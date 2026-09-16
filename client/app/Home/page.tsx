'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { TodayTasks } from '../components/home/TodayTasks';
import { UpcomingTasks } from '../components/home/UpcomingTasks';
import { DailyQuote } from '../components/home/DailyQuote';
import { usePageHeader } from '../components/context/PageHeaderContext';

interface Task {
  id: string;
  status?: string;
  isCompleted?: boolean;
  dueDate: string;
}

export default function DashboardPage() {
  const { setHeader } = usePageHeader();
  const [userName, setUserName] = useState<string>('');
  const [remainingTasksCount, setRemainingTasksCount] = useState<number>(0);
  const [totalTodayTasksCount, setTotalTodayTasksCount] = useState<number>(0); // 👈 新增：紀錄當日總任務數
  const [isLoadingTasks, setIsLoadingTasks] = useState<boolean>(true);
  const [greeting, setGreeting] = useState<string>('Good morning');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // 1. 動態計算時間招呼語
  const updateGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  // 輔助函式：安全取得本地 YYYY-MM-DD (避免 toISOString 時區偏差)
  const getLocalDateString = (d: Date = new Date()) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 2. 取得今日任務並計算數量
  const fetchTodayTasks = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const todayISO = getLocalDateString();
      const res = await fetch(`${API_URL}/api/task?date=${todayISO}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      if (res.ok && result.success) {
        const tasks = result.data || [];
        const today = new Date();

        // 嚴格比對年、月、日
        const todayTasks = tasks.filter((task: any) => {
          if (!task.dueDate) return true;
          const d = new Date(task.dueDate);
          return (
            d.getFullYear() === today.getFullYear() &&
            d.getMonth() === today.getMonth() &&
            d.getDate() === today.getDate()
          );
        });

        // 記錄當天任務總數
        setTotalTodayTasksCount(todayTasks.length);

        const unfinishedCount = todayTasks.filter(
          (task: any) => !task.isCompleted && task.status !== 'COMPLETED'
        ).length;

        setRemainingTasksCount(unfinishedCount);
      }
    } catch (err) {
      console.error('Failed to fetch today tasks count:', err);
    } finally {
      setIsLoadingTasks(false);
    }
  }, [API_URL]);

  // 設定 Layout Header、抓取資料與設定定時更新
  useEffect(() => {
    setHeader({ title: '', subtitle: '' });
    updateGreeting();

    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch(`${API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await res.json();
        if (res.ok && result.success && result.data?.name) {
          setUserName(result.data.name);
        }
      } catch (err) {
        console.error('Failed to fetch user name in DashboardPage:', err);
      }
    };

    fetchUserProfile();
    fetchTodayTasks();

    // 每 1 分鐘檢查一次招呼語
    const greetingInterval = setInterval(updateGreeting, 60000);

    // 監聽任務變更事件
    const handleTaskChange = () => {
      fetchTodayTasks();
    };

    window.addEventListener('task-created', handleTaskChange);
    window.addEventListener('task-updated', handleTaskChange);

    return () => {
      clearInterval(greetingInterval);
      window.removeEventListener('task-created', handleTaskChange);
      window.removeEventListener('task-updated', handleTaskChange);
    };
  }, [setHeader, fetchTodayTasks, updateGreeting]);

  return (
    <div className="relative w-full min-h-screen p-6 md:p-8">
      {/* 全螢幕背景圖 */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/sabina-sturzu-sHtJeNIzPe8-unsplash.jpg"
          alt="Cozy Room Background"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-[#FFFDF9]/10" />
      </div>

      {/* 主要內容區域 */}
      <div className="relative z-10 space-y-6 max-w-[1400px] mx-auto">
        {/* 動態歡迎招呼語 */}
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-[#3D2C2E] flex items-center gap-2 drop-shadow-xs">
            {greeting}, {userName || 'there'}! 
          </h2>
          <p className="text-xs md:text-sm font-bold text-[#6C5B52] mt-1 flex items-center gap-1">
            {isLoadingTasks ? (
              <span>Checking your tasks for today...</span>
            ) : remainingTasksCount > 0 ? (
              <>
                You have{' '}
                <span className="text-[#E07A5F] font-black">
                  {remainingTasksCount}
                </span>{' '}
                {remainingTasksCount === 1 ? 'task' : 'tasks'} left for today.
                Let's go! <span className="text-[#E07A5F]">♡</span>
              </>
            ) : totalTodayTasksCount > 0 ? (
              <>
                All tasks completed for today! You rock!{' '}
                <span className="text-[#E07A5F]">🎉</span>
              </>
            ) : (
              <>
                No tasks scheduled for today. Have a peaceful day!{' '}
                <span className="text-[#E07A5F]">✨</span>
              </>
            )}
          </p>
        </div>

        {/* 主內容 Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <TodayTasks />
          </div>

          <div className="space-y-6">
            <UpcomingTasks />
            <DailyQuote />
          </div>
        </div>
      </div>
    </div>
  );
}