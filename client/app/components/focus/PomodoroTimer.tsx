'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Settings, Play, Pause, RotateCcw } from 'lucide-react';

export const PomodoroTimer: React.FC = () => {
  const [mode, setMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');
  const [isRunning, setIsRunning] = useState(false);

  return (
    <Card className="p-6 flex flex-col items-center justify-between bg-[#FAF6F0] rounded-3xl border border-[#EADBC8]/60 shadow-sm h-full relative">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl">🍅</span>
          <h2 className="font-bold text-[#5C4B43]">Focus & Pomodoro Timer</h2>
        </div>
        <button className="text-[#A08D80] hover:text-[#5C4B43] transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* 環形時鐘區域 */}
      <div className="relative my-6 flex flex-col items-center justify-center">
        <div className="w-56 h-56 rounded-full border-8 border-[#F3E9DC] border-t-[#E07A5F] flex flex-col items-center justify-center relative shadow-inner bg-[#FFFDF9]">
          <div className="text-3xl mb-1">🐱💤</div>
          <span className="text-4xl font-extrabold text-[#4A3E3D] tracking-wider">25:00</span>
        </div>
      </div>

      {/* 控制按鈕 */}
      <button 
        onClick={() => setIsRunning(!isRunning)}
        className="px-8 py-2.5 bg-[#E07A5F] hover:bg-[#D0694E] text-white font-bold rounded-full flex items-center gap-2 shadow-md transition-all active:scale-95"
      >
        {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
        {isRunning ? 'Pause' : 'Start'}
      </button>

      {/* 模式切換 Tabs */}
      <div className="flex bg-[#F0E5D8]/60 p-1.5 rounded-2xl w-full justify-between mt-6 text-sm font-semibold text-[#8C7A6B]">
        <button 
          onClick={() => setMode('pomodoro')} 
          className={`flex-1 py-1.5 rounded-xl transition-all ${mode === 'pomodoro' ? 'bg-[#FFFDF9] text-[#E07A5F] shadow-sm' : 'hover:text-[#5C4B43]'}`}
        >
          Pomodoro
        </button>
        <button 
          onClick={() => setMode('shortBreak')} 
          className={`flex-1 py-1.5 rounded-xl transition-all ${mode === 'shortBreak' ? 'bg-[#FFFDF9] text-[#E07A5F] shadow-sm' : 'hover:text-[#5C4B43]'}`}
        >
          Short Break
        </button>
        <button 
          onClick={() => setMode('longBreak')} 
          className={`flex-1 py-1.5 rounded-xl transition-all ${mode === 'longBreak' ? 'bg-[#FFFDF9] text-[#E07A5F] shadow-sm' : 'hover:text-[#5C4B43]'}`}
        >
          Long Break
        </button>
      </div>
    </Card>
  );
};