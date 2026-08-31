'use client';

import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon?: string | null;
  color?: string | null;
}

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newCategory: Category) => void;
}

const AVAILABLE_ICONS = ['📖', '📓', '💻', '🦾', '🎨', '🏠', '🎵', '✈️', '☕', '🌱'];

export const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('📖');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setName('');
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // 假設已在 next.config 或代理設定中掛載 API 路由
      const token = localStorage.getItem('token'); // 若使用 JWT 可從 Client 取得

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

      const res = await fetch(`${API_URL}/api/category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: name.trim(),
          icon: selectedIcon,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Failed to create category.');
      }

      onSuccess(result.data);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-6 shadow-xl relative animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-extrabold text-[#3D2C2E]">Create Category</h3>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-1 rounded-full hover:bg-[#FAF6F0] text-[#8C7A6B] disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#3D2C2E] mb-1.5">Category Name</label>
            <input
              type="text"
              placeholder="e.g. Study"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF6F0] border border-[#EADBC8] text-xs font-bold text-[#3D2C2E] outline-none focus:border-[#E07A5F] disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3D2C2E] mb-1.5">Choose Icon</label>
            <div className="grid grid-cols-5 gap-2">
              {AVAILABLE_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setSelectedIcon(icon)}
                  className={`h-10 rounded-2xl border flex items-center justify-center text-lg transition-all ${
                    selectedIcon === icon
                      ? 'bg-[#FDF3E7] border-[#E89874] shadow-xs'
                      : 'bg-[#FAF6F0] border-[#EADBC8] hover:bg-[#F4E2D8]'
                  } disabled:opacity-50`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-2xl bg-[#FAF6F0] border border-[#EADBC8] text-xs font-bold text-[#6C5B52] hover:bg-[#EADBC8] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="flex-1 py-2.5 rounded-2xl bg-[#E89874] text-xs font-extrabold text-white shadow-xs hover:bg-[#d88763] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};