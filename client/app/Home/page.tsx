'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TodayTasks } from '../components/home/TodayTasks';
import { TodayProgress } from '../components/home/TodayProgress';
import { UpcomingTasks } from '../components/home/UpcomingTasks';
import { DailyQuote } from '../components/home/DailyQuote';
import { Bell, User, LogOut } from 'lucide-react';
import { DropdownMenu } from '../components/ui/DropdownMenu'; // 引入 DropdownMenu 元件

export default function DashboardPage() {
  const router = useRouter();

  // 下拉選單項目設定
  const userMenuItems = [
    {
      id: 'profile',
      label: 'View Profile',
      icon: <User className="w-4 h-4 text-[#8C7A6B]" />,
      onClick: () => router.push('/Home/settings'), // 跳轉至個人資料頁
    },
    'divider' as const,
    {
      id: 'logout',
      label: 'Log Out',
      icon: <LogOut className="w-4 h-4" />,
      danger: true,
      onClick: () => {
        // 執行登出邏輯 (例如清除 token)
        router.push('/login');
      },
    },
  ];

  return (
    // 外層容器無邊距，緊貼側邊欄右側
    <div className="relative w-full min-h-screen p-6 md:p-8">
      {/* 1. 全螢幕背景圖：移除模糊層，還原高清自然光影 */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/sabina-sturzu-sHtJeNIzPe8-unsplash.jpg"
          alt="Cozy Room Background"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        {/* 極薄的溫暖微光調色，防止圖片過暗，不影響清晰度 */}
        <div className="absolute inset-0 bg-[#FFFDF9]/10" />
      </div>

      {/* 2. 主要內容區域 (z-10 確保浮於背景上方) */}
      <div className="relative z-10 space-y-6 max-w-[1400px] mx-auto">
        {/* 頂部 Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#3D2C2E] flex items-center gap-2 drop-shadow-xs">
              Good morning, Chloe! ☀️
            </h1>
            <p className="text-xs md:text-sm font-bold text-[#6C5B52] mt-1 flex items-center gap-1">
              You have 2 tasks left for today. Let's go! <span className="text-[#E07A5F]">♡</span>
            </p>
          </div>

          {/* 右上角功能按鈕 */}
          <div className="flex items-center gap-3">
            {/* 通知按鈕 */}
            <button 
              type="button"
              className="p-2.5 rounded-2xl bg-[#FFFDF9] border border-[#EADBC8] text-[#6C5B52] hover:bg-white transition-colors relative shadow-xs cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#E07A5F] rounded-full" />
            </button>

            {/* 貓咪頭像下拉選單 */}
            <DropdownMenu
              align="right"
              items={userMenuItems}
              trigger={
                <div className="w-10 h-10 rounded-2xl bg-[#F4E2D8] border-2 border-[#EADBC8] flex items-center justify-center text-xl overflow-hidden shadow-xs cursor-pointer hover:border-[#E07A5F] transition-all">
                  🐱
                </div>
              }
            />
          </div>
        </div>

        {/* 主內容 Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <TodayTasks />
          </div>

          <div className="space-y-6">
            <TodayProgress />
            <UpcomingTasks />
            <DailyQuote />
          </div>
        </div>
      </div>
    </div>
  );
}