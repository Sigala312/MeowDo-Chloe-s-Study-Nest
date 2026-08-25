'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { ChevronDown, Check, User, LogOut } from 'lucide-react';

/* ==========================================================================
   1. 使用者個人選單 (User Dropdown Menu) - 包含頭像資訊卡片與操作選單
   ========================================================================== */

export interface UserProfile {
  name: string;
  email: string;
  avatarIcon?: ReactNode;
}

interface UserDropdownMenuProps {
  user?: UserProfile;
  onLogout?: () => void;
  align?: 'left' | 'right';
  className?: string;
}

export const DropdownMenu: React.FC<UserDropdownMenuProps> = ({
  user = {
    name: 'Chloe',
    email: 'chloe@email.com',
  },
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
        className="w-10 h-10 rounded-2xl bg-[#F4E2D8] border-2 border-[#EADBC8] flex items-center justify-center text-xl overflow-hidden shadow-xs cursor-pointer hover:border-[#E07A5F] transition-all outline-none"
      >
        🐱
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
            <div className="w-12 h-12 rounded-full bg-[#1C1C1C] flex items-center justify-center text-2xl overflow-hidden border border-[#EADBC8] shrink-0">
              🐱
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-[#3D2C2E] truncate">
                  {user.name}
                </span>
                <span className="text-sm">🐶</span>
              </div>
              <p className="text-xs text-[#8C7A6B] font-medium truncate">
                {user.email}
              </p>
            </div>
          </div>

          <div className="h-px bg-[#F2E8DC] my-1" />

          {/* 功能選項列表 */}
          <div className="py-1 space-y-1">
            {/* Personal Information (Hover 時顯示橘粉色底色) */}
            <Link
              href="Home/settings"
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

/* ==========================================================================
   2. 表單單選下拉選單 (Select Component) - 用於表單數值切換（如語言、排序等）
   ========================================================================== */

export interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full ${className}`} ref={selectRef}>
      {/* 選擇框本體 */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-[#FAF6F0] border text-xs font-bold transition-all cursor-pointer outline-none ${
          isOpen
            ? 'border-[#E07A5F] ring-2 ring-[#E07A5F]/20'
            : 'border-[#EADBC8] hover:border-[#D0BBA2]'
        } ${disabled ? 'opacity-50 cursor-not-allowed bg-[#F5EFE8]' : ''}`}
      >
        <span className="flex items-center gap-2 text-[#3D2C2E] truncate">
          {selectedOption?.icon && <span>{selectedOption.icon}</span>}
          {selectedOption ? selectedOption.label : <span className="text-[#8C7A6B]">{placeholder}</span>}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#8C7A6B] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#E07A5F]' : ''
          }`}
        />
      </button>

      {/* 下拉選單列表 */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-[#FFFDF9] border border-[#EADBC8] rounded-2xl p-1.5 shadow-xl max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FDF3E7] text-[#3D2C2E]'
                    : 'text-[#6C5B52] hover:bg-[#FAF6F0] hover:text-[#3D2C2E]'
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  {option.icon && <span>{option.icon}</span>}
                  <span>{option.label}</span>
                </span>
                {isSelected && <Check className="w-4 h-4 text-[#E07A5F]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};