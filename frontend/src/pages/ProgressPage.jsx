import { CartesianGrid, Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingUp } from "lucide-react";
import { PageIntro } from "../components/ui";
import { formatSteps } from "../lib/activity";

export default function ProgressPage({ weight, weightInput, setWeightInput, addWeight, steps, stepsInput, setStepsInput, saveSteps, history, mealHistory, stepHistory, activityError, onRetryActivity }) {
  const activityByDate = new Map();
  for (const entry of stepHistory) activityByDate.set(entry.loggedOn, { loggedOn: entry.loggedOn, steps: entry.steps, meals: [] });
  for (const meal of mealHistory) {
    const entry = activityByDate.get(meal.loggedOn) || { loggedOn: meal.loggedOn, steps: null, meals: [] };
    entry.meals.push(meal);
    activityByDate.set(meal.loggedOn, entry);
  }
  const activityHistory = [...activityByDate.values()].sort((a, b) => b.loggedOn.localeCompare(a.loggedOn));

  return <div className="content">
    <PageIntro eyebrow="THE BIG PICTURE" title="Progress you can measure." description="Track trends over time, not just one day’s numbers.">
      <div className="goal-chip"><TrendingUp size={15} /> Weight and activity</div>
    </PageIntro>
    {activityError && <p className="error history-error" role="alert">Your saved activity history could not be loaded: {activityError} <button className="text-button" onClick={() => onRetryActivity()}>Try again</button></p>}
    <div className="two-col">
      <section className="panel">
        <span className="muted">CURRENT WEIGHT</span>
        <div className="chart-number">{weight == null ? "—" : weight.toFixed(1)} <small>kg</small></div>
        <div className="weight-entry">
          <input aria-label="Weight in kg" type="number" min="30" max="300" step=".1" value={weightInput} onChange={e => setWeightInput(e.target.value)} />
          <button className="primary" onClick={addWeight}>Log weight</button>
        </div>
      </section>
      <section className="panel">
        <span className="muted">DAILY STEPS</span>
        <div className="chart-number">{steps == null ? formatSteps(steps) : <>{formatSteps(steps)} <small>steps</small></>}</div>
        <input className="range-input" aria-label="Steps today" type="number" min="0" max="100000" step="1" placeholder="Enter today’s steps" value={stepsInput} onChange={e => setStepsInput(e.target.value)} />
        <button className="primary" disabled={stepsInput === ""} onClick={saveSteps}>Save steps</button>
      </section>
    </div>
    <section className="chart-card">
      <div className="chart-head">
        <div><span className="muted">WEIGHT TREND</span><div className="chart-number">{weight == null ? "—" : weight.toFixed(1)} <small>kg</small></div></div>
        <span className="trend"><TrendingUp size={15} /> Weight history</span>
      </div>
      <div className="chart-wrap">
        {activityError
          ? <p className="muted">Weight history is unavailable until the saved activity can be loaded.</p>
          : history.length === 0
            ? <p className="muted">Log your first weigh-in to start a real trend.</p>
          : <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <CartesianGrid stroke="#252b26" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#879087", fontSize: 11 }} />
              <YAxis domain={["dataMin - 0.4", "dataMax + 0.4"]} axisLine={false} tickLine={false} tick={{ fill: "#879087", fontSize: 11 }} width={35} />
              <Tooltip contentStyle={{ background: "#171c18", border: "1px solid #303a30", borderRadius: 12, color: "#f5f7f2" }} />
              <Area type="monotone" dataKey="weight" stroke="#b8e36a" strokeWidth={2.5} fill="#b8e36a" fillOpacity={.12} />
            </AreaChart>
          </ResponsiveContainer>}
      </div>
    </section>
    <section className="panel">
      <div className="panel-heading"><div><h3>Recent activity</h3><p className="muted">Your saved meals and step logs from the last 30 days.</p></div></div>
      {activityError
        ? <p className="muted">Activity history is unavailable; retry the load to confirm whether records exist.</p>
        : activityHistory.length === 0
          ? <p className="muted">No meal or step records in the last 30 days yet.</p>
          : <div className="history-list">{activityHistory.map(day => <article className="history-row" key={day.loggedOn}><div><strong>{new Date(`${day.loggedOn}T12:00:00`).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}</strong><span className="muted">{day.steps == null ? "No step entry" : `${day.steps.toLocaleString()} steps`}</span></div><div className="history-meals">{day.meals.length === 0 ? <span className="muted">No meals logged</span> : day.meals.map(meal => <span key={meal.id}>{meal.name} · {meal.calories} kcal</span>)}</div></article>)}</div>}
    </section>
  </div>;
}
