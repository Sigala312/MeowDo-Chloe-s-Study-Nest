'use client';

import React from 'react';
import { Sidebar } from '../components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#FAF6F0] font-sans antialiased text-[#3D2C2E]">
      {/* 固定左側邊欄 */}
      <Sidebar />

      {/* 右側主要內容區：移除 p-8/p-10 內縮與 max-w-7xl 限制，達到完全滿版 */}
      <main className="flex-1 overflow-y-auto w-full min-w-0">
        {children}
      </main>
    </div>
  );
}