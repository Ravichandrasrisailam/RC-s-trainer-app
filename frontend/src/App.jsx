import { useEffect, useMemo, useState } from "react";
import { Activity, Apple, BarChart3, ChevronDown, Dumbbell, Home, LogOut } from "lucide-react";
import { api, clearToken, saveToken } from "./api";
import { demoProfile, workoutPlans } from "./data";
import DashboardPage from "./pages/DashboardPage";
import MealsPage from "./pages/MealsPage";
import TrainingPage from "./pages/TrainingPage";
import ProgressPage from "./pages/ProgressPage";
import ProfilePage from "./pages/ProfilePage";

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("register");
  const [form, setForm] = useState({ firstName: "", lastName: "", dob: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try { const result = mode === "register" ? await api.register({ ...form }) : await api.login(form.email, form.password); saveToken(result.token); onAuth(); }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to sign in. Please try again."); }
    finally { setBusy(false); }
  }
  return <main className="auth-shell"><div className="auth-brand"><span className="brand-mark">RC</span><span>RC TRAINER</span></div><section className="auth-card"><div className="eyebrow">YOUR TRAINING. YOUR PROGRESS.</div><h1>{mode === "register" ? "Build your stronger self." : "Welcome back."}</h1><p className="muted">A clearer plan for every workout and every meal.</p><div className="auth-switch"><button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>Create account</button><button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Sign in</button></div><form onSubmit={submit} className="form-grid">{mode === "register" && <><label>First name<input required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} placeholder="First name" /></label><label>Last name<input required value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} placeholder="Last name" /></label><label className="full">Date of birth<input required type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} /></label></>}<label className="full">Email address<input required type="email" autoComplete="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label><label className="full">Password<input required minLength={8} type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" /></label>{error && <p className="error full">{error}</p>}<button className="primary full" disabled={busy}>{busy ? "Please wait…" : mode === "register" ? "Create account" : "Sign in"}</button></form><p className="auth-legal">By continuing, you agree to use RC Trainer as a fitness tracking tool, not as a substitute for professional medical advice.</p></section></main>;
}

function Onboarding({ profile, onSave }) {
  const [p, setP] = useState(profile);
  return <main className="auth-shell"><div className="auth-brand"><span className="brand-mark">RC</span><span>RC TRAINER</span></div><section className="auth-card onboarding-card"><div className="eyebrow">LET'S SET YOUR BASELINE</div><h1>Set your starting point.</h1><p className="muted">Your goals and activity level will shape future AI recommendations.</p><form className="form-grid" onSubmit={e => { e.preventDefault(); onSave(p); }}><label>Height (cm)<input type="number" min="100" max="230" required value={p.heightCm} onChange={e => setP({ ...p, heightCm: +e.target.value })} /></label><label>Current weight (kg)<input type="number" min="30" max="300" step=".1" required value={p.weightKg} onChange={e => setP({ ...p, weightKg: +e.target.value })} /></label><label className="full">Desired goal<select value={p.goal} onChange={e => setP({ ...p, goal: e.target.value })}><option value="WEIGHT_LOSS">Weight loss</option><option value="FAT_LOSS">Fat loss</option><option value="MUSCLE_GAIN">Muscle gain</option><option value="RECOMPOSITION">Body recomposition</option></select></label><label className="full">Activity level<select value={p.activityLevel} onChange={e => setP({ ...p, activityLevel: e.target.value })}><option value="SEDENTARY">Sedentary</option><option value="LIGHT">Lightly active</option><option value="MODERATE">Moderately active</option><option value="VERY_ACTIVE">Very active</option></select></label><label className="full">Training days per week<select value={p.trainingDaysPerWeek} onChange={e => setP({ ...p, trainingDaysPerWeek: +e.target.value })}><option value="3">3 days</option><option value="4">4 days</option><option value="5">5 days</option><option value="6">6 days</option></select></label><label className="full">Daily step target<input type="number" min="1000" max="30000" step="500" value={p.stepTarget} onChange={e => setP({ ...p, stepTarget: +e.target.value })} /></label><button className="primary full">Save profile</button></form></section></main>;
}

const nav = [{ id: "overview", label: "Overview", icon: Home }, { id: "nutrition", label: "Meals", icon: Apple }, { id: "training", label: "Workouts", icon: Dumbbell }, { id: "progress", label: "Progress", icon: BarChart3 }, { id: "profile", label: "Profile", icon: Activity }];

export default function App() {
  const [authenticated, setAuthenticated] = useState(Boolean(localStorage.getItem("rc_access_token")));
  const [onboarded, setOnboarded] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profile, setProfile] = useState(demoProfile);
  const [tab, setTab] = useState("overview");
  const [meals, setMeals] = useState([]);
  const [mealText, setMealText] = useState("");
  const [mealBusy, setMealBusy] = useState(false);
  const [mealError, setMealError] = useState("");
  const [steps, setSteps] = useState(0);
  const [weight, setWeight] = useState(demoProfile.weightKg);
  const [weightInput, setWeightInput] = useState(String(demoProfile.weightKg));
  const [history, setHistory] = useState([]);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [days, setDays] = useState(demoProfile.trainingDaysPerWeek);
  const [activeDay, setActiveDay] = useState(0);
  const [exerciseLogs, setExerciseLogs] = useState({});
  const [toast, setToast] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const totals = useMemo(() => meals.reduce((a, m) => ({ calories: a.calories + m.calories, protein: a.protein + m.protein, carbs: a.carbs + m.carbs, fats: a.fats + m.fats }), { calories: 0, protein: 0, carbs: 0, fats: 0 }), [meals]);
  const proteinTarget = profile.proteinTarget || Math.round(profile.weightKg * (profile.goal === "MUSCLE_GAIN" ? 2 : 1.8));
  const plan = generatedPlan?.days?.length === days ? generatedPlan : workoutPlans[days];
  useEffect(() => {
    if (!authenticated) { setProfileLoading(false); return; }
    api.getProfile().then(async saved => {
      const nextProfile = { ...demoProfile, ...saved, proteinTarget: saved.proteinTargetG ?? saved.proteinTarget ?? demoProfile.proteinTarget };
      setProfile(nextProfile);
      setDays(nextProfile.trainingDaysPerWeek ?? 3);
      setOnboarded(Boolean(saved.hasOnboarded));
      if (saved.hasOnboarded) {
        try {
          const activity = await api.getActivityData();
          setMeals(activity.meals); setSteps(activity.steps); setHistory(activity.history);
          if (activity.weight != null) { setWeight(activity.weight); setWeightInput(String(activity.weight)); }
        } catch (err) { setToast(err instanceof Error ? `Activity history unavailable: ${err.message}` : "Could not load activity history."); }
        try { setGeneratedPlan(await api.getOrGenerateWorkoutPlan(nextProfile)); }
        catch (err) { setToast(err instanceof Error ? err.message : "AI workout plan is unavailable; showing a sample split."); }
      }
    }).catch(err => { setOnboarded(false); setToast(err instanceof Error ? err.message : "Could not load your saved profile."); }).finally(() => setProfileLoading(false));
  }, [authenticated]);
  async function saveProfile(next) {
    try {
      const saved = await api.saveProfile(next);
      const updated = { ...next, ...saved, proteinTarget: saved.proteinTargetG ?? Math.round(next.weightKg * (next.goal === "MUSCLE_GAIN" ? 2 : 1.8)) };
      setProfile(updated); setDays(updated.trainingDaysPerWeek); setOnboarded(true);
      setGeneratedPlan(null);
      try { setGeneratedPlan(await api.getOrGenerateWorkoutPlan(updated)); setToast("Profile saved and your personalized plan is ready."); }
      catch { setToast("Profile saved. AI plan generation needs GEMINI_API_KEY in Supabase Edge Function secrets."); }
    } catch (err) {
      setToast(err instanceof Error ? `Profile was not saved: ${err.message}` : "Profile could not be saved.");
    }
  }
  async function changeTrainingDays(nextDays) { const updated = { ...profile, trainingDaysPerWeek: nextDays }; setActiveDay(0); await saveProfile(updated); }
  async function addMeal() { if (!mealText.trim()) return; setMealBusy(true); setMealError(""); try { const estimate = await api.estimateMeal(mealText); const meal = await api.logMeal({ ...estimate, mealType: "Meal" }); setMeals(prev => [...prev, meal]); setMealText(""); setToast("Meal added to today's log"); } catch (e) { setMealError(e instanceof Error ? e.message : "Could not estimate this meal. Check the API connection."); } finally { setMealBusy(false); } }
  async function addWeight() { const value = Number(weightInput); if (!Number.isFinite(value) || value < 30 || value > 300) return; try { await api.logWeight(value); setWeight(value); setHistory(prev => [...prev, { day: new Date().toLocaleDateString([], { month: "short", day: "numeric" }), weight: value }]); setToast("Weight entry saved"); } catch (err) { setToast(err instanceof Error ? `Weight was not saved: ${err.message}` : "Weight could not be saved."); } }
  if (!authenticated) return <AuthScreen onAuth={() => setAuthenticated(true)} />;
  if (profileLoading) return <main className="auth-shell"><div className="auth-brand"><span className="brand-mark">RC</span><span>RC TRAINER</span></div><section className="auth-card"><div className="eyebrow">RC TRAINER</div><h1>Loading your profile.</h1><p className="muted">Preparing your dashboard and recommendations.</p></section></main>;
  if (!onboarded) return <Onboarding profile={profile} onSave={saveProfile} />;
  const pageTitle = { overview: "Your overview", nutrition: "Nutrition", training: "Training plan", progress: "Your progress", profile: "Profile" }[tab];
  const page = { overview: <DashboardPage profile={profile} steps={steps} weight={weight} totals={totals} proteinTarget={proteinTarget} history={history} plan={plan} activeDay={activeDay} onNavigate={setTab} />, nutrition: <MealsPage meals={meals} totals={totals} proteinTarget={proteinTarget} mealText={mealText} setMealText={setMealText} mealBusy={mealBusy} mealError={mealError} addMeal={addMeal} />, training: <TrainingPage days={days} setDays={setDays} onDaysChange={changeTrainingDays} plan={plan} activeDay={activeDay} setActiveDay={setActiveDay} exerciseLogs={exerciseLogs} setExerciseLogs={setExerciseLogs} setToast={setToast} />, progress: <ProgressPage weight={weight} weightInput={weightInput} setWeightInput={setWeightInput} addWeight={addWeight} steps={steps} setSteps={setSteps} history={history} setToast={setToast} />, profile: <ProfilePage profile={profile} onSave={saveProfile} /> }[tab];
  return <div className="app-shell"><aside className="sidebar"><div className="brand"><span className="brand-mark">RC</span><span>RC TRAINER</span></div><div className="side-label">WORKSPACE</div><nav>{nav.map(n => <button key={n.id} className={tab === n.id ? "nav-item selected" : "nav-item"} onClick={() => setTab(n.id)}><n.icon size={18} />{n.label}</button>)}</nav><div className="sidebar-bottom"><div className="profile-mini"><div className="avatar">{profile.firstName[0]}</div><div><strong>{profile.firstName} {profile.lastName}</strong><small>{profile.goal.replace("_", " ").toLowerCase()}</small></div><button className="icon-button" onClick={() => setShowProfile(!showProfile)}><ChevronDown size={16} /></button></div>{showProfile && <button className="nav-item" onClick={() => { clearToken(); setAuthenticated(false); setOnboarded(false); }}><LogOut size={17} /> Sign out</button>}</div></aside><main className="main-area"><header className="topbar"><div><span className="muted">TUESDAY, YOUR NEXT REP STARTS HERE</span><h1>{pageTitle}</h1></div><button className="date-pill"><Activity size={15} /> Today <ChevronDown size={14} /></button></header>{page}<footer className="footer"><span>RC TRAINER</span><span>Progress over perfection.</span></footer></main><nav className="mobile-nav">{nav.map(n => <button key={n.id} className={tab === n.id ? "mobile-item active" : "mobile-item"} onClick={() => setTab(n.id)}><n.icon size={19} /><span>{n.label}</span></button>)}</nav>{toast && <button className="toast" onClick={() => setToast("")}>{toast}</button>}</div>;
}
