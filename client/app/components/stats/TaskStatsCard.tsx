'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ClipboardList, CheckCircle2, Circle, AlertCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface Task {
  id: string;
  title: string;
  dueDate?: string;
  isCompleted: boolean;
  category?: { id: string; name: string };
}

interface DailyStat {
  dateKey: string;
  displayDate: string;
  completed: number;
  total: number;
  rate: number;
}

export const TaskStatsCard: React.FC = () => {
  const [period, setPeriod] = useState<'Year' | 'Month' | 'Week' | 'Day'>('Month');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // 1. 帶上 Auth Token 向 /api/task 發送請求
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

        if (res.status === 401) {
          throw new Error('Unauthorized: 尚未登入或 Token 已過期');
        }

        if (!res.ok) throw new Error('Failed to fetch tasks');
        
        const data = await res.json();

        // 核心修復：防禦性檢查，確保寫入 state 的必定是 Array
        if (Array.isArray(data)) {
          setTasks(data);
        } else if (Array.isArray(data.tasks)) {
          setTasks(data.tasks); // 相容 { tasks: [...] }
        } else if (Array.isArray(data.data)) {
          setTasks(data.data);   // 相容 { data: [...] }
        } else {
          console.error('API 回傳格式非陣列:', data);
          setTasks([]);          // 若格式不符，預設給空陣列避免壞頁
        }
      } catch (err) {
        console.error('Error fetching task stats:', err);
        setTasks([]);            // 發生錯誤時設為空陣列
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // 2. 切換上一頁/下一頁時間範圍
  const handlePrev = () => {
    const next = new Date(currentDate);
    if (period === 'Year') next.setFullYear(next.getFullYear() - 1);
    else if (period === 'Month') next.setMonth(next.getMonth() - 1);
    else if (period === 'Week') next.setDate(next.getDate() - 7);
    else next.setDate(next.getDate() - 1);
    setCurrentDate(next);
  };

  const handleNext = () => {
    const next = new Date(currentDate);
    if (period === 'Year') next.setFullYear(next.getFullYear() + 1);
    else if (period === 'Month') next.setMonth(next.getMonth() + 1);
    else if (period === 'Week') next.setDate(next.getDate() + 7);
    else next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  // 3. 依據時間顆粒計算過濾範圍與標題
  const dateRangeLabel = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.toLocaleString('en-US', { month: 'long' });
    const d = currentDate.getDate();

    if (period === 'Year') return `${y}`;
    if (period === 'Month') return `${m} ${y}`;
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

  // 4. 計算統計數據 (4格概覽 + 日期明細)
  const { filteredTasks, dailyStats, overview } = useMemo(() => {
    const now = new Date();

    const filtered = tasks.filter((task) => {
      if (!task.dueDate) return false;
      const tDate = new Date(task.dueDate);

      if (period === 'Year') {
        return tDate.getFullYear() === currentDate.getFullYear();
      }
      if (period === 'Month') {
        return (
          tDate.getFullYear() === currentDate.getFullYear() &&
          tDate.getMonth() === currentDate.getMonth()
        );
      }
      if (period === 'Week') {
        const start = new Date(currentDate);
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
        tDate.getFullYear() === currentDate.getFullYear() &&
        tDate.getMonth() === currentDate.getMonth() &&
        tDate.getDate() === currentDate.getDate()
      );
    });

    let completedCount = 0;
    let inProgressCount = 0;
    let overdueCount = 0;

    filtered.forEach((t) => {
      if (t.isCompleted) {
        completedCount++;
      } else {
        if (t.dueDate && new Date(t.dueDate) < now) {
          overdueCount++;
        } else {
          inProgressCount++;
        }
      }
    });

    const map = new Map<string, { total: number; completed: number; displayDate: string }>();

    filtered.forEach((task) => {
      if (!task.dueDate) return;
      const tDate = new Date(task.dueDate);

      let groupKey = '';
      let displayDate = '';

      if (period === 'Day') {
        const h = String(tDate.getHours()).padStart(2, '0');
        groupKey = `${h}:00`;
        displayDate = `${h}:00`;
      } else if (period === 'Year') {
        const monthName = tDate.toLocaleString('en-US', { month: 'short' });
        groupKey = `${tDate.getFullYear()}-${tDate.getMonth()}`;
        displayDate = monthName;
      } else {
        const monthName = tDate.toLocaleString('en-US', { month: 'short' });
        groupKey = `${tDate.getFullYear()}-${tDate.getMonth()}-${tDate.getDate()}`;
        displayDate = `${monthName} ${tDate.getDate()}`;
      }

      const curr = map.get(groupKey) || { total: 0, completed: 0, displayDate };
      curr.total += 1;
      if (task.isCompleted) curr.completed += 1;
      map.set(groupKey, curr);
    });

    const statsList: DailyStat[] = Array.from(map.entries()).map(([key, item]) => {
      const rate = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
      return {
        dateKey: key,
        displayDate: item.displayDate,
        completed: item.completed,
        total: item.total,
        rate,
      };
    });

    return {
      filteredTasks: filtered,
      dailyStats: statsList,
      overview: {
        completed: completedCount,
        inProgress: inProgressCount,
        overdue: overdueCount,
        total: filtered.length,
      },
    };
  }, [tasks, period, currentDate]);

  return (
    <div className="bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-6 shadow-sm space-y-6">
      {/* Title */}
      <div className="flex items-center gap-2">
        <ClipboardList className="w-5 h-5 text-[#E07A5F]" />
        <h2 className="text-lg font-black text-[#3D2C2E]">Task Statistics</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* 左側：統計開關 & 數據小卡 */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#FAF6F0] p-1 rounded-2xl border border-[#EADBC8] flex items-center justify-between">
            {(['Year', 'Month', 'Week', 'Day'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`flex-1 py-1.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  period === p
                    ? 'bg-[#FCE3D7] text-[#E07A5F] shadow-xs'
                    : 'text-[#8C7A6B] hover:text-[#3D2C2E]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 text-xs font-black text-[#3D2C2E]">
            <button
              onClick={handlePrev}
              className="p-1 hover:bg-[#FAF6F0] rounded-lg transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-[#8C7A6B]" />
            </button>
            <span>{dateRangeLabel}</span>
            <button
              onClick={handleNext}
              className="p-1 hover:bg-[#FAF6F0] rounded-lg transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-[#8C7A6B]" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-[#FAF6F0]/80 border border-[#EADBC8] rounded-2xl p-2.5">
              <div className="w-6 h-6 mx-auto rounded-full bg-[#EBF3E8] text-[#558B2F] flex items-center justify-center mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <p className="text-[10px] font-bold text-[#8C7A6B]">Completed</p>
              <p className="text-base font-black text-[#3D2C2E]">{overview.completed}</p>
            </div>

            <div className="bg-[#FAF6F0]/80 border border-[#EADBC8] rounded-2xl p-2.5">
              <div className="w-6 h-6 mx-auto rounded-full bg-[#EBF1F5] text-[#4B7B94] flex items-center justify-center mb-1">
                <Circle className="w-3.5 h-3.5" />
              </div>
              <p className="text-[10px] font-bold text-[#8C7A6B]">In Progress</p>
              <p className="text-base font-black text-[#3D2C2E]">{overview.inProgress}</p>
            </div>

            <div className="bg-[#FAF6F0]/80 border border-[#EADBC8] rounded-2xl p-2.5">
              <div className="w-6 h-6 mx-auto rounded-full bg-[#FDEAE8] text-[#D9534F] flex items-center justify-center mb-1">
                <AlertCircle className="w-3.5 h-3.5" />
              </div>
              <p className="text-[10px] font-bold text-[#8C7A6B]">Overdue</p>
              <p className="text-base font-black text-[#3D2C2E]">{overview.overdue}</p>
            </div>

            <div className="bg-[#FAF6F0]/80 border border-[#EADBC8] rounded-2xl p-2.5">
              <div className="w-6 h-6 mx-auto rounded-full bg-[#FAF0E6] text-[#A08D80] flex items-center justify-center mb-1">
                <ClipboardList className="w-3.5 h-3.5" />
              </div>
              <p className="text-[10px] font-bold text-[#8C7A6B]">Total</p>
              <p className="text-base font-black text-[#3D2C2E]">{overview.total}</p>
            </div>
          </div>
        </div>

        {/* 中間：表格明細 */}
        <div className="lg:col-span-5 bg-[#FAF6F0]/60 border border-[#EADBC8] rounded-2xl p-4 text-xs font-bold space-y-3 min-h-[220px] flex flex-col justify-between">
          <div className="space-y-3">
            <div className="grid grid-cols-4 text-[#8C7A6B] pb-2 border-b border-[#EADBC8]">
              <span>Date</span>
              <span className="text-center">Completed</span>
              <span className="text-center">Total</span>
              <span className="text-right">Completion Rate</span>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8 text-[#8C7A6B] text-xs gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#E89874]" /> Loading statistics...
              </div>
            ) : dailyStats.length === 0 ? (
              <div className="text-center text-[#A08D80] py-8 font-bold">
                No tasks found for this period.
              </div>
            ) : (
              dailyStats.slice(0, 5).map((item) => (
                <div key={item.dateKey} className="grid grid-cols-4 items-center text-[#3D2C2E]">
                  <span>{item.displayDate}</span>
                  <span className="text-center font-extrabold">{item.completed}</span>
                  <span className="text-center font-extrabold">{item.total}</span>
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-2 rounded-full bg-[#EADBC8]/50 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.rate === 100 ? 'bg-[#82A074]' : 'bg-[#E89874]'
                        }`}
                        style={{ width: `${item.rate}%` }}
                      />
                    </div>
                    <span className="w-7 text-right font-black">{item.rate}%</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {dailyStats.length > 5 && (
            <p className="text-center text-[#A08D80] font-black tracking-widest pt-1">...</p>
          )}
        </div>

        {/* 右側：吉祥物 */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center relative pt-2">
          <div className="bg-[#FAF6F0] border border-[#EADBC8] rounded-2xl px-3 py-1.5 text-[11px] font-black text-[#3D2C2E] shadow-xs mb-1 relative z-10">
            Good job! Keep going! ❤️
          </div>
          <img
            src="/螢幕擷取畫面_2026-09-04_153513-removebg-preview.png"
            alt="Mascot Cat"
            className="w-32 h-auto object-contain select-none"
          />
        </div>
      </div>
    </div>
  );
};