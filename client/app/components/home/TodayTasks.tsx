'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LinearProgress } from '../ui/Progress';
import { TaskItem, TaskItemProps } from '../ui/TaskItem';
import { Plus, ArrowRight, Loader2, Sparkles } from 'lucide-react';

// Modal 元件
import { AddTaskModal } from '../modal/AddTaskModal';
import { CreateCategoryModal } from '../modal/CreateCategoryModal';
import { AddTagModal } from '../modal/AddTagModal';

export const TodayTasks: React.FC = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const [tasks, setTasks] = useState<TaskItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 控制 3 個 Modal 顯示狀態
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  // 日期比對輔助函式：判斷 Date 是否為今天
  const isSameDay = (dateStr?: string | Date) => {
    if (!dateStr) return false;
    const taskDate = new Date(dateStr);
    const today = new Date();
    return (
      taskDate.getFullYear() === today.getFullYear() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getDate() === today.getDate()
    );
  };

  // 1. 從後端抓取當天 Task 列表
  const fetchTodayTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const todayISO = new Date().toISOString().split('T')[0];

      const res = await fetch(`${API_URL}/api/task?date=${todayISO}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (res.ok && result.success) {
        const todayTasksList = result.data.filter((task: any) =>
          task.dueDate ? isSameDay(task.dueDate) : true
        );

        const mappedTasks: TaskItemProps[] = todayTasksList.map((task: any) => ({
          id: task.id,
          title: task.title,
          category: task.category?.name || 'General',
          tags: Array.isArray(task.tags)
            ? task.tags.map((tag: any) => (typeof tag === 'string' ? tag : tag.name))
            : [],
          completed: task.isCompleted ?? task.completed ?? false,
          icon: task.category?.icon || '🐾',
          iconBg: 'bg-[#FAF0E6]',
          isToday: true,
          onToggle: () => {},
        }));

        setTasks(mappedTasks);
      }
    } catch (err) {
      console.error('Failed to fetch today tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchTodayTasks();
  }, [fetchTodayTasks]);

  // 2. 切換 Task 完成狀態
  const toggleTask = async (id: string) => {
    const targetTask = tasks.find((t) => t.id === id);
    if (!targetTask) return;

    const nextCompletedState = !targetTask.completed;

    // 樂觀更新 (Optimistic UI)
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: nextCompletedState } : task
      )
    );

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_URL}/api/task/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isCompleted: nextCompletedState }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        // 🌟 關鍵發送：通知跨元件（包含 UpcomingTasks）同步更新
        window.dispatchEvent(new Event('task-updated'));

        if (nextCompletedState) {
          window.dispatchEvent(new Event('cat-food-updated'));
          window.dispatchEvent(new Event('tomatoes-updated'));
        }
      } else {
        // 若 API 回傳失敗，還原前端 State
        setTasks((prev) =>
          prev.map((task) =>
            task.id === id ? { ...task, completed: targetTask.completed } : task
          )
        );
        console.error('Failed to update task status:', result.error);
      }
    } catch (err) {
      console.error('Error toggling task:', err);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: targetTask.completed } : task
        )
      );
    }
  };

  // 新增 Task 後的 Callback：既抓 Today，也發廣播給 Upcoming
  const handleTaskAdded = () => {
    fetchTodayTasks();
    window.dispatchEvent(new Event('task-created'));
  };

  // 3. 計算完成任務數量與罐頭總數
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage =
    totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const baseCatFood = completedCount;
  const bonusCatFood = completedCount >= 7 ? 3 : 0;
  const totalCatFoodEarned = baseCatFood + bonusCatFood;

  return (
    <>
      <Card className="flex flex-col h-full justify-between">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-[#3D2C2E]">Today's Tasks</h2>
              <p className="text-xs font-bold text-[#8C7A6B] mt-1">
                <span className="text-[#E07A5F]">{completedCount}</span> / {totalTasks} completed
              </p>
            </div>

            {/* 新增任務按鈕 */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsAddTaskOpen(true)}
              leftIcon={<Plus className="w-4 h-4 text-[#E07A5F]" />}
              className="rounded-full bg-[#FDEFEA] hover:bg-[#FADCD3] border-none text-[#E07A5F] cursor-pointer"
            >
              Add Task
            </Button>
          </div>

          {/* Linear Progress & Percent */}
          <div className="flex items-center gap-3">
            <LinearProgress
              value={completedCount}
              max={totalTasks || 1}
              className="flex-1"
            />
            <span className="text-xs font-extrabold text-[#8C7A6B]">
              {completionPercentage}%
            </span>
          </div>

          {/* 今日貓罐頭計數獎勵卡片 */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFF9F3] border border-[#F5E6D8]">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl select-none">🥫</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-[#3D2C2E]">
                    Earned {totalCatFoodEarned} Cat Foods
                  </span>
                  {bonusCatFood > 0 && (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-[#E89874] text-white">
                      <Sparkles className="w-3 h-3" /> +3 Bonus!
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-bold text-[#A08D80]">
                  {completedCount >= 7
                    ? 'Goal reached! Extra 3 cat foods unlocked 🎉'
                    : `Complete ${7 - completedCount} more tasks to get +3 bonus cat foods!`}
                </p>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-8 text-[#8C7A6B] text-xs font-bold gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#E89874]" /> Loading tasks...
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-8 text-xs font-bold text-[#A08D80]">
                No tasks for today. Click "Add Task" to get started! 🐾
              </div>
            ) : (
              tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  {...task}
                  onToggle={() => toggleTask(task.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Footer Link - 跳轉至 /Home/tasks */}
        <div className="pt-4 text-center">
          <Link
            href="/Home/tasks"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#8C7A6B] hover:text-[#E07A5F] transition-colors cursor-pointer"
          >
            View All Tasks <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Card>

      {/* 掛載 Modal */}
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onTaskAdded={handleTaskAdded}
      />

      <CreateCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />

      <AddTagModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
      />
    </>
  );
};