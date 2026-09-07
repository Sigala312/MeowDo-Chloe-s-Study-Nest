import React from 'react';
import { PomodoroTimer } from '../../components/focus/PomodoroTimer';
import { TodaysFocus } from '../../components/focus/TodaysFocus';
import { FocusGoal } from '../../components/focus/FocusGoal';
import { FocusStatistics } from '../../components/focus/FocusStatistics';
import { MusicPlayer } from '../../components/focus/MusicPlayer';

export default function FocusPage() {
  return (
    <div className="p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* 頂部標題與副標題 */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#4A3E3D] flex items-center gap-2">
          Focus 🐾
        </h1>
        <p className="text-sm text-[#8C7A6B] font-medium mt-1">
          Stay focused, make progress, and be proud of yourself! ♡
        </p>
      </div>

      {/* 上半部：3 欄排版 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-4">
          <PomodoroTimer />
        </div>
        <div className="lg:col-span-5">
          <TodaysFocus />
        </div>
        <div className="lg:col-span-3">
          <FocusGoal />
        </div>
      </div>

      {/* 下半部：2 欄排版 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7">
          <FocusStatistics />
        </div>
        <div className="lg:col-span-5">
          <MusicPlayer />
        </div>
      </div>
    </div>
  );
}