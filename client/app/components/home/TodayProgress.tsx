'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Flame, Sparkles, Trophy } from 'lucide-react';

export const TodayProgress: React.FC = () => {
  const [streakDays, setStreakDays] = useState<number>(1);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const token = localStorage.getItem('token');
        // 假設後端有提供取得使用者 Streak 的 API，若無亦可用 localStorage 做本地計算
        const res = await fetch(`${API_URL}/api/user/streak`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        if (res.ok && result.success) {
          setStreakDays(result.data.streakDays || 1);
        }
      } catch (err) {
        console.error('Failed to fetch login streak:', err);
      }
    };

    fetchStreak();
  }, [API_URL]);

  return (
    <Card className="p-5 bg-white rounded-3xl border border-[#EADBC8]/50 shadow-xs">
      <h3 className="text-base font-extrabold text-[#3D2C2E] mb-3">
        Login Streak
      </h3>

      <div className="flex items-center gap-4 bg-[#FFFBF7] border border-[#F5E6D8] p-4 rounded-2xl">
        {/* 火焰圖示外框 */}
        <div className="w-14 h-14 rounded-2xl bg-[#FDEFEA] flex items-center justify-center shrink-0 border border-[#F8D2C9]">
          <Flame className="w-8 h-8 text-[#E07A5F] fill-[#E07A5F] animate-bounce" />
        </div>

        {/* 連續登入文字 */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-black text-[#3D2C2E]">
              {streakDays}
            </span>
            <span className="text-xs font-bold text-[#8C7A6B]">
              Days Streak!
            </span>
            {streakDays >= 7 && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-[#E89874] text-white ml-1">
                <Sparkles className="w-3 h-3" /> On Fire!
              </span>
            )}
          </div>

          <p className="text-xs font-semibold text-[#A08D80]">
            {streakDays === 1
              ? 'Great start! Log in tomorrow to keep it going 🐾'
              : `You've logged in for ${streakDays} consecutive days!`}
          </p>
        </div>
      </div>
    </Card>
  );
};