import React, { useState } from 'react';
import { WorkoutPlan } from '../types/fitness';
import { Dumbbell, Clock, Flame, Play, Search, CheckCircle2, Zap } from 'lucide-react';

interface PlanTabProps {
  workouts: WorkoutPlan[];
  onSelectWorkout: (workout: WorkoutPlan) => void;
  completedWorkoutIds: string[];
}

export const PlanTab: React.FC<PlanTabProps> = ({
  workouts,
  onSelectWorkout,
  completedWorkoutIds,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Hypertrophy', 'Strength', 'Cardio', 'Mobility', 'RC AI Custom'];

  const filteredWorkouts = workouts.filter((w) => {
    const matchesCategory = selectedCategory === 'All' || w.category === selectedCategory;
    const matchesSearch = w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 space-y-5 animate-fadeIn pb-8 select-none">
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-red-500 text-xs font-semibold uppercase tracking-wider mb-1">
          <Zap className="w-3.5 h-3.5 fill-red-500" />
          <span>RC Trainer Adaptive Program Library</span>
        </div>
        <h2 className="text-white text-2xl font-bold tracking-tight">Structured Workouts</h2>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search workouts, equipment, or muscle groups..."
          className="w-full bg-[#141417] border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
              selectedCategory === cat
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-[#141417] text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Workout Cards */}
      <div className="space-y-3">
        {filteredWorkouts.length === 0 ? (
          <div className="bg-[#141417] rounded-2xl p-8 text-center border border-zinc-800">
            <Dumbbell className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
            <p className="text-zinc-400 text-xs">No workout plans found matching your search.</p>
          </div>
        ) : (
          filteredWorkouts.map((workout) => {
            const isCompleted = completedWorkoutIds.includes(workout.id);
            return (
              <div
                key={workout.id}
                onClick={() => onSelectWorkout(workout)}
                className="bg-[#141417] rounded-2xl p-4 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer group flex items-center gap-4 relative overflow-hidden"
              >
                <div className="w-14 h-14 bg-zinc-800 rounded-xl flex items-center justify-center border border-zinc-700 flex-shrink-0 relative">
                  <span className="text-zinc-500 text-base font-bold">
                    {workout.imagePlaceholderLetter || 'RC'}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isCompleted ? (
                      <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
                      {workout.category}
                    </span>
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-400" />
                      {workout.durationMins}m
                    </span>
                  </div>

                  <h3 className="text-white font-bold text-base mt-1 truncate group-hover:text-red-400 transition-colors">
                    {workout.title}
                  </h3>

                  <div className="flex items-center justify-between mt-1">
                    <p className="text-zinc-400 text-xs">
                      {workout.exercisesCount} exercises • {workout.level}
                    </p>

                    <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-red-500" />
                      {workout.caloriesBurnEstimate} kcal
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};



