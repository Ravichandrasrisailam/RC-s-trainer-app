import React from 'react';
import { Footprints, Moon, Droplets, Heart, Plus } from 'lucide-react';

interface MetricsGridProps {
  steps: number;
  stepsTarget: number;
  sleepMinutes: number;
  waterMl: number;
  waterTargetMl: number;
  heartRate: number;
  onAddWater: (ml: number) => void;
  onAddSteps: () => void;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  steps,
  stepsTarget,
  sleepMinutes,
  waterMl,
  waterTargetMl,
  heartRate,
  onAddWater,
  onAddSteps,
}) => {
  const sleepHours = Math.floor(sleepMinutes / 60);
  const sleepMinsRemaining = sleepMinutes % 60;

  const waterLiters = (waterMl / 1000).toFixed(1);
  const waterTargetLiters = (waterTargetMl / 1000).toFixed(1);

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 select-none">
      {/* Steps Card */}
      <div 
        onClick={onAddSteps}
        className="bg-[#141417] p-4 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer relative"
      >
        <div className="flex justify-between items-start mb-2">
          <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <Footprints className="w-4 h-4 text-red-500" />
          </div>
          <span className="text-[11px] font-semibold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">
            {Math.round((steps / stepsTarget) * 100)}%
          </span>
        </div>
        <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Daily Movement</p>
        <h3 className="text-white font-bold text-2xl mt-1 tracking-tight">
          {steps.toLocaleString()}
        </h3>
        <p className="text-zinc-400 text-[11px] font-medium mt-1">
          Goal: {stepsTarget.toLocaleString()} • {(steps * 0.00075).toFixed(1)} km
        </p>
      </div>

      {/* Sleep Card */}
      <div className="bg-[#141417] p-4 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all relative">
        <div className="flex justify-between items-start mb-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <Moon className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-[11px] font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
            88 Score
          </span>
        </div>
        <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Sleep Recovery</p>
        <h3 className="text-white font-bold text-2xl mt-1 tracking-tight">
          {sleepHours}h {sleepMinsRemaining}m
        </h3>
        <p className="text-zinc-400 text-[11px] font-medium mt-1">
          Deep: 2h 15m • REM: 1h 45m
        </p>
      </div>

      {/* Hydration / Water Card */}
      <div className="bg-[#141417] p-4 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all relative">
        <div className="flex justify-between items-start mb-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddWater(250);
            }}
            title="Add +250ml water"
            className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center transition-all cursor-pointer font-bold border border-zinc-700/80"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Hydration Level</p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-white font-bold text-2xl tracking-tight">{waterLiters}L</span>
          <span className="text-xs text-zinc-400 font-medium">/ {waterTargetLiters}L</span>
        </div>
        <p className="text-zinc-400 text-[11px] font-medium mt-1">
          {Math.round((waterMl / waterTargetMl) * 100)}% of daily quota
        </p>
      </div>

      {/* Heart Rate / Recovery Card */}
      <div className="bg-[#141417] p-4 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all relative">
        <div className="flex justify-between items-start mb-2">
          <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <Heart className="w-4 h-4 text-red-500" />
          </div>
          <span className="text-[11px] font-semibold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">
            Resting
          </span>
        </div>
        <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Bio Pulse HR</p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-white font-bold text-2xl tracking-tight">{heartRate}</span>
          <span className="text-xs font-medium text-zinc-400">BPM</span>
        </div>
        <p className="text-zinc-400 text-[11px] font-medium mt-1">
          HRV: 68 ms • High Prime
        </p>
      </div>
    </div>
  );
};



