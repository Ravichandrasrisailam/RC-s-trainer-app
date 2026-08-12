import React, { useState } from 'react';
import { WorkoutPlan, EquipmentType, Exercise } from '../types/fitness';
import { Cpu, Dumbbell, Clock, Flame, Check, Sparkles, ArrowRight } from 'lucide-react';

interface AiGeneratorTabProps {
  onWorkoutGenerated: (newWorkout: WorkoutPlan) => void;
  userEquipment: EquipmentType[];
  initialMuscle?: string;
}

export const AiGeneratorTab: React.FC<AiGeneratorTabProps> = ({
  onWorkoutGenerated,
  userEquipment,
  initialMuscle = 'Chest',
}) => {
  const muscleGroups = ['Chest', 'Lats & Back', 'Shoulders', 'Quadriceps', 'Hamstrings & Glutes', 'Biceps & Triceps', 'Abs & Core'];
  const allEquipment: EquipmentType[] = ['Dumbbells', 'Resistance Bands', 'Bodyweight', 'Barbell', 'Cable Machine', 'Kettlebell'];

  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([initialMuscle, 'Lats & Back']);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType[]>(
    userEquipment.length > 0 ? userEquipment : ['Dumbbells', 'Resistance Bands', 'Bodyweight']
  );
  const [duration, setDuration] = useState<number>(45);
  const [intensity, setIntensity] = useState<'Hypertrophy' | 'Strength' | 'Endurance & Pump'>('Hypertrophy');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedPreview, setGeneratedPreview] = useState<WorkoutPlan | null>(null);

  const toggleMuscle = (muscle: string) => {
    if (selectedMuscles.includes(muscle)) {
      if (selectedMuscles.length > 1) {
        setSelectedMuscles(selectedMuscles.filter((m) => m !== muscle));
      }
    } else {
      setSelectedMuscles([...selectedMuscles, muscle]);
    }
  };

  const toggleEquipment = (eq: EquipmentType) => {
    if (selectedEquipment.includes(eq)) {
      if (selectedEquipment.length > 1) {
        setSelectedEquipment(selectedEquipment.filter((e) => e !== eq));
      }
    } else {
      setSelectedEquipment([...selectedEquipment, eq]);
    }
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setGeneratedPreview(null);

    setTimeout(() => {
      const generatedExercises: Exercise[] = [];
      const primaryEquipment = selectedEquipment[0] || 'Dumbbells';
      const secondaryEquipment = selectedEquipment[1] || 'Resistance Bands';

      selectedMuscles.forEach((muscle, idx) => {
        if (muscle.includes('Chest')) {
          generatedExercises.push({
            id: `ai-e-${idx}-1`,
            name: `${primaryEquipment} Incline Chest Press`,
            sets: 4,
            reps: intensity === 'Strength' ? '6-8 reps' : '10-12 reps',
            targetMuscle: 'Upper Chest',
            equipment: primaryEquipment,
            suggestedWeightKg: primaryEquipment === 'Bodyweight' ? 0 : 24,
            rpeTarget: 8.5,
            instructions: 'Maintain slight arch, drive up with explosive tempo, control descent 2s.',
            rcTip: 'RC Auto-Weight: Maintain RPE 8.5. If set 1 reps are completed with ease, add +2kg.',
          });
          generatedExercises.push({
            id: `ai-e-${idx}-2`,
            name: `${secondaryEquipment} Chest Flye Squeeze`,
            sets: 3,
            reps: '12-15 reps',
            targetMuscle: 'Inner Chest',
            equipment: secondaryEquipment,
            suggestedWeightKg: secondaryEquipment === 'Bodyweight' ? 0 : 16,
            rpeTarget: 8.0,
            instructions: 'Focus on peak squeeze at center contraction line for 1 second.',
            rcTip: 'Continuous band tension across full arc.',
          });
        } else if (muscle.includes('Back') || muscle.includes('Lats')) {
          generatedExercises.push({
            id: `ai-e-${idx}-3`,
            name: `${primaryEquipment} Single-Arm Row`,
            sets: 4,
            reps: '10-12 reps',
            targetMuscle: 'Lats & Rhomboids',
            equipment: primaryEquipment,
            suggestedWeightKg: primaryEquipment === 'Bodyweight' ? 0 : 26,
            rpeTarget: 8.5,
            instructions: 'Pull elbow towards hip pocket, keep shoulder down and back.',
            rcTip: 'Do not twist upper torso at top.',
          });
        } else if (muscle.includes('Quadriceps')) {
          generatedExercises.push({
            id: `ai-e-${idx}-4`,
            name: `${primaryEquipment} Goblet Squat`,
            sets: 4,
            reps: intensity === 'Strength' ? '6-8 reps' : '10-12 reps',
            targetMuscle: 'Quadriceps',
            equipment: primaryEquipment,
            suggestedWeightKg: primaryEquipment === 'Bodyweight' ? 0 : 30,
            rpeTarget: 8.5,
            instructions: 'Deep knee travel, keep torso upright, drive up through heels.',
            rcTip: 'Pause 1s at bottom depth for quad hypertrophy.',
          });
        } else if (muscle.includes('Shoulders')) {
          generatedExercises.push({
            id: `ai-e-${idx}-5`,
            name: `${primaryEquipment} Overhead Arnold Press`,
            sets: 3,
            reps: '10 reps',
            targetMuscle: 'Deltoids',
            equipment: primaryEquipment,
            suggestedWeightKg: primaryEquipment === 'Bodyweight' ? 0 : 18,
            rpeTarget: 8.0,
            instructions: 'Rotate palms smoothly from facing chest to facing outward overhead.',
            rcTip: 'RPE 8 cap to protect shoulder joints.',
          });
        } else if (muscle.includes('Biceps') || muscle.includes('Arms')) {
          generatedExercises.push({
            id: `ai-e-${idx}-6`,
            name: `${secondaryEquipment} Peak Bicep Curl`,
            sets: 3,
            reps: '12-15 reps',
            targetMuscle: 'Biceps Peak',
            equipment: secondaryEquipment,
            suggestedWeightKg: secondaryEquipment === 'Bodyweight' ? 0 : 14,
            rpeTarget: 9.0,
            instructions: 'Lock elbows in place, flex bicep hard at top extension.',
            rcTip: 'Strict isolation with 2-second negative lowering.',
          });
        } else {
          generatedExercises.push({
            id: `ai-e-${idx}-7`,
            name: `${primaryEquipment} Core Rotational Hold`,
            sets: 3,
            reps: '45 seconds',
            targetMuscle: 'Abs & Obliques',
            equipment: primaryEquipment,
            suggestedWeightKg: 0,
            rpeTarget: 8.0,
            instructions: 'Brace abdominal wall tightly, resist rotation under tension.',
            rcTip: 'Sustained isometric core tension.',
          });
        }
      });

      const newPlan: WorkoutPlan = {
        id: `rc-ai-${Date.now()}`,
        title: `RC AI Custom ${selectedMuscles.slice(0, 2).join(' & ')}`,
        durationMins: duration,
        level: 'Intermediate',
        intensity: intensity === 'Strength' ? 3 : 2,
        category: 'RC AI Custom',
        exercisesCount: generatedExercises.length,
        caloriesBurnEstimate: duration * 9.5,
        imagePlaceholderLetter: 'RC',
        aiGenerated: true,
        exercises: generatedExercises,
      };

      setGeneratedPreview(newPlan);
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="space-y-5 pb-8 select-none">
      {/* AI Builder Hero Header */}
      <div className="bg-[#141417] border border-zinc-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center font-bold">
            <Cpu className="w-4 h-4" />
          </div>
          <span className="text-red-500 text-xs font-semibold uppercase tracking-wider">
            RC AI Session Generator
          </span>
        </div>

        <h2 className="text-white text-xl font-bold tracking-tight">
          Intelligent Adaptive Program Builder
        </h2>
        <p className="text-zinc-400 text-xs mt-1">
          Select your available equipment and target muscle groups. RC AI configures optimal set count, set-by-set weight targets, and RPE fatigue caps.
        </p>
      </div>

      {/* Target Muscle Selector */}
      <div className="bg-[#141417] border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-3">
        <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
          <span>1. Target Muscle Groups</span>
          <span className="text-red-500 text-xs font-semibold">{selectedMuscles.length} Selected</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {muscleGroups.map((muscle) => {
            const isSelected = selectedMuscles.includes(muscle);
            return (
              <button
                key={muscle}
                onClick={() => toggleMuscle(muscle)}
                className={`p-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-red-500/10 border-red-500/40 text-red-500'
                    : 'bg-zinc-800/40 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <span>{muscle}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-red-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Equipment Filter */}
      <div className="bg-[#141417] border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-3">
        <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
          <span>2. Available Equipment</span>
          <span className="text-zinc-400 text-xs font-normal">Filtered for setup</span>
        </label>

        <div className="flex flex-wrap gap-2">
          {allEquipment.map((eq) => {
            const isSelected = selectedEquipment.includes(eq);
            return (
              <button
                key={eq}
                onClick={() => toggleEquipment(eq)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-red-600 text-white border-red-600 font-semibold'
                    : 'bg-zinc-800/60 text-zinc-300 border-zinc-700/60 hover:bg-zinc-800'
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span>{eq}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration & Intensity Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Duration */}
        <div className="bg-[#141417] border border-zinc-800 rounded-2xl p-4 space-y-2">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-red-500" />
            <span>Target Session Duration</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[20, 30, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => setDuration(mins)}
                className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  duration === mins
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-zinc-800/40 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>

        {/* Intensity / Phase */}
        <div className="bg-[#141417] border border-zinc-800 rounded-2xl p-4 space-y-2">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-red-500" />
            <span>Training Goal Focus</span>
          </label>
          <div className="grid grid-cols-3 gap-1">
            {(['Hypertrophy', 'Strength', 'Endurance & Pump'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setIntensity(mode)}
                className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  intensity === mode
                    ? 'bg-red-500/10 text-red-500 border-red-500/40'
                    : 'bg-zinc-800/40 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                {mode.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Trigger Button */}
      <button
        onClick={handleGenerateAI}
        disabled={isGenerating}
        className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Synthesizing RC AI Program...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Generate Custom RC AI Session</span>
          </>
        )}
      </button>

      {/* Generated Preview */}
      {generatedPreview && (
        <div className="bg-[#141417] border border-red-500/40 rounded-2xl p-5 space-y-4 shadow-lg animate-fadeIn">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-red-500 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>RC AI Session Ready</span>
              </span>
              <h3 className="text-white text-lg font-bold mt-0.5">
                {generatedPreview.title}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-medium text-zinc-400">
                {generatedPreview.durationMins} Mins • {generatedPreview.exercisesCount} Exercises
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {generatedPreview.exercises.map((ex, i) => (
              <div key={ex.id} className="p-3 rounded-xl bg-zinc-800/40 border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-red-500">0{i + 1}</span>
                    <span className="text-xs font-semibold text-white">{ex.name}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{ex.rcTip || ex.vxsTip}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-zinc-200">{ex.sets} sets x {ex.reps}</span>
                  {ex.suggestedWeightKg ? (
                    <p className="text-[11px] text-red-400 font-medium">@{ex.suggestedWeightKg}kg • RPE {ex.rpeTarget}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onWorkoutGenerated(generatedPreview)}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Start Active Session Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};


