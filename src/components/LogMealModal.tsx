import React, { useState } from 'react';
import { presetMealOptions } from '../data/mockData';
import { MealLogItem } from '../types/fitness';
import { X, Utensils, Plus, Flame } from 'lucide-react';

interface LogMealModalProps {
  onClose: () => void;
  onAddMeal: (meal: Omit<MealLogItem, 'id' | 'timestamp'>) => void;
}

export const LogMealModal: React.FC<LogMealModalProps> = ({ onClose, onAddMeal }) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');

  // Custom Form state
  const [title, setTitle] = useState('');
  const [calories, setCalories] = useState('450');
  const [protein, setProtein] = useState('35');
  const [carbs, setCarbs] = useState('40');
  const [fats, setFats] = useState('12');
  const [mealType, setMealType] = useState<MealLogItem['type']>('Lunch');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddMeal({
      title,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fats: Number(fats) || 0,
      type: mealType,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-[#0e0e11] sm:rounded-2xl rounded-t-2xl border border-zinc-800 max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-[#141417]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-white text-base font-bold">Log Daily Meal</h2>
              <p className="text-zinc-400 text-xs">Track calories and macronutrients</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex p-2 bg-[#141417] border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'presets'
                ? 'bg-red-600 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Quick Presets
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'custom'
                ? 'bg-red-600 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Custom Meal
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {activeTab === 'presets' ? (
            <div className="space-y-2.5">
              <p className="text-zinc-400 text-xs mb-2">Select a preset athlete meal to log instantly:</p>
              {presetMealOptions.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onAddMeal(preset);
                    onClose();
                  }}
                  className="bg-[#141417] p-3.5 rounded-xl border border-zinc-800 hover:border-red-500/40 transition-all cursor-pointer flex justify-between items-center group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                        {preset.type}
                      </span>
                      <h4 className="text-white font-semibold text-xs group-hover:text-red-400 transition-colors">
                        {preset.title}
                      </h4>
                    </div>

                    <p className="text-zinc-400 text-xs mt-1">
                      P: {preset.protein}g • C: {preset.carbs}g • F: {preset.fats}g
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-red-500 flex items-center gap-0.5">
                      <Flame className="w-3.5 h-3.5 fill-red-500" />
                      +{preset.calories}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-zinc-800 group-hover:bg-red-600 group-hover:text-white text-zinc-300 flex items-center justify-center transition-all">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-3.5">
              <div>
                <label className="text-zinc-400 text-xs font-medium block mb-1">
                  Meal Name / Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Protein Smoothie Bowl"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-800/50 border border-zinc-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 text-xs font-medium block mb-1">
                    Meal Type
                  </label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value as MealLogItem['type'])}
                    className="w-full bg-zinc-800/50 border border-zinc-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 text-xs font-medium block mb-1">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    required
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="w-full bg-zinc-800/50 border border-zinc-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <div>
                  <label className="text-zinc-400 text-xs font-medium block mb-1">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className="w-full bg-zinc-800/50 border border-zinc-700/60 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 text-xs font-medium block mb-1">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    className="w-full bg-zinc-800/50 border border-zinc-700/60 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 text-xs font-medium block mb-1">
                    Fats (g)
                  </label>
                  <input
                    type="number"
                    value={fats}
                    onChange={(e) => setFats(e.target.value)}
                    className="w-full bg-zinc-800/50 border border-zinc-700/60 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Log Meal to Daily Tracker</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

