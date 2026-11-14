export function localDateString(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function buildWeightLogUpsert(userId, weightKg, date = new Date()) {
  return {
    payload: {
      user_id: userId,
      weight_kg: Number(weightKg),
      logged_on: localDateString(date),
      logged_at: date.toISOString()
    },
    options: { onConflict: "user_id,logged_on" }
  };
}

export function formatSteps(steps) {
  return steps == null ? "No steps logged yet" : Number(steps).toLocaleString();
}

export function stepsFromRow(row) {
  return row?.steps == null ? null : Number(row.steps);
}

export function calculateWeightProgress(history, targetWeightKg, startWeightKg) {
  const entries = Array.isArray(history)
    ? history.filter(entry => Number.isFinite(Number(entry.weight)) && Number(entry.weight) > 0)
    : [];
  if (entries.length === 0) return null;

  const start = startWeightKg == null || startWeightKg === ""
    ? Number(entries[0].weight)
    : Number(startWeightKg);
  const current = Number(entries.at(-1).weight);
  if (!Number.isFinite(start) || start <= 0 || !Number.isFinite(current) || current <= 0) return null;

  const hasTarget = targetWeightKg != null && targetWeightKg !== "";
  const target = hasTarget ? Number(targetWeightKg) : null;
  const denominator = hasTarget ? start - target : null;
  return {
    startWeightKg: start,
    currentWeightKg: current,
    changeKg: start - current,
    targetWeightKg: Number.isFinite(target) ? target : null,
    progressPercent: Number.isFinite(denominator) && denominator !== 0
      ? ((start - current) / denominator) * 100
      : null
  };
}

export function calculateRecommendedTargets({ heightCm, weightKg, goal, activityLevel, dob }) {
  const height = Number(heightCm);
  const weight = Number(weightKg);
  if (!Number.isFinite(height) || height < 100 || !Number.isFinite(weight) || weight < 30) {
    return null;
  }

  let age = 26;
  if (dob) {
    const birthDate = new Date(dob);
    if (!Number.isNaN(birthDate.getTime())) {
      const diffYears = new Date().getFullYear() - birthDate.getFullYear();
      if (diffYears >= 16 && diffYears <= 90) age = diffYears;
    }
  }

  // Mifflin-St Jeor formula
  const bmr = 10 * weight + 6.25 * height - 5 * age + 5;

  const activityMultipliers = {
    SEDENTARY: 1.2,
    LIGHT: 1.375,
    MODERATE: 1.55,
    VERY_ACTIVE: 1.725
  };
  const multiplier = activityMultipliers[activityLevel] || 1.375;
  const maintenance = Math.round(bmr * multiplier);

  let caloriesTarget = maintenance;
  let proteinMultiplier = 2.0;
  let stepTarget = 10000;

  switch (goal) {
    case "WEIGHT_LOSS":
      caloriesTarget = Math.max(1200, Math.round(maintenance - 500));
      proteinMultiplier = 1.8;
      stepTarget = 10500;
      break;
    case "FAT_LOSS":
      caloriesTarget = Math.max(1300, Math.round(maintenance - 400));
      proteinMultiplier = 2.0;
      stepTarget = 11000;
      break;
    case "MUSCLE_GAIN":
      caloriesTarget = Math.round(maintenance + 300);
      proteinMultiplier = 2.2;
      stepTarget = 8000;
      break;
    case "RECOMPOSITION":
    default:
      caloriesTarget = Math.round(maintenance - 150);
      proteinMultiplier = 2.0;
      stepTarget = 9500;
      break;
  }

  if (activityLevel === "SEDENTARY") stepTarget = Math.max(7000, stepTarget - 1500);
  if (activityLevel === "VERY_ACTIVE") stepTarget = Math.min(15000, stepTarget + 2000);

  const proteinTargetG = Math.min(350, Math.max(40, Math.round(weight * proteinMultiplier)));

  return {
    caloriesTarget: Math.round(caloriesTarget),
    proteinTargetG,
    proteinTarget: proteinTargetG,
    stepTarget: Math.round(stepTarget / 500) * 500
  };
}
