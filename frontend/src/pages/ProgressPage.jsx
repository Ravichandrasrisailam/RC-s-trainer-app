import { useState } from "react";
import { CartesianGrid, Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Calendar, Clock, Footprints, Scale, TrendingUp } from "lucide-react";
import { PageIntro } from "../components/ui";
import { formatSteps, localDateString } from "../lib/activity";

export default function ProgressPage({
  weight,
  weightInput,
  setWeightInput,
  addWeight,
  steps,
  stepsInput,
  setStepsInput,
  saveSteps,
  history,
  mealHistory,
  stepHistory,
  activityError,
  onRetryActivity,
  setToast
}) {
  const todayStr = localDateString();
  const yesterdayObj = new Date(Date.now() - 86400000);
  const yesterdayStr = localDateString(yesterdayObj);

  const [stepTargetDate, setStepTargetDate] = useState(yesterdayStr); // Default to yesterday as requested
  const [weightTargetDate, setWeightTargetDate] = useState(todayStr);

  const activityByDate = new Map();
  for (const entry of stepHistory) {
    activityByDate.set(entry.loggedOn, { loggedOn: entry.loggedOn, steps: entry.steps, meals: [] });
  }
  for (const meal of mealHistory) {
    const entry = activityByDate.get(meal.loggedOn) || { loggedOn: meal.loggedOn, steps: null, meals: [] };
    entry.meals.push(meal);
    activityByDate.set(meal.loggedOn, entry);
  }
  const activityHistory = [...activityByDate.values()].sort((a, b) => b.loggedOn.localeCompare(a.loggedOn));

  const handleSaveSteps = () => {
    saveSteps(stepsInput, stepTargetDate);
  };

  const handleAddWeight = () => {
    addWeight(weightInput, weightTargetDate);
  };

  return <div className="content">
    <PageIntro eyebrow="THE BIG PICTURE" title="Progress you can measure." description="Track trends over time, log yesterday's steps and manage daily bodyweight.">
      <div className="goal-chip"><TrendingUp size={15} /> Weight and activity</div>
    </PageIntro>

    {activityError && (
      <p className="error history-error" role="alert">
        Your saved activity history could not be loaded: {activityError}{" "}
        <button className="text-button" onClick={() => onRetryActivity()}>Try again</button>
      </p>
    )}

    <div className="two-col">
      <section className="panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="muted">BODY WEIGHT</span>
          <span className="tag"><Scale size={13} /> Weigh-in</span>
        </div>
        <div className="chart-number">{weight == null ? "—" : weight.toFixed(1)} <small>kg</small></div>

        <div style={{ margin: "10px 0 6px" }}>
          <label style={{ fontSize: "10px", color: "var(--muted)", display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px" }}>
            <Calendar size={12} /> Log date
          </label>
          <select value={weightTargetDate} onChange={e => setWeightTargetDate(e.target.value)} style={{ padding: "6px 10px", fontSize: "11px" }}>
            <option value={todayStr}>Today ({new Date(todayStr + "T12:00:00").toLocaleDateString([], { month: "short", day: "numeric" })})</option>
            <option value={yesterdayStr}>Yesterday ({new Date(yesterdayStr + "T12:00:00").toLocaleDateString([], { month: "short", day: "numeric" })})</option>
          </select>
        </div>

        <div className="weight-entry">
          <input aria-label="Weight in kg" type="number" min="30" max="300" step=".1" placeholder="e.g. 74.5" value={weightInput} onChange={e => setWeightInput(e.target.value)} />
          <button className="primary" onClick={handleAddWeight}>Save weigh-in</button>
        </div>
      </section>

      <section className="panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="muted">DAILY STEP COUNT</span>
          <span className="tag"><Footprints size={13} /> Activity</span>
        </div>
        <div className="chart-number">{steps == null ? formatSteps(steps) : <>{formatSteps(steps)} <small>steps</small></>}</div>

        <div style={{ margin: "10px 0 6px" }}>
          <label style={{ fontSize: "10px", color: "var(--muted)", display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px" }}>
            <Clock size={12} /> Walking day (default: yesterday)
          </label>
          <select value={stepTargetDate} onChange={e => setStepTargetDate(e.target.value)} style={{ padding: "6px 10px", fontSize: "11px" }}>
            <option value={yesterdayStr}>Yesterday ({new Date(yesterdayStr + "T12:00:00").toLocaleDateString([], { month: "short", day: "numeric" })}) — Completed</option>
            <option value={todayStr}>Today ({new Date(todayStr + "T12:00:00").toLocaleDateString([], { month: "short", day: "numeric" })}) — In progress</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
          <input
            className="range-input"
            style={{ margin: 0 }}
            aria-label="Steps"
            type="number"
            min="0"
            max="100000"
            step="100"
            placeholder="Enter walked steps (e.g. 8500)"
            value={stepsInput}
            onChange={e => setStepsInput(e.target.value)}
          />
          <button className="primary" style={{ whiteSpace: "nowrap" }} disabled={stepsInput === ""} onClick={handleSaveSteps}>
            Save steps
          </button>
        </div>
      </section>
    </div>

    <section className="chart-card">
      <div className="chart-head">
        <div>
          <span className="muted">WEIGHT TREND (30 DAYS)</span>
          <div className="chart-number">{weight == null ? "—" : weight.toFixed(1)} <small>kg</small></div>
        </div>
        <span className="trend"><TrendingUp size={15} /> Weight history</span>
      </div>
      <div className="chart-wrap">
        {activityError ? (
          <p className="muted">Weight history is unavailable until the saved activity can be loaded.</p>
        ) : history.length === 0 ? (
          <p className="muted">Log your first weigh-in to start a real trend.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <CartesianGrid stroke="#252b26" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#879087", fontSize: 11 }} />
              <YAxis domain={["dataMin - 0.4", "dataMax + 0.4"]} axisLine={false} tickLine={false} tick={{ fill: "#879087", fontSize: 11 }} width={35} />
              <Tooltip contentStyle={{ background: "#171c18", border: "1px solid #303a30", borderRadius: 12, color: "#f5f7f2" }} />
              <Area type="monotone" dataKey="weight" stroke="#b8e36a" strokeWidth={2.5} fill="#b8e36a" fillOpacity={.12} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>

    <section className="panel">
      <div className="panel-heading">
        <div>
          <h3>Activity & Step Log History</h3>
          <p className="muted">Saved records from the last 30 days (Read-only historical view).</p>
        </div>
      </div>
      {activityError ? (
        <p className="muted">Activity history is unavailable; retry the load to confirm whether records exist.</p>
      ) : activityHistory.length === 0 ? (
        <p className="muted">No meal or step records in the last 30 days yet.</p>
      ) : (
        <div className="history-list">
          {activityHistory.map(day => (
            <article className="history-row" key={day.loggedOn}>
              <div>
                <strong>{new Date(`${day.loggedOn}T12:00:00`).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}</strong>
                <span className="muted">{day.steps == null ? "No step entry" : `${day.steps.toLocaleString()} steps`}</span>
              </div>
              <div className="history-meals">
                {day.meals.length === 0 ? (
                  <span className="muted">No meals logged</span>
                ) : (
                  day.meals.map(meal => <span key={meal.id}>{meal.name} · {meal.calories} kcal</span>)
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  </div>;
}
