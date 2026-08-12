import React from 'react';
import { X, Droplets, Footprints, Utensils } from 'lucide-react';

interface QuickLogModalProps {
  onClose: () => void;
  onAddWater: (ml: number) => void;
  onAddSteps: (steps: number) => void;
  onOpenMealLog: () => void;
}

export const QuickLogModal: React.FC<QuickLogModalProps> = ({
  onClose,
  onAddWater,
  onAddSteps,
  onOpenMealLog,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-sm bg-[#0e0e11] sm:rounded-2xl rounded-t-2xl border border-zinc-800 p-5 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
          <div>
            <h2 className="text-white text-base font-bold">Quick Log Activity</h2>
            <p className="text-zinc-400 text-xs">Instantly update daily biometrics</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              onAddWater(250);
              onClose();
            }}
            className="bg-[#141417] hover:bg-zinc-800/80 p-4 rounded-xl border border-zinc-800 hover:border-red-500/40 text-left transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <p className="text-white text-xs font-semibold">+250 ml Water</p>
              <p className="text-zinc-400 text-[10px]">Hydration log</p>
            </div>
          </button>

          <button
            onClick={() => {
              onAddSteps(1000);
              onClose();
            }}
            className="bg-[#141417] hover:bg-zinc-800/80 p-4 rounded-xl border border-zinc-800 hover:border-red-500/40 text-left transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Footprints className="w-4 h-4" />
            </div>
            <div>
              <p className="text-white text-xs font-semibold">+1,000 Steps</p>
              <p className="text-zinc-400 text-[10px]">Activity log</p>
            </div>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenMealLog();
            }}
            className="bg-[#141417] hover:bg-zinc-800/80 p-4 rounded-xl border border-zinc-800 hover:border-red-500/40 text-left transition-all flex items-center gap-3 group cursor-pointer col-span-2"
          >
            <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <p className="text-white text-xs font-semibold">Log Meal / Calories</p>
              <p className="text-zinc-400 text-[10px]">Breakfast, Lunch, Dinner or Protein Shake</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

