'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Tag, Loader2, PawPrint } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const COLOR_PALETTE = [
  '#E07A5F',
  '#F4A261',
  '#E76F51',
  '#82A074',
  '#4B7B94',
  '#A08D80',
  '#D97706',
  '#65A30D',
];

export interface TaskTag {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate?: string;
  isCompleted: boolean;
  tags?: TaskTag[];
}

export interface TagStatItem {
  id: string;
  name: string;
  tasks: number;
  percent: number;
  color: string;
}

export interface TagStatsCardProps {
  period?: 'Year' | 'Month' | 'Week' | 'Day';
  currentDate?: Date;
}

export const TagStatsCard: React.FC<TagStatsCardProps> = ({
  period = 'Month',
  currentDate = new Date(),
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const safeDate = useMemo(() => {
    return currentDate instanceof Date && !isNaN(currentDate.getTime()) ? currentDate : new Date();
  }, [currentDate]);

  // 當 period 或 currentDate 改變時，觸發輕微縮放與淡入動畫
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [period, currentDate]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const isValidToken = token && /^[\x00-\xFF]*$/.test(token);

        const res = await fetch(`${API_URL}/api/task`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(isValidToken ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) throw new Error('Failed to fetch tasks');
        const data = await res.json();

        if (Array.isArray(data)) {
          setTasks(data);
        } else if (Array.isArray(data.tasks)) {
          setTasks(data.tasks);
        } else if (Array.isArray(data.data)) {
          setTasks(data.data);
        } else {
          setTasks([]);
        }
      } catch (err) {
        console.error('Error fetching tag stats:', err);
        setTasks([]);
      }finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const { tagStats, conicGradientStyle } = useMemo(() => {
    const filteredTasks = tasks.filter((task) => {
      if (!task.dueDate) return false;
      const tDate = new Date(task.dueDate);
      if (isNaN(tDate.getTime())) return false;

      if (period === 'Year') return tDate.getFullYear() === safeDate.getFullYear();
      if (period === 'Month') {
        return (
          tDate.getFullYear() === safeDate.getFullYear() &&
          tDate.getMonth() === safeDate.getMonth()
        );
      }
      if (period === 'Week') {
        const start = new Date(safeDate);
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
        tDate.getFullYear() === safeDate.getFullYear() &&
        tDate.getMonth() === safeDate.getMonth() &&
        tDate.getDate() === safeDate.getDate()
      );
    });

    const tagCountMap = new Map<string, { id: string; name: string; count: number }>();
    let totalTagOccurrences = 0;

    filteredTasks.forEach((task) => {
      if (Array.isArray(task.tags) && task.tags.length > 0) {
        task.tags.forEach((tag) => {
          const existing = tagCountMap.get(tag.name) || { id: tag.id, name: tag.name, count: 0 };
          existing.count += 1;
          tagCountMap.set(tag.name, existing);
          totalTagOccurrences += 1;
        });
      }
    });

    const statsList: TagStatItem[] = Array.from(tagCountMap.values())
      .sort((a, b) => b.count - a.count)
      .map((item, index) => {
        const percent = totalTagOccurrences > 0 ? Math.round((item.count / totalTagOccurrences) * 100) : 0;
        const tagNameWithHash = item.name.startsWith('#') ? item.name : `#${item.name}`;
        return {
          id: item.id,
          name: tagNameWithHash,
          tasks: item.count,
          percent,
          color: COLOR_PALETTE[index % COLOR_PALETTE.length],
        };
      });

    let currentPercentage = 0;
    const gradientStops: string[] = [];

    statsList.forEach((stat) => {
      const start = currentPercentage;
      const end = currentPercentage + stat.percent;
      gradientStops.push(`${stat.color} ${start}% ${end}%`);
      currentPercentage = end;
    });

    if (gradientStops.length > 0 && currentPercentage < 100) {
      const lastColor = statsList[statsList.length - 1].color;
      gradientStops.push(`${lastColor} ${currentPercentage}% 100%`);
    }

    const conicStyle =
      gradientStops.length > 0
        ? `conic-gradient(${gradientStops.join(', ')})`
        : 'conic-gradient(#EADBC8 0% 100%)';

    return {
      tagStats: statsList,
      conicGradientStyle: conicStyle,
    };
  }, [tasks, period, safeDate]);

  return (
    <div className="bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-2">
        <Tag className="w-5 h-5 text-[#E07A5F]" />
        <h2 className="text-lg font-black text-[#3D2C2E]">Tag Statistics</h2>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-[#8C7A6B] text-xs gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#E89874]" /> Loading tag statistics...
        </div>
      ) : tagStats.length === 0 ? (
        <div className="text-center text-[#A08D80] py-16 font-bold text-xs">
          No tagged tasks found for this period. 🐾
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
              {/* 中心貓爪圖示，保持正面不旋轉 */}
              <div className="w-16 h-16 bg-[#FFFDF9] border border-[#EADBC8] rounded-full flex items-center justify-center shadow-xs transform transition-transform duration-700 ease-out">
                <PawPrint
                  className={`w-6 h-6 text-[#DFA382] fill-[#DFA382] transition-transform duration-700 ${
                    isAnimating ? '-rotate-180 scale-110' : 'rotate-0 scale-100'
                  }`}
                />
              </div>
            </div>

            {/* 右側 Legend 列表（加入彈性平滑過渡） */}
            <div className="space-y-2.5 w-full sm:w-auto">
              {tagStats.map((tag) => (
                <div
                  key={tag.name}
                  className={`flex items-center justify-between gap-8 text-xs font-bold transition-all duration-500 ${
                    isAnimating ? 'opacity-50 translate-x-1' : 'opacity-100 translate-x-0'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full transition-colors duration-500"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className="text-[#3D2C2E]">{tag.name}</span>
                  </div>
                  <span className="text-[#8C7A6B] font-black">{tag.percent}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* 底部卡片列表 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {tagStats.map((tag) => (
              <div
                key={tag.name}
                className={`bg-[#FAF6F0]/80 border border-[#EADBC8] rounded-2xl p-3 space-y-1 transition-all duration-500 ${
                  isAnimating ? 'opacity-60 scale-95' : 'opacity-100 scale-100'
                }`}
              >
                <div className="inline-block px-2 py-0.5 rounded-lg text-[10px] font-black bg-[#FDF3E7] text-[#E07A5F]">
                  {tag.name}
                </div>
                <p className="text-xs font-extrabold text-[#8C7A6B]">
                  <span className="text-sm text-[#3D2C2E] font-black mr-1">{tag.tasks}</span> tasks
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};