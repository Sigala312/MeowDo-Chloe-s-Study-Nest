'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '../ui/Card';
import { ArrowRight, Calendar, Loader2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  dueDate: string | Date;
  isCompleted?: boolean;
  completed?: boolean;
}

interface UpcomingGroup {
  dateKey: string;
  dateLabel: string;
  items: { id: string; title: string; isCompleted: boolean }[];
}

export const UpcomingTasks: React.FC = () => {
  const router = useRouter();
  const [upcomingGroups, setUpcomingGroups] = useState<UpcomingGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // 取得本地 YYYY-MM-DD 字串
  const getLocalDateKey = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 格式化日期標頭 (例: Today (Aug 17), Tomorrow (Aug 18), Mon (Aug 19))
  const getDateLabel = (targetDate: Date, today: Date): string => {
    const targetDateOnly = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const diffTime = targetDateOnly.getTime() - todayOnly.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    const formattedDate = targetDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    if (diffDays === 0) return `Today (${formattedDate})`;
    if (diffDays === 1) return `Tomorrow (${formattedDate})`;

    const weekday = targetDate.toLocaleDateString('en-US', { weekday: 'short' });
    return `${weekday} (${formattedDate})`;
  };

  // 傳入 showLoading 參數：背景重抓資料時不顯示轉圈圈，避免畫面閃爍
  const fetchUpcomingTasks = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_URL}/api/task`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const result = await res.json();
      const rawTasks: Task[] = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result)
        ? result
        : [];

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const day3 = new Date(today);
      day3.setDate(today.getDate() + 2);

      const groupsMap: { [key: string]: UpcomingGroup } = {};

      for (let i = 0; i < 3; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const dateKey = getLocalDateKey(d);
        const label = getDateLabel(d, today);

        groupsMap[dateKey] = {
          dateKey,
          dateLabel: label,
          items: [],
        };
      }

      rawTasks.forEach((task) => {
        if (!task.dueDate) return;

        // 相容字串與 Date 物件，避免 UTC 偏移造成日期差一天
        const taskDate = new Date(task.dueDate);
        const taskDateOnly = new Date(
          taskDate.getFullYear(),
          taskDate.getMonth(),
          taskDate.getDate()
        );

        if (taskDateOnly >= today && taskDateOnly <= day3) {
          const dateKey = getLocalDateKey(taskDateOnly);
          if (groupsMap[dateKey]) {
            groupsMap[dateKey].items.push({
              id: task.id,
              title: task.title,
              isCompleted: !!(task.isCompleted ?? task.completed),
            });
          }
        }
      });

      const formattedGroups = Object.values(groupsMap).filter(
        (group) => group.items.length > 0
      );

      setUpcomingGroups(formattedGroups);
    } catch (err) {
      console.error('Failed to fetch upcoming tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchUpcomingTasks(true);

    // 重新抓取時靜默更新（不彈 Loader）
    const handleTaskUpdate = () => fetchUpcomingTasks(false);

    // 監聽各種可能的 Task 變更事件與視窗 Focus
    window.addEventListener('task-updated', handleTaskUpdate);
    window.addEventListener('task-created', handleTaskUpdate);
    window.addEventListener('task-deleted', handleTaskUpdate);
    window.addEventListener('tasks-changed', handleTaskUpdate);
    window.addEventListener('focus', handleTaskUpdate);

    return () => {
      window.removeEventListener('task-updated', handleTaskUpdate);
      window.removeEventListener('task-created', handleTaskUpdate);
      window.removeEventListener('task-deleted', handleTaskUpdate);
      window.removeEventListener('tasks-changed', handleTaskUpdate);
      window.removeEventListener('focus', handleTaskUpdate);
    };
  }, [fetchUpcomingTasks]);

  return (
    <Card className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold text-[#3D2C2E]">Upcoming</h3>
        <button
          type="button"
          onClick={() => router.push('/Home/tasks')}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#8C7A6B] hover:text-[#E07A5F] transition-colors cursor-pointer group"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>View Calendar</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Date Groups Container */}
      <div className="bg-[#FAF5EE]/70 rounded-2xl p-4 space-y-3.5 border border-[#EADBC8]/40 min-h-[120px] flex flex-col justify-center">
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-5 h-5 animate-spin text-[#E89874]" />
          </div>
        ) : upcomingGroups.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-xs font-bold text-[#8C7A6B]">No upcoming tasks</p>
            <p className="text-[11px] text-[#A08D80] mt-0.5">
              Enjoy your free days! 🐾
            </p>
          </div>
        ) : (
          upcomingGroups.map((group, groupIdx) => (
            <div key={`group-${group.dateKey}-${groupIdx}`} className="space-y-2">
              <span className="text-xs font-extrabold text-[#8C7A6B] block">
                {group.dateLabel}
              </span>
              <div className="space-y-1.5">
                {group.items.map((item, itemIdx) => (
                  <div
                    key={item.id ? `task-${item.id}` : `task-${group.dateKey}-${itemIdx}`}
                    className="flex items-center gap-2 text-xs font-bold text-[#3D2C2E]"
                  >
                    <div
                      className={`w-4 h-4 rounded-md border-2 shrink-0 flex items-center justify-center ${
                        item.isCompleted
                          ? 'bg-[#E89874] border-[#E89874] text-white'
                          : 'border-[#D5C4B3] bg-white'
                      }`}
                    >
                      {item.isCompleted && <span className="text-[10px]">✓</span>}
                    </div>
                    <span
                      className={
                        item.isCompleted
                          ? 'line-through text-[#A08D80] font-normal'
                          : ''
                      }
                    >
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};