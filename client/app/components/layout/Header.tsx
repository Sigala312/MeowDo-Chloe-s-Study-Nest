'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import { usePageHeader } from '../context/PageHeaderContext';
import { DropdownMenu, UserProfile } from '../ui/DropdownMenu';

export default function Header() {
  const router = useRouter();
  const { title, subtitle } = usePageHeader();
  const [user, setUser] = useState<UserProfile | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch(`${API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await res.json();
        if (res.ok && result.success) {
          setUser({
            name: result.data.name,
            email: result.data.email,
            avatarUrl: result.data.avatarUrl,
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile in Header:', err);
      }
    };

    fetchUserProfile();
    window.addEventListener('user-profile-updated', fetchUserProfile);
    return () => {
      window.removeEventListener('user-profile-updated', fetchUserProfile);
    };
  }, [API_URL]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    // 使用 absolute 讓 Header 浮在頁面上方，zIndex 設高，不佔用垂直空間
    <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-8 pt-6 pb-2 pointer-events-none">
      {/* 只有當 title 有值且不為空字串時才渲染左側標題 */}
      <div className="pointer-events-auto">
        {title && (
          <h1 className="text-2xl md:text-3xl font-black text-[#3D2C2E] flex items-center gap-2">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-xs md:text-sm font-bold text-[#8C7A6B] mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* 右上角按鈕組（恢復點擊事件） */}
      <div className="flex items-center gap-3 pointer-events-auto ml-auto">
        <button
          type="button"
          className="p-2.5 rounded-2xl bg-[#FFFDF9]/80 backdrop-blur-md border border-[#EADBC8] text-[#6C5B52] hover:bg-white transition-all relative shadow-xs cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#E07A5F] rounded-full" />
        </button>

        <DropdownMenu user={user} onLogout={handleLogout} align="right" />
      </div>
    </div>
  );
}