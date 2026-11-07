import assert from "node:assert/strict";
import test from "node:test";
import { normalizeMealPlan } from "../../supabase/functions/generate-plan/response-normalizers.js";

const meal = {
  name: "Oats bowl",
  mealType: "Breakfast",
  portion: "1 bowl",
  preparation: "Cook with milk",
  calories: 380,
  protein: 18,
  carbs: 54,
  fats: 11,
  fiber: 8,
};

test("normalizes provider meal-plan wrappers, aliases, and numeric strings", () => {
  const plan = normalizeMealPlan({
    meal_plan: {
      title: "Daily plan",
      items: [
        { ...meal, title: meal.name, name: undefined, meal_type: "Breakfast", calories: "380", protein_g: "18", protein: undefined, carbs_g: "54", carbs: undefined, fat_g: "11", fats: undefined, fiber_g: "8", fiber: undefined },
        { ...meal, title: "Rice bowl", name: undefined, calories: "620", protein: "32", carbs: "85", fats: "16", fiber: "10" },
        { ...meal, title: "Paneer salad", name: undefined, calories: "450", protein: "34", carbs: "23", fats: "22", fiber: "7" },
      ],
    },
  });

  assert.deepEqual(plan, {
    label: "Daily plan",
    meals: [
      { name: "Oats bowl", mealType: "Breakfast", portion: "1 bowl", preparation: "Cook with milk", calories: 380, protein: 18, carbs: 54, fats: 11, fiber: 8 },
      { name: "Rice bowl", mealType: "Breakfast", portion: "1 bowl", preparation: "Cook with milk", calories: 620, protein: 32, carbs: 85, fats: 16, fiber: 10 },
      { name: "Paneer salad", mealType: "Breakfast", portion: "1 bowl", preparation: "Cook with milk", calories: 450, protein: 34, carbs: 23, fats: 22, fiber: 7 },
    ],
  });
});

test("rejects incomplete meal plans", () => {
  assert.equal(normalizeMealPlan({ meals: [meal, meal] }), null);
  assert.equal(normalizeMealPlan({ meals: [{ ...meal, protein: undefined }, meal, meal] }), null);
});

test("flattens provider-wrapped meal entries and accepts singular preparation notes", () => {
  const plan = normalizeMealPlan({
    goal: "fat loss",
    meals: [
      { label: "Daily nutrition", meals: [{ ...meal, note: "Prepare fresh", preparation: undefined }] },
      { label: "Daily nutrition", meals: [{ ...meal, name: "Rice bowl" }] },
      { label: "Daily nutrition", meals: [{ ...meal, name: "Salad" }] },
    ],
  });

  assert.equal(plan.label, "Daily nutrition");
  assert.equal(plan.meals.length, 3);
  assert.equal(plan.meals[0].preparation, "Prepare fresh");
  assert.equal(plan.meals[1].name, "Rice bowl");
  assert.equal(plan.meals[2].name, "Salad");
});

test("normalizes provider meal labels and preparationNote fields", () => {
  const plan = normalizeMealPlan({
    goal: "fat loss",
    meals: [
      { label: "Oats bowl", mealType: "Breakfast", portion: "1 bowl", preparationNote: "Cook with milk", calories: 380, protein: 18, carbs: 54, fats: 11, fiber: 8 },
      { label: "Rice bowl", mealType: "Lunch", portion: "1 bowl", preparationNote: "Serve warm", calories: 620, protein: 32, carbs: 85, fats: 16, fiber: 10 },
      { label: "Paneer salad", mealType: "Dinner", portion: "1 plate", preparationNote: "Toss before serving", calories: 450, protein: 34, carbs: 23, fats: 22, fiber: 7 },
    ],
  });

  assert.equal(plan.meals.length, 3);
  assert.equal(plan.meals[0].name, "Oats bowl");
  assert.equal(plan.meals[0].preparation, "Cook with milk");
});

test("normalizes a provider response that mixes direct and single-meal-wrapped entries", () => {
  const plan = normalizeMealPlan({
    meals: [
      { ...meal, name: "Breakfast" },
      { label: "Daily nutrition", meals: [{ ...meal, label: "Lunch", name: undefined }] },
      { ...meal, name: "Dinner" },
    ],
  });

  assert.equal(plan.meals.length, 3);
  assert.equal(plan.meals[1].name, "Lunch");
  assert.equal(plan.label, "Daily nutrition");
});
