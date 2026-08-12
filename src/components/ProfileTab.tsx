import React, { useState } from 'react';
import { UserGoals } from '../types/fitness';
import { Target, Award, Save, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ProfileTabProps {
  user: UserGoals;
  onUpdateUser: (updated: UserGoals) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ user, onUpdateUser }) => {
  const [formData, setFormData] = useState<UserGoals>({ ...user });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 animate-fadeIn pb-8 select-none">
      {/* Profile Header */}
      <div className="flex items-center gap-4 bg-[#141417] p-5 rounded-2xl border border-zinc-800">
        <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold text-2xl">
          {formData.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-white text-xl font-bold">{formData.name}</h2>
            <span className="bg-red-500/10 text-red-500 text-[10px] font-semibold px-2 py-0.5 rounded border border-red-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> RC PRO ATHLETE
            </span>
          </div>
          <p className="text-zinc-400 text-xs mt-0.5">RC Hyper-Performance Tier</p>
          <p className="text-zinc-400 text-xs mt-1">
            Weight: <span className="text-red-400 font-semibold">{formData.weightKg} kg</span> • Height: <span className="text-red-400 font-semibold">{formData.heightCm} cm</span>
          </p>
        </div>
      </div>

      {/* Target Goals Form */}
      <form onSubmit={handleSubmit} className="bg-[#141417] p-5 rounded-2xl border border-zinc-800 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Target className="w-4 h-4 text-red-500" />
            <span>Biometric Quota Configuration</span>
          </div>

          {savedSuccess && (
            <span className="text-red-500 text-xs font-semibold flex items-center gap-1 animate-pulse uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" /> Updated!
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-zinc-400 text-xs font-medium block mb-1">
              Calorie Target (kcal)
            </label>
            <input
              type="number"
              value={formData.caloriesTarget}
              onChange={(e) => setFormData({ ...formData, caloriesTarget: Number(e.target.value) })}
              className="w-full bg-zinc-800/50 border border-zinc-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="text-zinc-400 text-xs font-medium block mb-1">
              Movement Step Target
            </label>
            <input
              type="number"
              value={formData.stepsTarget}
              onChange={(e) => setFormData({ ...formData, stepsTarget: Number(e.target.value) })}
              className="w-full bg-zinc-800/50 border border-zinc-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="text-zinc-400 text-xs font-medium block mb-1">
              Hydration Quota (ml)
            </label>
            <input
              type="number"
              step="100"
              value={formData.waterTargetMl}
              onChange={(e) => setFormData({ ...formData, waterTargetMl: Number(e.target.value) })}
              className="w-full bg-zinc-800/50 border border-zinc-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="text-zinc-400 text-xs font-medium block mb-1">
              Sleep Quota (hours)
            </label>
            <input
              type="number"
              step="0.5"
              value={formData.sleepTargetMinutes / 60}
              onChange={(e) => setFormData({ ...formData, sleepTargetMinutes: Math.round(Number(e.target.value) * 60) })}
              className="w-full bg-zinc-800/50 border border-zinc-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="text-zinc-400 text-xs font-medium block mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.weightKg}
              onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
              className="w-full bg-zinc-800/50 border border-zinc-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="text-zinc-400 text-xs font-medium block mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              value={formData.heightCm}
              onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
              className="w-full bg-zinc-800/50 border border-zinc-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4 stroke-[2.5]" />
          <span>Save RC Configuration</span>
        </button>
      </form>

      {/* Badges / Achievements */}
      <div className="bg-[#141417] p-5 rounded-2xl border border-zinc-800 space-y-3">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <Award className="w-4 h-4 text-red-500" />
          <span>RC Milestones & Badges</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-zinc-800/40 p-3 rounded-xl text-center border border-zinc-800">
            <div className="text-2xl mb-1">⚡</div>
            <p className="text-white text-xs font-semibold">14-Day Prime</p>
            <p className="text-zinc-400 text-[10px]">Unbroken streak</p>
          </div>

          <div className="bg-zinc-800/40 p-3 rounded-xl text-center border border-zinc-800">
            <div className="text-2xl mb-1">🔥</div>
            <p className="text-white text-xs font-semibold">Calorie Titan</p>
            <p className="text-zinc-400 text-[10px]">10x Target Hit</p>
          </div>

          <div className="bg-zinc-800/40 p-3 rounded-xl text-center border border-zinc-800">
            <div className="text-2xl mb-1">💧</div>
            <p className="text-white text-xs font-semibold">RC Hydrated</p>
            <p className="text-zinc-400 text-[10px]">Optimal Level</p>
          </div>
        </div>
      </div>
    </div>
  );
};



