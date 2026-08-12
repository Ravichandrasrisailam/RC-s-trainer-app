import React from 'react';
import { WorkoutPlan } from '../types/fitness';
import { Play, ChevronRight, Clock, Zap } from 'lucide-react';

interface WorkoutSectionProps {
  workouts: WorkoutPlan[];
  onSelectWorkout: (workout: WorkoutPlan) => void;
  onViewAllPlans: () => void;
}

export const WorkoutSection: React.FC<WorkoutSectionProps> = ({
  workouts,
  onSelectWorkout,
  onViewAllPlans,
}) => {
  const primaryWorkout = workouts[0] || sampleDefault;

  return (
    <div className="mt-2 select-none">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-white font-bold text-base tracking-tight flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-red-500 fill-red-500" />
          <span>Recommended Session</span>
        </h4>
        <button
          onClick={onViewAllPlans}
          className="text-red-500 hover:text-red-400 text-xs font-semibold flex items-center gap-0.5 transition-colors cursor-pointer"
        >
          <span>All Programs</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div
        onClick={() => onSelectWorkout(primaryWorkout)}
        className="bg-[#141417] rounded-2xl p-4 border border-zinc-800 hover:border-zinc-700 flex items-center gap-4 cursor-pointer transition-all group"
      >
        <div className="w-16 h-16 bg-zinc-800 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden relative border border-zinc-700">
          <span className="text-zinc-500 text-xl font-bold select-none">
            {primaryWorkout.imagePlaceholderLetter || 'RC'}
          </span>
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 fill-white ml-0.5" />
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
              {primaryWorkout.category}
            </span>
            <span className="text-zinc-400 text-xs flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              {primaryWorkout.durationMins} mins
            </span>
          </div>

          <h5 className="text-white font-bold text-base mt-1 truncate group-hover:text-red-400 transition-colors">
            {primaryWorkout.title}
          </h5>

          <p className="text-zinc-400 text-xs mt-0.5">
            {primaryWorkout.exercisesCount} Exercises • {primaryWorkout.level} • ~{primaryWorkout.caloriesBurnEstimate} kcal
          </p>
        </div>
      </div>
    </div>
  );
};

const sampleDefault = {
  id: 'w1',
  title: 'RC Upper Body Hypertrophy',
  durationMins: 45,
  level: 'Intermediate' as const,
  intensity: 2 as const,
  category: 'Hypertrophy' as const,
  exercisesCount: 5,
  caloriesBurnEstimate: 420,
  imagePlaceholderLetter: 'RC',
  exercises: [],
};



