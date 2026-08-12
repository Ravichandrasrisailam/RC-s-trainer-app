import React from 'react';
import { MacroBreakdown } from '../types/fitness';
import { Flame, Plus } from 'lucide-react';

interface CalorieCardProps {
  currentCalories: number;
  targetCalories: number;
  macros: MacroBreakdown;
  onOpenMealLog: () => void;
}

export const CalorieCard: React.FC<CalorieCardProps> = ({
  currentCalories,
  targetCalories,
  macros,
  onOpenMealLog,
}) => {
  const percentage = Math.min(100, Math.round((currentCalories / targetCalories) * 100));
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <div className="bg-[#141417] rounded-2xl p-5 border border-zinc-800 shadow-sm transition-all select-none">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Flame className="w-3.5 h-3.5 text-red-500" />
            </div>
            <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Metabolic Fuel Intake
            </p>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-white text-3xl font-extrabold tracking-tight">
              {currentCalories.toLocaleString()}
            </span>
            <span className="text-zinc-400 text-sm font-medium">
              / {targetCalories.toLocaleString()} kcal
            </span>
          </div>

          <div className="mt-2.5 inline-flex items-center gap-2 bg-zinc-800/80 px-2.5 py-1 rounded-md border border-zinc-700/60">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-zinc-300 text-xs font-semibold">
              {percentage}% Daily Goal Reached
            </span>
          </div>
        </div>

        {/* SVG Circular Ring */}
        <div 
          className="relative w-20 h-20 flex-shrink-0 cursor-pointer hover:scale-105 transition-transform" 
          onClick={onOpenMealLog} 
          title="Click to log meal"
        >
          <svg className="w-20 h-20 transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="#27272a"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="#ef4444"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-white">{percentage}%</span>
          </div>
        </div>
      </div>

      {/* Macros Distribution Bar & Quick Action */}
      <div className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
        <div className="grid grid-cols-3 gap-3 flex-1 mr-3">
          <div>
            <div className="flex justify-between items-center text-[11px] text-zinc-400 mb-1.5 font-medium">
              <span>Protein</span>
              <span className="text-zinc-200 font-semibold">{macros.protein}/{macros.targetProtein}g</span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-red-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (macros.protein / macros.targetProtein) * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-[11px] text-zinc-400 mb-1.5 font-medium">
              <span>Carbs</span>
              <span className="text-zinc-200 font-semibold">{macros.carbs}/{macros.targetCarbs}g</span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-zinc-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (macros.carbs / macros.targetCarbs) * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-[11px] text-zinc-400 mb-1.5 font-medium">
              <span>Fats</span>
              <span className="text-zinc-200 font-semibold">{macros.fats}/{macros.targetFats}g</span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (macros.fats / macros.targetFats) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={onOpenMealLog}
          className="bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 font-semibold px-3 py-1.5 rounded-lg border border-zinc-700/80 flex items-center gap-1.5 transition-all flex-shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Meal</span>
        </button>
      </div>
    </div>
  );
};



