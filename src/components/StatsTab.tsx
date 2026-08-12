import React, { useState } from 'react';
import { initialWeeklyStats } from '../data/mockData';
import { TrendingUp, Flame, Footprints, Moon, Trophy, Zap } from 'lucide-react';

export const StatsTab: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState<'calories' | 'steps' | 'sleep'>('calories');

  const maxCal = Math.max(...initialWeeklyStats.map((s) => s.calories), 2500);
  const maxSteps = Math.max(...initialWeeklyStats.map((s) => s.steps), 12000);

  return (
    <div className="p-4 sm:p-6 space-y-5 animate-fadeIn pb-8 select-none">
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-red-500 text-xs font-semibold uppercase tracking-wider mb-1">
          <Zap className="w-3.5 h-3.5 fill-red-500" />
          <span>RC Biometric Analytics Engine</span>
        </div>
        <h2 className="text-white text-2xl font-bold tracking-tight">Performance Statistics</h2>
      </div>

      {/* Metric Selector Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-[#141417] p-1.5 rounded-2xl border border-zinc-800">
        <button
          onClick={() => setActiveMetric('calories')}
          className={`py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider ${
            activeMetric === 'calories'
              ? 'bg-red-600 text-white'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Calories</span>
        </button>

        <button
          onClick={() => setActiveMetric('steps')}
          className={`py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider ${
            activeMetric === 'steps'
              ? 'bg-red-600 text-white'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Footprints className="w-3.5 h-3.5" />
          <span>Movement</span>
        </button>

        <button
          onClick={() => setActiveMetric('sleep')}
          className={`py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider ${
            activeMetric === 'sleep'
              ? 'bg-red-600 text-white'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Sleep</span>
        </button>
      </div>

      {/* Main Graph Card */}
      <div className="bg-[#141417] rounded-2xl p-5 border border-zinc-800 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">7-Day Rolling Average</p>
            <h3 className="text-white text-xl font-bold mt-0.5">
              {activeMetric === 'calories' && '2,210 KCAL / DAY'}
              {activeMetric === 'steps' && '10,613 STEPS / DAY'}
              {activeMetric === 'sleep' && '7.7 HRS / NIGHT'}
            </h3>
          </div>
          <div className="flex items-center gap-1 text-red-500 text-xs font-semibold bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
            <TrendingUp className="w-3.5 h-3.5 text-red-500" />
            <span>+8.4% vs prev week</span>
          </div>
        </div>

        {/* Visual Custom Bar Chart */}
        <div className="h-44 pt-6 flex items-end justify-between gap-2 px-1">
          {initialWeeklyStats.map((stat, idx) => {
            let val = 0;
            let maxVal = 1;
            let displayVal = '';

            if (activeMetric === 'calories') {
              val = stat.calories;
              maxVal = maxCal;
              displayVal = `${val}`;
            } else if (activeMetric === 'steps') {
              val = stat.steps;
              maxVal = maxSteps;
              displayVal = `${(val / 1000).toFixed(1)}k`;
            } else {
              val = stat.sleepHours;
              maxVal = 10;
              displayVal = `${val}h`;
            }

            const heightPct = Math.min(100, Math.max(12, (val / maxVal) * 100));
            const isToday = idx === 2; // Wed

            return (
              <div key={stat.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-medium text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  {displayVal}
                </span>

                <div className="w-full bg-zinc-800/50 rounded-t-lg h-32 flex items-end overflow-hidden p-0.5 border border-zinc-800">
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 ${
                      isToday
                        ? 'bg-red-600'
                        : 'bg-zinc-700/60 group-hover:bg-red-500/60'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>

                <span
                  className={`text-xs font-medium ${
                    isToday ? 'text-red-500 font-bold' : 'text-zinc-500'
                  }`}
                >
                  {stat.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Highlights Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#141417] p-4 rounded-2xl border border-zinc-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Active Streak</p>
            <p className="text-white font-bold text-base mt-0.5">14 Days Prime</p>
          </div>
        </div>

        <div className="bg-[#141417] p-4 rounded-2xl border border-zinc-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Weekly Burn</p>
            <p className="text-white font-bold text-base mt-0.5">15,470 kcal</p>
          </div>
        </div>
      </div>
    </div>
  );
};



