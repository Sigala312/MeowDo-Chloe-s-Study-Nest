'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Coffee, Ticket, Sparkles } from 'lucide-react';

interface LastDrawInfo {
  rewardTitle: string;
  drawnAt: string;
  isRedeemed: boolean;
}

export const TodaySpinsCard: React.FC = () => {
  const [remainingSpins, setRemainingSpins] = useState<number>(0);
  const [lastDraw, setLastDraw] = useState<LastDrawInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 抓取轉盤狀態 API
  const fetchStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/api/wheel/status', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const result = await res.json();

      if (res.ok) {
        // 解包取出內層 payload (相容 result.data 或直接相容 result)
        const payload = result.data || result;

        // 每 30 罐貓糧（tomatoes）換算為 1 次轉盤機會
        const spins = Math.floor((payload.tomatoes || 0) / 30);
        setRemainingSpins(spins);
        setLastDraw(payload.lastDraw || null);
      }
    } catch (err) {
      console.error('Failed to fetch wheel status in TodaySpinsCard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();

    // 🎯 監聽：抽獎完成、罐頭更新時，自動發送 API 重新取得最新次數與紀錄
    window.addEventListener('wheel-spun', fetchStatus);
    window.addEventListener('tomatoes-updated', fetchStatus);
    window.addEventListener('cat-food-updated', fetchStatus);

    return () => {
      window.removeEventListener('wheel-spun', fetchStatus);
      window.removeEventListener('tomatoes-updated', fetchStatus);
      window.removeEventListener('cat-food-updated', fetchStatus);
    };
  }, [fetchStatus]);

  // 格式化日期時間 (例如: Sep 8, 2026 16:32)
  const formatDrawnDate = (dateString: string) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

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
          {/* 肉墊 Icon */}
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
            <span className="text-3xl font-black text-[#4A3B32]">
              {loading ? '...' : remainingSpins}
            </span>
            <span className="text-sm font-bold text-[#8C7A6B]">spins remaining</span>
          </div>
        </div>

        {/* 中間：上次抽獎紀錄小卡 */}
        <div className="w-full md:w-auto flex-1 max-w-sm bg-[#FAF5EE] rounded-2xl p-3 px-4 flex items-center gap-3.5">
          <div className="w-10 h-10 bg-[#FFFDF9] rounded-full flex items-center justify-center shrink-0 border border-[#EADBC8]/40 shadow-xs">
            {lastDraw ? (
              <Coffee className="w-5 h-5 text-[#5C3D2E]" />
            ) : (
              <Sparkles className="w-5 h-5 text-[#DFA382]" />
            )}
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#A08D80] leading-tight">Last spin</p>
            {loading ? (
              <p className="text-xs font-bold text-[#8C7A6B]">Loading log...</p>
            ) : lastDraw ? (
              <>
                <p className="text-sm font-black text-[#4A3B32] leading-tight">
                  {lastDraw.rewardTitle}
                </p>
                <p className="text-[10px] font-medium text-[#B5A495] mt-0.5">
                  {formatDrawnDate(lastDraw.drawnAt)}
                </p>
              </>
            ) : (
              <p className="text-xs font-bold text-[#8C7A6B] mt-0.5">No spins yet today 🐾</p>
            )}
          </div>
        </div>

        {/* 右側占位 */}
        <div className="hidden md:block w-36 h-12 shrink-0" />
      </div>

      {/* 最右側：探頭 Good Luck 貓咪插圖 */}
      <div className="absolute right-2 bottom-0 w-36 h-24 sm:w-44 sm:h-28 pointer-events-none z-20">
        <Image
          src="/螢幕擷取畫面_2026-09-06_181015-removebg-preview.png"
          alt="Good Luck Cat"
          fill
          sizes="(max-width: 768px) 100vw, 176px"
          className="object-contain object-bottom"
        />
      </div>
    </div>
  );
};