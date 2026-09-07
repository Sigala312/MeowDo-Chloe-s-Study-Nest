'use client';

import React from 'react';
import { WheelSectionCard } from '../../components/roulette/WheelSectionCard';
import { RewardListCard } from '../../components/roulette/RewardListCard';
import { TodaySpinsCard } from '../../components/roulette/TodaySpinsCard';

export default function RoulettePage() {
  return (
    <div className="p-8 space-y-6 bg-[#FAF7F2] min-h-screen text-[#3D2C2E]">
      {/* 1. Header 標題列 */}
      <div>
        <h1 className="text-3xl font-black flex items-center gap-2">
          Lucky Roulette 🐾
        </h1>
        <p className="text-sm font-bold text-[#8C7A6B] mt-1">
          Spin the wheel, get a little happiness! ♡
        </p>
      </div>

      {/* 2. 上方雙欄（轉盤區 + 獎勵清單區） */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7">
          <WheelSectionCard />
        </div>
        <div className="lg:col-span-5">
          <RewardListCard />
        </div>
      </div>

      {/* 3. 下方全寬區塊（今日抽獎狀態與紀錄） */}
      <TodaySpinsCard />
    </div>
  );
}