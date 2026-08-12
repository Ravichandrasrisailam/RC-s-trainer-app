import React, { useState } from 'react';
import { UserGoals, MacroBreakdown, WorkoutPlan, MealLogItem } from '../types/fitness';
import { Dumbbell, Utensils, Play, Plus, Scale, Footprints, Flame, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface HomeTabProps {
  userGoals: UserGoals;
  macros: MacroBreakdown;
  loggedMeals: MealLogItem[];
  todaysWorkout: WorkoutPlan;
  steps: number;
  weightKg: number;
  onOpenWorkoutModal: (workout: WorkoutPlan) => void;
  onOpenMealLog: () => void;
  onLogWeight: (newWeight: number) => void;
  onAddSteps: (addedSteps: number) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  userGoals,
  macros,
  loggedMeals,
  todaysWorkout,
  steps,
  weightKg,
  onOpenWorkoutModal,
  onOpenMealLog,
  onLogWeight,
  onAddSteps,
}) => {
  const [weightInput, setWeightInput] = useState<string>(weightKg.toString());

  // Calculate total calories & protein from logged meals today
  const totalCaloriesLogged = loggedMeals.reduce((acc, meal) => acc + meal.calories, 0);
  const totalProteinLogged = loggedMeals.reduce((acc, meal) => acc + meal.protein, 0);

  const proteinTarget = macros.targetProtein || 150;
  const proteinPct = Math.min(100, Math.round((totalProteinLogged / proteinTarget) * 100));
  const isProteinGoalReached = totalProteinLogged >= proteinTarget;
  const proteinRemaining = Math.max(0, proteinTarget - totalProteinLogged);

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(weightInput);
    if (!isNaN(val) && val > 0) {
      onLogWeight(val);
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-4 select-none">
      {/* Clean Minimalist Header (Banner Image Removed) */}
      <div className="bg-[#121216]/90 p-4 sm:p-5 rounded-2xl border border-zinc-800/70 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-red-500/10 text-red-400 text-[10px] font-mono tracking-widest px-2 py-0.5 rounded border border-red-500/20 uppercase font-light">
              DAILY PERFORMANCE METRICS
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">01 // HOME</span>
          </div>
          <h2 className="text-white text-base sm:text-lg font-bitcount font-normal tracking-wide">
            Targeted Workout & Nutrition Sync
          </h2>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div className="px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-right">
            <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">Calories</p>
            <p className="text-xs font-mono-num text-red-400 font-light">{totalCaloriesLogged} / {userGoals.caloriesTarget} kcal</p>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-right">
            <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">Protein</p>
            <p className="text-xs font-mono-num text-emerald-400 font-light">{totalProteinLogged}g / {proteinTarget}g</p>
          </div>
        </div>
      </div>

      {/* TOP ROW: 2 BOXES (Left: Log Meal, Right: Workout Session) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* BOX 1 (LEFT): TODAY'S LOG MEAL */}
        <div className="bg-[#121216]/90 p-4 sm:p-5 rounded-2xl border border-zinc-800/80 flex flex-col justify-between space-y-3 backdrop-blur-md">
          <div>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                  <Utensils className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-white text-xs sm:text-sm font-bitcount font-normal tracking-wide">Today's Meal Log</h3>
                  <p className="text-zinc-400 text-[11px] font-light">{loggedMeals.length} meals completed</p>
                </div>
              </div>

              <span className="text-[11px] font-mono font-light text-red-400 bg-red-500/10 px-2 py-0.5 rounded-lg border border-red-500/20">
                {totalCaloriesLogged} / {userGoals.caloriesTarget} kcal
              </span>
            </div>

            {/* List of meals completed today */}
            <div className="space-y-2 max-h-36 overflow-y-auto no-scrollbar pt-1">
              {loggedMeals.length === 0 ? (
                <div className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/60 text-center">
                  <p className="text-zinc-500 text-xs font-light">No meals logged yet today.</p>
                </div>
              ) : (
                loggedMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800/60 flex justify-between items-center hover:border-zinc-700/80 transition-colors"
                  >
                    <div>
                      <span className="text-[9px] font-mono text-zinc-400 uppercase bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700/40">
                        {meal.type}
                      </span>
                      <p className="text-zinc-200 text-xs font-normal mt-1">{meal.title}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono-num text-red-400">{meal.calories} kcal</span>
                      <p className="text-[10px] text-zinc-400 font-light">{meal.protein}g P</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={onOpenMealLog}
            className="w-full bg-red-600/90 hover:bg-red-500 text-white font-light text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer border border-red-500/30 active:scale-98"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="font-bitcount tracking-wide">Log Today's Meal</span>
          </button>
        </div>

        {/* BOX 2 (RIGHT): START TODAY'S WORKOUT SESSION */}
        <div className="bg-[#121216]/90 p-4 sm:p-5 rounded-2xl border border-zinc-800/80 flex flex-col justify-between space-y-3 backdrop-blur-md">
          <div>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                  <Dumbbell className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-white text-xs sm:text-sm font-bitcount font-normal tracking-wide">Today's Workout</h3>
                  <p className="text-zinc-400 text-[11px] font-light">{todaysWorkout.durationMins} Mins • {todaysWorkout.exercisesCount} Exercises</p>
                </div>
              </div>

              <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 uppercase">
                {todaysWorkout.category}
              </span>
            </div>

            <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/60 space-y-1.5">
              <h4 className="text-white text-xs font-medium">{todaysWorkout.title}</h4>
              <p className="text-zinc-400 text-[11px] font-light">
                {todaysWorkout.exercises.map((e) => e.name).slice(0, 2).join(', ')} +{todaysWorkout.exercises.length - 2} more
              </p>
              <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-zinc-400">
                <span className="bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/40">
                  Est: ~{todaysWorkout.caloriesBurnEstimate} kcal
                </span>
                <span className="bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/40">
                  RPE {userGoals.rpeCap}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onOpenWorkoutModal(todaysWorkout)}
            className="w-full bg-red-600/90 hover:bg-red-500 text-white font-light text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer border border-red-500/30 active:scale-98"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span className="font-bitcount tracking-wide">Start Workout Session</span>
          </button>
        </div>
      </div>

      {/* BOTTOM ROW: 2 BOXES (Box 3: Log Weight & Steps, Box 4: Protein Bar Graph & Goal Status) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* BOX 3 (LEFT): LOG WEIGHT AND STEPS */}
        <div className="bg-[#121216]/90 p-4 sm:p-5 rounded-2xl border border-zinc-800/80 space-y-3 backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-zinc-800/60 pb-2">
            <Scale className="w-3.5 h-3.5 text-red-500" />
            <h3 className="text-white text-xs sm:text-sm font-bitcount font-normal tracking-wide">Weight & Daily Movement</h3>
          </div>

          {/* Interactive Weight Log */}
          <form onSubmit={handleSaveWeight} className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/60 flex items-center justify-between gap-2">
            <div>
              <p className="text-zinc-400 text-[10px] font-mono uppercase tracking-wider">Current Weight</p>
              <p className="text-zinc-200 text-xs font-mono mt-0.5">Target: {userGoals.targetWeightKg} kg</p>
            </div>

            <div className="flex items-center gap-1.5">
              <input
                type="number"
                step="0.1"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                className="w-16 bg-zinc-950 border border-zinc-700/80 rounded-lg px-2 py-1 text-center text-xs font-mono text-white focus:outline-none focus:border-red-500 font-light"
              />
              <span className="text-xs font-mono text-zinc-400">kg</span>
              <button
                type="submit"
                className="bg-red-600/90 hover:bg-red-500 text-white text-[11px] font-light px-2.5 py-1 rounded-lg transition-all cursor-pointer font-bitcount"
              >
                Save
              </button>
            </div>
          </form>

          {/* Steps Log */}
          <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/60 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <Footprints className="w-3.5 h-3.5 text-red-500" />
                <p className="text-zinc-200 text-xs font-mono-num">{steps.toLocaleString()} / {userGoals.stepsTarget.toLocaleString()} steps</p>
              </div>
              <div className="w-32 bg-zinc-800/80 h-1 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-red-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, Math.round((steps / userGoals.stepsTarget) * 100))}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => onAddSteps(1000)}
              className="bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/60 text-zinc-300 text-[11px] font-light px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>+1k Steps</span>
            </button>
          </div>
        </div>

        {/* BOX 4 (RIGHT): PROTEIN BAR GRAPH & GOAL STATUS */}
        <div className="bg-[#121216]/90 p-4 sm:p-5 rounded-2xl border border-zinc-800/80 space-y-3 flex flex-col justify-between backdrop-blur-md">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white text-xs sm:text-sm font-bitcount font-normal tracking-wide flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-500" />
                <span>Protein Goal Progress</span>
              </h3>
              <span className="text-xs font-mono-num text-red-400">
                {totalProteinLogged}g / {proteinTarget}g ({proteinPct}%)
              </span>
            </div>

            {/* Protein Bar Graph */}
            <div className="w-full bg-zinc-900/80 h-2.5 rounded-full overflow-hidden border border-zinc-800/80 p-0.5 mb-3">
              <div
                className="bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${proteinPct}%` }}
              />
            </div>

            {/* Goal Reached Status Badge */}
            <div className="pt-1">
              {isProteinGoalReached ? (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-emerald-400 text-xs font-light">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Protein Goal Reached ({totalProteinLogged}g)</span>
                </div>
              ) : (
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-2 text-amber-300 text-xs font-light">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span>{proteinRemaining}g Protein Remaining for daily target</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-[10px] text-zinc-400 bg-zinc-900/40 p-2 rounded-xl border border-zinc-800/60 flex items-center justify-between font-mono">
            <span>Dynamic intake monitor</span>
            <span className="text-zinc-300">Target: {proteinTarget}g</span>
          </div>
        </div>
      </div>
    </div>
  );
};
