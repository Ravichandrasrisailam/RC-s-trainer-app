import { Check, CircleHelp, Dumbbell } from "lucide-react";
import { PageIntro } from "../components/ui";
import { api } from "../api";

export default function TrainingPage({ days, setDays, onDaysChange, plan, activeDay, setActiveDay, exerciseLogs, setExerciseLogs, setToast }) {
  async function saveSet(exercise) {
    const entry = exerciseLogs[exercise.name];
    if (!entry?.weight || !entry?.reps) return;
    try {
      await api.logWorkoutSet(exercise.name, entry.weight, entry.reps);
      setToast(`${exercise.name} set saved`);
    } catch (error) {
      setToast(error instanceof Error ? `Set was not saved: ${error.message}` : "Set could not be saved.");
    }
  }

  const selectedDay = plan.days[activeDay % plan.days.length];
  const dayName = typeof selectedDay === "string" ? selectedDay : selectedDay.name;
  const exercises = typeof selectedDay === "string" ? plan.exercises : selectedDay.exercises;

  return <div className="content">
    <PageIntro eyebrow="TRAIN WITH INTENTION" title="Your training plan." description="Choose a weekly schedule and log each working set."><div className="goal-chip"><Dumbbell size={15} /> {plan.aiGenerated ? "Personalized AI plan" : "Sample split — AI setup required"}</div></PageIntro>
    <section className="panel">
      <div className="panel-heading"><div><h3>Choose your split</h3><p className="muted">Your saved profile sets the default training schedule.</p></div></div>
      <div className="split-options">{[3, 4, 5, 6].map(n => <button className={days === n ? "split-option active" : "split-option"} key={n} onClick={() => { onDaysChange ? onDaysChange(n) : setDays(n); setActiveDay(0); }}><strong>{n}</strong><span>days / week</span></button>)}</div>
      <div className="day-tabs">{plan.days.map((day, i) => { const label = typeof day === "string" ? day : day.name; return <button className={activeDay === i ? "day-tab active" : "day-tab"} onClick={() => setActiveDay(i)} key={label}>{label}</button>; })}</div>
      <div className="exercise-list">{exercises.map((ex, i) => <div className="exercise-row" key={ex.name}><div className="exercise-index">{String(i + 1).padStart(2, "0")}</div><div className="exercise-info"><strong>{ex.name}</strong><span className="muted">{ex.muscle} · {ex.equipment} · {ex.sets} sets × {ex.repRange}</span></div><div className="exercise-inputs"><input aria-label={`${ex.name} weight in kg`} placeholder="kg" type="number" min="0" value={exerciseLogs[ex.name]?.weight ?? ""} onChange={e => setExerciseLogs({ ...exerciseLogs, [ex.name]: { weight: e.target.value, reps: exerciseLogs[ex.name]?.reps ?? "" } })} /><input aria-label={`${ex.name} reps`} placeholder="reps" type="number" min="1" value={exerciseLogs[ex.name]?.reps ?? ""} onChange={e => setExerciseLogs({ ...exerciseLogs, [ex.name]: { weight: exerciseLogs[ex.name]?.weight ?? "", reps: e.target.value } })} /><button className="log-set" title="Save set" onClick={() => saveSet(ex)}><Check size={16} /></button></div></div>)}</div>
      <p className="muted helper-note"><CircleHelp size={14} /> ${selectedDay.focus ? `Focus: ${selectedDay.focus}. ` : ""}Saved sets are stored with your Supabase account.</p>
    </section>
  </div>;
}
