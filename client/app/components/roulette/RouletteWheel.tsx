'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export interface Reward {
  id: number;
  title: string;
  icon: string;
  desc: string;
}

interface RouletteWheelProps {
  rewards: Reward[];
  rotation: number;
  isSpinning: boolean;
  spinsLeft: number;
  wonReward: Reward | null;
  onSpin: () => void;
}

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
  rewards,
  rotation,
  isSpinning,
  spinsLeft,
  wonReward,
  onSpin,
}) => {
  return (
    <div className="flex flex-col items-center justify-center relative py-2">
      {/* 氣泡對話框 */}
      <div className="absolute top-2 right-12 md:right-24 bg-[#FFFDF9] border border-[#EADBC8] px-4 py-2 rounded-2xl shadow-xs text-xs font-bold text-[#6C5B52] hidden sm:flex items-center gap-1 z-10">
        Let's see what you get! 🐾
      </div>

      {/* 轉盤外框 */}
      <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px]">
        {/* 指針 */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
          <div className="w-8 h-10 bg-[#5C4033] rounded-t-full rounded-b-xl flex items-center justify-center border-2 border-[#EADBC8] shadow-md">
            <span className="text-white text-xs">♡</span>
          </div>
        </div>

        {/* 轉盤核心 */}
        <motion.div
          className="w-full h-full rounded-full border-8 border-[#DDB892] bg-[#FFFDF9] shadow-lg relative overflow-hidden flex items-center justify-center"
          animate={{ rotate: rotation }}
          transition={{ duration: 4.5, ease: [0.15, 0.99, 0.35, 1] }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0">
            {rewards.map((_, index) => {
              const angle = (360 / rewards.length) * index;
              return (
                <g key={index} transform={`rotate(${angle} 50 50)`}>
                  <path
                    d="M 50 50 L 50 0 A 50 50 0 0 1 93.3 25 Z"
                    fill={index % 2 === 0 ? '#FDF8F2' : '#F5E6D3'}
                    stroke="#EADBC8"
                    strokeWidth="0.5"
                  />
                </g>
              );
            })}
          </svg>

          {/* 獎項圖示文字 */}
          {rewards.map((reward, index) => {
            const angle = (360 / rewards.length) * index + 30;
            return (
              <div
                key={reward.id}
                className="absolute w-20 h-32 flex flex-col items-center justify-start pt-4 text-center pointer-events-none"
                style={{
                  transformOrigin: 'bottom center',
                  transform: `rotate(${angle}deg) translateY(-10px)`,
                }}
              >
                <span className="text-2xl mb-1">{reward.icon}</span>
                <span className="text-[10px] font-extrabold text-[#3D2C2E] leading-tight px-1">
                  {reward.title}
                </span>
              </div>
            );
          })}

          {/* 中心爪印 */}
          <div className="absolute w-16 h-16 rounded-full bg-[#5C4033] border-4 border-[#EADBC8] shadow-md flex items-center justify-center text-xl z-20">
            🐾
          </div>
        </motion.div>

        {/* 右下角插圖 */}
        <div className="absolute -bottom-4 -right-10 w-28 h-28 pointer-events-none select-none hidden sm:block z-20">
          <Image
            src="/未命名設計__1_-removebg-preview.png"
            alt="Decoration Illustration"
            fill
            sizes="112px"
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* SPIN 按鈕 */}
      <div className="mt-6 flex flex-col items-center gap-2 z-10">
        <button
          onClick={onSpin}
          disabled={isSpinning || spinsLeft <= 0}
          className={`px-12 py-3 rounded-full font-black text-white text-lg shadow-md transition-all flex items-center gap-2 ${
            isSpinning || spinsLeft <= 0
              ? 'bg-[#B0A397] cursor-not-allowed opacity-80'
              : 'bg-[#5C4033] hover:bg-[#422D24] hover:scale-105 active:scale-95'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#E2C7B3]" />
          {isSpinning ? 'SPINNING...' : 'SPIN!'}
          <Sparkles className="w-4 h-4 text-[#E2C7B3]" />
        </button>

        <span className="text-xs font-bold text-[#8C7A6B]">
          Spins left today: <span className="text-[#3D2C2E]">{spinsLeft} / 3</span>
        </span>
      </div>

      {/* 中獎結果彈窗 */}
      {wonReward && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="mt-4 px-6 py-3 bg-[#FFFDF9] border-2 border-[#E07A5F] rounded-2xl shadow-md flex items-center gap-3 z-10"
        >
          <span className="text-3xl">{wonReward.icon}</span>
          <div>
            <p className="text-xs font-extrabold text-[#E07A5F]">CONGRATULATIONS!</p>
            <p className="text-sm font-black text-[#3D2C2E]">You won {wonReward.title}!</p>
          </div>
        </motion.div>
      )}

      {/* 底部賺取次數提示 */}
      <div className="mt-6 w-full max-w-lg bg-[#FFFDF9]/80 border border-[#EADBC8] rounded-2xl p-3 flex items-center justify-between text-xs font-bold text-[#6C5B52] shadow-xs">
        <div className="flex items-center gap-2">
          <span>💡</span>
          <span>Complete tasks and focus sessions to earn more spins!</span>
        </div>
        <ArrowRight className="w-4 h-4 text-[#8C7A6B]" />
      </div>
    </div>
  );
};