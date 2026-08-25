'use client';

import React from 'react';

export interface HistoryItem {
  id: number;
  title: string;
  icon: string;
  time: string;
}

interface RecentHistoryProps {
  history: HistoryItem[];
}

export const RecentHistory: React.FC<RecentHistoryProps> = ({ history }) => {
  return (
    <div className="bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-6 shadow-xs relative overflow-hidden">
      {/* 拍立得照片 */}
      <div className="absolute top-3 right-4 w-12 h-14 bg-white border border-[#EADBC8] p-1 shadow-xs rotate-6 rounded-sm hidden sm:block">
        <div className="w-full h-8 bg-[#FAF6F0] rounded-xs flex items-center justify-center text-xs">
          ☕
        </div>
      </div>

      <h3 className="text-base font-extrabold text-[#3D2C2E] mb-4">Recent History</h3>

      <div className="space-y-3">
        {history.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-2 border-b border-[#FAF6F0] last:border-none">
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <div>
                <h4 className="text-xs font-extrabold text-[#3D2C2E]">{item.title}</h4>
                <p className="text-[10px] font-bold text-[#8C7A6B]">{item.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};