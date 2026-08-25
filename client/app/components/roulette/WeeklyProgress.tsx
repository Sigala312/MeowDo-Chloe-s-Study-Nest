'use client';

import React from 'react';
import Image from 'next/image';

interface WeeklyProgressProps {
  earnedSpins: number;
  maxSpins: number;
}

export const WeeklyProgress: React.FC<WeeklyProgressProps> = ({
  earnedSpins,
  maxSpins,
}) => {
  const percentage = Math.round((earnedSpins / maxSpins) * 100);

  return (
    <div className="bg-[#FFFDF9] border-2 border-dashed border-[#EADBC8] rounded-3xl p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {/* 彩球/歡慶插圖 */}
        <div className="relative w-12 h-12 shrink-0 select-none">
          <Image
            src="/螢幕擷取畫面_2026-08-18_024101-removebg-preview.png"
            alt="Celebration Icon"
            fill
            sizes="48px"
            className="object-contain"
            priority
          />
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-[#3D2C2E]">Keep going, Chloe!</h4>
          <p className="text-xs font-bold text-[#8C7A6B]">
            You're collecting little by little, and great things will come. ☀️
          </p>
        </div>
      </div>

      <div className="w-full md:w-64 bg-[#FAF6F0] p-3 rounded-2xl border border-[#EADBC8]">
        <div className="flex justify-between text-xs font-extrabold text-[#3D2C2E] mb-1.5">
          <span>Spins earned this week</span>
          <span>{earnedSpins} / {maxSpins}</span>
        </div>
        <div className="w-full bg-[#EADBC8] h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-[#5C4033] h-full rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};