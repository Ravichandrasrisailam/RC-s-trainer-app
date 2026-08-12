import React, { useState, useEffect } from 'react';
import { WorkoutPlan, Exercise } from '../types/fitness';
import { X, Play, Pause, RotateCcw, Check, Clock, Award, CheckCircle2, Zap, Volume2 } from 'lucide-react';

interface WorkoutModalProps {
  workout: WorkoutPlan;
  onClose: () => void;
  onFinishWorkout: (workoutId: string, caloriesBurned: number) => void;
}

export const WorkoutModal: React.FC<WorkoutModalProps> = ({
  workout,
  onClose,
  onFinishWorkout,
}) => {
  const [completedSetsState, setCompletedSetsState] = useState<{ [exerciseId: string]: boolean[] }>(() => {
    const initialState: { [id: string]: boolean[] } = {};
    workout.exercises.forEach((e) => {
      initialState[e.id] = new Array(e.sets).fill(false);
    });
    return initialState;
  });

  const [loggedWeightsState, setLoggedWeightsState] = useState<{ [exerciseId: string]: number[] }>(() => {
    const initialState: { [id: string]: number[] } = {};
    workout.exercises.forEach((e) => {
      initialState[e.id] = new Array(e.sets).fill(e.suggestedWeightKg || 20);
    });
    return initialState;
  });

  // Rest Timer state
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isWorkoutCompleted, setIsWorkoutCompleted] = useState<boolean>(false);

  // Play synthesized audio beep when timer reaches 0
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 pitch
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // Audio fallback
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
      playBeep();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const toggleSet = (exerciseId: string, setIndex: number) => {
    setCompletedSetsState((prev) => {
      const current = [...(prev[exerciseId] || [])];
      current[setIndex] = !current[setIndex];
      return { ...prev, [exerciseId]: current };
    });

    // Start rest timer automatically when checking off a set
    setTimerSeconds(60);
    setIsTimerRunning(true);
  };

  const updateWeight = (exerciseId: string, setIndex: number, delta: number) => {
    setLoggedWeightsState((prev) => {
      const current = [...(prev[exerciseId] || [])];
      current[setIndex] = Math.max(0, (current[setIndex] || 0) + delta);
      return { ...prev, [exerciseId]: current };
    });
  };

  const handleFinish = () => {
    setIsWorkoutCompleted(true);
    setTimeout(() => {
      onFinishWorkout(workout.id, workout.caloriesBurnEstimate);
    }, 1200);
  };

  const totalSets = workout.exercises.reduce((acc, e) => acc + e.sets, 0);
  const completedSetsCount = Object.values(completedSetsState)
    .flat()
    .filter(Boolean).length;
  const progressPct = totalSets > 0 ? Math.round((completedSetsCount / totalSets) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn select-none">
      <div className="w-full max-w-lg bg-[#0e0e11] sm:rounded-2xl rounded-t-2xl border border-zinc-800 max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex justify-between items-center bg-[#141417]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded uppercase">
                {workout.category}
              </span>
              <span className="text-zinc-400 text-xs flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {workout.durationMins}m
              </span>
            </div>
            <h2 className="text-white text-lg font-bold mt-1">{workout.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-zinc-800/80 text-zinc-400 hover:text-white flex items-center justify-center border border-zinc-700/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workout Progress Bar */}
        <div className="px-5 py-3 bg-[#141417] border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-medium">Session Progress:</span>
            <span className="text-xs font-semibold text-red-400">
              {completedSetsCount}/{totalSets} sets ({progressPct}%)
            </span>
          </div>

          <div className="w-28 bg-zinc-800 h-2 rounded-full overflow-hidden border border-zinc-700/60">
            <div
              className="bg-red-600 h-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Rest Timer Widget */}
        <div className="mx-4 my-3 p-3 bg-[#141417] rounded-xl border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center font-bold text-base">
              {timerSeconds}s
            </div>
            <div>
              <p className="text-white text-xs font-semibold flex items-center gap-1 uppercase tracking-wider">
                <span>RC Auto Rest Timer</span>
                {timerSeconds === 0 && <Volume2 className="w-3.5 h-3.5 text-red-500 animate-ping" />}
              </p>
              <p className="text-zinc-400 text-[11px]">
                {isTimerRunning ? 'Resting & Recovering...' : 'Ready for Next Set'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-2.5 rounded-xl bg-red-600 text-white hover:bg-red-500 transition-all cursor-pointer font-bold"
            >
              {isTimerRunning ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            </button>
            <button
              onClick={() => {
                setTimerSeconds(60);
                setIsTimerRunning(false);
              }}
              className="p-2.5 rounded-xl bg-zinc-800/80 text-zinc-300 hover:text-white border border-zinc-700/60 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Exercises List */}
        <div className="flex-1 overflow-y-auto px-4 space-y-4 py-2">
          {workout.exercises.map((exercise, idx) => {
            const exerciseSets = completedSetsState[exercise.id] || [];
            const exerciseWeights = loggedWeightsState[exercise.id] || [];
            return (
              <div key={exercise.id} className="bg-[#141417] p-4 rounded-xl border border-zinc-800 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 text-xs font-semibold uppercase">
                        Ex #{idx + 1}
                      </span>
                      {exercise.equipment && (
                        <span className="text-[10px] bg-zinc-800 border border-zinc-700/60 px-2 py-0.5 rounded text-zinc-300">
                          {exercise.equipment}
                        </span>
                      )}
                      {exercise.rpeTarget && (
                        <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-semibold">
                          RPE {exercise.rpeTarget} Cap
                        </span>
                      )}
                    </div>
                    <h3 className="text-white font-bold text-sm sm:text-base mt-0.5">{exercise.name}</h3>
                    <p className="text-zinc-400 text-xs">{exercise.targetMuscle} • {exercise.reps}</p>
                  </div>
                </div>

                {(exercise.rcTip || exercise.vxsTip) && (
                  <div className="bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl text-xs text-zinc-300 flex items-start gap-2">
                    <Zap className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5 fill-red-500" />
                    <span>{exercise.rcTip || exercise.vxsTip}</span>
                  </div>
                )}

                {/* Set Toggle Buttons & Weight Loggers */}
                <div className="space-y-2 pt-1">
                  {exerciseSets.map((isDone, setIdx) => {
                    const weight = exerciseWeights[setIdx] ?? (exercise.suggestedWeightKg || 20);
                    return (
                      <div key={setIdx} className="flex items-center justify-between gap-2 bg-zinc-800/40 p-2 rounded-xl border border-zinc-800">
                        <span className="text-xs font-semibold text-zinc-300 w-12">Set {setIdx + 1}</span>

                        {/* Weight Adjustment */}
                        <div className="flex items-center gap-1 bg-zinc-900/60 px-2 py-1 rounded-lg border border-zinc-700/60">
                          <button
                            onClick={() => updateWeight(exercise.id, setIdx, -2)}
                            className="text-zinc-400 hover:text-white text-xs px-1.5 font-bold cursor-pointer"
                          >
                            -2
                          </button>
                          <span className="text-xs font-semibold text-red-400 min-w-[45px] text-center">
                            {weight} kg
                          </span>
                          <button
                            onClick={() => updateWeight(exercise.id, setIdx, 2)}
                            className="text-zinc-400 hover:text-white text-xs px-1.5 font-bold cursor-pointer"
                          >
                            +2
                          </button>
                        </div>

                        {/* Set Completed Checkbox Button */}
                        <button
                          onClick={() => toggleSet(exercise.id, setIdx)}
                          className={`py-1.5 px-4 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            isDone
                              ? 'bg-red-600 text-white'
                              : 'bg-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {isDone ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>Done</span>
                            </>
                          ) : (
                            <span>Complete</span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Finish Action */}
        <div className="p-4 sm:p-5 border-t border-zinc-800 bg-[#141417]">
          {isWorkoutCompleted ? (
            <div className="bg-red-600 text-white py-3.5 rounded-xl text-center font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              <span>RC Workout Saved! +{workout.caloriesBurnEstimate} kcal logged</span>
            </div>
          ) : (
            <button
              onClick={handleFinish}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Award className="w-5 h-5 stroke-[2.5]" />
              <span>Finish Session & Log Progress</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


