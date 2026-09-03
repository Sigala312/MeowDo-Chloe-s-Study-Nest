'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarItem } from '../ui/SidebarItem';
import { Card } from '../ui/Card';
import Image from 'next/image';
import {
  Home,
  CheckSquare,
  Timer,
  Dices,
  Cat,
  BarChart2,
  Settings,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Home', icon: <Home className="w-5 h-5" />, href: '/Home' },
    { label: 'Tasks', icon: <CheckSquare className="w-5 h-5" />, href: '/Home/tasks' },
    { label: 'Focus', icon: <Timer className="w-5 h-5" />, href: '/Home/focus' },
    { label: 'Roulette', icon: <Dices className="w-5 h-5" />, href: '/Home/roulette' },
    { label: 'Cat Corner', icon: <Cat className="w-5 h-5" />, href: '/cat-corner' },
    { label: 'Stats', icon: <BarChart2 className="w-5 h-5" />, href: '/stats' },
    { label: 'Settings', icon: <Settings className="w-5 h-5" />, href: '/settings' },
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 bg-[#FAF6F0] p-6 flex flex-col justify-between border-r border-[#EADBC8]/40 select-none shrink-0 z-20">
      <div className="space-y-8">
        {/* 1. Logo 區域：點擊回 Home Dashboard */}
        <Link href="/Home/Dashboard" className="flex flex-col items-center text-center block">
          <Image 
            src="/螢幕擷取畫面_2026-07-31_153200-removebg-preview.png"
            alt="MeowDo Study Nest Logo" 
            width={200}
            height={200}
            className="w-full h-full object-contain drop-shadow-sm hover:scale-105 transition-transform"
            priority
          />
        </Link>

        {/* 2. 導覽選單列表 */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            // 判斷當前網址是否匹配該選項
            const isActive = pathname === item.href || (item.href !== '/Home/Dashboard' && pathname.startsWith(item.href));

            return (
              <Link key={item.label} href={item.href} className="block">
                <SidebarItem
                  icon={item.icon}
                  label={item.label}
                  isActive={isActive}
                />
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 3. 左下角：勵志便利貼卡片 */}
      <Card variant="cream" className="p-4 rounded-2xl relative text-center border-dashed border-[#D0BBA2]/80">
        <p className="text-xs font-bold text-[#6C5B52] leading-relaxed">
          Every day <br />
          is a new snapshot. <br />
          Let's make it count.
        </p>
        <span className="block text-right text-xs mt-1">🐾</span>
      </Card>
    </aside>
  );
};