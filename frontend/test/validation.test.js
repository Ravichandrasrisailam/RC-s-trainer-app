import test from "node:test";
import assert from "node:assert/strict";
import { emptyProfile } from "../src/data.js";
import { authErrorMessage, signupSessionError } from "../src/lib/auth.js";
import { buildWeightLogUpsert, calculateWeightProgress, formatSteps, stepsFromRow } from "../src/lib/activity.js";
import { isFitnessProfile, isMealPlan, isStepCount, isWeightKg, isWorkoutPlan, isWorkoutSet } from "../src/lib/validation.js";

test("keeps onboarding profile values empty until supplied by the user", () => {
  assert.equal(emptyProfile.hasOnboarded, false);
  assert.equal(emptyProfile.weightKg, "");
  assert.equal(emptyProfile.targetWeightKg, "");
  assert.equal(emptyProfile.goal, "");
  assert.equal(emptyProfile.stepTarget, "");
  assert.equal(emptyProfile.proteinTarget, "");
  assert.equal(emptyProfile.caloriesTarget, "");
  assert.equal(isFitnessProfile(emptyProfile), false);
});

test("accepts valid weight and rejects unsafe values", () => {
  assert.equal(isWeightKg("75.4"), true);
  assert.equal(isWeightKg(29.9), false);
  assert.equal(isWeightKg(300.1), false);
  assert.equal(isWeightKg("not a number"), false);
});

test("accepts valid step counts and rejects invalid ones", () => {
  assert.equal(isStepCount(0), true);
  assert.equal(isStepCount("100000"), true);
  assert.equal(isStepCount(1.5), false);
  assert.equal(isStepCount(-1), false);
  assert.equal(isStepCount(100001), false);
});

test("requires a non-negative load and at least one rep for a workout set", () => {
  assert.equal(isWorkoutSet({ weight: "0", reps: "12" }), true);
  assert.equal(isWorkoutSet({ weight: "20", reps: "0" }), false);
  assert.equal(isWorkoutSet({ weight: "20", reps: "1.5" }), false);
  assert.equal(isWorkoutSet({ weight: "1501", reps: "8" }), false);
  assert.equal(isWorkoutSet({ weight: "-1", reps: "8" }), false);
});

test("validates fitness profile fields before persistence", () => {
  const profile = {
    firstName: "Ravi",
    lastName: "Chandra",
    heightCm: 175,
    weightKg: 75.4,
    goal: "FAT_LOSS",
    activityLevel: "MODERATE",
    trainingDaysPerWeek: 4,
    stepTarget: 10000,
    proteinTarget: 130,
    caloriesTarget: 2100
  };
  assert.equal(isFitnessProfile(profile), true);
  assert.equal(isFitnessProfile({ ...profile, heightCm: 231 }), false);
  assert.equal(isFitnessProfile({ ...profile, trainingDaysPerWeek: 2 }), false);
  assert.equal(isFitnessProfile({ ...profile, goal: "unknown" }), false);
  assert.equal(isFitnessProfile({ ...profile, caloriesTarget: "" }), false);
  assert.equal(isFitnessProfile({ ...profile, proteinTarget: "" }), false);
  assert.equal(isFitnessProfile({ ...profile, targetWeightKg: 29 }), false);
  assert.equal(isFitnessProfile({ ...profile, targetWeightKg: 70 }), true);
});

test("rejects incomplete or invalid cached AI plans", () => {
  const mealPlan = {
    label: "Daily plan",
    meals: [1, 2, 3].map(() => ({
      name: "Meal", mealType: "Lunch", portion: "1 serving",
      calories: 500, protein: 30, carbs: 50, fats: 15, fiber: 5
    }))
  };
  const workoutPlan = {
    label: "Training plan",
    days: [1, 2, 3].map(() => ({
      name: "Day", exercises: [1, 2, 3].map(() => ({
        name: "Squat", muscle: "Legs", equipment: "Barbell", sets: 3, repRange: "8-12"
      }))
    }))
  };
  assert.equal(isMealPlan(mealPlan), true);
  assert.equal(isMealPlan({ ...mealPlan, meals: [] }), false);
  assert.equal(isWorkoutPlan(workoutPlan, 3), true);
  assert.equal(isWorkoutPlan(workoutPlan, 4), false);
  assert.equal(isWorkoutPlan({ ...workoutPlan, days: [{ name: "Broken", exercises: [] }] }, 1), false);
});

test("builds a per-user daily weight upsert payload using the local date", () => {
  const date = new Date(2026, 10, 5, 12, 30);
  assert.deepEqual(buildWeightLogUpsert("user-1", "72.5", date), {
    payload: {
      user_id: "user-1",
      weight_kg: 72.5,
      logged_on: "2026-11-05",
      logged_at: date.toISOString()
    },
    options: { onConflict: "user_id,logged_on" }
  });
});

test("represents missing steps as an empty state but preserves a logged zero", () => {
  assert.equal(stepsFromRow(null), null);
  assert.equal(stepsFromRow(undefined), null);
  assert.equal(stepsFromRow({ steps: 0 }), 0);
  assert.equal(formatSteps(null), "No steps logged yet");
  assert.equal(formatSteps(undefined), "No steps logged yet");
  assert.equal(formatSteps(0), "0");
  assert.equal(formatSteps(12000), "12,000");
});

test("calculates weight progress from the earliest log and optional target", () => {
  const history = [{ weight: 78 }, { weight: 75 }];
  const withTarget = calculateWeightProgress(history, 70, 80);
  assert.equal(withTarget.startWeightKg, 80);
  assert.equal(withTarget.currentWeightKg, 75);
  assert.equal(withTarget.progressPercent, 50);

  const withoutTarget = calculateWeightProgress([{ weight: 80 }, { weight: 75 }], null);
  assert.equal(withoutTarget.changeKg, 5);
  assert.equal(withoutTarget.progressPercent, null);
  assert.equal(calculateWeightProgress([], 70), null);
  assert.equal(calculateWeightProgress([{ weight: 80 }], 80).progressPercent, null);
});

test("turns empty auth errors into actionable messages and preserves useful service errors", () => {
  const emptyError = new Error("{}");
  emptyError.status = 400;
  emptyError.code = "signup_failed";
  assert.match(authErrorMessage(emptyError, "create your account"), /create your account \(signup_failed, HTTP 400\)/);
  assert.match(authErrorMessage({}, "sign in"), /Forgot password/);
  assert.equal(authErrorMessage(new Error("Invalid login credentials"), "sign in"), "Invalid login credentials");
});

test("directs duplicate sign-ups to sign in or password reset", () => {
  assert.match(signupSessionError({ identities: [] }), /account with this email may already exist/i);
  assert.match(signupSessionError({ identities: [{ id: "identity-1" }] }), /confirm your email/i);
  assert.match(signupSessionError(null), /confirm your email/i);
});
