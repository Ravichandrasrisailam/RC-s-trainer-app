import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};

function respond(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: cors });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return respond({ error: "Method not allowed." }, 405);

  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) return respond({ error: "AI is not configured yet. Add GEMINI_API_KEY to Supabase Edge Function secrets." }, 503);
  const auth = req.headers.get("Authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  const url = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
  if (!url || !anonKey || !token) return respond({ error: "Authenticated Supabase session required." }, 401);

  const supabase = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const { data: userData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !userData.user) return respond({ error: "Session expired. Please sign in again." }, 401);

  let body: { task?: string; description?: string };
  try { body = await req.json(); } catch { return respond({ error: "Invalid JSON request." }, 400); }
  const task = body.task || "generate-workout";
  let prompt: string;

  if (task === "estimate-meal") {
    const description = (body.description || "").trim().slice(0, 500);
    if (!description) return respond({ error: "Describe the meal first." }, 400);
    prompt = `Estimate nutrition for the described meal and portion. Respond only with JSON keys name, calories, protein, carbs, fats, fiber. Calories are kcal and all macros are grams. Values must be non-negative numbers. Be conservative and state estimate in name. This is approximate, not medical advice. Meal: ${description}`;
  } else if (task === "generate-meals") {
    const { data: profile, error } = await supabase.from("profiles").select("goal,activity_level,training_days_per_week,height_cm,weight_kg,protein_target_g,calories_target").eq("id", userData.user.id).maybeSingle();
    if (error) return respond({ error: "Could not load your saved profile." }, 400);
    if (!profile || !profile.goal) return respond({ error: "Save your profile before generating meals." }, 400);
    prompt = `Create a practical one-day meal plan personalized for this saved user profile: goal=${profile.goal}; activity level=${profile.activity_level}; training days per week=${profile.training_days_per_week}; weight kg=${profile.weight_kg}; height cm=${profile.height_cm}; protein target grams=${profile.protein_target_g}; calorie target kcal=${profile.calories_target}. Respond ONLY with JSON keys label and meals. Include 3-5 realistic meals that respect the user's goal and protein target, use common ingredients, state portion clearly, and include mealType, calories, protein, carbs, fats, fiber (all non-negative numbers; macros in grams), portion, and a brief preparation note. Avoid medical claims, extreme calorie restriction, and supplements as requirements. These are estimates, not medical advice.`;
  } else if (task === "generate-workout") {
    const { data: profile, error } = await supabase.from("profiles")
      .select("goal,activity_level,training_days_per_week,height_cm,weight_kg")
      .eq("id", userData.user.id).maybeSingle();
    if (error) return respond({ error: "Could not load your saved profile." }, 400);
    if (!profile || !profile.training_days_per_week) return respond({ error: "Save your profile before generating a workout." }, 400);
    const days = Number(profile.training_days_per_week);
    if (days < 3 || days > 6) return respond({ error: "Training days must be between 3 and 6." }, 400);
    prompt = `Create a safe, practical weekly workout plan personalized to this saved user profile: goal=${profile.goal}; activity level=${profile.activity_level}; training days per week=${days}; body weight kg=${profile.weight_kg}; height cm=${profile.height_cm}. Return ONLY JSON with keys label and days. days must have EXACTLY ${days} objects. Each day object has name, focus, and exercises. Include 4-6 exercises per day, balanced recovery across the week, beginner-appropriate progression, and no medical diagnosis or extreme training. Each exercise must have name, muscle, equipment, sets (integer 2-4), and repRange (short string). Do not add extra root keys.`;
  } else {
    return respond({ error: "Unsupported AI task." }, 400);
  }

  try {
    const model = Deno.env.get("GEMINI_MODEL") || "gemini-2.5-flash";
    const result = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.35, maxOutputTokens: 5000 }
      })
    });
    if (!result.ok) {
      const detail = await result.text();
      console.error("Gemini request failed", result.status, detail.slice(0, 500));
      return respond({ error: "The AI provider could not generate a response. Check the Gemini key and model configuration." }, 502);
    }
    const resultBody = await result.json();
    const text = resultBody?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("") || "";
    const parsed = JSON.parse(text);
    if (task === "estimate-meal") {
      for (const key of ["calories", "protein", "carbs", "fats", "fiber"]) {
        if (!Number.isFinite(Number(parsed[key])) || Number(parsed[key]) < 0) throw new Error("Invalid nutrition values");
      }
      return respond({ estimate: parsed });
    }
    if (task === "generate-meals") {
      if (typeof parsed.label !== "string" || !Array.isArray(parsed.meals) || parsed.meals.length < 3 || parsed.meals.length > 5) throw new Error("Invalid meal plan shape");
      for (const meal of parsed.meals) {
        if (typeof meal.name !== "string" || typeof meal.mealType !== "string" || typeof meal.portion !== "string") throw new Error("Invalid meal details");
        for (const key of ["calories", "protein", "carbs", "fats", "fiber"]) if (!Number.isFinite(Number(meal[key])) || Number(meal[key]) < 0) throw new Error("Invalid meal macros");
      }
      return respond({ mealPlan: parsed });
    }
    if (typeof parsed.label !== "string" || !Array.isArray(parsed.days)) throw new Error("Invalid plan shape");
    const expectedDays = Number((await supabase.from("profiles").select("training_days_per_week").eq("id", userData.user.id).single()).data?.training_days_per_week);
    if (parsed.days.length !== expectedDays || parsed.days.some((day: any) => typeof day.name !== "string" || !Array.isArray(day.exercises) || day.exercises.length < 3 || day.exercises.length > 8)) {
      throw new Error("The generated plan did not match the saved training schedule");
    }
    return respond({ plan: parsed });
  } catch (error) {
    console.error("AI generation failed", error);
    return respond({ error: "Could not produce a valid personalized plan. Please try again." }, 502);
  }
});
