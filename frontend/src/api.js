import { supabase } from "./supabaseClient";

const tokenKey = "rc_access_token";

export function saveToken(token) {
  if (token) localStorage.setItem(tokenKey, token);
}

export function clearToken() {
  localStorage.removeItem(tokenKey);
  supabase.auth.signOut();
}

export function getToken() {
  return localStorage.getItem(tokenKey);
}

async function currentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

function profileFromRow(row, user) {
  const [firstName = "Athlete", ...rest] = (user?.user_metadata?.full_name || row?.name || "Athlete").split(" ");
  return {
    id: row?.id || user?.id,
    firstName: user?.user_metadata?.first_name || firstName,
    lastName: user?.user_metadata?.last_name || rest.join(" "),
    email: user?.email || row?.email || "",
    heightCm: Number(row?.height_cm ?? 175),
    weightKg: Number(row?.weight_kg ?? 70),
    goal: row?.goal || "RECOMPOSITION",
    activityLevel: row?.activity_level || "MODERATE",
    trainingDaysPerWeek: Number(row?.training_days_per_week ?? 3),
    stepTarget: Number(row?.steps_target ?? 10000),
    proteinTarget: Number(row?.protein_target_g ?? 120),
    proteinTargetG: Number(row?.protein_target_g ?? 120),
    hasOnboarded: Boolean(row?.has_onboarded)
  };
}

export const api = {
  register: async ({ firstName, lastName, dob, email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { first_name: firstName, last_name: lastName, full_name: [firstName, lastName].filter(Boolean).join(" "), dob } }
    });
    if (error) throw error;
    if (!data.session) throw new Error("Please confirm your email before signing in.");
    saveToken(data.session.access_token);
    return { token: data.session.access_token };
  },

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    saveToken(data.session.access_token);
    return { token: data.session.access_token };
  },

  getProfile: async () => {
    const user = await currentUser();
    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    if (error) throw error;
    return profileFromRow(data, user);
  },

  saveProfile: async (profile) => {
    const user = await currentUser();
    const payload = {
      id: user.id,
      email: user.email,
      name: [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "Athlete",
      height_cm: Number(profile.heightCm),
      weight_kg: Number(profile.weightKg),
      goal: profile.goal,
      activity_level: profile.activityLevel,
      training_days_per_week: Number(profile.trainingDaysPerWeek),
      steps_target: Number(profile.stepTarget),
      protein_target_g: Number(profile.proteinTarget || profile.proteinTargetG || 120),
      has_onboarded: true
    };
    const { data, error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" }).select().single();
    if (error) throw error;
    return profileFromRow(data, user);
  },

  logMeal: async (meal) => {
    const user = await currentUser();
    const payload = {
      user_id: user.id,
      title: meal.name || meal.title || "Meal",
      calories: Number(meal.calories || 0),
      protein: Number(meal.protein || 0),
      carbs: Number(meal.carbs || 0),
      fats: Number(meal.fats || 0),
      fiber: Number(meal.fiber || 0),
      meal_type: meal.mealType || meal.meal_type || "Snack"
    };
    const { data, error } = await supabase.from("meal_logs").insert(payload).select().single();
    if (error) throw error;
    return { ...meal, id: data.id, name: data.title, mealType: data.meal_type, loggedAt: new Date(data.logged_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
  },


  getActivityData: async () => {
    const user = await currentUser();
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();
    const today = new Date(now.getFullYear() - 0, now.getMonth(), now.getDate()).toISOString().slice(0, 10);
    const [mealResult, stepResult, weightResult] = await Promise.all([
      supabase.from("meal_logs").select("*").eq("user_id", user.id).gte("logged_at", start).lt("logged_at", tomorrow).order("logged_at", { ascending: false }),
      supabase.from("step_logs").select("*").eq("user_id", user.id).eq("log_date", today).maybeSingle(),
      supabase.from("weight_logs").select("*").eq("user_id", user.id).order("logged_at", { ascending: true }).limit(30)
    ]);
    for (const result of [mealResult, stepResult, weightResult]) if (result.error) throw result.error;
    const meals = (mealResult.data || []).map(row => ({
      id: row.id, name: row.title, mealType: row.meal_type, calories: Number(row.calories || 0),
      protein: Number(row.protein || 0), carbs: Number(row.carbs || 0), fats: Number(row.fats || 0),
      loggedAt: new Date(row.logged_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }));
    const history = (weightResult.data || []).map(row => ({
      day: new Date(row.logged_at).toLocaleDateString([], { month: "short", day: "numeric" }),
      weight: Number(row.weight_kg)
    }));
    return { meals, steps: Number(stepResult.data?.steps || 0), history, weight: history.at(-1)?.weight };
  },

  getOrGenerateWorkoutPlan: async (profile) => {
    const user = await currentUser();
    const snapshot = {
      goal: profile.goal, activityLevel: profile.activityLevel,
      trainingDaysPerWeek: Number(profile.trainingDaysPerWeek), heightCm: Number(profile.heightCm),
      weightKg: Number(profile.weightKg)
    };
    const { data: cached, error: cacheError } = await supabase.from("ai_workout_plans")
      .select("plan,profile_snapshot").eq("user_id", user.id).maybeSingle();
    if (cacheError) throw cacheError;
    if (cached && JSON.stringify(cached.profile_snapshot) === JSON.stringify(snapshot)) return cached.plan;
    const { data, error } = await supabase.functions.invoke("generate-plan", { body: { profile: snapshot } });
    if (error) throw error;
    if (!data?.plan || data.plan.days?.length !== snapshot.trainingDaysPerWeek || !Array.isArray(data.plan.exercises)) {
      throw new Error("The AI returned an incomplete workout plan. Please try again.");
    }
    const { error: saveError } = await supabase.from("ai_workout_plans").upsert({
      user_id: user.id, training_days_per_week: snapshot.trainingDaysPerWeek,
      profile_snapshot: snapshot, plan: data.plan, generated_at: new Date().toISOString()
    }, { onConflict: "user_id" });
    if (saveError) throw saveError;
    return data.plan;
  },

  estimateMeal: async (description) => {
    const { data, error } = await supabase.functions.invoke("generate-plan", { body: { task: "estimate-meal", description } });
    if (error) throw error;
    if (!data?.estimate || !Number.isFinite(Number(data.estimate.calories))) throw new Error("AI nutrition estimate was invalid.");
    return { ...data.estimate, name: data.estimate.name || description, mealType: "Meal", fiber: Number(data.estimate.fiber || 0) };
  },

  logWeight: async (weightKg) => {
    const user = await currentUser();
    const { data, error } = await supabase.from("weight_logs").insert({ user_id: user.id, weight_kg: Number(weightKg) }).select().single();
    if (error) throw error;
    return data;
  },

  logSteps: async (steps) => {
    const user = await currentUser();
    const { data, error } = await supabase.from("step_logs").upsert({ user_id: user.id, steps: Number(steps), log_date: new Date().toISOString().slice(0, 10) }, { onConflict: "user_id,log_date" }).select().single();
    if (error) throw error;
    return data;
  },

  logWorkoutSet: async (exercise, weight, reps) => {
    const user = await currentUser();
    const { data, error } = await supabase.from("workout_completions").insert({
      user_id: user.id,
      workout_id: exercise,
      workout_title: `${exercise} · ${weight}kg × ${reps} reps`,
      calories_burned: 0
    }).select().single();
    if (error) throw error;
    return data;
  }
};
