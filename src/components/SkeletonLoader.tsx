import React, { useState, useEffect } from 'react';
import { Cpu, Sparkles, Loader2 } from 'lucide-react';

export const CardSkeleton: React.FC<{ rows?: number }> = ({ rows = 3 }) => {
  return (
    <div className="bg-[#121216]/90 p-4 rounded-2xl border border-zinc-800/80 space-y-3 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-zinc-800 rounded w-1/3" />
        <div className="h-4 bg-zinc-800 rounded w-1/6" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 bg-zinc-900/80 rounded-xl border border-zinc-800/60 w-full" />
      ))}
    </div>
  );
};

export const ListSkeleton: React.FC = () => {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-12 bg-zinc-900/60 rounded-xl border border-zinc-800/60 w-full" />
      <div className="h-12 bg-zinc-900/60 rounded-xl border border-zinc-800/60 w-full" />
      <div className="h-12 bg-zinc-900/60 rounded-xl border border-zinc-800/60 w-full" />
    </div>
  );
};

interface AnalyzingStateProps {
  title?: string;
  steps?: string[];
  onCancel?: () => void;
}

export const AnalyzingState: React.FC<AnalyzingStateProps> = ({
  title = 'AI Biometric Intelligence Analyzing...',
  steps = [
    'Connecting to Neural Engine...',
    'Evaluating macronutrient ratios...',
    'Calculating glycemic index & calories...',
    'Formulating personalized recommendations...',
  ],
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [steps]);

  return (
    <div className="p-5 bg-zinc-900/90 border border-red-500/30 rounded-2xl space-y-4 animate-fadeIn backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center animate-spin">
          <Loader2 className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-white font-bitcount text-xs">{title}</h4>
          <p className="text-red-400 font-mono text-[10px] animate-pulse font-light">
            {steps[currentStep]}
          </p>
        </div>
      </div>

      {/* Thin Pulse Bar */}
      <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-800">
        <div className="bg-gradient-to-r from-red-600 via-orange-500 to-red-400 h-full rounded-full animate-pulse w-3/4" />
      </div>

      {onCancel && (
        <div className="flex justify-end pt-1">
          <button
            onClick={onCancel}
            className="text-[10px] text-zinc-400 hover:text-white font-mono underline"
          >
            Cancel Analysis
          </button>
        </div>
      )}
    </div>
  );
};
