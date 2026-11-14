import { useState, useMemo, useEffect } from "react";
import { Check, ChevronDown, Clock, Dumbbell, Plus, RefreshCw, Trash2, X } from "lucide-react";
import { PageIntro } from "../components/ui";
import { api } from "../api";
import { isWorkoutSet } from "../lib/validation";
import { EXERCISE_DATABASE, getAlternatives, getAllMuscles } from "../lib/exercises";

export default function TrainingPage({
  days,
  setDays,
  onDaysChange,
  plan,
  activeDay,
  workoutPlanBusy,
  regenerateWorkoutPlan,
  setActiveDay,
  exerciseLogs,
  setExerciseLogs,
  recentSets,
  recentSetsError,
  onRetryHistory,
  setRecentSets,
  setToast,
  isReadOnly = false,
  selectedDateLabel = "Today"
}) {
  // Equipment mode toggle: "Gym" vs "No Equipment"
  const [equipmentMode, setEquipmentMode] = useState("Gym");

  // Determine today's day of week: 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 0=Sun
  const todayDayOfWeek = new Date().getDay();
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState(todayDayOfWeek);

  // Modal / Dropdown states for Replace and Add exercise
  const [replacingIndex, setReplacingIndex] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMuscleFilter, setAddMuscleFilter] = useState("Chest");

  // Active exercises for the day (allows dynamic additions / replacements)
  const [customizedExercises, setCustomizedExercises] = useState({});

  const weekDayNames = [
    { index: 1, short: "Mon", full: "Monday" },
    { index: 2, short: "Tue", full: "Tuesday" },
    { index: 3, short: "Wed", full: "Wednesday" },
    { index: 4, short: "Thu", full: "Thursday" },
    { index: 5, short: "Fri", full: "Friday" },
    { index: 6, short: "Sat", full: "Saturday" },
    { index: 0, short: "Sun", full: "Sunday" }
  ];

  // Resolve which calendar day is selected
  const activeWeekDay = weekDayNames.find(d => d.index === selectedDayOfWeek) || weekDayNames[0];

  // Get calendar routine from generated plan
  const weeklyCalendar = plan?.weeklyCalendar || [
    { dayIndex: 1, routineKey: "Push", isRestDay: false },
    { dayIndex: 2, routineKey: "Pull", isRestDay: false },
    { dayIndex: 3, routineKey: "Legs", isRestDay: false },
    { dayIndex: 4, routineKey: null, isRestDay: true },
    { dayIndex: 5, routineKey: "Upper", isRestDay: false },
    { dayIndex: 6, routineKey: "Lower", isRestDay: false },
    { dayIndex: 0, routineKey: null, isRestDay: true }
  ];

  const calendarDaySchedule = weeklyCalendar.find(d => d.dayIndex === selectedDayOfWeek);
  const isRestDay = calendarDaySchedule ? calendarDaySchedule.isRestDay : selectedDayOfWeek === 0;

  // Resolve standard exercises for this day based on equipment mode
  const baseExercises = useMemo(() => {
    // Check if the plan provides day objects
    if (!plan?.days || plan.days.length === 0) return [];
    
    // Find matching day object
    let dayObj = plan.days.find(d => d.dayIndex === selectedDayOfWeek);
    if (!dayObj && !isRestDay) {
      // Fallback to first available day
      dayObj = plan.days[0];
    }
    if (!dayObj) return [];

    if (equipmentMode === "No Equipment") {
      return dayObj.bodyweightExercises || dayObj.exercises.map(ex => {
        const alt = getAlternatives(ex.name, ex.muscle, "No Equipment");
        return alt[0] || { ...ex, equipment: "No Equipment" };
      });
    }

    return dayObj.gymExercises || dayObj.exercises;
  }, [plan, selectedDayOfWeek, equipmentMode, isRestDay]);

  // Current working exercises for today (combining base with user replacements/additions)
  const currentExercisesKey = `${selectedDayOfWeek}-${equipmentMode}`;
  const currentExercises = customizedExercises[currentExercisesKey] || baseExercises;

  // Handle set save
  async function saveSet(exercise, dayLabel) {
    if (isReadOnly) {
      setToast("Past dates are in read-only mode. Switch to Today to log sets.");
      return;
    }
    const entry = exerciseLogs[exercise.name];
    if (!entry || !isWorkoutSet(entry)) {
      setToast("Enter a valid set: load 0–1,500 kg and 1–100 whole reps.");
      return;
    }
    try {
      const saved = await api.logWorkoutSet(exercise.name, dayLabel, entry.weight, entry.reps);
      setRecentSets(current => [saved, ...current.filter(item => item.id !== saved.id)].slice(0, 50));
      setExerciseLogs(current => {
        const next = { ...current };
        delete next[exercise.name];
        return next;
      });
      setToast(`${exercise.name} set saved (${Number(saved.load_kg)} kg × ${saved.reps} reps)`);
    } catch (error) {
      setToast(error instanceof Error ? `Set was not saved: ${error.message}` : "Set could not be saved.");
    }
  }

  // Handle replacing an exercise
  function handleReplaceExercise(index, newExercise) {
    const nextList = [...currentExercises];
    nextList[index] = {
      name: newExercise.name,
      muscle: newExercise.muscle,
      equipment: newExercise.equipment,
      sets: newExercise.sets,
      repRange: newExercise.repRange
    };
    setCustomizedExercises(prev => ({
      ...prev,
      [currentExercisesKey]: nextList
    }));
    setReplacingIndex(null);
    setToast(`Replaced with ${newExercise.name}`);
  }

  // Handle adding an exercise
  function handleAddExercise(newExercise) {
    const nextList = [...currentExercises, {
      name: newExercise.name,
      muscle: newExercise.muscle,
      equipment: newExercise.equipment,
      sets: newExercise.sets,
      repRange: newExercise.repRange
    }];
    setCustomizedExercises(prev => ({
      ...prev,
      [currentExercisesKey]: nextList
    }));
    setShowAddModal(false);
    setToast(`Added ${newExercise.name} to today's workout`);
  }

  // Handle removing an exercise
  function handleRemoveExercise(index) {
    const nextList = currentExercises.filter((_, i) => i !== index);
    setCustomizedExercises(prev => ({
      ...prev,
      [currentExercisesKey]: nextList
    }));
    setToast("Exercise removed from session");
  }

  return <div className="content">
    {isReadOnly && (
      <div className="read-only-banner">
        <div>
          <strong>Viewing Training Schedule for {selectedDateLabel}</strong>
          <span className="history-tag" style={{ marginLeft: "8px" }}>Read-Only</span>
          <p className="muted" style={{ margin: "4px 0 0" }}>To record live workout sets, return to Today.</p>
        </div>
      </div>
    )}

    <PageIntro
      eyebrow="SCHEDULED TRAINING"
      title="Today's Workout."
      description="Tailored to your current calendar day. Toggle equipment or swap exercises to fit your setup."
    >
      <div className="goal-chip"><Dumbbell size={15} /> {days || 5}-Day Training Schedule</div>
    </PageIntro>

    {/* Calendar Weekday Navigation Bar */}
    <section className="panel" style={{ padding: "14px 18px", marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <span className="muted" style={{ fontSize: "10px", letterSpacing: "0.14em" }}>CALENDAR WEEK SCHEDULE</span>
          <h3 style={{ margin: "4px 0 0" }}>{activeWeekDay.full}'s Scheduled Routine</h3>
        </div>
        {activeWeekDay.index === todayDayOfWeek && (
          <span className="tag" style={{ background: "#212b1d", borderColor: "#3d5434", color: "var(--lime)" }}>
            Today ({activeWeekDay.short})
          </span>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "6px" }}>
        {weekDayNames.map(wd => {
          const isToday = wd.index === todayDayOfWeek;
          const isSelected = wd.index === selectedDayOfWeek;
          const calItem = weeklyCalendar.find(c => c.dayIndex === wd.index);
          const dayRest = calItem ? calItem.isRestDay : wd.index === 0;

          return (
            <button
              key={wd.short}
              type="button"
              onClick={() => {
                setSelectedDayOfWeek(wd.index);
                setReplacingIndex(null);
              }}
              style={{
                border: isSelected ? "1px solid var(--lime)" : "1px solid var(--line)",
                background: isSelected ? "#273322" : "#141a15",
                color: isSelected ? "#e2f2c8" : "#9ca89b",
                borderRadius: "10px",
                padding: "10px 4px",
                display: "grid",
                gap: "3px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.15s"
              }}
            >
              <span style={{ fontSize: "10px", fontWeight: "700" }}>{wd.short}</span>
              <span style={{ fontSize: "9px", color: isSelected ? "var(--lime)" : "var(--muted)" }}>
                {dayRest ? "Rest" : "Workout"}
              </span>
              {isToday && <span style={{ fontSize: "8px", color: "var(--lime)", fontWeight: "800" }}>● TODAY</span>}
            </button>
          );
        })}
      </div>
    </section>

    {/* Equipment 2-Button Toggle */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
      <div style={{ display: "inline-flex", background: "#111712", border: "1px solid var(--line)", borderRadius: "10px", padding: "4px", gap: "4px" }}>
        <button
          type="button"
          onClick={() => setEquipmentMode("Gym")}
          style={{
            border: 0,
            background: equipmentMode === "Gym" ? "#283324" : "transparent",
            color: equipmentMode === "Gym" ? "var(--lime)" : "var(--muted)",
            fontWeight: equipmentMode === "Gym" ? "700" : "500",
            padding: "8px 16px",
            borderRadius: "7px",
            fontSize: "11px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: "pointer"
          }}
        >
          <Dumbbell size={14} /> Full Gym Equipment
        </button>
        <button
          type="button"
          onClick={() => setEquipmentMode("No Equipment")}
          style={{
            border: 0,
            background: equipmentMode === "No Equipment" ? "#283324" : "transparent",
            color: equipmentMode === "No Equipment" ? "var(--lime)" : "var(--muted)",
            fontWeight: equipmentMode === "No Equipment" ? "700" : "500",
            padding: "8px 16px",
            borderRadius: "7px",
            fontSize: "11px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: "pointer"
          }}
        >
          No Equipment (Bodyweight)
        </button>
      </div>

      <span className="muted" style={{ fontSize: "11px" }}>
        {equipmentMode === "Gym" ? "Using commercial gym equipment" : "Calisthenics & bodyweight movements"}
      </span>
    </div>

    {/* Main Workout Panel for Selected Day */}
    <section className="panel">
      {isRestDay ? (
        <div style={{ padding: "28px 16px", textAlign: "center", display: "grid", gap: "12px", placeItems: "center" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#202a1e", color: "var(--lime)", display: "grid", placeItems: "center" }}>
            <Clock size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: "18px", margin: "0 0 6px" }}>{activeWeekDay.full} is a Scheduled Rest & Recovery Day</h3>
            <p className="muted" style={{ maxWidth: "460px", margin: "0 auto", lineHeight: "1.6" }}>
              Muscles grow during recovery. Prioritize quality sleep, 8,000–10,000 light recovery steps, hydration, and hitting your daily protein target.
            </p>
          </div>
          <button
            className="secondary"
            style={{ marginTop: "8px" }}
            onClick={() => {
              // Switch to next scheduled workout day
              const nextWorkDay = weeklyCalendar.find(d => !d.isRestDay);
              if (nextWorkDay) setSelectedDayOfWeek(nextWorkDay.dayIndex);
            }}
          >
            Switch to a training day
          </button>
        </div>
      ) : (
        <>
          <div className="panel-heading">
            <div>
              <h3>{activeWeekDay.full}'s Exercises ({equipmentMode})</h3>
              <p className="muted">Log your working sets below. Load 0–1,500 kg, reps 1–100.</p>
            </div>
            <button className="secondary" onClick={() => setShowAddModal(true)}>
              <Plus size={14} /> Add Exercise
            </button>
          </div>

          <div className="exercise-list">
            {currentExercises.map((ex, i) => {
              const lastSet = recentSets.find(item => item.exercise_name.toLowerCase() === ex.name.toLowerCase());
              const isReplacingThis = replacingIndex === i;
              const alternatives = isReplacingThis ? getAlternatives(ex.name, ex.muscle, equipmentMode) : [];

              return (
                <div key={`${ex.name}-${i}`} style={{ borderBottom: "1px solid var(--line)", paddingBottom: "12px" }}>
                  <div className="exercise-row">
                    <div className="exercise-index">{String(i + 1).padStart(2, "0")}</div>
                    <div className="exercise-info">
                      <strong>{ex.name}</strong>
                      <span className="muted">{ex.muscle} · {ex.equipment} · {ex.sets} sets × {ex.repRange} reps</span>
                      <span className="muted">
                        {lastSet ? `Last logged: ${Number(lastSet.load_kg).toLocaleString()} kg × ${lastSet.reps} reps` : "No sets logged yet"}
                      </span>
                    </div>

                    {!isReadOnly && (
                      <div className="exercise-inputs" style={{ alignItems: "center" }}>
                        <input
                          aria-label={`${ex.name} weight in kg`}
                          placeholder="kg"
                          type="number"
                          min="0"
                          value={exerciseLogs[ex.name]?.weight ?? ""}
                          onChange={e => setExerciseLogs({ ...exerciseLogs, [ex.name]: { weight: e.target.value, reps: exerciseLogs[ex.name]?.reps ?? "" } })}
                        />
                        <input
                          aria-label={`${ex.name} reps`}
                          placeholder="reps"
                          type="number"
                          min="1"
                          value={exerciseLogs[ex.name]?.reps ?? ""}
                          onChange={e => setExerciseLogs({ ...exerciseLogs, [ex.name]: { weight: exerciseLogs[ex.name]?.weight ?? "", reps: e.target.value } })}
                        />
                        <button className="log-set" title="Save set" onClick={() => saveSet(ex, activeWeekDay.full)}>
                          <Check size={16} />
                        </button>
                        <button
                          type="button"
                          className="secondary"
                          style={{ padding: "7px 10px", fontSize: "10px", height: "32px" }}
                          title="Replace exercise"
                          onClick={() => setReplacingIndex(isReplacingThis ? null : i)}
                        >
                          <RefreshCw size={13} /> Swap
                        </button>
                        <button
                          type="button"
                          className="icon-button"
                          style={{ color: "#bd5a52", padding: "6px" }}
                          title="Remove exercise"
                          onClick={() => handleRemoveExercise(i)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Inline Replacement Drawer */}
                  {isReplacingThis && (
                    <div style={{ background: "#111712", border: "1px solid var(--line)", borderRadius: "10px", padding: "12px", margin: "10px 0 6px 42px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "700" }}>Swap with an alternative for {ex.muscle} ({equipmentMode}):</span>
                        <button type="button" className="text-button" onClick={() => setReplacingIndex(null)}><X size={14} /> Close</button>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "8px" }}>
                        {alternatives.map(alt => (
                          <button
                            key={alt.name}
                            type="button"
                            className="secondary"
                            style={{ justifyContent: "flex-start", textAlign: "left", padding: "8px 10px" }}
                            onClick={() => handleReplaceExercise(i, alt)}
                          >
                            <div>
                              <strong style={{ fontSize: "11px", display: "block" }}>{alt.name}</strong>
                              <small className="muted">{alt.sets} sets × {alt.repRange}</small>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "18px", flexWrap: "wrap", gap: "10px" }}>
            <span className="muted" style={{ fontSize: "11px" }}>
              {currentExercises.length} exercises programmed for {activeWeekDay.full}.
            </span>
            <button className="secondary" disabled={workoutPlanBusy} onClick={regenerateWorkoutPlan}>
              {workoutPlanBusy ? "Refreshing…" : "Reset schedule"}
            </button>
          </div>
        </>
      )}
    </section>

    {/* Add Exercise Modal */}
    {showAddModal && (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "grid", placeItems: "center", zIndex: 50, padding: "20px" }}>
        <div style={{ background: "#171d18", border: "1px solid var(--line)", borderRadius: "16px", padding: "24px", width: "min(100%, 540px)", maxHeight: "90vh", overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3>Add Exercise to {activeWeekDay.full}</h3>
            <button type="button" className="icon-button" onClick={() => setShowAddModal(false)}><X size={18} /></button>
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "10px", color: "var(--muted)", marginBottom: "6px", display: "block" }}>SELECT MUSCLE GROUP</label>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {getAllMuscles().map(m => (
                <button
                  key={m}
                  type="button"
                  className={addMuscleFilter === m ? "day-tab active" : "day-tab"}
                  onClick={() => setAddMuscleFilter(m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gap: "8px", marginTop: "14px" }}>
            {EXERCISE_DATABASE.filter(ex => ex.muscle === addMuscleFilter && ex.equipment === equipmentMode).map(ex => (
              <div key={ex.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#111712", borderRadius: "10px", border: "1px solid var(--line)" }}>
                <div>
                  <strong style={{ fontSize: "12px", display: "block" }}>{ex.name}</strong>
                  <span className="muted" style={{ fontSize: "10px" }}>{ex.muscle} · {ex.sets} sets × {ex.repRange} reps</span>
                </div>
                <button type="button" className="primary" style={{ padding: "6px 12px", fontSize: "10px" }} onClick={() => handleAddExercise(ex)}>
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}

    {/* Workout Set Logs History */}
    <section className="panel" style={{ marginTop: "16px" }}>
      <div className="panel-heading">
        <div>
          <h3>Recent Workout History</h3>
          <p className="muted">Your 50 most recent logged sets across all sessions.</p>
        </div>
      </div>
      {recentSetsError ? (
        <p className="error history-error" role="alert">
          Workout history could not be loaded: {recentSetsError}{" "}
          <button className="text-button" onClick={() => onRetryHistory()}>Try again</button>
        </p>
      ) : recentSets.length === 0 ? (
        <p className="muted">No workout sets logged yet. Recorded sets will appear here.</p>
      ) : (
        <div className="history-list">
          {recentSets.map(set => (
            <article className="history-row" key={set.id}>
              <div>
                <strong>{set.exercise_name}</strong>
                <span className="muted">{set.workout_day} · {new Date(set.logged_at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</span>
              </div>
              <strong>{Number(set.load_kg).toLocaleString()} kg × {set.reps} reps</strong>
            </article>
          ))}
        </div>
      )}
    </section>
  </div>;
}
