'use client';

import React from 'react';
import { Reward } from './RouletteWheel';

interface RewardsListProps {
  rewards: Reward[];
}

export const RewardsList: React.FC<RewardsListProps> = ({ rewards }) => {
  return (
    <div className="bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-6 shadow-xs relative overflow-hidden">
      {/* 右上角紙膠帶 */}
      <div className="absolute top-3 right-4 w-12 h-4 bg-[#E2C7B3]/70 rotate-12 rounded-xs border-y border-white/40" />

      <h3 className="text-base font-extrabold text-[#3D2C2E] mb-4">Rewards List</h3>

      <div className="space-y-3">
        {rewards.map((reward) => (
          <div key={reward.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#FAF6F0] transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF6F0] border border-[#EADBC8] flex items-center justify-center text-xl shrink-0">
              {reward.icon}
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#3D2C2E]">{reward.title}</h4>
              <p className="text-[11px] font-bold text-[#8C7A6B]">{reward.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};