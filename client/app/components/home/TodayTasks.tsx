'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LinearProgress } from '../ui/Progress';
import { TaskItem, TaskItemProps } from '../ui/TaskItem';
import { Plus, ArrowRight } from 'lucide-react';

// 1. 引入 3 個 Modal 元件 (請依據你的實際目錄位置微調路徑)
import { AddTaskModal } from '../modal/AddTaskModal';
import { CreateCategoryModal } from '../modal/CreateCategoryModal';
import { AddTagModal } from '../modal/AddTagModal';

const initialTasks: TaskItemProps[] = [
  {
    id: '1',
    title: 'Read 20 pages of a book',
    category: 'Study',
    pomodoros: 2,
    completed: false,
    icon: '📖',
    iconBg: 'bg-[#F9EFE6]',
    isToday: true,
    onToggle: () => {},
  },
  {
    id: '2',
    title: 'Review vocabulary',
    category: 'Study',
    pomodoros: 1,
    completed: false,
    icon: 'Aa',
    iconBg: 'bg-[#F2EAE1]',
    isToday: true,
    onToggle: () => {},
  },
  {
    id: '3',
    title: 'Morning exercise',
    category: 'Health',
    pomodoros: 1,
    completed: true,
    icon: '🏋️',
    iconBg: 'bg-[#EBF3E8]',
    isToday: true,
    onToggle: () => {},
  },
  {
    id: '4',
    title: 'Practice React API',
    category: 'Coding',
    pomodoros: 3,
    completed: false,
    icon: '</>',
    iconBg: 'bg-[#EDEAF4]',
    isToday: true,
    onToggle: () => {},
  },
  {
    id: '5',
    title: 'Write diary',
    category: 'Personal',
    pomodoros: 1,
    completed: false,
    icon: '📔',
    iconBg: 'bg-[#FAF0E6]',
    isToday: true,
    onToggle: () => {},
  },
];

export const TodayTasks: React.FC = () => {
  const [tasks, setTasks] = useState(initialTasks);

  // 2. 控制 3 個 Modal 的顯示狀態
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // 3. 處理提交新 Task 的邏輯
  const handleAddTask = (newTaskData: any) => {
    const newTask: TaskItemProps = {
      id: Date.now().toString(),
      title: newTaskData.taskName,
      category: newTaskData.category,
      pomodoros: 1,
      completed: false,
      icon: '🐾',
      iconBg: 'bg-[#FAF0E6]',
      isToday: true,
      onToggle: () => {},
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <>
      <Card className="flex flex-col h-full justify-between">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-[#3D2C2E]">Today's Tasks</h2>
              <p className="text-xs font-bold text-[#8C7A6B] mt-1">
                <span className="text-[#E07A5F]">{completedCount}</span> / {tasks.length} completed
              </p>
            </div>
            {/* 按下按鈕打開 AddTaskModal */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsAddTaskOpen(true)}
              leftIcon={<Plus className="w-4 h-4 text-[#E07A5F]" />}
              className="rounded-full bg-[#FDEFEA] hover:bg-[#FADCD3] border-none text-[#E07A5F]"
            >
              Add Task
            </Button>
          </div>

          {/* Linear Progress */}
          <div className="flex items-center gap-3">
            <LinearProgress value={completedCount} max={tasks.length} className="flex-1" />
            <span className="text-xs font-extrabold text-[#8C7A6B]">
              {Math.round((completedCount / tasks.length) * 100)}%
            </span>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskItem key={task.id} {...task} onToggle={toggleTask} />
            ))}
          </div>
        </div>

        {/* Footer Link */}
        <div className="pt-4 text-center">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#8C7A6B] hover:text-[#E07A5F] transition-colors cursor-pointer"
          >
            View All Tasks <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </Card>

      {/* 4. 掛載 3 個 Modal */}
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onAddTask={handleAddTask}
        onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
        onOpenTagModal={() => setIsTagModalOpen(true)}
      />

      <CreateCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onAddCategory={(cat) => console.log('New Category:', cat)}
      />

      <AddTagModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        onAddTag={(tag) => console.log('New Tag:', tag)}
      />
    </>
  );
};