import { CartesianGrid, Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingUp } from "lucide-react";
import { PageIntro } from "../components/ui";
import { api } from "../api";

export default function ProgressPage({ weight, weightInput, setWeightInput, addWeight, steps, setSteps, history, setToast }) {
  async function saveSteps() {
    try {
      await api.logSteps(steps);
    } catch (error) {
      setToast(error instanceof Error ? `Steps were not saved: ${error.message}` : "Steps could not be saved.");
      return;
    }
    setToast("Today’s steps saved.");
  }

  return <div className="content"><PageIntro eyebrow="THE BIG PICTURE" title="Progress you can measure." description="Track trends over time, not just one day’s numbers."><div className="goal-chip"><TrendingUp size={15} /> Weight and activity</div></PageIntro><div className="two-col"><section className="panel"><span className="muted">CURRENT WEIGHT</span><div className="chart-number">{weight == null ? "—" : weight.toFixed(1)} <small>kg</small></div><div className="weight-entry"><input aria-label="Weight in kg" type="number" min="30" max="300" step=".1" value={weightInput} onChange={e => setWeightInput(e.target.value)} /><button className="primary" onClick={addWeight}>Log weight</button></div></section><section className="panel"><span className="muted">DAILY STEPS</span><div className="chart-number">{steps.toLocaleString()} <small>steps</small></div><input className="range-input" aria-label="Steps today" type="range" min="0" max="100000" step="100" value={steps} onChange={e => setSteps(+e.target.value)} /><button className="primary" onClick={saveSteps}>Save steps</button></section></div><section className="chart-card"><div className="chart-head"><div><span className="muted">WEIGHT TREND</span><div className="chart-number">{weight == null ? "—" : weight.toFixed(1)} <small>kg</small></div></div><span className="trend"><TrendingUp size={15} /> Weight history</span></div><div className="chart-wrap">{history.length === 0 ? <p className="muted">Log your first weigh-in to start a real trend.</p> : <ResponsiveContainer width="100%" height="100%"><AreaChart data={history}><CartesianGrid stroke="#252b26" vertical={false} /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#879087", fontSize: 11 }} /><YAxis domain={["dataMin - 0.4", "dataMax + 0.4"]} axisLine={false} tickLine={false} tick={{ fill: "#879087", fontSize: 11 }} width={35} /><Tooltip contentStyle={{ background: "#171c18", border: "1px solid #303a30", borderRadius: 12, color: "#f5f7f2" }} /><Area type="monotone" dataKey="weight" stroke="#b8e36a" strokeWidth={2.5} fill="#b8e36a" fillOpacity={.12} /></AreaChart></ResponsiveContainer>}</div></section></div>;
}
