import { ArrowUpRight, Dumbbell, Flame, Footprints, Target, TrendingUp, Weight } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MetricCard, PageIntro, ProgressBar } from "../components/ui";
import { calculateWeightProgress, formatSteps } from "../lib/activity";

export default function DashboardPage({ profile, steps, weight, totals, proteinTarget, caloriesTarget, history, startWeight, plan, activeDay, onNavigate }) {
  const workoutDay = plan?.days?.[activeDay % (plan.days.length || 1)];
  const workoutDayName = typeof workoutDay === "string" ? workoutDay : workoutDay?.name;
  const goalLabel = profile.goal.replaceAll("_", " ").toLowerCase();
  const weightProgress = calculateWeightProgress(history, profile.targetWeightKg, startWeight);
  const weightProgressNote = !weightProgress
    ? "Log your first weigh-in to see progress."
    : weightProgress.targetWeightKg != null
      ? weightProgress.progressPercent == null
        ? "Your target matches your starting weight; percentage progress is unavailable."
        : `${weightProgress.progressPercent.toFixed(1)}% toward your ${weightProgress.targetWeightKg.toFixed(1)} kg target.`
      : `Since your first log: ${Math.abs(weightProgress.changeKg).toFixed(1)} kg ${weightProgress.changeKg > 0 ? "down" : weightProgress.changeKg < 0 ? "up" : "no change"}.`;

  return <div className="content">
    <PageIntro eyebrow="CONSISTENCY BUILDS RESULTS" title={`Good to see you, ${profile.firstName}.`} description="Small actions today. Meaningful progress over time."><div className="goal-chip"><Target size={15} />{goalLabel}</div></PageIntro>
    <div className="metric-grid">
      <MetricCard icon={Footprints} label="Steps today" value={steps == null ? "—" : formatSteps(steps)} target={steps == null ? null : profile.stepTarget} unit="steps" color="lime" note={steps == null ? formatSteps(steps) : profile.stepTarget ? `${Math.max(0, profile.stepTarget - steps).toLocaleString()} to go` : "Set a step target in your profile"} />
      <MetricCard icon={Flame} label="Protein today" value={totals.protein} target={proteinTarget} unit="g" color="mint" note={proteinTarget ? `${Math.max(0, proteinTarget - totals.protein)}g remaining` : "Set a protein target in your profile"} />
      <MetricCard icon={Weight} label="Body weight" value={weight == null ? "—" : weight.toFixed(1)} unit="kg" color="blue" note={history.length ? "Latest logged entry" : "Profile baseline"} />
    </div>
    <div className="section-heading"><div><h3>Your week at a glance</h3><p className="muted">A simple view of the habits that move you forward.</p></div><button className="text-button" onClick={() => onNavigate("progress")}>View progress <ArrowUpRight size={15} /></button></div>
    <section className="chart-card"><div className="chart-head"><div><span className="muted">BODY WEIGHT</span><div className="chart-number">{weight == null ? "—" : weight.toFixed(1)} <small>kg</small></div></div><span className="trend"><TrendingUp size={15} /> Weight history</span></div><p className="muted">{weightProgressNote}</p><div className="chart-wrap">{history.length === 0 ? <p className="muted">No weight entries yet. Log a weigh-in to start your history.</p> : <ResponsiveContainer width="100%" height="100%"><AreaChart data={history}><defs><linearGradient id="weightFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#b8e36a" stopOpacity={0.24} /><stop offset="100%" stopColor="#b8e36a" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="#252b26" vertical={false} /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#879087", fontSize: 11 }} /><YAxis domain={["dataMin - 0.4", "dataMax + 0.4"]} axisLine={false} tickLine={false} tick={{ fill: "#879087", fontSize: 11 }} width={35} /><Tooltip contentStyle={{ background: "#171c18", border: "1px solid #303a30", borderRadius: 12, color: "#f5f7f2" }} /><Area type="monotone" dataKey="weight" stroke="#b8e36a" strokeWidth={2.5} fill="url(#weightFill)" /></AreaChart></ResponsiveContainer>}</div></section>
    <div className="two-col">
      <section className="panel"><div className="panel-heading"><div><h3>Nutrition today</h3><p className="muted">{proteinTarget ? `Your protein target is ${proteinTarget}g.` : "Set nutrition targets in your profile."}</p></div><button className="icon-button" onClick={() => onNavigate("nutrition")}><ArrowUpRight size={17} /></button></div><div className="macro-row"><span>Protein</span><strong>{totals.protein}{proteinTarget ? ` / ${proteinTarget}g` : "g"}</strong></div><ProgressBar value={totals.protein} target={proteinTarget} color="mint" /><div className="macro-row"><span>Calories</span><strong>{totals.calories}{caloriesTarget ? ` / ${caloriesTarget} kcal` : " kcal"}</strong></div><ProgressBar value={totals.calories} target={caloriesTarget} color="amber" /><div className="macro-row"><span>Carbs</span><strong>{totals.carbs}g</strong></div><div className="macro-row"><span>Fat</span><strong>{totals.fats}g</strong></div><button className="secondary full-button" onClick={() => onNavigate("nutrition")}>Log a meal <ArrowUpRight size={16} /></button></section>
      <section className="panel"><div className="panel-heading"><div><h3>Next workout</h3><p className="muted">{plan?.label || "No workout plan yet"}</p></div><Dumbbell size={18} className="muted" /></div>{workoutDayName ? <div className="workout-next"><div className="workout-day">{String(activeDay + 1).padStart(2, "0")}</div><div><strong>{workoutDayName}</strong><p className="muted">{workoutDay.exercises?.length ?? plan.exercises?.length ?? 0} exercises</p></div></div> : <p className="muted">Your workout area will fill in after a personalized plan is generated.</p>}<button className="secondary full-button" onClick={() => onNavigate("training")}>{plan ? "Open training plan" : "Set up a workout plan"} <ArrowUpRight size={16} /></button></section>
    </div>
  </div>;
}
