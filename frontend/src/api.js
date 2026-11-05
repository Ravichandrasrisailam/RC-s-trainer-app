import { supabase } from "./supabaseClient";
import { buildWeightLogUpsert, localDateString, stepsFromRow } from "./lib/activity";
import { isFitnessProfile, isMealPlan, isStepCount, isWeightKg, isWorkoutPlan, isWorkoutSet } from "./lib/validation";

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

async function invokeAI(body) {
  const { data, error } = await supabase.functions.invoke("generate-plan", { body });
  if (error) {
    let detail;
    if (typeof error.context?.json === "function") {
      try {
        detail = await error.context.json();
      } catch (parseError) {
        throw new Error(`AI request failed: ${error.message}. The error response was not valid JSON.`, { cause: parseError });
      }
    }
    throw new Error(detail?.error || error.message || "AI request failed.");
  }
  return data;
}

async function currentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error("Your session has expired. Please sign in again.");
  return data.user;
}

function profileFromRow(row, user) {
  const [metadataFirstName = "", ...metadataRest] = (user?.user_metadata?.full_name || "").split(" ");
  const [firstName = metadataFirstName, ...rest] = (row?.name || "").split(" ");
  const profile = {
    id: row?.id || user?.id,
    firstName: firstName || user?.user_metadata?.first_name || "",
    lastName: rest.join(" ") || user?.user_metadata?.last_name || metadataRest.join(" "),
    email: user?.email || row?.email || "",
    heightCm: row?.height_cm == null ? "" : Number(row.height_cm),
    weightKg: row?.weight_kg == null ? "" : Number(row.weight_kg),
    goal: row?.goal || "",
    activityLevel: row?.activity_level || "",
    trainingDaysPerWeek: row?.training_days_per_week == null ? "" : Number(row.training_days_per_week),
    stepTarget: row?.steps_target == null ? "" : Number(row.steps_target),
    proteinTarget: row?.protein_target_g == null ? "" : Number(row.protein_target_g),
    proteinTargetG: row?.protein_target_g == null ? "" : Number(row.protein_target_g),
    caloriesTarget: row?.calories_target == null ? "" : Number(row.calories_target),
    targetWeightKg: row?.target_weight_kg == null ? "" : Number(row.target_weight_kg),
    hasOnboarded: false
  };
  profile.hasOnboarded = Boolean(row?.has_onboarded && isFitnessProfile(profile));
  return profile;
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
    if (!isFitnessProfile(profile)) throw new Error("Please check the profile values and try again.");
    const user = await currentUser();
    const payload = {
      id: user.id,
      email: user.email,
      name: [profile.firstName, profile.lastName].join(" "),
      height_cm: Number(profile.heightCm),
      weight_kg: Number(profile.weightKg),
      goal: profile.goal,
      activity_level: profile.activityLevel,
      training_days_per_week: Number(profile.trainingDaysPerWeek),
      steps_target: Number(profile.stepTarget),
      protein_target_g: Number(profile.proteinTargetG ?? profile.proteinTarget),
      calories_target: Number(profile.caloriesTarget),
      target_weight_kg: profile.targetWeightKg == null || profile.targetWeightKg === "" ? null : Number(profile.targetWeightKg),
      has_onboarded: true
    };
    const { data, error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" }).select().single();
    if (error) throw error;
    return profileFromRow(data, user);
  },

  logMeal: async (meal) => {
    const title = meal.name || meal.title || "Meal";
    const nutrition = ["calories", "protein", "carbs", "fats", "fiber"].map(key => Number(meal[key] || 0));
    if (typeof title !== "string" || !title.trim() || title.length > 180
      || nutrition.some(value => !Number.isFinite(value) || value < 0 || value > 999999.99)) {
      throw new Error("Meal details and nutrition values are invalid.");
    }
    const mealType = meal.mealType || meal.meal_type || "Meal";
    if (typeof mealType !== "string" || !mealType.trim() || mealType.length > 40) {
      throw new Error("Meal type is invalid.");
    }
    const user = await currentUser();
    const payload = {
      user_id: user.id,
      title: title.trim(),
      calories: nutrition[0],
      protein: nutrition[1],
      carbs: nutrition[2],
      fats: nutrition[3],
      fiber: nutrition[4],
      meal_type: mealType.trim()
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
    const today = localDateString(now);
    const [mealResult, stepResult, weightResult, firstWeightResult] = await Promise.all([
      supabase.from("meal_logs").select("*").eq("user_id", user.id).gte("logged_at", start).lt("logged_at", tomorrow).order("logged_at", { ascending: false }),
      supabase.from("step_logs").select("*").eq("user_id", user.id).eq("log_date", today).maybeSingle(),
      supabase.from("weight_logs").select("weight_kg,logged_on,logged_at").eq("user_id", user.id).order("logged_on", { ascending: false }).limit(30),
      supabase.from("weight_logs").select("weight_kg").eq("user_id", user.id).order("logged_on", { ascending: true }).limit(1).maybeSingle()
    ]);
    for (const result of [mealResult, stepResult, weightResult, firstWeightResult]) if (result.error) throw result.error;
    const meals = (mealResult.data || []).map(row => ({
      id: row.id, name: row.title, mealType: row.meal_type, calories: Number(row.calories || 0),
      protein: Number(row.protein || 0), carbs: Number(row.carbs || 0), fats: Number(row.fats || 0),
      loggedAt: new Date(row.logged_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }));
    const history = (weightResult.data || []).slice().reverse().map(row => ({
      loggedOn: row.logged_on,
      day: new Date(`${row.logged_on}T12:00:00`).toLocaleDateString([], { month: "short", day: "numeric" }),
      weight: Number(row.weight_kg)
    }));
    return {
      meals,
      steps: stepsFromRow(stepResult.data),
      history,
      weight: history.at(-1)?.weight,
      startWeight: firstWeightResult.data?.weight_kg == null ? null : Number(firstWeightResult.data.weight_kg)
    };
  },

  getRecentSets: async () => {
    const user = await currentUser();
    const { data, error } = await supabase.from("workout_set_logs")
      .select("id,workout_day,exercise_name,load_kg,reps,logged_at")
      .eq("user_id", user.id)
      .order("logged_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    return data || [];
  },

  getOrGenerateWorkoutPlan: async (profile, { force = false } = {}) => {
    const user = await currentUser();
    const snapshot = {
      goal: profile.goal, activityLevel: profile.activityLevel,
      trainingDaysPerWeek: Number(profile.trainingDaysPerWeek), heightCm: Number(profile.heightCm),
      weightKg: Number(profile.weightKg)
    };
    const { data: cached, error: cacheError } = await supabase.from("ai_workout_plans")
      .select("plan,profile_snapshot").eq("user_id", user.id).maybeSingle();
    if (cacheError) throw cacheError;
    if (!force && cached && Object.entries(snapshot).every(([key, value]) => cached.profile_snapshot?.[key] === value)
      && isWorkoutPlan(cached.plan, snapshot.trainingDaysPerWeek)) return { ...cached.plan, aiGenerated: true };
    const data = await invokeAI({ task: "generate-workout" });
    if (!isWorkoutPlan(data?.plan, snapshot.trainingDaysPerWeek)) {
      throw new Error("The AI returned an incomplete workout plan. Please try again.");
    }
    const { error: saveError } = await supabase.from("ai_workout_plans").upsert({
      user_id: user.id, training_days_per_week: snapshot.trainingDaysPerWeek,
      profile_snapshot: snapshot, plan: data.plan, generated_at: new Date().toISOString()
    }, { onConflict: "user_id" });
    if (saveError) throw saveError;
    return { ...data.plan, aiGenerated: true };
  },

  getOrGenerateMealPlan: async (profile, { force = false } = {}) => {
    const user = await currentUser();
    const snapshot = {
      goal: profile.goal, activityLevel: profile.activityLevel,
      trainingDaysPerWeek: Number(profile.trainingDaysPerWeek), heightCm: Number(profile.heightCm),
      weightKg: Number(profile.weightKg), proteinTarget: Number(profile.proteinTargetG ?? profile.proteinTarget),
      caloriesTarget: Number(profile.caloriesTarget)
    };
    const { data: cached, error } = await supabase.from("ai_meal_plans")
      .select("meal_plan,profile_snapshot,generated_at").eq("user_id", user.id).maybeSingle();
    if (error) throw error;
    const sameProfile = cached && Object.entries(snapshot).every(([key, value]) => cached.profile_snapshot?.[key] === value);
    const generatedToday = cached && new Date(cached.generated_at).toDateString() === new Date().toDateString();
    if (!force && sameProfile && generatedToday && isMealPlan(cached.meal_plan)) return cached.meal_plan;
    const data = await invokeAI({ task: "generate-meals" });
    if (!isMealPlan(data?.mealPlan)) throw new Error("The AI returned an incomplete meal plan.");
    const { error: saveError } = await supabase.from("ai_meal_plans").upsert({
      user_id: user.id, profile_snapshot: snapshot, meal_plan: data.mealPlan,
      generated_at: new Date().toISOString()
    }, { onConflict: "user_id" });
    if (saveError) throw saveError;
    return data.mealPlan;
  },

  estimateMeal: async (description) => {
    if (typeof description !== "string" || !description.trim() || description.length > 500) {
      throw new Error("Describe the meal in 1 to 500 characters.");
    }
    const data = await invokeAI({ task: "estimate-meal", description });
    if (!data?.estimate || !Number.isFinite(Number(data.estimate.calories))) throw new Error("AI nutrition estimate was invalid.");
    return { ...data.estimate, name: data.estimate.name || description, mealType: "Meal", fiber: Number(data.estimate.fiber || 0) };
  },

  logWeight: async (weightKg) => {
    if (!isWeightKg(weightKg)) throw new Error("Weight must be between 30 and 300 kg.");
    const user = await currentUser();
    const { payload, options } = buildWeightLogUpsert(user.id, weightKg);
    const { data, error } = await supabase.from("weight_logs").upsert(payload, options).select().single();
    if (error) throw error;
    return data;
  },

  logSteps: async (steps) => {
    if (!isStepCount(steps)) throw new Error("Steps must be a whole number between 0 and 100,000.");
    const user = await currentUser();
    const { data, error } = await supabase.from("step_logs").upsert({ user_id: user.id, steps: Number(steps), log_date: localDateString() }, { onConflict: "user_id,log_date" }).select().single();
    if (error) throw error;
    return data;
  },

  logWorkoutSet: async (exercise, day, weight, reps) => {
    if (!isWorkoutSet({ weight, reps })) throw new Error("Enter a valid set: load 0–1,500 kg and 1–100 whole reps.");
    if (typeof exercise !== "string" || !exercise.trim() || exercise.length > 120) throw new Error("Exercise name is invalid.");
    if (typeof day !== "string" || !day.trim() || day.length > 80) throw new Error("Workout day is invalid.");
    const user = await currentUser();
    const { data, error } = await supabase.from("workout_set_logs").insert({
      user_id: user.id,
      workout_day: day.trim(),
      exercise_name: exercise.trim(),
      load_kg: Number(weight),
      reps: Number(reps)
    }).select().single();
    if (error) throw error;
    return data;
  }
};
