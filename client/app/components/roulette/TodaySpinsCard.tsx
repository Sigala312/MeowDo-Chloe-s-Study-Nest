'use client';

import React from 'react';
import Image from 'next/image';
import { Coffee, Ticket } from 'lucide-react';

export const TodaySpinsCard: React.FC = () => {
  return (
    <div className="bg-[#FFFDF9] border border-[#EADBC8]/60 rounded-3xl p-6 sm:p-7 shadow-sm relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Ticket className="w-5 h-5 text-[#C88A68] -rotate-12" />
        <h2 className="text-lg font-black text-[#4A3B32]">Today's Spins</h2>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* 左側：剩餘次數 */}
        <div className="flex items-center gap-3 shrink-0 md:pr-8 md:border-r md:border-[#EADBC8]/50">
          {/* 自訂可愛肉墊 Icon */}
          <div className="w-8 h-8 flex items-center justify-center text-[#DFA382]">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
              <ellipse cx="12" cy="15.5" rx="5" ry="4" />
              <circle cx="6.5" cy="9.5" r="2" />
              <circle cx="10" cy="7" r="2" />
              <circle cx="14" cy="7" r="2" />
              <circle cx="17.5" cy="9.5" r="2" />
            </svg>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#4A3B32]">2</span>
            <span className="text-sm font-bold text-[#8C7A6B]">spins remaining</span>
          </div>
        </div>

        {/* 中間：上次抽獎紀錄小卡 */}
        <div className="w-full md:w-auto flex-1 max-w-sm bg-[#FAF5EE] rounded-2xl p-3 px-4 flex items-center gap-3.5">
          <div className="w-10 h-10 bg-[#FFFDF9] rounded-full flex items-center justify-center shrink-0 border border-[#EADBC8]/40 shadow-xs">
            <Coffee className="w-5 h-5 text-[#5C3D2E]" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#A08D80] leading-tight">Last spin</p>
            <p className="text-sm font-black text-[#4A3B32] leading-tight">Coffee</p>
            <p className="text-[10px] font-medium text-[#B5A495] mt-0.5">Sep 8, 2026 16:32</p>
          </div>
        </div>

        {/* 右側占位（確保 md 以上螢幕時貓咪不會遮擋內容） */}
        <div className="hidden md:block w-36 h-12 shrink-0" />
      </div>

      {/* 最右側：探頭 Good Luck 貓咪插圖 */}
      <div className="absolute right-2 bottom-0 w-36 h-24 sm:w-44 sm:h-28 pointer-events-none z-20">
        <Image
          src="/螢幕擷取畫面_2026-09-06_181015-removebg-preview.png"
          alt="Good Luck Cat"
          fill
          className="object-contain object-bottom"
        />
      </div>
    </div>
  );
};