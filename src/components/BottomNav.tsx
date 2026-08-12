import React from 'react';
import { NavigationTab } from '../types/fitness';
import { Home, Dumbbell, Utensils } from 'lucide-react';

interface BottomNavProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: NavigationTab; label: string; icon: React.ReactNode; isCenter?: boolean }[] = [
    { id: 'training', label: 'Training', icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" />, isCenter: true },
    { id: 'eat', label: 'Eat', icon: <Utensils className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-[#121216]/95 border-t border-zinc-800/80 backdrop-blur-xl flex flex-col justify-between items-center z-30 select-none">
      <div className="w-full h-14 flex justify-around items-center px-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-0.5 transition-all cursor-pointer relative py-1 px-4 ${
                isActive ? 'opacity-100' : 'opacity-40 hover:opacity-80'
              }`}
            >
              {tab.isCenter ? (
                <div
                  className={`w-10 h-10 -mt-4 rounded-xl flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-red-600/90 text-white shadow-md ring-2 ring-red-600/20'
                      : 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                  }`}
                >
                  <Home className="w-4 h-4" />
                </div>
              ) : (
                <div
                  className={`w-5 h-5 flex items-center justify-center transition-colors ${
                    isActive ? 'text-red-400' : 'text-zinc-400'
                  }`}
                >
                  {tab.icon}
                </div>
              )}

              <span
                className={`text-[10px] font-bitcount font-normal tracking-wide ${
                  isActive ? 'text-red-400' : 'text-zinc-400'
                }`}
              >
                {tab.label}
              </span>

              {isActive && !tab.isCenter && (
                <span className="absolute -top-1 w-4 h-0.5 bg-red-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* iOS style indicator */}
      <div className="w-24 h-1 bg-zinc-800/80 rounded-full mb-1" />
    </div>
  );
};
