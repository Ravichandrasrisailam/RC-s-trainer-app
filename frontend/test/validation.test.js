import test from "node:test";
import assert from "node:assert/strict";
import { emptyProfile } from "../src/data.js";
import { isFitnessProfile, isMealPlan, isStepCount, isWeightKg, isWorkoutPlan, isWorkoutSet } from "../src/lib/validation.js";

test("keeps onboarding profile values empty until supplied by the user", () => {
  assert.equal(emptyProfile.hasOnboarded, false);
  assert.equal(emptyProfile.weightKg, "");
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
