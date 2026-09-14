'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { TodayTasks } from '../components/home/TodayTasks';
import { UpcomingTasks } from '../components/home/UpcomingTasks';
import { DailyQuote } from '../components/home/DailyQuote';
import { usePageHeader } from '../components/context/PageHeaderContext'; // 引入 Header Context

interface Task {
  id: string;
  status: string;
  dueDate: string;
}

export default function DashboardPage() {
  const { setHeader } = usePageHeader();
  const [userName, setUserName] = useState<string>('');
  const [remainingTasksCount, setRemainingTasksCount] = useState<number>(0);
  const [isLoadingTasks, setIsLoadingTasks] = useState<boolean>(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // 取得今日任務並計算未完成數量
  const fetchTodayTasks = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${API_URL}/api/task/today`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      if (res.ok && result.success) {
        const tasks: Task[] = result.data || [];
        const unfinishedCount = tasks.filter(
          (task) => task.status !== 'COMPLETED'
        ).length;
        setRemainingTasksCount(unfinishedCount);
      }
    } catch (err) {
      console.error('Failed to fetch today tasks count:', err);
    } finally {
      setIsLoadingTasks(false);
    }
  }, [API_URL]);

  // 1. 設定 Layout Header 的全域標題，並抓取使用者名稱與今日任務
  useEffect(() => {
    setHeader({ title: '', subtitle: '' });

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

    // 監聽任務變更事件，即時更新招呼語的剩餘數量
    const handleTaskChange = () => {
      fetchTodayTasks();
    };

    window.addEventListener('task-created', handleTaskChange);
    window.addEventListener('task-updated', handleTaskChange);

    return () => {
      window.removeEventListener('task-created', handleTaskChange);
      window.removeEventListener('task-updated', handleTaskChange);
    };
  }, [setHeader, fetchTodayTasks]);

  return (
    <div className="relative w-full min-h-screen p-6 md:p-8">
      {/* 1. 全螢幕背景圖 */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/sabina-sturzu-sHtJeNIzPe8-unsplash.jpg"
          alt="Cozy Room Background"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        {/* 微光透色 */}
        <div className="absolute inset-0 bg-[#FFFDF9]/10" />
      </div>

      {/* 2. 主要內容區域 */}
      <div className="relative z-10 space-y-6 max-w-[1400px] mx-auto">
        {/* 歡迎招呼語 */}
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-[#3D2C2E] flex items-center gap-2 drop-shadow-xs">
            Good morning, {userName || 'there'}! ☀️
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
            ) : (
              <>
                All tasks completed for today! You rock!{' '}
                <span className="text-[#E07A5F]">🎉</span>
              </>
            )}
          </p>
        </div>

        {/* 主內容 Layout（維持你原有的區塊大小與 grid-cols-3） */}
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