import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Activity, Apple, BarChart3, ChevronDown, Dumbbell, Home, LogOut } from "lucide-react";
import { api, clearToken, saveToken } from "./api";
import { emptyProfile } from "./data";
import { isStepCount, isWeightKg } from "./lib/validation";
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const MealsPage = lazy(() => import("./pages/MealsPage"));
const TrainingPage = lazy(() => import("./pages/TrainingPage"));
const ProgressPage = lazy(() => import("./pages/ProgressPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

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

function Onboarding({ profile, onSave, error }) {
  const [p, setP] = useState(profile);
  const [saving, setSaving] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    try { await onSave(p); } finally { setSaving(false); }
  }
  return <main className="auth-shell"><div className="auth-brand"><span className="brand-mark">RC</span><span>RC TRAINER</span></div><section className="auth-card onboarding-card"><div className="eyebrow">LET'S SET YOUR BASELINE</div><h1>Set your starting point.</h1><p className="muted">Enter your own baseline and targets. Your AI plans will use these saved values.</p><form className="form-grid" onSubmit={submit}><label>Height (cm)<input type="number" min="100" max="230" required value={p.heightCm} onChange={e => setP({ ...p, heightCm: e.target.value === "" ? "" : Number(e.target.value) })} /></label><label>Current weight (kg)<input type="number" min="30" max="300" step=".1" required value={p.weightKg} onChange={e => setP({ ...p, weightKg: e.target.value === "" ? "" : Number(e.target.value) })} /></label><label>Target weight (kg, optional)<input type="number" min="30" max="300" step=".1" value={p.targetWeightKg ?? ""} onChange={e => setP({ ...p, targetWeightKg: e.target.value === "" ? "" : Number(e.target.value) })} /></label><label className="full">Desired goal<select required value={p.goal} onChange={e => setP({ ...p, goal: e.target.value })}><option value="">Choose a goal</option><option value="WEIGHT_LOSS">Weight loss</option><option value="FAT_LOSS">Fat loss</option><option value="MUSCLE_GAIN">Muscle gain</option><option value="RECOMPOSITION">Body recomposition</option></select></label><label className="full">Activity level<select required value={p.activityLevel} onChange={e => setP({ ...p, activityLevel: e.target.value })}><option value="">Choose activity level</option><option value="SEDENTARY">Sedentary</option><option value="LIGHT">Lightly active</option><option value="MODERATE">Moderately active</option><option value="VERY_ACTIVE">Very active</option></select></label><label className="full">Training days per week<select required value={p.trainingDaysPerWeek} onChange={e => setP({ ...p, trainingDaysPerWeek: e.target.value === "" ? "" : Number(e.target.value) })}><option value="">Choose days per week</option><option value="3">3 days</option><option value="4">4 days</option><option value="5">5 days</option><option value="6">6 days</option></select></label><label>Daily step target<input type="number" min="1000" max="30000" step="500" required value={p.stepTarget} onChange={e => setP({ ...p, stepTarget: e.target.value === "" ? "" : Number(e.target.value) })} /></label><label>Daily protein target (g)<input type="number" min="20" max="400" step="1" required value={p.proteinTargetG ?? p.proteinTarget} onChange={e => setP({ ...p, proteinTargetG: e.target.value === "" ? "" : Number(e.target.value), proteinTarget: e.target.value === "" ? "" : Number(e.target.value) })} /></label><label className="full">Daily calorie target (kcal)<input type="number" min="500" max="10000" step="1" required value={p.caloriesTarget} onChange={e => setP({ ...p, caloriesTarget: e.target.value === "" ? "" : Number(e.target.value) })} /></label>{error && <p className="error full">{error}</p>}<button className="primary full" disabled={saving}>{saving ? "Saving…" : "Save profile"}</button></form></section></main>;
}

const nav = [{ id: "overview", label: "Overview", icon: Home }, { id: "nutrition", label: "Meals", icon: Apple }, { id: "training", label: "Workouts", icon: Dumbbell }, { id: "progress", label: "Progress", icon: BarChart3 }, { id: "profile", label: "Profile", icon: Activity }];
const todayLabel = new Date().toLocaleDateString([], { weekday: "long" }).toUpperCase();

export default function App() {
  const [authenticated, setAuthenticated] = useState(Boolean(localStorage.getItem("rc_access_token")));
  const [onboarded, setOnboarded] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [profileSaveError, setProfileSaveError] = useState("");
  const [profile, setProfile] = useState(emptyProfile);
  const [tab, setTab] = useState("overview");
  const [meals, setMeals] = useState([]);
  const [mealText, setMealText] = useState("");
  const [mealBusy, setMealBusy] = useState(false);
  const [mealError, setMealError] = useState("");
  const [mealPlan, setMealPlan] = useState(null);
  const [mealPlanBusy, setMealPlanBusy] = useState(false);
  const [mealPlanError, setMealPlanError] = useState("");
  const [workoutPlanBusy, setWorkoutPlanBusy] = useState(false);
  const [steps, setSteps] = useState(null);
  const [stepsInput, setStepsInput] = useState("");
  const [weight, setWeight] = useState(null);
  const [weightInput, setWeightInput] = useState("");
  const [history, setHistory] = useState([]);
  const [startWeight, setStartWeight] = useState(null);
  const [recentSets, setRecentSets] = useState([]);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [days, setDays] = useState(null);
  const [activeDay, setActiveDay] = useState(0);
  const [exerciseLogs, setExerciseLogs] = useState({});
  const [toast, setToast] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const totals = useMemo(() => meals.reduce((a, m) => ({ calories: a.calories + m.calories, protein: a.protein + m.protein, carbs: a.carbs + m.carbs, fats: a.fats + m.fats }), { calories: 0, protein: 0, carbs: 0, fats: 0 }), [meals]);
  const proteinTarget = Number(profile.proteinTargetG ?? profile.proteinTarget) || null;
  const caloriesTarget = Number(profile.caloriesTarget) || null;
  const plan = generatedPlan?.days?.length === days ? generatedPlan : null;
  useEffect(() => {
    if (!authenticated) { setProfileLoading(false); return; }
    setProfileError("");
    setMealPlan(null);
    setMealPlanError("");
    setMealPlanBusy(false);
    setGeneratedPlan(null);
    setMeals([]);
    setHistory([]);
    setSteps(null);
    setStepsInput("");
    setWeight(null);
    setWeightInput("");
    setStartWeight(null);
    setRecentSets([]);
    api.getProfile().then(async saved => {
      const nextProfile = { ...emptyProfile, ...saved, proteinTarget: saved.proteinTargetG ?? saved.proteinTarget };
      setProfile(nextProfile);
      setDays(nextProfile.trainingDaysPerWeek || null);
      setOnboarded(Boolean(saved.hasOnboarded));
      if (saved.hasOnboarded) {
        const [activityResult, recentSetsResult] = await Promise.allSettled([
          api.getActivityData(),
          api.getRecentSets()
        ]);
        if (activityResult.status === "fulfilled") {
          const activity = activityResult.value;
          setMeals(activity.meals);
          setSteps(activity.steps);
          setStepsInput(activity.steps == null ? "" : String(activity.steps));
          setHistory(activity.history);
          setStartWeight(activity.startWeight);
          const currentWeight = activity.weight ?? Number(nextProfile.weightKg);
          if (Number.isFinite(currentWeight) && currentWeight > 0) { setWeight(currentWeight); setWeightInput(String(currentWeight)); }
        } else {
          const err = activityResult.reason;
          setToast(err instanceof Error ? `Activity history unavailable: ${err.message}` : "Could not load activity history.");
        }
        if (recentSetsResult.status === "fulfilled") {
          setRecentSets(recentSetsResult.value);
        } else {
          const err = recentSetsResult.reason;
          setToast(err instanceof Error ? `Recent workout sets unavailable: ${err.message}` : "Could not load recent workout sets.");
        }
        try { setGeneratedPlan(await api.getOrGenerateWorkoutPlan(nextProfile)); }
        catch (err) { setToast(err instanceof Error ? `Workout plan unavailable: ${err.message}` : "Could not load your workout plan."); }
        setMealPlanBusy(true);
        try { setMealPlan(await api.getOrGenerateMealPlan(nextProfile)); }
        catch (err) { setMealPlanError(err instanceof Error ? err.message : "Could not load your meal plan."); }
        finally { setMealPlanBusy(false); }
      }
    }).catch(err => { setProfileError(err instanceof Error ? err.message : "Could not load your saved profile."); }).finally(() => setProfileLoading(false));
  }, [authenticated]);
  async function saveProfile(next) {
    setProfileSaveError("");
    try {
      const saved = await api.saveProfile(next);
      const updated = { ...next, ...saved, proteinTarget: saved.proteinTargetG ?? saved.proteinTarget };
      setProfile(updated); setDays(updated.trainingDaysPerWeek); setOnboarded(true);
      setGeneratedPlan(null);
      setMealPlan(null);
      setMealPlanError("");
      setMealPlanBusy(true);
      const [workoutResult, mealResult] = await Promise.allSettled([
        api.getOrGenerateWorkoutPlan(updated),
        api.getOrGenerateMealPlan(updated)
      ]);
      if (workoutResult.status === "fulfilled") setGeneratedPlan(workoutResult.value);
      else setToast(`Profile saved. Workout plan unavailable: ${workoutResult.reason instanceof Error ? workoutResult.reason.message : "AI generation failed."}`);
      if (mealResult.status === "fulfilled") setMealPlan(mealResult.value);
      else setMealPlanError(mealResult.reason instanceof Error ? mealResult.reason.message : "Could not generate a meal plan.");
      setMealPlanBusy(false);
      if (workoutResult.status === "fulfilled" && mealResult.status === "fulfilled") setToast("Profile saved and personalized plans are ready.");
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Profile could not be saved.";
      setProfileSaveError(message);
      setToast(`Profile was not saved: ${message}`);
      return false;
    }
  }
  async function changeTrainingDays(nextDays) { const updated = { ...profile, trainingDaysPerWeek: nextDays }; setActiveDay(0); await saveProfile(updated); }
  async function generateMealPlan() {
    setMealPlanBusy(true); setMealPlanError("");
    try { setMealPlan(await api.getOrGenerateMealPlan(profile, { force: Boolean(mealPlan) })); }
    catch (err) { setMealPlanError(err instanceof Error ? err.message : "Could not generate a meal plan."); }
    finally { setMealPlanBusy(false); }
  }
  async function regenerateWorkoutPlan() {
    setWorkoutPlanBusy(true);
    try { setGeneratedPlan(await api.getOrGenerateWorkoutPlan(profile, { force: true })); setToast("Your personalized workout plan is ready."); }
    catch (err) { setToast(err instanceof Error ? err.message : "Could not generate a workout plan."); }
    finally { setWorkoutPlanBusy(false); }
  }
  async function logPlannedMeal(meal) {
    try { const saved = await api.logMeal({ ...meal, mealType: meal.mealType || "Meal" }); setMeals(prev => [saved, ...prev]); setToast("Suggested meal added to today’s log."); }
    catch (err) { setToast(err instanceof Error ? `Meal was not saved: ${err.message}` : "Meal could not be saved."); }
  }
  async function addMeal() { if (!mealText.trim()) return; setMealBusy(true); setMealError(""); try { const estimate = await api.estimateMeal(mealText); const meal = await api.logMeal({ ...estimate, mealType: "Meal" }); setMeals(prev => [...prev, meal]); setMealText(""); setToast("Meal added to today's log"); } catch (e) { setMealError(e instanceof Error ? e.message : "Could not estimate this meal. Check the API connection."); } finally { setMealBusy(false); } }
  async function addWeight() {
    const value = Number(weightInput);
    if (!isWeightKg(value)) { setToast("Enter a weight between 30 and 300 kg."); return; }
    try {
      const saved = await api.logWeight(value);
      const savedWeight = Number(saved.weight_kg);
      const loggedOn = saved.logged_on;
      const entry = {
        loggedOn,
        day: new Date(`${loggedOn}T12:00:00`).toLocaleDateString([], { month: "short", day: "numeric" }),
        weight: savedWeight
      };
      setWeight(savedWeight);
      setWeightInput(String(savedWeight));
      setHistory(current => [...current.filter(item => item.loggedOn !== loggedOn), entry].sort((a, b) => a.loggedOn.localeCompare(b.loggedOn)).slice(-30));
      setStartWeight(current => current == null ? savedWeight : current);
      setToast("Weight entry saved");
    } catch (err) {
      setToast(err instanceof Error ? `Weight was not saved: ${err.message}` : "Weight could not be saved.");
    }
  }
  async function saveSteps() {
    if (stepsInput === "") { setToast("Choose a step count before saving."); return; }
    const value = Number(stepsInput);
    if (!isStepCount(value)) { setToast("Enter a whole step count between 0 and 100,000."); return; }
    try {
      const saved = await api.logSteps(value);
      setSteps(Number(saved.steps));
      setStepsInput(String(saved.steps));
      setToast("Today’s steps saved.");
    } catch (err) {
      setToast(err instanceof Error ? `Steps were not saved: ${err.message}` : "Steps could not be saved.");
    }
  }
  if (!authenticated) return <AuthScreen onAuth={() => { setProfileLoading(true); setProfileError(""); setAuthenticated(true); }} />;
  if (profileLoading) return <main className="auth-shell"><div className="auth-brand"><span className="brand-mark">RC</span><span>RC TRAINER</span></div><section className="auth-card"><div className="eyebrow">RC TRAINER</div><h1>Loading your profile.</h1><p className="muted">Preparing your dashboard and recommendations.</p></section></main>;
  if (profileError) return <main className="auth-shell"><div className="auth-brand"><span className="brand-mark">RC</span><span>RC TRAINER</span></div><section className="auth-card"><div className="eyebrow">PROFILE UNAVAILABLE</div><h1>We couldn't load your profile.</h1><p className="error">{profileError}</p><button className="primary full" onClick={() => window.location.reload()}>Try again</button><button className="secondary full" onClick={() => { clearToken(); setAuthenticated(false); }}>Sign in again</button></section></main>;
  if (!onboarded) return <Onboarding profile={profile} onSave={saveProfile} error={profileSaveError} />;
  const pageTitle = { overview: "Your overview", nutrition: "Nutrition", training: "Training plan", progress: "Your progress", profile: "Profile" }[tab];
  const page = { overview: <DashboardPage profile={profile} steps={steps} weight={weight} totals={totals} proteinTarget={proteinTarget} caloriesTarget={caloriesTarget} history={history} startWeight={startWeight} plan={plan} activeDay={activeDay} onNavigate={setTab} />, nutrition: <MealsPage meals={meals} totals={totals} proteinTarget={proteinTarget} caloriesTarget={caloriesTarget} mealText={mealText} setMealText={setMealText} mealBusy={mealBusy} mealError={mealError} addMeal={addMeal} mealPlan={mealPlan} mealPlanBusy={mealPlanBusy} generateMealPlan={generateMealPlan} mealPlanError={mealPlanError} logPlannedMeal={logPlannedMeal} />, training: <TrainingPage days={days} setDays={setDays} onDaysChange={changeTrainingDays} plan={plan} activeDay={activeDay} workoutPlanBusy={workoutPlanBusy} regenerateWorkoutPlan={regenerateWorkoutPlan} setActiveDay={setActiveDay} exerciseLogs={exerciseLogs} setExerciseLogs={setExerciseLogs} recentSets={recentSets} setRecentSets={setRecentSets} setToast={setToast} />, progress: <ProgressPage weight={weight} weightInput={weightInput} setWeightInput={setWeightInput} addWeight={addWeight} steps={steps} stepsInput={stepsInput} setStepsInput={setStepsInput} saveSteps={saveSteps} history={history} setToast={setToast} />, profile: <ProfilePage profile={profile} onSave={saveProfile} /> }[tab];
  return <div className="app-shell"><aside className="sidebar"><div className="brand"><span className="brand-mark">RC</span><span>RC TRAINER</span></div><div className="side-label">WORKSPACE</div><nav>{nav.map(n => <button key={n.id} className={tab === n.id ? "nav-item selected" : "nav-item"} onClick={() => setTab(n.id)}><n.icon size={18} />{n.label}</button>)}</nav><div className="sidebar-bottom"><div className="profile-mini"><div className="avatar">{profile.firstName[0]}</div><div><strong>{profile.firstName} {profile.lastName}</strong><small>{profile.goal.replace("_", " ").toLowerCase()}</small></div><button className="icon-button" onClick={() => setShowProfile(!showProfile)}><ChevronDown size={16} /></button></div>{showProfile && <button className="nav-item" onClick={() => { clearToken(); setAuthenticated(false); setOnboarded(false); setProfile(emptyProfile); setMeals([]); setMealPlan(null); setGeneratedPlan(null); }}><LogOut size={17} /> Sign out</button>}</div></aside><main className="main-area"><header className="topbar"><div><span className="muted">{todayLabel}, YOUR NEXT REP STARTS HERE</span><h1>{pageTitle}</h1></div><button className="date-pill"><Activity size={15} /> Today <ChevronDown size={14} /></button></header><Suspense fallback={<section className="content"><p className="muted">Loading…</p></section>}>{page}</Suspense><footer className="footer"><span>RC TRAINER</span><span>Progress over perfection.</span></footer></main><nav className="mobile-nav">{nav.map(n => <button key={n.id} className={tab === n.id ? "mobile-item active" : "mobile-item"} onClick={() => setTab(n.id)}><n.icon size={19} /><span>{n.label}</span></button>)}</nav>{toast && <button className="toast" onClick={() => setToast("")}>{toast}</button>}</div>;
}
