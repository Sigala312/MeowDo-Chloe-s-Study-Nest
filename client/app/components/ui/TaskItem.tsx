'use client';

import React from 'react';
import { Check, CheckCircle2 } from 'lucide-react';

export interface TaskItemProps {
  id: string;
  title: string;
  category: string;
  pomodoros: number;
  completed: boolean;
  icon?: React.ReactNode;
  iconBg?: string;
  isToday?: boolean;
  onToggle: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  id,
  title,
  category,
  pomodoros,
  completed,
  icon = '📝',
  iconBg = 'bg-[#F9F0E6]',
  isToday = true,
  onToggle,
}) => {
  return (
    <div
      onClick={() => onToggle(id)}
      className={`group flex items-center justify-between p-3.5 rounded-2xl transition-all duration-200 cursor-pointer border ${
        completed
          ? 'bg-[#FAF7F2]/60 border-transparent opacity-75'
          : 'bg-white hover:bg-[#FAF5EF] border-[#F0E6DC] hover:border-[#E5D7C8] shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3.5">
        {/* 自訂手繪風 Checkbox */}
        <button
          type="button"
          className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-colors ${
            completed
              ? 'bg-[#E07A5F] border-[#E07A5F] text-white'
              : 'border-[#D5C4B3] group-hover:border-[#E07A5F] bg-white'
          }`}
        >
          {completed && <Check className="w-4 h-4 stroke-[3]" />}
        </button>

        {/* 類別圖示方塊 */}
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center text-lg border border-black/5`}>
          {icon}
        </div>

        {/* 內容 */}
        <div>
          <h4
            className={`font-bold text-sm text-[#3D2C2E] ${
              completed ? 'line-through text-[#9E8E81]' : ''
            }`}
          >
            {title}
          </h4>
          <p className="text-xs text-[#8C7A6B] mt-0.5">
            {category} <span className="mx-1">•</span> {pomodoros} Pomodoro{pomodoros > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* 狀態 / 標籤 */}
      <div>
        {completed ? (
          <span className="flex items-center gap-1 text-xs font-bold text-[#5B8C5A] bg-[#EAF3EA] px-3 py-1 rounded-full">
            Completed <CheckCircle2 className="w-3.5 h-3.5" />
          </span>
        ) : isToday ? (
          <span className="flex items-center gap-1 text-xs font-bold text-[#E07A5F] bg-[#FDEFEA] px-2.5 py-1 rounded-full">
            🍅 Today
          </span>
        ) : null}
      </div>
    </div>
  );
};