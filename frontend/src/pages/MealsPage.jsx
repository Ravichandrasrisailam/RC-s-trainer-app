import { Apple, Clock, Plus, Utensils } from "lucide-react";
import { PageIntro, ProgressBar } from "../components/ui";

export default function MealsPage({
  meals,
  totals,
  proteinTarget,
  caloriesTarget,
  mealText,
  setMealText,
  mealBusy,
  mealError,
  addMeal,
  mealPlan,
  mealPlanBusy,
  generateMealPlan,
  mealPlanError,
  logPlannedMeal,
  activityError,
  onRetryActivity,
  isReadOnly = false,
  selectedDateLabel = "Today",
  onSwitchToToday
}) {
  return <div className="content">
    {isReadOnly && (
      <div className="read-only-banner">
        <div>
          <strong>Viewing Past Meals for {selectedDateLabel}</strong>
          <span className="history-tag" style={{ marginLeft: "8px" }}>Read-Only History</span>
          <p className="muted" style={{ margin: "4px 0 0" }}>You are viewing past saved food logs. To log food for today, switch back to Today.</p>
        </div>
        {onSwitchToToday && (
          <button className="primary" onClick={onSwitchToToday}>Return to Today</button>
        )}
      </div>
    )}

    {activityError && (
      <p className="error history-error" role="alert">
        Your saved meal and activity history could not be loaded: {activityError}{" "}
        <button className="text-button" onClick={() => onRetryActivity()}>Try again</button>
      </p>
    )}

    <PageIntro
      eyebrow="NUTRITION & MACROS"
      title="Daily Nutrition Plan."
      description="Calibrated around your workout timing with balanced whole-food staples: rice, yogurt/curd, lentils, vegetables, and high-quality protein."
    >
      <div className="goal-chip"><Utensils size={15} /> Daily Meal Schedule</div>
    </PageIntro>

    <section className="panel">
      <div className="panel-heading">
        <div>
          <h3>Scheduled Daily Meals</h3>
          <p className="muted">Structured timing and portions to hit your daily protein and calorie targets.</p>
        </div>
      </div>

      {mealPlanError && <p className="error">{mealPlanError}</p>}

      {mealPlan ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
            <h4>{mealPlan.label}</h4>
            <span className="tag">Balanced Whole Foods</span>
          </div>

          <div className="meal-list">
            {mealPlan.meals.map((meal, index) => (
              <article className="meal-item" key={`${meal.name}-${index}`}>
                <div className="meal-dot"><Apple size={17} /></div>
                <div className="meal-info">
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                    <strong>{meal.name}</strong>
                    {meal.time && (
                      <span className="meal-timestamp"><Clock size={11} /> {meal.time}</span>
                    )}
                  </div>
                  <span className="muted">{meal.mealType} · {meal.portion}</span>
                  <span className="muted">{meal.preparation || meal.notes || ""}</span>
                </div>
                <div className="meal-macros">
                  <strong>{meal.calories} kcal</strong>
                  <span className="muted">{meal.protein}g protein · {meal.carbs}g carbs · {meal.fats}g fat</span>
                  {!isReadOnly && (
                    <button className="secondary" onClick={() => logPlannedMeal(meal)}>Log this meal</button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </>
      ) : (
        <p className="muted">{mealPlanBusy ? "Loading your meal plan…" : "No meal plan generated yet. Click below to generate your schedule."}</p>
      )}

      <div className="ai-actions">
        <span className="muted">Whole-food meals aligned with your protein target and workout schedule.</span>
        <button className="primary" disabled={mealPlanBusy} onClick={generateMealPlan}>
          {mealPlanBusy ? "Updating…" : mealPlan ? "Refresh meal plan" : "Generate meal plan"}
        </button>
      </div>
    </section>

    {!isReadOnly ? (
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h3>Estimate & Log a Meal</h3>
            <p className="muted">Describe whatever food and portion you consumed (e.g. 1 cup rice, 1 bowl dal, 150g chicken breast or paneer with curd and salad).</p>
          </div>
        </div>
        <textarea rows={3} value={mealText} onChange={e => setMealText(e.target.value)} placeholder="Describe what you ate (e.g., 2 rotis with dal and 150g chicken curry, 1 bowl yogurt)…" />
        {mealError && <p className="error">{mealError}</p>}
        <div className="ai-actions">
          <span className="muted">Specify portions for the most accurate macro estimation.</span>
          <button className="primary" disabled={mealBusy || !mealText.trim()} onClick={addMeal}>
            {mealBusy ? "Estimating…" : "Estimate & add meal"}
          </button>
        </div>
      </section>
    ) : null}

    <div className="nutrition-summary">
      <div>
        <span className="muted">PROTEIN</span>
        <strong>{totals.protein}<small>{proteinTarget ? ` / ${proteinTarget}g` : " g"}</small></strong>
        <ProgressBar value={totals.protein} target={proteinTarget} color="mint" />
      </div>
      <div>
        <span className="muted">CALORIES</span>
        <strong>{totals.calories}<small>{caloriesTarget ? ` / ${caloriesTarget} kcal` : " kcal"}</small></strong>
        <ProgressBar value={totals.calories} target={caloriesTarget} color="amber" />
      </div>
      <div>
        <span className="muted">CARBS</span>
        <strong>{totals.carbs}<small> g</small></strong>
      </div>
      <div>
        <span className="muted">FATS</span>
        <strong>{totals.fats}<small> g</small></strong>
      </div>
    </div>

    <section className="panel">
      <div className="panel-heading">
        <div>
          <h3>{isReadOnly ? `Food Log for ${selectedDateLabel}` : "Today’s food log"}</h3>
          <p className="muted">{activityError ? "History unavailable" : `${meals.length} meals logged`}</p>
        </div>
        <span className="tag">{selectedDateLabel}</span>
      </div>
      <div className="meal-list">
        {activityError ? (
          <p className="muted">We could not confirm whether you have meals logged for this date.</p>
        ) : meals.length === 0 ? (
          <p className="muted">No meals logged for {selectedDateLabel.toLowerCase()}. {isReadOnly ? "No past entries found." : "Your real log will appear here after you add one."}</p>
        ) : (
          meals.map(m => (
            <div className="meal-item" key={m.id}>
              <div className="meal-dot"><Apple size={17} /></div>
              <div className="meal-info">
                <strong>{m.name}</strong>
                <span className="muted">{m.mealType} · {m.loggedAt}</span>
              </div>
              <div className="meal-macros">
                <strong>{m.calories} kcal</strong>
                <span className="muted">{m.protein}g protein · {m.carbs}g carbs · {m.fats}g fat</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  </div>;
}
