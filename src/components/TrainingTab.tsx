import React, { useState } from 'react';
import { WorkoutPlan, EquipmentType } from '../types/fitness';
import { Dumbbell, Cpu, Play } from 'lucide-react';
import { AnalyzingState } from './SkeletonLoader';

interface TrainingTabProps {
  userEquipment: EquipmentType[];
  onStartWorkout: (workout: WorkoutPlan) => void;
  sampleWorkouts: WorkoutPlan[];
}

export const TrainingTab: React.FC<TrainingTabProps> = ({
  onStartWorkout,
  sampleWorkouts,
}) => {
  const [goal, setGoal] = useState<string>('Muscle Hypertrophy & Size');
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>(['Chest', 'Triceps', 'Shoulders']);
  const [duration, setDuration] = useState<number>(45);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedWorkout, setGeneratedWorkout] = useState<WorkoutPlan | null>(null);

  const availableMuscleGroups = ['Chest', 'Back & Lats', 'Shoulders', 'Quadriceps', 'Hamstrings', 'Biceps', 'Triceps', 'Core & Abs'];

  const toggleMuscle = (muscle: string) => {
    if (selectedMuscles.includes(muscle)) {
      setSelectedMuscles(selectedMuscles.filter((m) => m !== muscle));
    } else {
      setSelectedMuscles([...selectedMuscles, muscle]);
    }
  };

  const handleGenerateWorkout = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      const newWorkout: WorkoutPlan = {
        id: `ai-tr-${Date.now()}`,
        title: `AI Workout: ${goal.split('&')[0]}`,
        durationMins: duration,
        level: 'Intermediate',
        intensity: 2,
        category: 'RC AI Custom',
        exercisesCount: 5,
        caloriesBurnEstimate: Math.round(duration * 9.5),
        imagePlaceholderLetter: 'RC',
        aiGenerated: true,
        exercises: [
          {
            id: 'tr-e1',
            name: `${selectedMuscles[0] || 'Chest'} Compound Drive`,
            sets: 4,
            reps: '8-10 reps',
            targetMuscle: selectedMuscles[0] || 'Chest',
            equipment: 'Dumbbells',
            suggestedWeightKg: 28,
            rpeTarget: 8.5,
            rcTip: 'Keep core tight, control eccentric phase.',
          },
          {
            id: 'tr-e2',
            name: `${selectedMuscles[1] || 'Triceps'} Hypertrophy Press`,
            sets: 4,
            reps: '10-12 reps',
            targetMuscle: selectedMuscles[1] || 'Triceps',
            equipment: 'Resistance Bands',
            suggestedWeightKg: 20,
            rpeTarget: 8,
            rcTip: 'Peak contraction at full extension.',
          },
          {
            id: 'tr-e3',
            name: `${selectedMuscles[2] || 'Shoulders'} Isolation Drive`,
            sets: 3,
            reps: '12-15 reps',
            targetMuscle: selectedMuscles[2] || 'Shoulders',
            equipment: 'Dumbbells',
            suggestedWeightKg: 14,
            rpeTarget: 9,
            rcTip: 'Control the movement path smoothly.',
          },
          {
            id: 'tr-e4',
            name: 'Core & Stabilizer Hold',
            sets: 3,
            reps: '45 seconds',
            targetMuscle: 'Core',
            equipment: 'Bodyweight',
            suggestedWeightKg: 0,
            rpeTarget: 8,
            rcTip: 'Brace abdominal wall throughout.',
          },
        ],
      };

      setGeneratedWorkout(newWorkout);
    }, 700);
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-6 select-none">
      {/* Title Banner */}
      <div className="flex justify-between items-center bg-[#121216]/90 p-4 rounded-2xl border border-zinc-800/80 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-light text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded uppercase">
              03 // TRAINING HUB
            </span>
          </div>
          <h2 className="text-white text-base sm:text-lg font-bitcount font-normal tracking-wide mt-1">
            Goal-Oriented Workout Generator
          </h2>
        </div>
        <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
          <Dumbbell className="w-4 h-4" />
        </div>
      </div>

      {/* Goal & Target Muscle Selection Box */}
      <div className="bg-[#121216]/90 p-4 sm:p-5 rounded-2xl border border-zinc-800/80 space-y-3.5 backdrop-blur-md">
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest font-light block">1. Select Training Goal</label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-light"
          >
            <option value="Muscle Hypertrophy & Size">Muscle Hypertrophy & Size (6-12 reps)</option>
            <option value="Pure Strength & Heavy Power">Pure Strength & Heavy Power (3-6 reps)</option>
            <option value="Fat Loss & Conditioning Circuit">Fat Loss & Conditioning Circuit (High Tempo)</option>
            <option value="Athletic Mobility & Stamina">Athletic Mobility & Stamina</option>
          </select>
        </div>

        {/* Muscle Selection Chips */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest font-light block">2. Target Muscle Groups</label>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {availableMuscleGroups.map((muscle) => {
              const isSelected = selectedMuscles.includes(muscle);
              return (
                <button
                  key={muscle}
                  onClick={() => toggleMuscle(muscle)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-red-600/90 text-white font-bitcount'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800/80 font-light'
                  }`}
                >
                  {muscle}
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration Selector */}
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest font-light block">3. Session Duration</label>
          <div className="flex gap-2">
            {[30, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => setDuration(mins)}
                className={`flex-1 py-1.5 text-xs font-mono transition-all cursor-pointer rounded-xl ${
                  duration === mins
                    ? 'bg-red-600/90 text-white font-bitcount'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800/80 font-light'
                }`}
              >
                {mins} Mins
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerateWorkout}
          disabled={isGenerating}
          className="w-full bg-red-600/90 hover:bg-red-500 text-white text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer font-bitcount font-normal disabled:opacity-50 active:scale-98"
        >
          {isGenerating ? (
            <span>Generating Routine...</span>
          ) : (
            <>
              <Cpu className="w-3.5 h-3.5" />
              <span>Generate Workout Routine</span>
            </>
          )}
        </button>

        {isGenerating && (
          <AnalyzingState
            title="Building Biomechanical Workout Structure..."
            steps={[
              'Selecting exercises for target muscle groups...',
              'Calculating set volume & RPE targets...',
              'Optimizing equipment availability & resting intervals...',
            ]}
          />
        )}
      </div>

      {/* Generated Workout Display Card */}
      {generatedWorkout && (
        <div className="bg-[#121216]/90 p-4 sm:p-5 rounded-2xl border border-red-500/30 space-y-3 animate-fadeIn backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 uppercase">
                AI Custom Routine
              </span>
              <h3 className="text-white text-xs sm:text-sm font-bitcount font-normal mt-1">{generatedWorkout.title}</h3>
              <p className="text-zinc-400 text-[11px] font-light mt-0.5">
                {generatedWorkout.durationMins} Mins • ~{generatedWorkout.caloriesBurnEstimate} kcal Burn
              </p>
            </div>

            <button
              onClick={() => onStartWorkout(generatedWorkout)}
              className="bg-red-600/90 hover:bg-red-500 text-white text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer font-bitcount"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Start</span>
            </button>
          </div>

          <div className="space-y-2 pt-1">
            <h4 className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-light">Exercise Plan</h4>
            {generatedWorkout.exercises.map((ex, idx) => (
              <div key={ex.id} className="p-2.5 bg-zinc-900/80 rounded-xl border border-zinc-800/80 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 text-xs font-mono">#{idx + 1}</span>
                    <h5 className="text-zinc-200 text-xs font-light">{ex.name}</h5>
                  </div>
                  <p className="text-zinc-400 text-[11px] font-light mt-0.5">{ex.targetMuscle} • {ex.sets} sets x {ex.reps}</p>
                </div>

                <span className="text-[10px] font-mono bg-zinc-800/80 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700/40">
                  {ex.equipment}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pre-built Workouts Library Section */}
      <div className="bg-[#121216]/90 p-4 sm:p-5 rounded-2xl border border-zinc-800/80 space-y-3 backdrop-blur-md">
        <h3 className="text-white text-xs sm:text-sm font-bitcount font-normal tracking-wide">Featured Workouts</h3>
        <div className="space-y-2">
          {sampleWorkouts.map((w) => (
            <div
              key={w.id}
              className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/60 flex justify-between items-center hover:border-red-500/40 transition-all cursor-pointer group"
              onClick={() => onStartWorkout(w)}
            >
              <div>
                <span className="text-[9px] font-mono text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded uppercase border border-red-500/20">
                  {w.category}
                </span>
                <h4 className="text-zinc-200 text-xs font-light group-hover:text-red-400 transition-colors mt-1 font-bitcount">
                  {w.title}
                </h4>
                <p className="text-zinc-400 text-[11px] font-light mt-0.5">
                  {w.durationMins} Mins • {w.exercisesCount} Exercises • {w.level}
                </p>
              </div>

              <div className="w-7 h-7 rounded-xl bg-zinc-800/80 group-hover:bg-red-600 group-hover:text-white text-zinc-300 flex items-center justify-center transition-all">
                <Play className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
