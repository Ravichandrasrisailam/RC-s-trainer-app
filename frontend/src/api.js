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

  estimateMeal: async (description) => {
    const text = description.toLowerCase();
    const estimates = [
      [/chicken|turkey/, { calories: 420, protein: 42, carbs: 28, fats: 12 }],
      [/paneer|tofu/, { calories: 360, protein: 24, carbs: 18, fats: 20 }],
      [/egg/, { calories: 220, protein: 16, carbs: 12, fats: 12 }],
      [/oat|banana/, { calories: 340, protein: 11, carbs: 58, fats: 8 }],
      [/rice/, { calories: 260, protein: 5, carbs: 56, fats: 1 }]
    ];
    const match = estimates.find(([pattern]) => pattern.test(text));
    const values = match?.[1] || { calories: 300, protein: 18, carbs: 32, fats: 10 };
    return { ...values, name: description, mealType: "Meal", fiber: 4 };
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
