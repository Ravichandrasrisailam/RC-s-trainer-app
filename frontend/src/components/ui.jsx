import { ArrowUpRight } from "lucide-react";

export function ProgressBar({ value, target, color = "lime" }) {
  const pct = Math.min(100, Math.round((value / Math.max(target, 1)) * 100));
  return <div className="progress-track"><div className={`progress-fill ${color}`} style={{ width: `${pct}%` }} /></div>;
}

export function MetricCard({ icon: Icon, label, value, target, unit, color, note }) {
  return <section className="metric-card">
    <div className="metric-top"><span className="metric-icon"><Icon size={17} /></span><span className="muted">{label}</span><ArrowUpRight size={15} className="muted" /></div>
    <div className="metric-value">{value}<small> {unit}</small></div>
    <ProgressBar value={value} target={target} color={color} />
    <div className="metric-foot"><span>{note}</span><strong>{Math.min(100, Math.round(value / Math.max(target, 1) * 100))}%</strong></div>
  </section>;
}

export function PageIntro({ eyebrow, title, description, children }) {
  return <section className="welcome-row"><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2><p className="muted">{description}</p></div>{children}</section>;
}
