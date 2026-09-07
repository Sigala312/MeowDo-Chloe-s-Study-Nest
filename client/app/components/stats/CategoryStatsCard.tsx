'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ListFilter, BookOpen, Code, Heart, User, Folder, Loader2, PawPrint } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const COLOR_PALETTE = ['#82A074', '#F4A261', '#E76F51', '#8AB17D', '#E07A5F', '#4B7B94', '#A08D80'];

export interface Task {
  id: string;
  title: string;
  dueDate?: string | null;
  createdAt?: string;
  isCompleted: boolean;
  category?: { id: string; name: string } | null;
}

interface CategoryStatsCardProps {
  period: 'Year' | 'Month' | 'Week' | 'Day';
  currentDate: Date;
}

export const CategoryStatsCard: React.FC<CategoryStatsCardProps> = ({
  period,
  currentDate,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // 當 period 或 currentDate 改變時觸發切換動畫
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [period, currentDate]);

  // 1. 撈取 API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        const res = await fetch(`${API_URL}/api/task`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) throw new Error('Failed to fetch tasks');
        const data = await res.json();

        const rawTasks = Array.isArray(data) ? data : data.tasks || data.data || [];
        setTasks(rawTasks);
      } catch (err) {
        console.error('Error fetching category stats:', err);
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // 2. 嚴格比對日期與計算分類
  const categoryData = useMemo(() => {
    if (!tasks || tasks.length === 0 || !currentDate) return [];

    const filtered = tasks.filter((task) => {
      const targetDateStr = task.dueDate || task.createdAt;
      if (!targetDateStr) return false;

      const tDate = new Date(targetDateStr);
      if (isNaN(tDate.getTime())) return false;

      const safeCurrentDate =
        currentDate instanceof Date && !isNaN(currentDate.getTime()) ? currentDate : new Date();

      const targetYear = tDate.getFullYear();
      const targetMonth = tDate.getMonth();

      const currYear = safeCurrentDate.getFullYear();
      const currMonth = safeCurrentDate.getMonth();

      if (period === 'Year') {
        return targetYear === currYear;
      }

      if (period === 'Month') {
        return targetYear === currYear && targetMonth === currMonth;
      }

      if (period === 'Week') {
        const start = new Date(safeCurrentDate);
        const day = start.getDay();
        const diffToMon = (day + 6) % 7;
        start.setDate(start.getDate() - diffToMon);
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        return tDate >= start && tDate <= end;
      }

      return (
        targetYear === currYear &&
        targetMonth === currMonth &&
        tDate.getDate() === safeCurrentDate.getDate()
      );
    });

    if (filtered.length === 0) return [];

    const counts: { [name: string]: number } = {};
    filtered.forEach((task) => {
      const catName = task.category?.name || 'Uncategorized';
      counts[catName] = (counts[catName] || 0) + 1;
    });

    const totalCount = filtered.length;

    return Object.entries(counts).map(([name, tasksCount], index) => {
      const percent = Math.round((tasksCount / totalCount) * 100);
      return {
        name,
        tasks: tasksCount,
        percent,
        color: COLOR_PALETTE[index % COLOR_PALETTE.length],
      };
    });
  }, [tasks, period, currentDate]);

  // 3. 動態渲染圓餅圖 Conic Gradient
  const conicGradientStyle = useMemo(() => {
    if (categoryData.length === 0) return 'conic-gradient(#EADBC8 0% 100%)';

    let cumulative = 0;
    const stops = categoryData.map((cat) => {
      const start = cumulative;
      cumulative += cat.percent;
      const end = cumulative > 99 ? 100 : cumulative;
      return `${cat.color} ${start}% ${end}%`;
    });

    return `conic-gradient(${stops.join(', ')})`;
  }, [categoryData]);

  const getCategoryIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('study')) return <BookOpen className="w-3.5 h-3.5" />;
    if (lower.includes('code') || lower.includes('coding')) return <Code className="w-3.5 h-3.5" />;
    if (lower.includes('health')) return <Heart className="w-3.5 h-3.5" />;
    if (lower.includes('person')) return <User className="w-3.5 h-3.5" />;
    return <Folder className="w-3.5 h-3.5" />;
  };

  return (
    <div className="bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-2">
        <ListFilter className="w-5 h-5 text-[#E07A5F]" />
        <h2 className="text-lg font-black text-[#3D2C2E]">Category Statistics</h2>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-[#8C7A6B] text-xs gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#E89874]" /> Loading category data...
        </div>
      ) : categoryData.length === 0 ? (
        <div className="text-center text-[#A08D80] py-12 font-bold text-xs">
          No category statistics found for this period.
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
            {/* 動態圓餅圖容器 */}
            <div
              className={`relative w-40 h-40 rounded-full flex items-center justify-center shadow-inner transition-all duration-700 ease-out transform ${
                isAnimating ? 'scale-95 opacity-80 rotate-180' : 'scale-100 opacity-100 rotate-0'
              }`}
              style={{ background: conicGradientStyle }}
            >
              {/* 中心貓爪圖示，同步反轉維持正向 */}
              <div className="w-16 h-16 bg-[#FFFDF9] border border-[#EADBC8] rounded-full flex items-center justify-center shadow-xs transform transition-transform duration-700 ease-out">
                <PawPrint
                  className={`w-6 h-6 text-[#DFA382] fill-[#DFA382] transition-transform duration-700 ${
                    isAnimating ? '-rotate-180 scale-110' : 'rotate-0 scale-100'
                  }`}
                />
              </div>
            </div>

            {/* 右側 Legend 列表 */}
            <div className="space-y-2.5 w-full sm:w-auto">
              {categoryData.map((cat) => (
                <div
                  key={cat.name}
                  className={`flex items-center justify-between gap-8 text-xs font-bold transition-all duration-500 ${
                    isAnimating ? 'opacity-50 translate-x-1' : 'opacity-100 translate-x-0'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full transition-colors duration-500"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-[#3D2C2E]">{cat.name}</span>
                  </div>
                  <span className="text-[#8C7A6B] font-black">{cat.percent}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* 底部卡片區塊 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categoryData.map((cat) => (
              <div
                key={cat.name}
                className={`bg-[#FAF6F0]/80 border border-[#EADBC8] rounded-2xl p-3 space-y-1 transition-all duration-500 ${
                  isAnimating ? 'opacity-60 scale-95' : 'opacity-100 scale-100'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#3D2C2E]">
                  {getCategoryIcon(cat.name)}
                  <span className="truncate">{cat.name}</span>
                </div>
                <p className="text-xs font-extrabold text-[#8C7A6B]">
                  <span className="text-sm text-[#3D2C2E] font-black mr-1">{cat.tasks}</span> tasks
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};