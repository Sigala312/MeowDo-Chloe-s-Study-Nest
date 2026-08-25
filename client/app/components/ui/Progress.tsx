'use client';

import React from 'react';

// 1. 橫向條狀進度條
export const LinearProgress: React.FC<{ value: number; max?: number; className?: string }> = ({
  value,
  max = 100,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`w-full bg-[#EFE6DC] h-3 rounded-full overflow-hidden p-0.5 ${className}`}>
      <div
        className="bg-[#E07A5F] h-full rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

// 2. 環形進度圈 (Today's Progress 專用)
export const CircularProgress: React.FC<{
  current: number;
  total: number;
  size?: number;
  strokeWidth?: number;
}> = ({ current, total, size = 120, strokeWidth = 12 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = total > 0 ? current / total : 0;
  const strokeDashoffset = circumference - percentage * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 背景圈 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#EFE6DC"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* 進度圈 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E07A5F"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* 中間文字 */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-black text-[#3D2C2E] leading-none">{current}</span>
        <span className="text-xs font-bold text-[#8C7A6B] mt-1">/ {total}</span>
      </div>
    </div>
  );
};