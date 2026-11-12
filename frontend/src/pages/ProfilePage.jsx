import { useEffect, useState } from "react";
import { ArrowUpRight, Dumbbell, Globe, HeartPulse, Paperclip, UserRound } from "lucide-react";
import { PageIntro } from "../components/ui";
import { calculateRecommendedTargets } from "../lib/activity";

export default function ProfilePage({ profile, onSave, onExportData, onDeleteAccount }) {
  const [draft, setDraft] = useState(profile);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [accountError, setAccountError] = useState("");
  const [autoCalculatedNotice, setAutoCalculatedNotice] = useState("");
  const [attachedFileName, setAttachedFileName] = useState("");

  useEffect(() => setDraft(profile), [profile]);

  const change = (key, value) => {
    const next = { ...draft, [key]: value };
    setDraft(next);

    // If changing baseline drivers, auto-calculate if fields are ready
    if (["heightCm", "weightKg", "goal", "activityLevel"].includes(key)) {
      if (next.heightCm && next.weightKg && next.goal && next.activityLevel) {
        const rec = calculateRecommendedTargets({
          heightCm: next.heightCm,
          weightKg: next.weightKg,
          goal: next.goal,
          activityLevel: next.activityLevel
        });
        if (rec) {
          next.stepTarget = rec.stepTarget;
          next.proteinTargetG = rec.proteinTargetG;
          next.proteinTarget = rec.proteinTargetG;
          next.caloriesTarget = rec.caloriesTarget;
          setDraft({ ...next });
          setAutoCalculatedNotice("Targets auto-updated based on your baseline.");
        }
      }
    }
  };

  const applyAutoTargets = () => {
    if (!draft.heightCm || !draft.weightKg || !draft.goal || !draft.activityLevel) {
      setAutoCalculatedNotice("Please set height, weight, goal and activity level first.");
      return;
    }
    const rec = calculateRecommendedTargets({
      heightCm: draft.heightCm,
      weightKg: draft.weightKg,
      goal: draft.goal,
      activityLevel: draft.activityLevel
    });
    if (rec) {
      setDraft(prev => ({
        ...prev,
        stepTarget: rec.stepTarget,
        proteinTargetG: rec.proteinTargetG,
        proteinTarget: rec.proteinTargetG,
        caloriesTarget: rec.caloriesTarget
      }));
      setAutoCalculatedNotice("Targets calculated using Mifflin-St Jeor TDEE & optimal protein synthesis ratios.");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFileName(file.name);
      change("prescriptionUrl", file.name);
      if (!draft.prescriptionNotes) {
        change("prescriptionNotes", `Attached file: ${file.name}`);
      }
    }
  };

  return <div className="content">
    <PageIntro eyebrow="YOUR BASELINE" title="Profile & Preferences." description="These parameters drive your scheduled training splits and daily macro recommendations.">
      <div className="goal-chip"><UserRound size={15} /> Personal profile</div>
    </PageIntro>

    <section className="panel profile-form">
      <div className="panel-heading">
        <div>
          <h3>Training & Diet Inputs</h3>
          <p className="muted">Keep these current so your workout schedule and nutrition stay tailored to your body and timezone.</p>
        </div>
      </div>

      <form className="form-grid" onSubmit={async e => {
        e.preventDefault();
        setSaving(true);
        try { await onSave(draft); }
        finally { setSaving(false); }
      }}>
        <label>First name<input required value={draft.firstName} onChange={e => change("firstName", e.target.value)} /></label>
        <label>Last name<input required value={draft.lastName} onChange={e => change("lastName", e.target.value)} /></label>

        {/* Location Columns */}
        <label>Country
          <input
            placeholder="e.g. India, United States"
            value={draft.country || ""}
            onChange={e => change("country", e.target.value)}
          />
        </label>
        <label>City
          <input
            placeholder="e.g. Hyderabad, Bengaluru, London"
            value={draft.city || ""}
            onChange={e => change("city", e.target.value)}
          />
        </label>
        
        <label>Height (cm)<input required min="100" max="230" type="number" value={draft.heightCm} onChange={e => change("heightCm", e.target.value === "" ? "" : Number(e.target.value))} /></label>
        <label>Current weight (kg)<input required min="30" max="300" type="number" step=".1" value={draft.weightKg} onChange={e => change("weightKg", e.target.value === "" ? "" : Number(e.target.value))} /></label>
        <label className="full">Target weight (kg, optional)<input min="30" max="300" type="number" step=".1" value={draft.targetWeightKg ?? ""} onChange={e => change("targetWeightKg", e.target.value === "" ? "" : Number(e.target.value))} /></label>

        <label className="full">Desired goal
          <select required value={draft.goal} onChange={e => change("goal", e.target.value)}>
            <option value="">Choose a goal</option>
            <option value="WEIGHT_LOSS">Weight loss</option>
            <option value="FAT_LOSS">Fat loss (Preserve muscle, shed fat)</option>
            <option value="MUSCLE_GAIN">Muscle gain (Hypertrophy / Lean bulk)</option>
            <option value="RECOMPOSITION">Body recomposition</option>
          </select>
        </label>

        <label className="full">Activity level
          <select required value={draft.activityLevel} onChange={e => change("activityLevel", e.target.value)}>
            <option value="">Choose activity level</option>
            <option value="SEDENTARY">Sedentary (Little or no exercise)</option>
            <option value="LIGHT">Lightly active (1-3 days/week)</option>
            <option value="MODERATE">Moderately active (3-5 days/week)</option>
            <option value="VERY_ACTIVE">Very active (6-7 days/week)</option>
          </select>
        </label>

        <label>Dietary preference
          <select value={draft.dietaryPreference || "NON_VEG"} onChange={e => change("dietaryPreference", e.target.value)}>
            <option value="NON_VEG">Non-Vegetarian (Chicken, Fish, Prawns, Mutton, Eggs)</option>
            <option value="VEG">Vegetarian (Paneer, Tofu, Soya Chunks, Dal, Curd/Yogurt)</option>
            <option value="EGGETARIAN">Eggetarian (Veg + Eggs)</option>
            <option value="VEGAN">Vegan (Plant-based, Tofu, Soya, Legumes)</option>
          </select>
        </label>

        <label>Workout timing preference
          <select value={draft.workoutTiming || "EVENING"} onChange={e => change("workoutTiming", e.target.value)}>
            <option value="MORNING">Morning Workout (Pre-workout at ~6:30 AM)</option>
            <option value="EVENING">Evening Workout (Pre-workout at ~5:00 PM)</option>
          </select>
        </label>

        <label className="full">Default equipment situation
          <select value={draft.equipmentAccess || "FULL_GYM"} onChange={e => change("equipmentAccess", e.target.value)}>
            <option value="FULL_GYM">Gym (Barbells, Dumbbells, Cables, Machines)</option>
            <option value="BODYWEIGHT">No Equipment (Bodyweight & Calisthenics)</option>
          </select>
        </label>

        <label className="full">How many days per week will you work out?
          <select required value={draft.trainingDaysPerWeek} onChange={e => change("trainingDaysPerWeek", e.target.value === "" ? "" : Number(e.target.value))}>
            <option value="">Choose workout days</option>
            <option value="3">3 days (Full Body Split)</option>
            <option value="4">4 days (Upper / Lower Split)</option>
            <option value="5">5 days (Push / Pull / Legs / Upper / Lower)</option>
            <option value="6">6 days (Push / Pull / Legs x 2)</option>
          </select>
        </label>

        <div className="full" style={{ marginTop: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: "700" }}>DAILY TARGETS</span>
            <button type="button" className="text-button" onClick={applyAutoTargets}>Auto-calculate from baseline</button>
          </div>
          {autoCalculatedNotice && <div className="auto-calc-badge">{autoCalculatedNotice}</div>}
        </div>

        <label>Daily step target
          <input required type="number" min="1000" max="30000" step="500" value={draft.stepTarget} onChange={e => change("stepTarget", e.target.value === "" ? "" : Number(e.target.value))} />
        </label>

        <label>Daily protein target (g)
          <input required type="number" min="20" max="400" value={draft.proteinTargetG ?? draft.proteinTarget} onChange={e => change("proteinTargetG", e.target.value === "" ? "" : Number(e.target.value))} />
        </label>

        <label className="full">Daily calorie target (kcal)
          <input required type="number" min="500" max="10000" value={draft.caloriesTarget} onChange={e => change("caloriesTarget", e.target.value === "" ? "" : Number(e.target.value))} />
        </label>

        <label className="full">Any injury, pain, or medical condition
          <textarea
            rows={2}
            placeholder="e.g. Lower back stiffness, right shoulder impingement, knee discomfort, diabetes, or none"
            value={draft.injuriesOrConditions || ""}
            onChange={e => change("injuriesOrConditions", e.target.value)}
          />
        </label>

        <label className="full">Doctor's prescription or medical notes (Optional)
          <textarea
            rows={2}
            placeholder="Optional doctor's guidance, medication notes, or exercise restrictions"
            value={draft.prescriptionNotes || ""}
            onChange={e => change("prescriptionNotes", e.target.value)}
          />
        </label>

        <div className="full">
          <label style={{ marginBottom: "6px" }}>Optional prescription attachment (Image / PDF)</label>
          <label className="file-attachment-box">
            <Paperclip size={18} className="muted" />
            <span style={{ fontSize: "11px" }}>{attachedFileName || draft.prescriptionUrl || "Click to attach doctor's prescription or lab report"}</span>
            <span className="muted" style={{ fontSize: "10px" }}>Supports PDF, JPG, PNG for health context analysis</span>
            <input type="file" accept="image/*,application/pdf" style={{ display: "none" }} onChange={handleFileUpload} />
          </label>
        </div>

        {(draft.injuriesOrConditions || draft.prescriptionNotes || draft.prescriptionUrl) && (
          <div className="full health-context-card">
            <strong><HeartPulse size={15} /> Health Context Active</strong>
            <p>Your workout recommendations automatically swap high-risk movements for biomechanically safe, joint-friendly variations.</p>
          </div>
        )}

        <button className="primary full" disabled={saving}>
          {saving ? "Saving…" : "Save profile"} <ArrowUpRight size={17} />
        </button>
      </form>
    </section>

    <section className="panel profile-form">
      <div className="panel-heading">
        <div>
          <h3>Your data</h3>
          <p className="muted">Export a copy of your profile, saved activity, workout sets and cached plans.</p>
        </div>
      </div>
      <button className="secondary" disabled={exporting} onClick={async () => {
        setAccountError("");
        setExporting(true);
        try { await onExportData(); }
        catch (error) { setAccountError(error instanceof Error ? error.message : "Data export failed."); }
        finally { setExporting(false); }
      }}>
        {exporting ? "Preparing export…" : "Download my data"}
      </button>
      {accountError && <p className="error" role="alert">{accountError}</p>}
    </section>

    <section className="panel profile-form account-danger">
      <div className="panel-heading">
        <div>
          <h3>Delete account</h3>
          <p className="muted">Permanently remove your Supabase account and associated profile, activity, workout logs and saved plans. This cannot be undone.</p>
        </div>
      </div>
      <form className="form-grid" onSubmit={async event => {
        event.preventDefault();
        setAccountError("");
        setDeleting(true);
        try { await onDeleteAccount(); }
        catch (error) { setAccountError(error instanceof Error ? error.message : "Account deletion failed."); }
        finally { setDeleting(false); }
      }}>
        <label className="full">Type DELETE to confirm<input autoComplete="off" value={deleteConfirmation} onChange={event => setDeleteConfirmation(event.target.value)} /></label>
        <button className="danger-button full" disabled={deleting || deleteConfirmation !== "DELETE"}>
          {deleting ? "Deleting account…" : "Permanently delete account"}
        </button>
        {accountError && <p className="error full" role="alert">{accountError}</p>}
      </form>
    </section>
  </div>;
}
