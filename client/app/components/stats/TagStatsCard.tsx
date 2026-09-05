'use client';

import React from 'react';
import { Tag } from 'lucide-react';

const tagData = [
  { name: '#Study', percent: 40, tasks: 64, color: '#82A074' },
  { name: '#React', percent: 25, tasks: 40, color: '#F4A261' },
  { name: '#Exam', percent: 20, tasks: 32, color: '#E76F51' },
  { name: '#Important', percent: 15, tasks: 24, color: '#8AB17D' },
];

export const TagStatsCard: React.FC = () => {
  return (
    <div className="bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-6 shadow-sm space-y-6">
      {/* Title */}
      <div className="flex items-center gap-2">
        <Tag className="w-5 h-5 text-[#E07A5F]" />
        <h2 className="text-lg font-black text-[#3D2C2E]">Tag Statistics</h2>
      </div>

      {/* 圖表與圖例 */}
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
        {/* CSS Conic Gradient 圓餅圖 */}
        <div className="relative w-40 h-40 rounded-full flex items-center justify-center shadow-inner"
          style={{
            background: `conic-gradient(
              #82A074 0% 40%,
              #F4A261 40% 65%,
              #E76F51 65% 85%,
              #8AB17D 85% 100%
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
          {tagData.map((tag) => (
            <div key={tag.name} className="flex items-center justify-between gap-8 text-xs font-bold">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                <span className="text-[#3D2C2E]">{tag.name}</span>
              </div>
              <span className="text-[#8C7A6B] font-black">{tag.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* 底部各標籤任務數量卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {tagData.map((tag) => (
          <div key={tag.name} className="bg-[#FAF6F0]/80 border border-[#EADBC8] rounded-2xl p-3 space-y-1">
            <div className="inline-block px-2 py-0.5 rounded-lg text-[10px] font-black bg-[#FDF3E7] text-[#E07A5F]">
              {tag.name}
            </div>
            <p className="text-xs font-extrabold text-[#8C7A6B]">
              <span className="text-sm text-[#3D2C2E] font-black mr-1">{tag.tasks}</span> tasks
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};