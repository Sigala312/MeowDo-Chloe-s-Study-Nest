'use client';

import React from 'react';
import { Bell } from 'lucide-react';

interface FocusHeaderProps {
  completedSessions: number;
  totalSessions: number;
}

export const FocusHeader: React.FC<FocusHeaderProps> = ({
  completedSessions,
  totalSessions,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-[#3D2C2E] flex items-center gap-2">
          <span>🍅</span> Focus Time
        </h1>
        <p className="text-xs md:text-sm font-bold text-[#8C7A6B] mt-1">
          Let's get things done, Chloe! 💪
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* 今日番茄進度卡 */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#FFFDF9] border border-[#EADBC8] shadow-xs">
          <span className="text-base">🍅</span>
          <div className="text-xs font-black text-[#3D2C2E]">
            <span className="text-[#8C7A6B] text-[10px] block font-bold">Today's Focus</span>
            {completedSessions} / {totalSessions}
          </div>
          <button className="w-5 h-5 rounded-full bg-[#E07A5F] text-white flex items-center justify-center text-xs font-bold hover:bg-[#c96349] transition-colors ml-1">
            +
          </button>
        </div>

        <button className="p-2.5 rounded-2xl bg-[#FFFDF9] border border-[#EADBC8] text-[#6C5B52] shadow-xs hover:bg-white transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E07A5F]" />
        </button>
        
        <div className="w-10 h-10 rounded-2xl bg-[#F4E2D8] border-2 border-[#EADBC8] flex items-center justify-center text-xl overflow-hidden shadow-xs">
          🐱
        </div>
      </div>
    </div>
  );
};