'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, LogOut } from 'lucide-react';

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string | null;
}

interface UserDropdownMenuProps {
  user?: UserProfile | null;
  onLogout?: () => void;
  align?: 'left' | 'right';
  className?: string;
}

export const DropdownMenu: React.FC<UserDropdownMenuProps> = ({
  user,
  onLogout,
  align = 'right',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 點擊外部自動關閉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* 觸發按鈕（頭像） */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative w-10 h-10 rounded-2xl bg-[#F4E2D8] border-2 border-[#EADBC8] flex items-center justify-center font-extrabold text-[#E89874] overflow-hidden shadow-xs cursor-pointer hover:border-[#E07A5F] transition-all outline-none"
      >
        {user?.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.name || 'User Avatar'}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          user?.name?.[0]?.toUpperCase() || '🐱'
        )}
      </button>

      {/* 下拉浮層 */}
      {isOpen && (
        <div
          className={`absolute z-50 mt-2 w-64 bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-4 shadow-xl animate-in fade-in zoom-in-95 duration-150 ${
            align === 'right' ? 'right-0' : 'left-0'
          } ${className}`}
        >
          {/* 頂部個人資訊區塊 */}
          <div className="flex items-center gap-3 pb-3">
            <div className="relative w-12 h-12 rounded-full bg-[#F4E2D8] flex items-center justify-center text-xl font-black text-[#E89874] overflow-hidden border border-[#EADBC8] shrink-0">
              {user?.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name || 'User Avatar'}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                user?.name?.[0]?.toUpperCase() || '🐱'
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-[#3D2C2E] truncate">
                  {user?.name || 'Loading...'}
                </span>
                <span className="text-sm">🐾</span>
              </div>
              <p className="text-xs text-[#8C7A6B] font-medium truncate">
                {user?.email || ''}
              </p>
            </div>
          </div>

          <div className="h-px bg-[#F2E8DC] my-1" />

          {/* 功能選項列表 */}
          <div className="py-1 space-y-1">
            <Link
              href="/Home/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-transparent text-[#3D2C2E] text-xs font-extrabold hover:bg-[#FDF3E7] transition-all"
            >
              <User className="w-4 h-4 text-[#6C5B52]" />
              <span>Personal Information</span>
            </Link>

            <div className="h-px bg-[#F2E8DC] my-1" />

            {/* Log out */}
            <button
              type="button"
              onClick={() => {
                onLogout?.();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[#E07A5F] hover:bg-[#FDF3E7] text-xs font-extrabold transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-[#E07A5F]" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};