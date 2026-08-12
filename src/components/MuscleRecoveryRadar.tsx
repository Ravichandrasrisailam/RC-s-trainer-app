import React from 'react';
import { MuscleGroupStatus } from '../types/fitness';
import { initialMuscleStatuses } from '../data/mockData';
import { Activity, ChevronRight, ShieldCheck } from 'lucide-react';

interface MuscleRecoveryRadarProps {
  muscleStatuses?: MuscleGroupStatus[];
  onSelectMuscleToTrain?: (muscleName: string) => void;
  onGenerateWorkout?: () => void;
}

export const MuscleRecoveryRadar: React.FC<MuscleRecoveryRadarProps> = ({
  muscleStatuses = initialMuscleStatuses,
  onSelectMuscleToTrain,
  onGenerateWorkout,
}) => {
  const safeStatuses = muscleStatuses || [];
  const primeMuscles = safeStatuses.filter((m) => m.recoveryPercentage >= 85);

  const handleSelect = (muscleName: string) => {
    if (onSelectMuscleToTrain) {
      onSelectMuscleToTrain(muscleName);
    } else if (onGenerateWorkout) {
      onGenerateWorkout();
    }
  };

  const getStatusBadge = (status: MuscleGroupStatus['status']) => {
    switch (status) {
      case 'Prime':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'Ready':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Recovering':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Fatigued':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    }
  };

  const getBarColor = (percentage: number) => {
    if (percentage >= 85) return 'bg-red-500';
    if (percentage >= 70) return 'bg-emerald-400';
    if (percentage >= 50) return 'bg-amber-400';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-[#141417] border border-zinc-800 rounded-2xl p-4 sm:p-5 select-none">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-white text-base font-bold tracking-tight">
              Muscle Recovery Radar
            </h3>
            <p className="text-zinc-400 text-xs">Real-time bio-fatigue index for target training</p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-xs font-semibold text-red-500">{primeMuscles.length} Muscle Groups Prime</span>
        </div>
      </div>

      {/* Summary highlight pill */}
      <div className="bg-zinc-800/60 border border-zinc-700/60 rounded-xl p-3 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-red-500" />
          <span className="text-xs text-zinc-300">
            Top Readiness: <strong className="text-white font-semibold">{primeMuscles.map(m => m.name).join(', ')}</strong>
          </span>
        </div>
        <button
          onClick={() => handleSelect(primeMuscles[0]?.name || 'Chest')}
          className="text-xs font-semibold text-red-500 hover:text-red-400 flex items-center gap-1 cursor-pointer"
        >
          <span>Train Prime</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Muscle List Bars */}
      <div className="space-y-2.5">
        {safeStatuses.map((muscle) => {
          return (
            <div
              key={muscle.id}
              onClick={() => handleSelect(muscle.name)}
              className="p-2.5 rounded-xl bg-zinc-800/40 hover:bg-zinc-800/80 border border-zinc-800 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-200 group-hover:text-red-400 transition-colors">
                    {muscle.name}
                  </span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${getStatusBadge(muscle.status)}`}>
                    {muscle.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-300">
                    {muscle.recoveryPercentage}%
                  </span>
                  <span className="text-[10px] text-zinc-400">{muscle.lastTrained}</span>
                </div>
              </div>

              {/* Progress track */}
              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getBarColor(muscle.recoveryPercentage)}`}
                  style={{ width: `${muscle.recoveryPercentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


