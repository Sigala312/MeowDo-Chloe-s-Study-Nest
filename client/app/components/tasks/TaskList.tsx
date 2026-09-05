'use client';

import React, { useMemo } from 'react';
import { Plus, Check, Loader2, Calendar, Clock } from 'lucide-react';

export interface Task {
  id: string;
  title: string;
  category?: { id: string; name: string; icon?: string; color?: string };
  dueDate?: string;
  isCompleted: boolean;
  isStarred?: boolean;
}

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  viewMode: 'Day' | 'Week' | 'Month';
  selectedDateStr: string; // 當前選取的日期 YYYY-MM-DD
  filterStatus: 'All' | 'To Do' | 'Completed';
  onFilterChange: (status: 'All' | 'To Do' | 'Completed') => void;
  onToggleTask: (id: string, currentStatus: boolean) => void;
  onToggleStar?: (id: string) => void;
  onOpenAddTask: () => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// 輔助函式：取得週一與週日範圍
const getWeekRange = (dateStr: string) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  const day = target.getDay();
  const diffToMon = (day + 6) % 7;

  const startOfWeek = new Date(target);
  startOfWeek.setDate(target.getDate() - diffToMon);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return { startOfWeek, endOfWeek };
};

// 格式化日期與時間標籤 (例: "May 12, 14:30")
const formatTaskDateTime = (dueDateStr?: string) => {
  if (!dueDateStr) return 'No date';

  const dateObj = new Date(dueDateStr);
  if (isNaN(dateObj.getTime())) return 'No date';

  const dateFormatted = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  if (dueDateStr.includes('T')) {
    const timeFormatted = dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return `${dateFormatted}, ${timeFormatted}`;
  }

  return dateFormatted;
};

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading,
  viewMode,
  selectedDateStr,
  filterStatus,
  onFilterChange,
  onToggleTask,
  onOpenAddTask,
}) => {
  // 1. 根據 Filter (All / To Do / Completed) 過濾
  const statusFilteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filterStatus === 'To Do') return !task.isCompleted;
      if (filterStatus === 'Completed') return task.isCompleted;
      return true;
    });
  }, [tasks, filterStatus]);

  // 2. 根據 viewMode & selectedDateStr 篩選並進行分組
  const { dateRangeTitle, groupedTasks, totalFilteredCount } = useMemo(() => {
    const [y, m, d] = selectedDateStr.split('-').map(Number);
    const selectedDate = new Date(y, m - 1, d);

    // --- DAY 模式：以小時 (00:00 ~ 23:00) 分組 ---
if (viewMode === 'Day') {
  // 修正：使用 Date 比對當地日期的 YYYY-MM-DD，避免跨時區日期偏差
  const dayTasks = statusFilteredTasks.filter((t) => {
    if (!t.dueDate) return false;
    const taskDate = new Date(t.dueDate);
    const yyyy = taskDate.getFullYear();
    const mm = String(taskDate.getMonth() + 1).padStart(2, '0');
    const dd = String(taskDate.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}` === selectedDateStr;
  });

  const map = new Map<string, Task[]>();
  HOURS.forEach((h) => map.set(h, []));

  dayTasks.forEach((task) => {
    let hourLabel = '09:00';
    if (task.dueDate) {
      const taskDate = new Date(task.dueDate);
      if (!isNaN(taskDate.getTime())) {
        // ✅ 使用 getHours() 取得本地時區的小時 (UTC+8 會自動加 8 小時轉成 10:00)
        const localHour = taskDate.getHours();
        hourLabel = `${String(localHour).padStart(2, '0')}:00`;
      }
    }
    const list = map.get(hourLabel) || [];
    map.set(hourLabel, [...list, task]);
  });

  return {
    dateRangeTitle: selectedDateStr,
    groupedTasks: Array.from(map.entries()).map(([label, items]) => ({ label, items })),
    totalFilteredCount: dayTasks.length,
  };
}

    // --- WEEK 模式：以星期幾 (Mon ~ Sun) 分組 ---
    if (viewMode === 'Week') {
      const { startOfWeek, endOfWeek } = getWeekRange(selectedDateStr);

      const weekTasks = statusFilteredTasks.filter((t) => {
        if (!t.dueDate) return false;
        const [ty, tm, td] = t.dueDate.split('T')[0].split('-').map(Number);
        const taskDate = new Date(ty, tm - 1, td);
        return taskDate >= startOfWeek && taskDate <= endOfWeek;
      });

      const map = new Map<string, Task[]>();
      DAYS_OF_WEEK.forEach((day) => map.set(day, []));

      weekTasks.forEach((task) => {
        if (!task.dueDate) return;
        const [ty, tm, td] = task.dueDate.split('T')[0].split('-').map(Number);
        const taskDate = new Date(ty, tm - 1, td);
        const dayIdx = (taskDate.getDay() + 6) % 7; // Mon = 0
        const dayName = DAYS_OF_WEEK[dayIdx];
        const list = map.get(dayName) || [];
        map.set(dayName, [...list, task]);
      });

      const startStr = startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const endStr = endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      return {
        dateRangeTitle: `${startStr} - ${endStr}`,
        groupedTasks: Array.from(map.entries()).map(([label, items]) => ({ label, items })),
        totalFilteredCount: weekTasks.length,
      };
    }

    // --- MONTH 模式：按月份篩選，並以日期 (YYYY-MM-DD) 分組 ---
    const monthPrefix = `${y}-${String(m).padStart(2, '0')}`;
    const monthTasks = statusFilteredTasks.filter(
      (t) => t.dueDate && t.dueDate.startsWith(monthPrefix)
    );

    const map = new Map<string, Task[]>();
    monthTasks.forEach((task) => {
      const dateKey = task.dueDate ? task.dueDate.split('T')[0] : 'Unscheduled';
      const list = map.get(dateKey) || [];
      map.set(dateKey, [...list, task]);
    });

    const monthTitle = selectedDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    return {
      dateRangeTitle: monthTitle,
      groupedTasks: Array.from(map.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([label, items]) => ({ label, items })),
      totalFilteredCount: monthTasks.length,
    };
  }, [statusFilteredTasks, viewMode, selectedDateStr]);

  // 單一任務卡片元件
  const renderTaskItem = (task: Task) => (
    <div
      key={task.id}
      className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
        task.isCompleted
          ? 'bg-[#FAF6F0]/40 border-[#EADBC8] opacity-70'
          : 'bg-[#FAF6F0]/60 border-[#EADBC8] hover:border-[#E89874]'
      }`}
    >
      {/* 左側：完成勾選、分類圖示、任務標題 */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggleTask(task.id, task.isCompleted)}
          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
            task.isCompleted
              ? 'bg-[#E07A5F] border-[#E07A5F] text-white'
              : 'border-[#C8B8A6] bg-white hover:border-[#E07A5F]'
          }`}
        >
          {task.isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>
        <span className="text-base">{task.category?.icon || '📖'}</span>
        <span
          className={`text-xs font-extrabold ${
            task.isCompleted ? 'text-[#8C7A6B] line-through' : 'text-[#3D2C2E]'
          }`}
        >
          {task.title}
        </span>
      </div>

      {/* 右側：分類名稱、日期與時間 */}
      <div className="flex items-center gap-2.5">
        {task.category && (
          <span className="px-2.5 py-1 rounded-xl text-[10px] font-black bg-[#EBF3E8] text-[#558B2F]">
            {task.category.name}
          </span>
        )}

        {/* 日期與時間標籤 */}
        <div className="flex items-center gap-1 text-[11px] font-bold text-[#8C7A6B] bg-[#FAF6F0] px-2.5 py-1 rounded-xl border border-[#EADBC8]">
          <Clock className="w-3 h-3 text-[#E07A5F]" />
          <span>{formatTaskDateTime(task.dueDate)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#E07A5F]" />
          <h2 className="text-lg font-black text-[#3D2C2E]">{dateRangeTitle}</h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF6F0] text-[#8C7A6B] border border-[#EADBC8]">
            {totalFilteredCount} tasks
          </span>
        </div>

        <button
          onClick={onOpenAddTask}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#FCE3D7] hover:bg-[#FAD0BE] text-[#E07A5F] rounded-2xl text-xs font-black transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['All', 'To Do', 'Completed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => onFilterChange(status)}
            className={`px-3.5 py-1.5 text-xs font-black rounded-2xl transition-all cursor-pointer ${
              filterStatus === status
                ? 'bg-[#FDF3E7] border border-[#E89874] text-[#3D2C2E]'
                : 'bg-[#FAF6F0] border border-transparent text-[#8C7A6B] hover:bg-[#F4E2D8]'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-[#8C7A6B] text-xs font-bold gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#E89874]" /> Loading tasks...
        </div>
      ) : totalFilteredCount === 0 ? (
        <p className="text-xs text-[#A08D80] font-bold py-8 text-center">
          No tasks found for this period.
        </p>
      ) : (
        <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4 no-scrollbar">
          {groupedTasks.map((group) => {
            if (viewMode === 'Day' && group.items.length === 0) return null;

            return (
              <div key={group.label} className="space-y-2">
                {/* Group Header (時間/星期/日期) */}
                <div className="flex items-center gap-2 sticky top-0 bg-[#FFFDF9] py-1 z-10">
                  <span className="text-xs font-black text-[#E07A5F] bg-[#FAF6F0] px-2.5 py-1 rounded-xl border border-[#EADBC8]">
                    {group.label}
                  </span>
                  <div className="h-[1px] bg-[#F2E8DC] grow" />
                </div>

                {/* Items */}
                <div className="space-y-2 pl-2">
                  {group.items.length > 0 ? (
                    group.items.map(renderTaskItem)
                  ) : (
                    <div className="text-[11px] text-[#C0B0A0] italic py-1 pl-2">
                      No tasks scheduled
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};