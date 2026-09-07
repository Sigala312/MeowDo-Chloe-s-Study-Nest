'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Coffee, Gift, Gamepad2, Film, Cake, BookOpen, PawPrint } from 'lucide-react';

const REWARDS = [
  { id: '1', name: 'Coffee', icon: Coffee, color: '#FFF8F0', iconColor: '#5C3D2E' },
  { id: '2', name: 'Play games', icon: Gamepad2, color: '#E8E5F7', iconColor: '#6B5BB9' },
  { id: '3', name: 'Watch a movie', icon: Film, color: '#FCE4EC', iconColor: '#D81B60' },
  { id: '4', name: 'Eat dessert', icon: Cake, color: '#FFF3E0', iconColor: '#E65100' },
  { id: '5', name: 'Free time', icon: BookOpen, color: '#E8F5E9', iconColor: '#2E7D32' },
  { id: '6', name: 'Gift Box', icon: Gift, color: '#E1F5FE', iconColor: '#0277BD' },
];

export const WheelSectionCard: React.FC = () => {
  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const extraDegrees = Math.floor(Math.random() * 360);
    const newRotation = rotation + 1800 + extraDegrees;
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
    }, 4000);
  };

  return (
    <div className="bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-8 shadow-sm flex flex-col items-center justify-between min-h-[480px] relative overflow-hidden">
      {/* 左側手繪標語 */}
      <div className="absolute left-6 top-10 text-center -rotate-12 hidden sm:block pointer-events-none z-20">
        <p className="text-xs font-bold text-[#A08D80] leading-snug">
          Spin<br />and see<br />what you get! ♡
        </p>
      </div>

      {/* 左下角貓咪插圖 */}
      <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 w-20 h-20 sm:w-24 sm:h-24 pointer-events-none z-20">
        <Image
          src="/ChatGPT_Image_2026年9月6日_下午06_11_38-removebg-preview.png" // 請確保將圖片放置於 public 目錄中，或改為你的圖片路徑
          alt="Smart Cat"
          width={200}
          height={200}
          className="object-contain w-full h-full drop-shadow-sm"
        />
      </div>

      {/* 轉盤主區域 */}
      <div className="relative w-[340px] h-[340px] flex items-center justify-center my-auto">
        
        {/* 1. 頂部黃色指標 */}
        <div className="absolute -top-3 z-30 flex flex-col items-center pointer-events-none">
          <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
            <path
              d="M14 36L2 14C-1 9.5 1.5 2 7 2H21C26.5 2 29 9.5 26 14L14 36Z"
              fill="#F4A261"
              stroke="#D88042"
              strokeWidth="2.5"
            />
            <circle cx="14" cy="10" r="3.5" fill="#FFFDF9" stroke="#D88042" strokeWidth="1.5" />
          </svg>
        </div>

        {/* 2. 外圍木質圓框與轉盤 */}
        <div className="relative w-[300px] h-[300px] rounded-full border-[12px] border-[#F4E8DC] shadow-[0_0_0_4px_#DFA382] flex items-center justify-center overflow-hidden z-20">
          
          {/* 轉盤本體 (包含 6 個 SVG 扇形區塊) */}
          <div
            className="w-full h-full relative transition-transform duration-[4000ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {REWARDS.map((item, index) => {
                const angle = 360 / REWARDS.length;
                const startAngle = index * angle;
                const endAngle = startAngle + angle;

                const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

                const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                return (
                  <path
                    key={item.id}
                    d={pathData}
                    fill={item.color}
                    stroke="#FFFDF9"
                    strokeWidth="1.5"
                  />
                );
              })}
            </svg>

            {/* 扇形內的 Icon */}
            <div className="absolute inset-0 pointer-events-none">
              {REWARDS.map((item, idx) => {
                const angle = (360 / REWARDS.length) * idx + 30;
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="absolute w-full h-full flex justify-center items-start pt-6"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: item.iconColor }} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. 中央肉墊貓爪印 */}
          <div className="absolute inset-0 m-auto w-14 h-14 bg-[#FFFDF9] border-2 border-[#DFA382] rounded-full flex items-center justify-center shadow-md z-30">
            <PawPrint className="w-6 h-6 text-[#DFA382] fill-[#DFA382]" />
          </div>
        </div>
      </div>

      {/* 4. SPIN 按鈕 */}
      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className="mt-6 w-full max-w-xs bg-[#E07A5F] hover:bg-[#D0694E] disabled:bg-[#D1C2B4] text-white py-3.5 rounded-2xl font-black text-base tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer z-20"
      >
        <Sparkles className="w-5 h-5" />
        {isSpinning ? 'SPINNING...' : 'SPIN'}
      </button>
    </div>
  );
};