const MAX_NUTRITION_VALUE = 999999.99;

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function firstString(...values) {
  for (const value of values) {
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed) return trimmed;
    }
  }
  return null;
}

function firstNutritionValue(...values) {
  for (const value of values) {
    const numericValue = typeof value === "number"
      ? value
      : typeof value === "string" && value.trim()
        ? Number(value)
        : Number.NaN;

    if (
      Number.isFinite(numericValue) &&
      numericValue >= 0 &&
      numericValue <= MAX_NUTRITION_VALUE
    ) {
      return numericValue;
    }
  }
  return null;
}

function normalizeMeal(value) {
  if (!isRecord(value)) return null;

  const name = firstString(value.name, value.title, value.dish);
  const calories = firstNutritionValue(value.calories, value.calories_kcal);
  const protein = firstNutritionValue(value.protein, value.protein_g);
  const carbs = firstNutritionValue(value.carbs, value.carbohydrates, value.carbs_g);
  const fats = firstNutritionValue(value.fats, value.fat, value.fat_g);
  const fiber = firstNutritionValue(value.fiber, value.fibre, value.fiber_g, value.fibre_g);

  if (!name || calories === null || protein === null || carbs === null || fats === null || fiber === null) {
    return null;
  }

  return {
    name,
    mealType: firstString(value.mealType, value.meal_type, value.type) ?? "Meal",
    portion: firstString(value.portion, value.serving, value.servingSize, value.serving_size) ?? "One serving",
    preparation: firstString(value.preparation, value.notes, value.instructions, value.description) ?? "",
    calories,
    protein,
    carbs,
    fats,
    fiber,
  };
}

/**
 * Convert small provider variations into the stable shape returned by the
 * Edge Function. Invalid or incomplete responses remain rejected.
 */
export function normalizeMealPlan(value) {
  const root = Array.isArray(value)
    ? { meals: value }
    : isRecord(value)
      ? value
      : null;

  if (!root) return null;

  const nestedPlan = [root.mealPlan, root.meal_plan, root.plan]
    .find((candidate) => isRecord(candidate) || Array.isArray(candidate));
  const plan = Array.isArray(nestedPlan)
    ? { meals: nestedPlan }
    : nestedPlan ?? root;

  const sourceMeals = [plan.meals, plan.items, plan.plan]
    .find((candidate) => Array.isArray(candidate));

  if (!Array.isArray(sourceMeals) || sourceMeals.length < 3 || sourceMeals.length > 5) {
    return null;
  }

  const meals = sourceMeals.map(normalizeMeal);
  if (meals.some((meal) => meal === null)) return null;

  return {
    label: firstString(plan.label, plan.title, root.label, root.title) ?? "Personalized meal plan",
    meals,
  };
}
