'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { CircularProgress } from '../ui/Progress';

export const TodayProgress: React.FC = () => {
  return (
    <Card>
      <h3 className="text-base font-extrabold text-[#3D2C2E] mb-4">Today's Progress</h3>
      <div className="flex items-center gap-6">
        {/* 環形進度 */}
        <CircularProgress current={6} total={8} size={100} strokeWidth={10} />

        {/* 提示與打卡天數 */}
        <div className="space-y-2">
          <p className="text-sm font-bold text-[#3D2C2E]">Keep it up, Chloe!</p>
          <div className="inline-flex items-center gap-1.5 bg-[#FDF2EA] text-[#E07A5F] px-3 py-1 rounded-full text-xs font-extrabold">
            <span>🔥</span>
            <span>7 day streak</span>
          </div>
        </div>
      </div>
    </Card>
  );
};