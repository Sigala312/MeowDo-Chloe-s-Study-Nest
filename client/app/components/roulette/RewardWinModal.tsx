'use client';

import React from 'react';
import Image from 'next/image';
import { Bookmark, X, PawPrint } from 'lucide-react';
import { REWARD_ASSETS } from '../../constants/rewards';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  drawData: {
    drawLogId: string;
    reward: {
      id: string;
      title: string;
      rarity: string;
      imageKey: string;
    };
  } | null;
}

export const RewardWinModal: React.FC<Props> = ({ isOpen, onClose, drawData }) => {
  if (!isOpen || !drawData) return null;

  const { reward } = drawData;
  const asset = REWARD_ASSETS[reward.imageKey] || { image: '/badges/pass-coffee-ticket.png' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-sm bg-[#FFFDF9] border-2 border-[#EADBC8] rounded-3xl p-6 shadow-2xl text-center space-y-4">
        
        {/* 右上角關閉按鈕 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8C7A6B] hover:text-[#3D2C2E] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. 最頂部標籤 */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-2xl bg-[#FFEBD8] border border-[#FAD7B5] text-[#8C5832] text-xs font-black shadow-sm">
          <PawPrint className="w-3.5 h-3.5" />
          <span>New Reward Unlocked!</span>
        </div>

        {/* 2. 主標題與副標題 */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <PawPrint className="w-5 h-5 text-[#E07A5F]" />
            <h2 className="text-2xl font-black text-[#3D2C2E]">
              {reward.title}
            </h2>
            <PawPrint className="w-5 h-5 text-[#E07A5F]" />
          </div>
          <p className="text-xs font-bold text-[#8C7A6B]">
            享受屬於自己的悠閒時光吧！
          </p>
        </div>

        {/* 獎品圖片區域 */}
        <div className="relative w-full h-44 rounded-2xl bg-[#FAF6F0] border border-[#EADBC8] p-2 flex flex-col items-center justify-center shadow-inner">
          <Image
            src={asset.image}
            alt={reward.title}
            fill
            className="object-contain p-4"
          />
        </div>

        {/* 3. 按鈕區域 (焦糖奶茶橘按鈕) */}
        <div className="pt-2 space-y-2">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 bg-[#E07A5F] hover:bg-[#D0694E] text-white py-3.5 rounded-2xl font-black text-sm transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Bookmark className="w-4 h-4" />
            <span>Add to Collection</span>
          </button>
          
          <p className="text-[11px] font-bold text-[#B0A195]">
            ✨ Keep collecting more happy moments! ✨
          </p>
        </div>

      </div>
    </div>
  );
};