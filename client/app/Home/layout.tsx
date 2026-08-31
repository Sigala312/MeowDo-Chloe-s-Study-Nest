'use client';

import React from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import Header from '../components/layout/Header'; // 請依據你的 Header 元件實際路徑調整
import { PageHeaderProvider } from '../components/context/PageHeaderContext'; // 請依據你的 Context 實際路徑調整

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageHeaderProvider>
      <div className="flex min-h-screen bg-[#FAF6F0] font-sans antialiased text-[#3D2C2E]">
        {/* 固定左側邊欄 */}
        <Sidebar />

        {/* 右側主要內容區 */}
        <main className="flex-1 overflow-y-auto w-full min-w-0 relative">
          {/* 全域頂部 Header (包含動態標題、通知按鈕與串接 API 的 DropdownMenu) */}
          <Header />

          {/* 頁面主要內容 */}
          {children}
        </main>
      </div>
    </PageHeaderProvider>
  );
}