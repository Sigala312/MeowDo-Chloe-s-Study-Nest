'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, Plus } from 'lucide-react';
import { CreateCategoryModal } from './CreateCategoryModal';
import { AddTagModal } from './AddTagModal';
import { Button } from '../ui/Button'; 

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: any) => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
}) => {
  const [taskName, setTaskName] = useState('');
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Study', icon: '📖' },
    { id: '2', name: 'Health', icon: '🦾' },
    { id: '3', name: 'Coding', icon: '💻' },
    { id: '4', name: 'Life', icon: '🏠' },
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Study');
  const [tags, setTags] = useState<string[]>(['#React', '#Frontend']);
  const [dueDate, setDueDate] = useState('2026-05-19');
  const [dueTime, setDueTime] = useState('10:00 AM');

  // 控制子彈窗開關
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleCreateCategory = (newCat: { name: string; icon: string }) => {
    const categoryItem = { id: Date.now().toString(), ...newCat };
    setCategories((prev) => [...prev, categoryItem]);
    setSelectedCategory(newCat.name);
  };

  const handleAddTag = (newTag: string) => {
    if (!tags.includes(newTag)) {
      setTags((prev) => [...prev, newTag]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    onAddTask({
      taskName,
      category: selectedCategory,
      tags,
      dueDate,
      dueTime,
    });

    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4">
        <div className="w-full max-w-md bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-black text-[#3D2C2E]">Add New Task</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="p-1 h-auto w-auto rounded-full text-[#8C7A6B] hover:bg-[#FAF6F0]"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Task Name */}
            <div>
              <label className="block text-xs font-extrabold text-[#3D2C2E] mb-1.5">Task Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Read 20 pages of a book"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF6F0] border border-[#EADBC8] text-xs font-bold text-[#3D2C2E] outline-none focus:border-[#E07A5F]"
                />
                <span className="absolute right-3 top-2.5 text-base pointer-events-none">🐱</span>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-extrabold text-[#3D2C2E] mb-1.5">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer ${
                      selectedCategory === cat.name
                        ? 'bg-[#FDF3E7] border-[#E89874] text-[#3D2C2E] shadow-xs'
                        : 'bg-[#FAF6F0] border-[#EADBC8] text-[#6C5B52] hover:bg-[#F4E2D8]'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCategoryModalOpen(true)}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  className="border-dashed border-[#D0BBA2] bg-white text-[#8C7A6B] hover:bg-[#FAF6F0] hover:border-[#D0BBA2] text-xs py-2 px-3 font-extrabold"
                >
                  Add Category
                </Button>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-extrabold text-[#3D2C2E] mb-1.5">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-[#FDF3E7] border border-[#E89874] text-xs font-extrabold text-[#3D2C2E]"
                  >
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="cursor-pointer">
                      <X className="w-3 h-3 text-[#8C7A6B] hover:text-[#3D2C2E]" />
                    </button>
                  </span>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTagModalOpen(true)}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  className="border-dashed border-[#D0BBA2] bg-white text-[#8C7A6B] hover:bg-[#FAF6F0] hover:border-[#D0BBA2] text-xs py-1.5 px-3 font-extrabold"
                >
                  Add Tag
                </Button>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-extrabold text-[#3D2C2E] mb-1.5">Due Date</label>
                <div className="relative">
                  <input
                    type="text"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-[#FAF6F0] border border-[#EADBC8] text-xs font-bold text-[#3D2C2E] outline-none"
                  />
                  <Calendar className="w-4 h-4 text-[#8C7A6B] absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#3D2C2E] mb-1.5">Time (Optional)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-[#FAF6F0] border border-[#EADBC8] text-xs font-bold text-[#3D2C2E] outline-none"
                  />
                  <Clock className="w-4 h-4 text-[#8C7A6B] absolute left-3 top-3" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-3">
              <Button
                type="button"
                variant="secondary"
                fullWidth
                onClick={onClose}
                className="bg-[#FAF6F0] border-[#EADBC8] text-[#6C5B52] hover:bg-[#EADBC8] text-xs font-black py-3"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                className="bg-[#E89874] hover:bg-[#d88763] text-white border-none shadow-xs text-xs font-black py-3"
              >
                Add Task 🐾
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* 巢狀彈窗 */}
      <CreateCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onAddCategory={handleCreateCategory}
      />

      <AddTagModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        onAddTag={handleAddTag}
      />
    </>
  );
};