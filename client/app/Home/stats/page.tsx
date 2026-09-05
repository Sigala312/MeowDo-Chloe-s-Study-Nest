'use client';

import React, { useState } from 'react';
import { TaskStatsCard } from '../../components/stats/TaskStatsCard';
import { CategoryStatsCard } from '../../components/stats/CategoryStatsCard';
import { TagStatsCard } from '../../components/stats/TagStatsCard';
import { Calendar, Search, Bell } from 'lucide-react';

export default function StatsPage() {
  const [quickSelect, setQuickSelect] = useState<'Today' | 'This Week' | 'This Month' | 'Custom'>('This Month');

  return (
    <div className="p-8 space-y-6 bg-[#FAF7F2] min-h-screen text-[#3D2C2E]">
      {/* Top Bar Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-2">
            Statistics 🐾
          </h1>
          <p className="text-sm font-bold text-[#8C7A6B] mt-1">
            Track your productivity and keep improving! 🧡
          </p>
        </div>

        {/* 右上角搜尋與通知 */}
        {/* <div className="flex items-center gap-3">
          <button className="p-2.5 bg-[#FFFDF9] border border-[#EADBC8] rounded-2xl hover:bg-[#FAF6F0] transition-all cursor-pointer">
            <Search className="w-4 h-4 text-[#8C7A6B]" />
          </button>
          <button className="p-2.5 bg-[#FFFDF9] border border-[#EADBC8] rounded-2xl hover:bg-[#FAF6F0] transition-all cursor-pointer relative">
            <Bell className="w-4 h-4 text-[#8C7A6B]" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E07A5F]" />
          </button>
          <div className="w-9 h-9 rounded-2xl overflow-hidden border border-[#EADBC8]">
            <img src="/avatar-cat.png" alt="Chloe" className="w-full h-full object-cover" />
          </div>
        </div> */}
      </div>

      {/* Date Range & Quick Select 篩選列 */}
      <div className="bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 text-xs font-black">
          <span className="text-[#8C7A6B]">Date Range</span>
          <div className="flex items-center gap-2 bg-[#FAF6F0] border border-[#EADBC8] px-3 py-2 rounded-2xl text-[#3D2C2E]">
            <Calendar className="w-4 h-4 text-[#E07A5F]" />
            <span>Sep 1 - Sep 30, 2026</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-[#8C7A6B] mr-2">Quick Select</span>
          {(['Today', 'This Week', 'This Month', 'Custom'] as const).map((item) => (
            <button
              key={item}
              onClick={() => setQuickSelect(item)}
              className={`px-4 py-2 text-xs font-black rounded-2xl transition-all cursor-pointer ${
                quickSelect === item
                  ? 'bg-[#FCE3D7] text-[#E07A5F] border border-[#E89874]'
                  : 'bg-[#FAF6F0] text-[#8C7A6B] border border-transparent hover:bg-[#F4E2D8]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* 1. 任務統計區塊 (Task Statistics Component) */}
      <TaskStatsCard />

      {/* 2 & 3. 下方雙欄統計區塊 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryStatsCard />
        <TagStatsCard />
      </div>
    </div>
  );
}