'use client';

import React from 'react';
import { Bell } from 'lucide-react';

interface RouletteHeaderProps {
  spinsLeft: number;
}

export const RouletteHeader: React.FC<RouletteHeaderProps> = ({ spinsLeft }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-[#3D2C2E] flex items-center gap-2">
          Lucky Roulette <span className="text-[#E07A5F]">♡</span>
        </h1>
        <p className="text-xs md:text-sm font-bold text-[#8C7A6B] mt-1">
          Spin the wheel and claim your reward! Good luck, Chloe! 🍀
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Ticket 按鈕 */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#FFFDF9] border border-[#EADBC8] shadow-xs">
          <span className="text-xs font-black text-[#8C5A3C] bg-[#F4E2D8] px-2 py-0.5 rounded-lg">🎟️ Ticket</span>
          <span className="text-xs font-extrabold text-[#3D2C2E]">You have {spinsLeft} spins</span>
          <button className="w-5 h-5 rounded-full bg-[#E07A5F] text-white flex items-center justify-center text-xs font-bold hover:bg-[#c96349] transition-colors">
            +
          </button>
        </div>

        <button className="p-2.5 rounded-2xl bg-[#FFFDF9] border border-[#EADBC8] text-[#6C5B52] shadow-xs hover:bg-white transition-colors">
          <Bell className="w-4 h-4" />
        </button>
        <div className="w-10 h-10 rounded-2xl bg-[#F4E2D8] border-2 border-[#EADBC8] flex items-center justify-center text-xl overflow-hidden shadow-xs">
          🐱
        </div>
      </div>
    </div>
  );
};