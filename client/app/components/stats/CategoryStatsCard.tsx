'use client';

import React from 'react';
import { ListFilter, BookOpen, Code, Heart, User } from 'lucide-react';

const categoryData = [
  { name: 'Study', percent: 45, tasks: 72, color: '#82A074', icon: <BookOpen className="w-3.5 h-3.5" /> },
  { name: 'Coding', percent: 30, tasks: 48, color: '#F4A261', icon: <Code className="w-3.5 h-3.5" /> },
  { name: 'Health', percent: 15, tasks: 24, color: '#E76F51', icon: <Heart className="w-3.5 h-3.5" /> },
  { name: 'Personal', percent: 10, tasks: 18, color: '#8AB17D', icon: <User className="w-3.5 h-3.5" /> },
];

export const CategoryStatsCard: React.FC = () => {
  return (
    <div className="bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-6 shadow-sm space-y-6">
      {/* Title */}
      <div className="flex items-center gap-2">
        <ListFilter className="w-5 h-5 text-[#E07A5F]" />
        <h2 className="text-lg font-black text-[#3D2C2E]">Category Statistics</h2>
      </div>

      {/* 圖表與圖例 */}
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
        {/* CSS Conic Gradient 呈現的圓餅圖 */}
        <div className="relative w-40 h-40 rounded-full flex items-center justify-center shadow-inner"
          style={{
            background: `conic-gradient(
              #82A074 0% 45%,
              #F4A261 45% 75%,
              #E76F51 75% 90%,
              #8AB17D 90% 100%
            )`,
          }}
        >
          {/* 中心爪印空心 */}
          <div className="w-16 h-16 bg-[#FFFDF9] rounded-full flex items-center justify-center shadow-xs">
            <span className="text-xl">🐾</span>
          </div>
        </div>

        {/* 右側 Legend 列表 */}
        <div className="space-y-2.5 w-full sm:w-auto">
          {categoryData.map((cat) => (
            <div key={cat.name} className="flex items-center justify-between gap-8 text-xs font-bold">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-[#3D2C2E]">{cat.name}</span>
              </div>
              <span className="text-[#8C7A6B] font-black">{cat.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* 底部各分類任務數量卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categoryData.map((cat) => (
          <div key={cat.name} className="bg-[#FAF6F0]/80 border border-[#EADBC8] rounded-2xl p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#3D2C2E]">
              {cat.icon}
              <span>{cat.name}</span>
            </div>
            <p className="text-xs font-extrabold text-[#8C7A6B]">
              <span className="text-sm text-[#3D2C2E] font-black mr-1">{cat.tasks}</span> tasks
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};