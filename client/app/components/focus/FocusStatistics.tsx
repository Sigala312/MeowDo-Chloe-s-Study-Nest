'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { BarChart2, Calendar } from 'lucide-react';

export const FocusStatistics: React.FC = () => {
  const [tab, setTab] = useState<'day' | 'week' | 'month'>('day');

  const chartData = [
    { date: '9/1', val: 75 },
    { date: '9/2', val: 90 },
    { date: '9/3', val: 65 },
    { date: '9/4', val: 55 },
    { date: '9/5', val: 80 },
    { date: '9/6', val: 60 },
    { date: '9/7', val: 85 },
  ];

  return (
    <Card className="p-6 bg-[#FAF6F0] rounded-3xl border border-[#EADBC8]/60 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-[#8C7A6B]" />
          <h2 className="font-bold text-[#5C4B43]">Focus Statistics</h2>
        </div>
        <button className="text-xs font-bold bg-[#FFFDF9] border border-[#EADBC8] text-[#6C5B52] px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm">
          <Calendar className="w-3.5 h-3.5" /> Sep 2026
        </button>
      </div>

      {/* 切換 Tab */}
      <div className="flex bg-[#F0E5D8]/60 p-1 rounded-2xl w-full text-xs font-bold text-[#8C7A6B] mb-6">
        {(['day', 'week', 'month'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-1 rounded-xl capitalize transition-all ${tab === t ? 'bg-[#FFFDF9] text-[#E07A5F] shadow-sm' : ''}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* 簡易柱狀圖繪製 */}
      <div className="h-28 flex items-end justify-between px-2 gap-2 border-b border-[#EADBC8]/60 pb-2">
        {chartData.map((item, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
            <div 
              className="w-full bg-[#F4A261]/70 hover:bg-[#E07A5F] rounded-t-md transition-all"
              style={{ height: `${item.val}%` }}
            />
            <span className="text-[10px] font-bold text-[#A08D80]">{item.date}</span>
          </div>
        ))}
      </div>

      {/* 平均時間卡片 */}
      <div className="mt-4 p-3 bg-[#FFFDF9] rounded-2xl border border-[#EADBC8]/40">
        <span className="text-xs font-bold text-[#8C7A6B] block mb-2">⏱️ Average Focus Time</span>
        <div className="grid grid-cols-3 text-center divide-x divide-[#EADBC8]/60">
          <div>
            <span className="text-[10px] text-[#A08D80] block">Day</span>
            <span className="text-xs font-extrabold text-[#4A3E3D]">1h 12m</span>
          </div>
          <div>
            <span className="text-[10px] text-[#A08D80] block">Week</span>
            <span className="text-xs font-extrabold text-[#4A3E3D]">1h 34m</span>
          </div>
          <div>
            <span className="text-[10px] text-[#A08D80] block">Month</span>
            <span className="text-xs font-extrabold text-[#4A3E3D]">1h 28m</span>
          </div>
        </div>
      </div>
    </Card>
  );
};