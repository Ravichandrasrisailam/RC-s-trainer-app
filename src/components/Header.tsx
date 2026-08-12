import React, { useState } from 'react';
import { UserGoals, UserProfile } from '../types/fitness';
import { Bell, LogOut, X } from 'lucide-react';

interface HeaderProps {
  userGoals: UserGoals;
  userProfile?: UserProfile | null;
  onOpenQuickAdd: () => void;
  onOpenProfile: () => void;
  onSignOut: () => void;
  isExpandedView: boolean;
  onToggleExpandedView: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userGoals,
  userProfile,
  onOpenProfile,
  onSignOut,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: '1', title: 'Hydration Target', desc: 'You reached 72% of your 2.5L water goal', time: '10 mins ago' },
    { id: '2', title: 'Chest & Triceps Ready', desc: 'Your muscle recovery index for Chest is at 92%', time: '1 hour ago' },
    { id: '3', title: 'Macro Check', desc: '22g Protein left to reach daily target', time: '2 hours ago' },
  ];

  const userName = userProfile?.name || userGoals.name || 'Ravichandra';

  return (
    <div className="px-5 pt-3.5 pb-3 flex justify-between items-center bg-[#121216]/90 border-b border-zinc-800/80 backdrop-blur-md select-none relative z-20">
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-zinc-400 font-light">Good morning,</span>
          <span className="text-[9px] font-mono font-light text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-0.2 rounded uppercase">
            RC ATHLETE
          </span>
        </div>

        <div className="flex items-center gap-2 mt-0.5">
          <h1 className="text-white text-base sm:text-lg font-bitcount font-normal tracking-wide flex items-center gap-1.5">
            <span>{userName}</span>
            <span className="text-sm">👋</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications Icon Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
            className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white hover:border-zinc-700 transition-all cursor-pointer relative"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          </button>

          {/* Notifications Dropdown Modal */}
          {showNotifications && (
            <div className="absolute right-0 top-10 w-72 bg-[#121216] border border-zinc-800 rounded-2xl shadow-2xl p-4 z-50 animate-fadeIn space-y-3 backdrop-blur-xl">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                <div className="flex items-center gap-1.5 text-xs font-bitcount text-white">
                  <Bell className="w-3.5 h-3.5 text-red-400" />
                  <span>Activity Alerts</span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-zinc-400 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 bg-zinc-900/80 rounded-xl border border-zinc-800/80 text-xs">
                    <p className="font-normal text-zinc-200 flex items-center justify-between font-bitcount">
                      <span>{n.title}</span>
                      <span className="text-[9px] text-zinc-500 font-mono font-light">{n.time}</span>
                    </p>
                    <p className="text-zinc-400 text-[11px] mt-0.5 font-light">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Icon Button */}
        <button
          onClick={onOpenProfile}
          title="Profile & Settings"
          className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white font-bitcount text-xs font-normal hover:border-red-500/60 transition-colors cursor-pointer relative"
        >
          {userName.charAt(0).toUpperCase()}
          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-red-500 border-2 border-zinc-900 rounded-full"></span>
        </button>

        {/* Sign Out Button */}
        <button
          onClick={onSignOut}
          title="Sign Out"
          className="w-8 h-8 rounded-xl bg-zinc-900/80 hover:bg-red-950/40 border border-zinc-800 hover:border-red-600/40 flex items-center justify-center text-zinc-400 hover:text-red-400 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
