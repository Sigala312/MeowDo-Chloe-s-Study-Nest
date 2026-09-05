'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TaskCalendar } from '../../components/tasks/TaskCalendar';
import { TaskList, Task } from '../../components/tasks/TaskList';
import { AddTaskModal } from '../../components/modal/AddTaskModal';

export default function TasksPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // --- States ---
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'Day' | 'Week' | 'Month'>('Month');

  // 當前日曆顯示的月份/年份基準 Date
  const [currentDate, setCurrentDate] = useState(new Date());

  // 新增：目前被點選的具體日期（字串格式 YYYY-MM-DD，預設為今天）
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const [filterStatus, setFilterStatus] = useState<'All' | 'To Do' | 'Completed'>('All');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  // --- API ---
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/task`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setTasks(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleToggleTask = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, isCompleted: nextStatus } : t)));

    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/task/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isCompleted: nextStatus }),
      });
    } catch (err) {
      console.error('Failed to update task:', err);
      fetchTasks();
    }
  };

  const handleToggleStar = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, isStarred: !t.isStarred } : t)));
  };

  // 處理點擊 Today 鍵：重置 currentDate 與 selectedDateStr
  const handleTodayClick = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(today.toISOString().split('T')[0]);
  };

  return (
    <div className="p-8 space-y-6 bg-[#FAF7F2] min-h-screen text-[#3D2C2E]">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black flex items-center gap-2">Tasks 🐾</h1>
        <p className="text-sm font-bold text-[#8C7A6B] mt-1">
          Plan your day, stay focused, and get things done!
        </p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 左側：日曆區塊 */}
        <div className="lg:col-span-6">
          <TaskCalendar
            currentDate={currentDate}
            tasks={tasks}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onPrevMonth={() =>
              setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
            }
            onNextMonth={() =>
              setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
            }
            onToday={handleTodayClick}
            onDateSelect={setSelectedDateStr}
          />
        </div>

        {/* 右側：任務清單 (跟隨 viewMode 與 selectedDateStr 連動) */}
        <div className="lg:col-span-6">
          <TaskList
            tasks={tasks}
            isLoading={isLoading}
            viewMode={viewMode}
            selectedDateStr={selectedDateStr}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            onToggleTask={handleToggleTask}
            onToggleStar={handleToggleStar}
            onOpenAddTask={() => setIsAddTaskOpen(true)}
          />
        </div>
      </div>

      {/* 新增任務彈窗 */}
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onTaskAdded={fetchTasks}
      />
    </div>
  );
}