'use client';

import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface Task {
  id: string;
  title: string;
  category?: Category;
  dueDate?: string;
  isCompleted: boolean;
  isStarred?: boolean;
}

interface TaskCalendarProps {
  currentDate: Date;
  tasks?: Task[];
  categories?: Category[];
  viewMode: 'Day' | 'Week' | 'Month';
  onViewModeChange: (mode: 'Day' | 'Week' | 'Month') => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onDateSelect?: (dateStr: string) => void; // 點擊特定日期格子的 callback (可選)
}

const FALLBACK_PALETTE = [
  '#4E73DF',
  '#1CC88A',
  '#36B9CC',
  '#F6C23E',
  '#E74A3B',
  '#6F42C1',
  '#FD7E14',
  '#20C997',
];

const getCategoryStyle = (colorHex?: string) => {
  const hex = colorHex && colorHex.trim() !== '' ? colorHex : '#4E73DF';

  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((char) => char + char).join('');
  }

  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);

    return {
      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.15)`,
      color: `rgb(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(0, b - 30)})`,
      dotColor: `#${cleanHex}`,
    };
  }

  return {
    backgroundColor: 'rgba(78, 115, 223, 0.15)',
    color: '#2e59d9',
    dotColor: '#4E73DF',
  };
};

// --- 時區安全與週別計算輔助函式 ---

// 取得 local Date 物件（避免 UTC 時間戳偏差）
const parseLocalDate = (dateStr: string): Date => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

// 計算日期所在的週（以 Mon 為一週起點）
const getWeekRange = (date: Date) => {
  const target = new Date(date);
  const day = target.getDay();
  const diffToMon = (day + 6) % 7; // 週一 offset

  const startOfWeek = new Date(target);
  startOfWeek.setDate(target.getDate() - diffToMon);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return { startOfWeek, endOfWeek };
};

export const TaskCalendar: React.FC<TaskCalendarProps> = ({
  currentDate,
  tasks = [],
  categories = [],
  viewMode,
  onViewModeChange,
  onPrevMonth,
  onNextMonth,
  onToday,
  onDateSelect,
}) => {
  // 記錄當前選取的日期 (預設為今天或傳入的 currentDate)
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);

  const monthTitle = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  // --- 動態計算日曆格子 ---
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const startOffset = (firstDayOfWeek + 6) % 7;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const calendarCells: Array<{
    dateNumber: number;
    isCurrentMonth: boolean;
    dateString: string | null;
  }> = [];

  // 1. 上個月尾端
  for (let i = startOffset - 1; i >= 0; i--) {
    const pDay = prevMonthDays - i;
    const pMonth = month === 0 ? 12 : month;
    const pYear = month === 0 ? year - 1 : year;
    const m = String(pMonth).padStart(2, '0');
    const d = String(pDay).padStart(2, '0');

    calendarCells.push({
      dateNumber: pDay,
      isCurrentMonth: false,
      dateString: `${pYear}-${m}-${d}`,
    });
  }

  // 2. 當月日期
  for (let day = 1; day <= daysInMonth; day++) {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    calendarCells.push({
      dateNumber: day,
      isCurrentMonth: true,
      dateString: `${year}-${m}-${d}`,
    });
  }

  // 3. 下個月開頭
  const totalCells = calendarCells.length > 35 ? 42 : 35;
  const remainingCells = totalCells - calendarCells.length;
  for (let day = 1; day <= remainingCells; day++) {
    const nMonth = month + 2 > 12 ? 1 : month + 2;
    const nYear = month + 2 > 12 ? year + 1 : year;
    const m = String(nMonth).padStart(2, '0');
    const d = String(day).padStart(2, '0');

    calendarCells.push({
      dateNumber: day,
      isCurrentMonth: false,
      dateString: `${nYear}-${m}-${d}`,
    });
  }

  // --- 選取週期的判定邏輯 ---
  const selectedDateObj = useMemo(
    () => parseLocalDate(selectedDateStr),
    [selectedDateStr]
  );
  const weekRange = useMemo(
    () => getWeekRange(selectedDateObj),
    [selectedDateObj]
  );

  // 檢查某個 dateString 是否需要套用高亮
  const isCellHighlighted = (dateString: string | null) => {
    if (!dateString) return false;

    // 「月」模式：完全不顯示篩選高亮
    if (viewMode === 'Month') return false;

    // 「日」模式：只高亮選取的當天
    if (viewMode === 'Day') {
      return dateString === selectedDateStr;
    }

    // 「週」模式：高亮選取日期所在的那一週 (Mon~Sun)
    if (viewMode === 'Week') {
      const cellDate = parseLocalDate(dateString);
      return cellDate >= weekRange.startOfWeek && cellDate <= weekRange.endOfWeek;
    }

    return false;
  };

  // --- 動態提取分類 ---
  const activeCategories = useMemo(() => {
    const map = new Map<string, Category>();

    categories.forEach((cat, idx) => {
      map.set(cat.id, {
        ...cat,
        color: cat.color || FALLBACK_PALETTE[idx % FALLBACK_PALETTE.length],
      });
    });

    tasks.forEach((task) => {
      if (task.category && !map.has(task.category.id)) {
        map.set(task.category.id, {
          ...task.category,
          color:
            task.category.color ||
            FALLBACK_PALETTE[map.size % FALLBACK_PALETTE.length],
        });
      }
    });

    return Array.from(map.values());
  }, [tasks, categories]);

  const categoryColorMap = useMemo(() => {
    const map = new Map<string, string>();
    activeCategories.forEach((cat) => {
      if (cat.color) map.set(cat.id, cat.color);
    });
    return map;
  }, [activeCategories]);

  // 點擊「Today」時同步重置選取日期
  const handleTodayClick = () => {
    setSelectedDateStr(todayStr);
    onToday();
  };

  return (
    <div className="bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-6 shadow-sm space-y-6">
      {/* Calendar Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Mode Switcher */}
        <div className="flex items-center bg-[#FAF6F0] p-1 rounded-2xl border border-[#EADBC8]">
          {(['Day', 'Week', 'Month'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              className={`px-3.5 py-1.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                viewMode === mode
                  ? 'bg-[#FDF3E7] text-[#3D2C2E] shadow-xs border border-[#EADBC8]'
                  : 'text-[#8C7A6B] hover:text-[#3D2C2E]'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevMonth}
            className="p-1.5 rounded-xl hover:bg-[#FAF6F0] text-[#8C7A6B] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-black min-w-[90px] text-center">
            {monthTitle}
          </span>
          <button
            onClick={onNextMonth}
            className="p-1.5 rounded-xl hover:bg-[#FAF6F0] text-[#8C7A6B] cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Today Button */}
        <button
          onClick={handleTodayClick}
          className="px-4 py-1.5 text-xs font-black border border-[#E89874] text-[#E07A5F] bg-[#FFF9F3] hover:bg-[#FDF3E7] rounded-2xl transition-all cursor-pointer"
        >
          Today
        </button>
      </div>

      {/* Grid Header */}
      <div>
        <div className="grid grid-cols-7 text-center text-xs font-extrabold text-[#8C7A6B] mb-2">
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          <div className="text-[#E07A5F]">Sun</div>
        </div>

        {/* Dynamic Dates Grid */}
        <div className="grid grid-cols-7 border-t border-l border-[#F2E8DC] rounded-2xl overflow-hidden bg-white">
          {calendarCells.map((cell, idx) => {
            const dayTasks = cell.dateString
              ? tasks.filter((t) => t.dueDate && t.dueDate.startsWith(cell.dateString!))
              : [];

            const isToday = cell.dateString === todayStr;
            const isHighlighted = isCellHighlighted(cell.dateString);

            return (
              <div
                key={idx}
                onClick={() => {
                  if (cell.dateString) {
                    setSelectedDateStr(cell.dateString);
                    onDateSelect?.(cell.dateString);
                  }
                }}
                className={`h-20 p-1 border-r border-b border-[#F2E8DC] text-xs font-bold transition-all cursor-pointer relative ${
                  !cell.isCurrentMonth ? 'text-[#D0C2B4] bg-[#FAF6F0]/30' : 'text-[#3D2C2E]'
                } ${
                  /* 動態高亮背景：Day/Week 模式符合條件顯示柔和奶油色 bg-[#FFF3E0] */
                  isHighlighted ? '!bg-[#FDF3E7] ring-1 ring-[#E89874]/40 z-10' : ''
                }`}
              >
                {/* Date Number */}
                <div className="flex items-center justify-between">
                  {isToday ? (
                    <span className="inline-block w-5 h-5 text-center leading-5 rounded-full bg-[#E89874] text-white font-black text-[10px]">
                      {cell.dateNumber}
                    </span>
                  ) : (
                    <span
                      className={`px-1 ${
                        isHighlighted ? 'text-[#E07A5F] font-black' : ''
                      }`}
                    >
                      {cell.dateNumber}
                    </span>
                  )}
                </div>

                {/* Task Items in Cell */}
                <div className="mt-1 space-y-1 overflow-y-auto max-h-[48px] no-scrollbar">
                  {dayTasks.slice(0, 2).map((task) => {
                    const categoryColor =
                      task.category?.color ||
                      (task.category?.id ? categoryColorMap.get(task.category.id) : undefined);

                    const style = getCategoryStyle(categoryColor);

                    return (
                      <div
                        key={task.id}
                        style={{
                          backgroundColor: style.backgroundColor,
                          color: style.color,
                        }}
                        className="text-[9px] font-black px-1.5 py-0.5 rounded-md truncate flex items-center gap-1 transition-colors"
                        title={task.title}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: style.dotColor }}
                        />
                        <span className="truncate">{task.title}</span>
                      </div>
                    );
                  })}

                  {dayTasks.length > 2 && (
                    <div className="text-[8px] font-extrabold text-[#8C7A6B] px-1">
                      +{dayTasks.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Category Legend */}
      <div className="flex items-center gap-6 pt-2 text-xs font-bold text-[#6C5B52] flex-wrap">
        {activeCategories.length > 0 ? (
          activeCategories.map((cat) => (
            <span key={cat.id} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              {cat.name}
            </span>
          ))
        ) : (
          <span className="text-[#8C7A6B] font-normal italic">No categories yet</span>
        )}
      </div>
    </div>
  );
};