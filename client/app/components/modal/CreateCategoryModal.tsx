'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (category: { name: string; icon: string }) => void;
}

const AVAILABLE_ICONS = ['📖', '📓', '💻', '🦾', '🎨', '🏠', '🎵', '✈️', '☕', '🌱'];

export const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  isOpen,
  onClose,
  onAddCategory,
}) => {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('📖');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddCategory({ name, icon: selectedIcon });
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-6 shadow-xl relative animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-extrabold text-[#3D2C2E]">Create Category</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[#FAF6F0] text-[#8C7A6B]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#3D2C2E] mb-1.5">Category Name</label>
            <input
              type="text"
              placeholder="e.g. Study"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF6F0] border border-[#EADBC8] text-xs font-bold text-[#3D2C2E] outline-none focus:border-[#E07A5F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3D2C2E] mb-1.5">Choose Icon</label>
            <div className="grid grid-cols-5 gap-2">
              {AVAILABLE_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`h-10 rounded-2xl border flex items-center justify-center text-lg transition-all ${
                    selectedIcon === icon
                      ? 'bg-[#FDF3E7] border-[#E89874] shadow-xs'
                      : 'bg-[#FAF6F0] border-[#EADBC8] hover:bg-[#F4E2D8]'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-2xl bg-[#FAF6F0] border border-[#EADBC8] text-xs font-bold text-[#6C5B52] hover:bg-[#EADBC8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-2xl bg-[#E89874] text-xs font-extrabold text-white shadow-xs hover:bg-[#d88763]"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};