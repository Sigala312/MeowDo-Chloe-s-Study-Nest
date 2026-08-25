'use client';

import React from 'react';
import { Clock, Award } from 'lucide-react';

interface FocusStatsProps {
  totalTime: string; // e.g. "1h 15m"
  completedSessions: number;
  xpEarned: number;
}

export const FocusStats: React.FC<FocusStatsProps> = ({
  totalTime,
  completedSessions,
  xpEarned,
}) => {
  return (
    <div className="bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-6 shadow-xs flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-extrabold text-[#3D2C2E]">Focus Statistics</h3>
        <select className="text-xs font-bold bg-[#FAF6F0] border border-[#EADBC8] text-[#6C5B52] rounded-xl px-2 py-1 outline-none">
          <option>Today</option>
          <option>This Week</option>
        </select>
      </div>

      {/* 環形數據圖表 */}
      <div className="relative flex flex-col items-center justify-center my-2">
        <div className="w-36 h-36 rounded-full border-[10px] border-[#FAF6F0] border-t-[#E89874] border-r-[#E89874] flex flex-col items-center justify-center">
          <span className="text-lg">🍅</span>
          <span className="text-[10px] font-bold text-[#8C7A6B]">Total Focus Time</span>
          <span className="text-xl font-black text-[#3D2C2E]">{totalTime}</span>
        </div>
      </div>

      {/* 數據指標卡 */}
      <div className="grid grid-cols-2 gap-3 my-3">
        <div className="bg-[#FAF6F0] p-3 rounded-2xl flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FFFDF9] border border-[#EADBC8] flex items-center justify-center text-[#8C5A3C]">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#8C7A6B]">Sessions</p>
            <p className="text-sm font-black text-[#3D2C2E]">{completedSessions}</p>
          </div>
        </div>

        <div className="bg-[#FAF6F0] p-3 rounded-2xl flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FFFDF9] border border-[#EADBC8] flex items-center justify-center text-[#E07A5F]">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#8C7A6B]">XP Earned</p>
            <p className="text-sm font-black text-[#3D2C2E]">{xpEarned} XP</p>
          </div>
        </div>
      </div>

      {/* 勵志小語貼紙 */}
      <div className="bg-[#FDF3E7] border border-dashed border-[#EADBC8] rounded-2xl p-3 text-center">
        <p className="text-xs font-bold text-[#6C5B52] leading-snug">
          Small focus sessions every day create big achievements. 🐾
        </p>
      </div>
    </div>
  );
};