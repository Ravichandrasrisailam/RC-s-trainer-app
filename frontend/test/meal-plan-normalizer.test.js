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
