'use client';

import React from 'react';
import { Gift, Coffee, Gamepad2, Film, Cake, BookOpen, Sparkles } from 'lucide-react';

interface RewardItem {
  id: string;
  title: string;
  category: string;
  icon: React.ElementType;
  bgColor: string;
  tagBg: string;
  tagColor: string;
}

const INITIAL_REWARDS: RewardItem[] = [
  { id: '1', title: 'Coffee', category: 'Relax', icon: Coffee, bgColor: 'bg-[#FDF3E7]', tagBg: 'bg-[#FCE3D7]', tagColor: 'text-[#C85A32]' },
  { id: '2', title: 'Play games', category: 'Entertainment', icon: Gamepad2, bgColor: 'bg-[#F0EEF9]', tagBg: 'bg-[#E8E5F7]', tagColor: 'text-[#6B5BB9]' },
  { id: '3', title: 'Watch a movie', category: 'Entertainment', icon: Film, bgColor: 'bg-[#FDEBF1]', tagBg: 'bg-[#FCE4EC]', tagColor: 'text-[#D81B60]' },
  { id: '4', title: 'Eat dessert', category: 'Food', icon: Cake, bgColor: 'bg-[#FFF8E7]', tagBg: 'bg-[#FFF3E0]', tagColor: 'text-[#E65100]' },
  { id: '5', title: 'Free time', category: 'Personal', icon: BookOpen, bgColor: 'bg-[#F0F7F1]', tagBg: 'bg-[#E8F5E9]', tagColor: 'text-[#2E7D32]' },
  { id: '6', title: 'Mystery Gift', category: 'Surprise', icon: Sparkles, bgColor: 'bg-[#FFF4E5]', tagBg: 'bg-[#FFE8CC]', tagColor: 'text-[#D97706]' },
];

export const RewardListCard: React.FC = () => {
  return (
    <div className="bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-[#E07A5F]" />
          <h2 className="text-lg font-black text-[#3D2C2E]">Your Reward List</h2>
        </div>
      </div>

      {/* Rewards List */}
      <div className="space-y-2.5 my-auto">
        {INITIAL_REWARDS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="bg-[#FAF6F0] border border-[#EADBC8]/60 rounded-2xl p-3 flex items-center justify-between hover:border-[#E89874] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${item.bgColor}`}>
                  <Icon className="w-4 h-4 text-[#3D2C2E]" />
                </div>
                <span className="text-sm font-black text-[#3D2C2E]">{item.title}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-xl ${item.tagBg} ${item.tagColor}`}>
                  {item.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};