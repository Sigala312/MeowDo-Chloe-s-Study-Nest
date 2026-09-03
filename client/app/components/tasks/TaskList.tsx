'use client';

import React from 'react';
import { Plus, Star, Check, Loader2 } from 'lucide-react';

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
  filterStatus: 'All' | 'To Do' | 'Completed';
  onFilterChange: (status: 'All' | 'To Do' | 'Completed') => void;
  onToggleTask: (id: string, currentStatus: boolean) => void;
  onToggleStar: (id: string) => void;
  onOpenAddTask: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading,
  filterStatus,
  onFilterChange,
  onToggleTask,
  onToggleStar,
  onOpenAddTask,
}) => {
  // 根據選擇的頁籤進行過濾
  const displayedTasks = tasks.filter((task) => {
    if (filterStatus === 'To Do') return !task.isCompleted;
    if (filterStatus === 'Completed') return task.isCompleted;
    return true;
  });

  return (
    <div className="bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-black text-[#3D2C2E]">Tasks</h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF6F0] text-[#8C7A6B] border border-[#EADBC8]">
            {tasks.length} tasks
          </span>
        </div>

        <button
          onClick={onOpenAddTask}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#FCE3D7] hover:bg-[#FAD0BE] text-[#E07A5F] rounded-2xl text-xs font-black transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      {/* Status Filter Tabs (Only All, To Do, Completed) */}
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

      {/* Task List Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-[#8C7A6B] text-xs font-bold gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#E89874]" /> Loading tasks...
        </div>
      ) : (
        <div className="space-y-2.5">
          {displayedTasks.length === 0 ? (
            <p className="text-xs text-[#A08D80] font-bold py-6 text-center">
              No tasks found.
            </p>
          ) : (
            displayedTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  task.isCompleted
                    ? 'bg-[#FAF6F0]/40 border-[#EADBC8] opacity-70'
                    : 'bg-[#FAF6F0]/60 border-[#EADBC8] hover:border-[#E89874]'
                }`}
              >
                {/* Left: Checkbox & Title */}
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

                  <span className="text-lg">{task.category?.icon || '📖'}</span>

                  <span
                    className={`text-xs font-extrabold ${
                      task.isCompleted ? 'text-[#8C7A6B] line-through' : 'text-[#3D2C2E]'
                    }`}
                  >
                    {task.title}
                  </span>
                </div>

                {/* Right: Category, Date & Star */}
                <div className="flex items-center gap-3">
                  {task.category && (
                    <span className="px-2.5 py-1 rounded-xl text-[10px] font-black bg-[#EBF3E8] text-[#558B2F]">
                      {task.category.name}
                    </span>
                  )}

                  <span className="text-[11px] font-bold text-[#8C7A6B]">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'No date'}
                  </span>

                  <button
                    onClick={() => onToggleStar(task.id)}
                    className="text-[#D0C2B4] hover:text-[#F4A261] transition-colors cursor-pointer"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        task.isStarred ? 'fill-[#F4A261] text-[#F4A261]' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};