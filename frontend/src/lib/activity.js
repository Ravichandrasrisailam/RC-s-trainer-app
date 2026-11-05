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
