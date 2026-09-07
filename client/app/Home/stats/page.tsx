'use client';

import React, { useState, useMemo, useRef } from 'react';
import { TaskStatsCard } from '../../components/stats/TaskStatsCard';
import { CategoryStatsCard } from '../../components/stats/CategoryStatsCard';
import { TagStatsCard } from '../../components/stats/TagStatsCard';
import { Calendar } from 'lucide-react';

export default function StatsPage() {
  // 移除 Custom，預設選取 'This Month'
  const [quickSelect, setQuickSelect] = useState<'Today' | 'This Week' | 'This Month' | null>('This Month');
  const [period, setPeriod] = useState<'Year' | 'Month' | 'Week' | 'Day'>('Month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // 用於觸發隱藏的 HTML5 date input 彈窗
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  // 1. 處理 Quick Select 點擊：同步更新 period 與 currentDate
  const handleQuickSelect = (item: 'Today' | 'This Week' | 'This Month') => {
    setQuickSelect(item);
    const now = new Date();

    if (item === 'Today') {
      setPeriod('Day');
      setCurrentDate(now);
    } else if (item === 'This Week') {
      setPeriod('Week');
      setCurrentDate(now);
    } else if (item === 'This Month') {
      setPeriod('Month');
      setCurrentDate(now);
    }
  };

  // 2. 處理手動選擇日期
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const selected = new Date(e.target.value);
    if (!isNaN(selected.getTime())) {
      setCurrentDate(selected);
      setQuickSelect(null); // 取消 Quick Select 按鈕的高亮狀態
    }
  };

  // 將 currentDate 轉換為 <input type="date" /> 要求的 "YYYY-MM-DD" 格式
  const formattedInputDate = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, '0');
    const d = String(currentDate.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [currentDate]);

  // 3. 動態計算目前選取的 Date Range 文字標籤
  const dateRangeLabel = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.toLocaleString('en-US', { month: 'short' });
    const fullMonth = currentDate.toLocaleString('en-US', { month: 'long' });
    const d = currentDate.getDate();

    if (period === 'Year') return `Jan 1 - Dec 31, ${y}`;
    if (period === 'Month') return `${fullMonth} 1 - ${fullMonth} ${new Date(y, currentDate.getMonth() + 1, 0).getDate()}, ${y}`;
    if (period === 'Week') {
      const start = new Date(currentDate);
      const day = start.getDay();
      const diffToMon = (day + 6) % 7;
      start.setDate(start.getDate() - diffToMon);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      const sMonth = start.toLocaleString('en-US', { month: 'short' });
      const eMonth = end.toLocaleString('en-US', { month: 'short' });
      return `${sMonth} ${start.getDate()} - ${eMonth} ${end.getDate()}, ${y}`;
    }
    return `${m} ${d}, ${y}`;
  }, [currentDate, period]);

  return (
    <div className="p-8 space-y-6 bg-[#FAF7F2] min-h-screen text-[#3D2C2E]">
      {/* Top Bar Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-2">
            Statistics 🐾
          </h1>
          <p className="text-sm font-bold text-[#8C7A6B] mt-1">
            Track your productivity and keep improving! 🧡
          </p>
        </div>
      </div>

      {/* Date Range & Quick Select 篩選列 */}
      <div className="bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        {/* Date Range 選擇器 */}
        <div className="flex items-center gap-3 text-xs font-black">
          <span className="text-[#8C7A6B]">Date Range</span>
          <div
            onClick={() => dateInputRef.current?.showPicker?.() || dateInputRef.current?.focus()}
            className="relative flex items-center gap-2 bg-[#FAF6F0] border border-[#EADBC8] px-3 py-2 rounded-2xl text-[#3D2C2E] cursor-pointer hover:bg-[#F4E2D8] transition-all"
          >
            <Calendar className="w-4 h-4 text-[#E07A5F]" />
            <span>{dateRangeLabel}</span>

            {/* 隱藏的原生 Date Input，點擊外層即可彈出日曆 */}
            <input
              ref={dateInputRef}
              type="date"
              value={formattedInputDate}
              onChange={handleDateChange}
              className="absolute inset-0 opacity-0 cursor-pointer pointer-events-auto"
            />
          </div>
        </div>

        {/* Quick Select 按鈕（已移除 Custom） */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-[#8C7A6B] mr-2">Quick Select</span>
          {(['Today', 'This Week', 'This Month'] as const).map((item) => (
            <button
              key={item}
              onClick={() => handleQuickSelect(item)}
              className={`px-4 py-2 text-xs font-black rounded-2xl transition-all cursor-pointer ${
                quickSelect === item
                  ? 'bg-[#FCE3D7] text-[#E07A5F] border border-[#E89874]'
                  : 'bg-[#FAF6F0] text-[#8C7A6B] border border-transparent hover:bg-[#F4E2D8]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* 1. 任務統計區塊 */}
      <TaskStatsCard
        period={period}
        setPeriod={setPeriod}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />

      {/* 2 & 3. 下方雙欄統計區塊 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryStatsCard period={period} currentDate={currentDate} />
        <TagStatsCard period={period} currentDate={currentDate} />
      </div>
    </div>
  );
}