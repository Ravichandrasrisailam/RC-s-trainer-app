export function isWeightKg(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 30 && number <= 300;
}

export function isStepCount(value) {
  const number = Number(value);
  return Number.isSafeInteger(number) && number >= 0 && number <= 100000;
}

export function isWorkoutSet({ weight, reps }) {
  const parsedWeight = Number(weight);
  const parsedReps = Number(reps);
  return Number.isFinite(parsedWeight) && parsedWeight >= 0 && parsedWeight <= 1500
    && Number.isSafeInteger(parsedReps) && parsedReps >= 1 && parsedReps <= 100;
}

export function isFitnessProfile(profile) {
  const validGoals = ["WEIGHT_LOSS", "FAT_LOSS", "MUSCLE_GAIN", "RECOMPOSITION"];
  const validActivityLevels = ["SEDENTARY", "LIGHT", "MODERATE", "VERY_ACTIVE"];
  const height = Number(profile.heightCm);
  const weight = Number(profile.weightKg);
  const trainingDays = Number(profile.trainingDaysPerWeek);
  const stepTarget = Number(profile.stepTarget);
  const proteinTarget = Number(profile.proteinTargetG ?? profile.proteinTarget);
  const caloriesTarget = Number(profile.caloriesTarget);

  return typeof profile.firstName === "string" && profile.firstName.trim().length > 0
    && profile.firstName.length <= 80
    && typeof profile.lastName === "string" && profile.lastName.trim().length > 0
    && profile.lastName.length <= 80
    && Number.isFinite(height) && height >= 100 && height <= 230
    && isWeightKg(weight)
    && validGoals.includes(profile.goal)
    && validActivityLevels.includes(profile.activityLevel)
    && Number.isSafeInteger(trainingDays) && trainingDays >= 3 && trainingDays <= 6
    && Number.isSafeInteger(stepTarget) && stepTarget >= 1000 && stepTarget <= 30000
    && Number.isFinite(proteinTarget) && proteinTarget >= 20 && proteinTarget <= 400
    && Number.isSafeInteger(caloriesTarget) && caloriesTarget >= 500 && caloriesTarget <= 10000;
}

export function isMealPlan(plan) {
  return typeof plan?.label === "string" && plan.label.trim().length > 0
    && Array.isArray(plan.meals) && plan.meals.length >= 3 && plan.meals.length <= 5
    && plan.meals.every(meal => meal && typeof meal.name === "string" && meal.name.trim().length > 0
      && typeof meal.mealType === "string" && meal.mealType.trim().length > 0
      && typeof meal.portion === "string" && meal.portion.trim().length > 0
      && ["calories", "protein", "carbs", "fats", "fiber"].every(key => {
        const value = Number(meal[key]);
        return Number.isFinite(value) && value >= 0 && value <= 999999.99;
      }));
}

export function isWorkoutPlan(plan, expectedDays) {
  return typeof plan?.label === "string" && plan.label.trim().length > 0
    && Array.isArray(plan.days) && plan.days.length === expectedDays
    && plan.days.every(day => day && typeof day.name === "string" && day.name.trim().length > 0
      && Array.isArray(day.exercises) && day.exercises.length >= 3 && day.exercises.length <= 8
      && day.exercises.every(exercise => exercise && typeof exercise.name === "string" && exercise.name.trim().length > 0
        && typeof exercise.muscle === "string" && typeof exercise.equipment === "string"
        && typeof exercise.repRange === "string" && Number.isInteger(exercise.sets)
        && exercise.sets >= 2 && exercise.sets <= 4));
}
