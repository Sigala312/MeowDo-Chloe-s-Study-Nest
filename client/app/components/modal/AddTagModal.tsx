'use client';

import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface TagData {
  id: string;
  name: string;
  color?: string | null;
}

interface AddTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newTag: TagData) => void;
}

const POPULAR_TAGS = ['民法', '土地法規', '土地登記', '土地稅法', '歷屆試題', '重點筆記','買賣過戶', '保存登記', '繼承贈與', '節稅規劃', '不動產經紀', '重要案件'];

export const AddTagModal: React.FC<AddTagModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [tagName, setTagName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // 核心 API 發送邏輯
  const createTagApi = async (name: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

      const res = await fetch(`${API_URL}/api/tag`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Failed to create tag.');
      }

      setTagName('');
      if (typeof onSuccess === 'function') {
        onSuccess(result.data);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim() || isLoading) return;
    createTagApi(tagName.trim());
  };

  const handlePopularTagClick = (tag: string) => {
    if (isLoading) return;
    createTagApi(tag);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-6 shadow-xl relative animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-extrabold text-[#3D2C2E]">Add Tag</h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 rounded-full hover:bg-[#FAF6F0] text-[#8C7A6B] disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#3D2C2E] mb-1.5">
              Tag Name
            </label>
            <input
              type="text"
              placeholder="e.g. React"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF6F0] border border-[#EADBC8] text-xs font-bold text-[#3D2C2E] outline-none focus:border-[#E07A5F] disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3D2C2E] mb-1.5">
              Popular Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handlePopularTagClick(tag)}
                  className="px-3 py-1.5 rounded-2xl bg-[#FAF6F0] border border-[#EADBC8] text-xs font-bold text-[#6C5B52] hover:bg-[#FDF3E7] hover:border-[#E89874] disabled:opacity-50 cursor-pointer"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-2xl bg-[#FAF6F0] border border-[#EADBC8] text-xs font-bold text-[#6C5B52] hover:bg-[#EADBC8] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-2xl bg-[#E89874] text-xs font-extrabold text-white shadow-xs hover:bg-[#d88763] disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Creating...
                </>
              ) : (
                'Add Tag'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};