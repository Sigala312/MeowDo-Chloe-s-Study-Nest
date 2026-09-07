'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { Target, Settings } from 'lucide-react';

export const FocusGoal: React.FC = () => {
  return (
    <Card className="p-6 bg-[#FAF6F0] rounded-3xl border border-[#EADBC8]/60 shadow-sm h-full flex flex-col items-center justify-between relative">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-[#E07A5F]" />
          <h2 className="font-bold text-[#5C4B43]">Focus Goal</h2>
        </div>
        <button className="text-[#A08D80] hover:text-[#5C4B43]">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* 環形進度圖表 */}
      <div className="relative my-4 flex items-center justify-center">
        <div className="w-40 h-40 rounded-full border-[10px] border-[#F3E9DC] border-t-[#E07A5F] border-r-[#E07A5F] flex flex-col items-center justify-center bg-[#FFFDF9]">
          <span className="text-2xl font-black text-[#4A3E3D]">1h 20m</span>
          <span className="text-xs text-[#A08D80] font-semibold mt-0.5">/ 2h</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-bold bg-[#F3E9DC] text-[#6C5B52] px-3 py-1 rounded-full">
          Today's Goal
        </span>
        <p className="text-xs font-bold text-[#8C7A6B] flex items-center gap-1">
          🐱 Keep going! ♡
        </p>
      </div>
    </Card>
  );
};