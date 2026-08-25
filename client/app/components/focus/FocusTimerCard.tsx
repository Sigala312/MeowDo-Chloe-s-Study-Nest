'use client';

import React from 'react';
import { Pause, Play, RotateCcw, Edit3 } from 'lucide-react';

interface FocusTimerCardProps {
  taskTitle: string;
  timeLeft: string; // e.g. "24:37"
  isRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onEditTask?: () => void;
}

export const FocusTimerCard: React.FC<FocusTimerCardProps> = ({
  taskTitle,
  timeLeft,
  isRunning,
  onToggleTimer,
  onResetTimer,
  onEditTask,
}) => {
  return (
    <div className="bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-8 shadow-xs relative flex flex-col items-center justify-center min-h-[420px] overflow-hidden">
      {/* 右上角 Tip 便利貼 */}
      <div className="absolute top-6 right-6 w-36 bg-[#FDF3E7] border border-[#EADBC8] p-3 rounded-2xl shadow-xs rotate-3 text-left">
        <p className="text-[11px] font-extrabold text-[#E07A5F] mb-1 flex items-center gap-1">
          Tip ✨
        </p>
        <p className="text-[11px] font-bold text-[#6C5B52] leading-snug">
          Take a deep breath and believe in yourself. 💖
        </p>
        <span className="text-[10px] block text-right mt-1">🐾</span>
      </div>

      {/* 大番茄圓環計時器 */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border-[12px] border-[#E89874] bg-[#FFF8F3] shadow-inner flex flex-col items-center justify-center p-4">
        {/* 番茄葉子裝飾 */}
        <div className="absolute -top-7 text-4xl select-none">
          🌿
        </div>

        <span className="text-xs font-bold text-[#8C7A6B] mb-1">Focus on</span>

        {/* 當前任務標籤 */}
        <button
          onClick={onEditTask}
          className="flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#FAF6F0] border border-[#EADBC8] text-xs font-extrabold text-[#3D2C2E] hover:bg-[#F4E2D8] transition-colors mb-3"
        >
          <span>{taskTitle}</span>
          <Edit3 className="w-3 h-3 text-[#8C7A6B]" />
        </button>

        {/* 時間顯示 */}
        <div className="text-5xl sm:text-6xl font-black text-[#3D2C2E] tracking-tight font-mono my-1">
          {timeLeft}
        </div>

        <span className="text-xs font-bold text-[#8C7A6B] mb-4">Remaining</span>

        {/* 控制按鈕 */}
        <div className="flex flex-col gap-2 w-36 z-10">
          <button
            onClick={onToggleTimer}
            className="w-full py-2.5 rounded-2xl bg-[#3D2C2E] hover:bg-[#2A1E1F] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> Start
              </>
            )}
          </button>

          <button
            onClick={onResetTimer}
            className="w-full py-1.5 rounded-xl bg-[#FAF6F0] hover:bg-[#EADBC8] text-[#6C5B52] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Restart
          </button>
        </div>
      </div>

      {/* 右下角加油貓咪插圖 */}
      <div className="absolute bottom-4 right-8 flex items-end gap-2 hidden sm:flex">
        <div className="bg-[#FFFDF9] border border-[#EADBC8] px-3 py-1.5 rounded-2xl shadow-xs text-xs font-extrabold text-[#3D2C2E] mb-8">
          You've got this!
        </div>
        <div className="text-6xl select-none">🐱</div>
      </div>
    </div>
  );
};