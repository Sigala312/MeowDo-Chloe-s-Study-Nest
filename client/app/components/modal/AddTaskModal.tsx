'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Plus, Loader2 } from 'lucide-react';
import { CreateCategoryModal } from './CreateCategoryModal';
import { AddTagModal } from './AddTagModal';
import { Button } from '../ui/Button';

export interface Category {
  id: string;
  name: string;
  icon?: string | null;
  color?: string | null;
}

export interface Tag {
  id: string;
  name: string;
}

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded?: () => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onTaskAdded,
}) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // 取得今天的預設 YYYY-MM-DD
  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // 表單 State
  const [taskName, setTaskName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedTagNames, setSelectedTagNames] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState(getTodayDateString());
  const [dueTime, setDueTime] = useState('10:00');

  // API 資料 State
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 控制子彈窗開關
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  // 重置表單
  const resetForm = () => {
    setTaskName('');
    setSelectedTagNames([]);
    setDueDate(getTodayDateString());
    setDueTime('10:00');
    if (categories.length > 0) {
      setSelectedCategoryId(categories[0].id);
    } else {
      setSelectedCategoryId('');
    }
  };

  // 1. 開啟 Modal 時，向後端撈取 Categories 與 Tags 列表
  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // 平行向 API 發送 GET 請求
        const [catRes, tagRes] = await Promise.all([
          fetch(`${API_URL}/api/category`, { headers }),
          fetch(`${API_URL}/api/tag`, { headers }),
        ]);

        const catResult = await catRes.json();
        const tagResult = await tagRes.json();

        // 設定 Categories
        if (catRes.ok && catResult.success) {
          const catList: Category[] = catResult.data;
          setCategories(catList);
          if (catList.length > 0 && !selectedCategoryId) {
            setSelectedCategoryId(catList[0].id);
          }
        }

        // 設定 Tags
        if (tagRes.ok && tagResult.success) {
          setAvailableTags(tagResult.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch initial modal data:', err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [isOpen, API_URL]);

  if (!isOpen) return null;

  // 2. Category 建立後的回呼
  const handleCategoryCreated = (newCat: Category) => {
    setCategories((prev) => [...prev, newCat]);
    setSelectedCategoryId(newCat.id);
  };

  // 3. Tag 建立後的回呼
  const handleTagCreated = (newTag: Tag) => {
    setAvailableTags((prev) => [...prev, newTag]);
    if (!selectedTagNames.includes(newTag.name)) {
      setSelectedTagNames((prev) => [...prev, newTag.name]);
    }
  };

  // 標籤切換/移除選擇
  const handleToggleTag = (tagName: string) => {
    setSelectedTagNames((prev) =>
      prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]
    );
  };

  // 4. 提交 Task
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) {
      alert('Please enter a task name!');
      return;
    }

    setIsSubmitting(true);

    try {
      const combinedDateTime = dueTime 
        ? new Date(`${dueDate}T${dueTime}`).toISOString()
        : new Date(dueDate).toISOString();

      const payload = {
        title: taskName.trim(),
        categoryId: selectedCategoryId || undefined,
        tags: selectedTagNames,
        dueDate: combinedDateTime,
      };

      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to add task.');
      }

      resetForm();
      onClose();

      if (onTaskAdded) {
        onTaskAdded();
      }
    } catch (err: any) {
      console.error('Error creating task:', err);
      alert(err.message || 'An error occurred while creating the task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4">
        <div className="w-full max-w-md bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
          {/* Header */}
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
              <label className="block text-xs font-extrabold text-[#3D2C2E] mb-1.5">
                Task Name
              </label>
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
              <label className="block text-xs font-extrabold text-[#3D2C2E] mb-1.5">
                Category
              </label>
              <div className="flex flex-wrap gap-2 items-center">
                {isLoadingData ? (
                  <div className="flex items-center gap-2 text-xs text-[#8C7A6B] py-1">
                    <Loader2 className="w-4 h-4 animate-spin text-[#E89874]" /> Loading...
                  </div>
                ) : (
                  categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer ${
                        selectedCategoryId === cat.id
                          ? 'bg-[#FDF3E7] border-[#E89874] text-[#3D2C2E] shadow-xs'
                          : 'bg-[#FAF6F0] border-[#EADBC8] text-[#6C5B52] hover:bg-[#F4E2D8]'
                      }`}
                    >
                      <span>{cat.icon || '📁'}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))
                )}

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
              <div className="flex flex-wrap gap-2 items-center">
                {isLoadingData ? (
                  <div className="flex items-center gap-2 text-xs text-[#8C7A6B] py-1">
                    <Loader2 className="w-4 h-4 animate-spin text-[#E89874]" /> Loading...
                  </div>
                ) : (
                  availableTags.map((tag) => {
                    const isSelected = selectedTagNames.includes(tag.name);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleToggleTag(tag.name)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#FDF3E7] border-[#E89874] text-[#3D2C2E] shadow-xs'
                            : 'bg-[#FAF6F0] border-[#EADBC8] text-[#6C5B52] hover:bg-[#F4E2D8]'
                        }`}
                      >
                        <span>#{tag.name}</span>
                        {isSelected && <X className="w-3 h-3 text-[#E89874]" />}
                      </button>
                    );
                  })
                )}

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
                <label className="block text-xs font-extrabold text-[#3D2C2E] mb-1.5">
                  Due Date
                </label>
                <div className="relative flex items-center">
                  <Calendar className="w-4 h-4 text-[#8C7A6B] absolute left-3 z-10 pointer-events-none" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    onClick={(e) => e.currentTarget.showPicker?.()}
                    className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-[#FAF6F0] border border-[#EADBC8] text-xs font-bold text-[#3D2C2E] outline-none cursor-pointer focus:border-[#E07A5F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#3D2C2E] mb-1.5">
                  Time (Optional)
                </label>
                <div className="relative flex items-center">
                  <Clock className="w-4 h-4 text-[#8C7A6B] absolute left-3 z-10 pointer-events-none" />
                  <input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    onClick={(e) => e.currentTarget.showPicker?.()}
                    className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-[#FAF6F0] border border-[#EADBC8] text-xs font-bold text-[#3D2C2E] outline-none cursor-pointer focus:border-[#E07A5F]"
                  />
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
                disabled={isSubmitting}
                className="bg-[#FAF6F0] border-[#EADBC8] text-[#6C5B52] hover:bg-[#EADBC8] text-xs font-black py-3"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={isSubmitting}
                className="bg-[#E89874] hover:bg-[#d88763] text-white border-none shadow-xs text-xs font-black py-3 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Adding...
                  </>
                ) : (
                  <>
                    Add Task 🐾
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* 巢狀彈窗：Category */}
      <CreateCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSuccess={handleCategoryCreated}
      />

      {/* 巢狀彈窗：Tag */}
      <AddTagModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        onSuccess={handleTagCreated}
      />
    </>
  );
};