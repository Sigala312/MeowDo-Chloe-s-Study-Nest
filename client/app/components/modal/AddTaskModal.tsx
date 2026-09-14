'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Plus, 
  Loader2, 
  FileText, 
  Folder, 
  Tag as TagIcon, 
  ChevronDown,
  PawPrint
} from 'lucide-react';
import { CreateCategoryModal } from './CreateCategoryModal';
import { AddTagModal } from './AddTagModal';

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

// 標籤彩色盤
const TAG_COLORS = [
  { bg: 'bg-[#FDE8E3]', text: 'text-[#C86D51]', border: 'border-[#F8D2C9]' }, // 暖粉
  { bg: 'bg-[#E3EFFD]', text: 'text-[#4A7BB0]', border: 'border-[#CDE0F9]' }, // 淡藍
  { bg: 'bg-[#F1E8FA]', text: 'text-[#8A63B4]', border: 'border-[#E2D2F3]' }, // 柔紫
  { bg: 'bg-[#EAF3E4]', text: 'text-[#5E8C48]', border: 'border-[#D4E6CA]' }, // 草綠
  { bg: 'bg-[#FAF3DC]', text: 'text-[#A08332]', border: 'border-[#F2E5B9]' }, // 淺黃
];

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onTaskAdded,
}) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [taskName, setTaskName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedTagNames, setSelectedTagNames] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState(getTodayDateString());
  const [dueTime, setDueTime] = useState('10:00');

  const [categories, setCategories] = useState<Category[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

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

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [catRes, tagRes] = await Promise.all([
          fetch(`${API_URL}/api/category`, { headers }),
          fetch(`${API_URL}/api/tag`, { headers }),
        ]);

        const catResult = await catRes.json();
        const tagResult = await tagRes.json();

        if (catRes.ok && catResult.success) {
          const catList: Category[] = catResult.data || [];
          setCategories(catList);
          if (catList.length > 0 && !selectedCategoryId) {
            setSelectedCategoryId(catList[0].id);
          }
        }

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

  const handleCategoryCreated = (newCat: Category) => {
    setCategories((prev) => [...prev, newCat]);
    setSelectedCategoryId(newCat.id);
  };

  const handleTagCreated = (newTag: Tag) => {
    setAvailableTags((prev) => [...prev, newTag]);
    if (!selectedTagNames.includes(newTag.name)) {
      setSelectedTagNames((prev) => [...prev, newTag.name]);
    }
  };

  const handleToggleTag = (tagName: string) => {
    setSelectedTagNames((prev) =>
      prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) {
      alert('Please enter a task name!');
      return;
    }

    setIsSubmitting(true);

    try {
      const timePart = dueTime || '23:59';
      const combinedDateTime = new Date(`${dueDate}T${timePart}`).toISOString();

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

      // 🌟 關鍵修正：發送全域事件廣播給 UpcomingTasks 重新拉取資料
      window.dispatchEvent(new Event('task-created'));
      window.dispatchEvent(new Event('task-updated'));

      resetForm();
      onClose();

      if (onTaskAdded) {
        onTaskAdded();
      }
    } catch (err: unknown) {
      console.error('Error creating task:', err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'An error occurred while creating the task.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/25 backdrop-blur-xs p-4 font-sans selection:bg-[#F2A68D]/30">
        {/* 視窗最大寬度調小至 420px，內邊距調為 p-5 sm:p-6 */}
        <div className="w-full max-w-[390px] bg-[#FFFBF5] border-4 border-[#F2EAE1] rounded-[32px] p-5 sm:p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
          
          {/* 貓咪插圖：位置移至 right-16 (更靠左)，大小調整為 w-20 h-20 */}
          <div className="absolute -top-10 right-16 w-20 h-20 pointer-events-none select-none z-10">
            <img
              src="/螢幕擷取畫面_2026-09-10_024116-removebg-preview.png"
              alt="Cat Illustration Header"
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>

          {/* Header */}
          <div className="flex items-start justify-between mb-3 relative z-0">
            <div>
              <div className="flex items-center gap-1.5">
                <PawPrint className="w-4 h-4 text-[#4A3228] fill-[#4A3228]" />
                <h2 className="text-xl font-bold text-[#4A3228] tracking-wide">
                  Add New Task
                </h2>
              </div>
              <p className="text-[11px] font-semibold text-[#A08C82] mt-0.5 ml-5">
                Small steps make big changes! <span className="text-[#E57373]">♡</span>
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="p-1 rounded-full text-[#9C887B] hover:bg-[#F2EAE1] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="bg-[#FAF4ED] border border-[#EFE5D8] rounded-[24px] p-3.5 sm:p-4 space-y-3">
              
              {/* Task Name */}
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#5C4639] mb-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#8C7A6B]" />
                  Task Name
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="e.g. Read 20 pages of a book"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    className="w-full pl-3.5 pr-9 py-2.5 rounded-xl bg-[#FFFBF5] border-2 border-[#EAE0D3] text-xs font-semibold text-[#4A3228] placeholder-[#B8A89D] outline-none focus:border-[#E89874] transition-all"
                  />
                  <img
                    src="/螢幕擷取畫面_2026-09-10_024104-removebg-preview.png"
                    alt="Cat Icon"
                    className="absolute right-2.5 w-4 h-4 object-contain pointer-events-none"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#5C4639] mb-1.5">
                  <Folder className="w-3.5 h-3.5 text-[#8C7A6B]" />
                  Category
                </label>
                <div className="flex flex-wrap gap-1.5 items-center">
                  {isLoadingData ? (
                    <div className="flex items-center gap-1.5 text-xs text-[#9C887B] py-0.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E89874]" /> Loading...
                    </div>
                  ) : (
                    categories.map((cat) => {
                      const isSelected = selectedCategoryId === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCategoryId(cat.id)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border-2 text-[11px] font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#FFF3EC] border-[#F2A68D] text-[#4A3228] shadow-xs'
                              : 'bg-[#FFFBF5] border-[#EAE0D3] text-[#7A685D] hover:bg-[#F7EFE6]'
                          }`}
                        >
                          <span>{cat.icon || '📖'}</span>
                          <span>{cat.name}</span>
                        </button>
                      );
                    })
                  )}

                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border-2 border-dashed border-[#D6C7B8] bg-[#FFFBF5] text-[#9C887B] hover:bg-[#F7EFE6] text-[11px] font-bold transition-all cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Category</span>
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#5C4639] mb-1.5">
                  <TagIcon className="w-3.5 h-3.5 text-[#8C7A6B]" />
                  Tags
                </label>
                <div className="flex flex-wrap gap-1.5 items-center">
                  {isLoadingData ? (
                    <div className="flex items-center gap-1.5 text-xs text-[#9C887B] py-0.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E89874]" /> Loading...
                    </div>
                  ) : (
                    availableTags.map((tag, idx) => {
                      const isSelected = selectedTagNames.includes(tag.name);
                      const colorScheme = TAG_COLORS[idx % TAG_COLORS.length];

                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => handleToggleTag(tag.name)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                            isSelected
                              ? `${colorScheme.bg} ${colorScheme.text} ${colorScheme.border} shadow-xs`
                              : 'bg-[#FFFBF5] border-[#EAE0D3] text-[#7A685D] hover:bg-[#F7EFE6]'
                          }`}
                        >
                          <span>#{tag.name}</span>
                          {isSelected && <X className="w-3 h-3 opacity-70 hover:opacity-100" />}
                        </button>
                      );
                    })
                  )}

                  <button
                    type="button"
                    onClick={() => setIsTagModalOpen(true)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl border-2 border-dashed border-[#D6C7B8] bg-[#FFFBF5] text-[#9C887B] hover:bg-[#F7EFE6] text-[11px] font-bold transition-all cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Tag</span>
                  </button>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-2.5 pt-0.5">
                <div>
                  <label className="flex items-center gap-1 text-[11px] font-bold text-[#5C4639] mb-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#8C7A6B]" />
                    Due Date
                  </label>
                  <div className="relative flex items-center">
                    <Calendar className="w-3.5 h-3.5 text-[#9C887B] absolute left-3 pointer-events-none z-10" />
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      onClick={(e) => e.currentTarget.showPicker?.()}
                      className="w-full pl-8 pr-6 py-2 rounded-xl bg-[#FFFBF5] border-2 border-[#EAE0D3] text-xs font-bold text-[#4A3228] outline-none cursor-pointer focus:border-[#E89874] appearance-none"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-[#9C887B] absolute right-2.5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-1 text-[11px] font-bold text-[#5C4639] mb-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#8C7A6B]" />
                    Time (Optional)
                  </label>
                  <div className="relative flex items-center">
                    <Clock className="w-3.5 h-3.5 text-[#9C887B] absolute left-3 pointer-events-none z-10" />
                    <input
                      type="time"
                      value={dueTime}
                      onChange={(e) => setDueTime(e.target.value)}
                      onClick={(e) => e.currentTarget.showPicker?.()}
                      className="w-full pl-8 pr-6 py-2 rounded-xl bg-[#FFFBF5] border-2 border-[#EAE0D3] text-xs font-bold text-[#4A3228] outline-none cursor-pointer focus:border-[#E89874] appearance-none"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-[#9C887B] absolute right-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="pt-1.5 flex items-center justify-between relative">
              <div className="absolute -left-1 -bottom-1 text-[#C4A482] text-[10px] font-bold rotate-[-6deg] select-none pointer-events-none hidden sm:block">
                <span>You got this! ♡</span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto sm:ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#F0E4D8] text-[#6E5A4E] hover:bg-[#E5D7C9] text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#EE8866] hover:bg-[#E07755] text-white text-xs font-bold shadow-md shadow-[#EE8866]/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add Task
                      <PawPrint className="w-3 h-3 fill-white text-white ml-0.5" />
                    </>
                  )}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>

      <CreateCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSuccess={handleCategoryCreated}
      />

      <AddTagModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        onSuccess={handleTagCreated}
      />
    </>
  );
};