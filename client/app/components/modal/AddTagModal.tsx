'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTag: (tag: string) => void;
}

const POPULAR_TAGS = ['React', 'Frontend', 'Important', 'Exam', 'Personal'];

export const AddTagModal: React.FC<AddTagModalProps> = ({ isOpen, onClose, onAddTag }) => {
  const [tagName, setTagName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim()) return;
    onAddTag(tagName.startsWith('#') ? tagName : `#${tagName}`);
    setTagName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-6 shadow-xl relative animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-extrabold text-[#3D2C2E]">Add Tag</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[#FAF6F0] text-[#8C7A6B]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#3D2C2E] mb-1.5">Tag Name</label>
            <input
              type="text"
              placeholder="e.g. React"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF6F0] border border-[#EADBC8] text-xs font-bold text-[#3D2C2E] outline-none focus:border-[#E07A5F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3D2C2E] mb-1.5">Popular Tags</label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    onAddTag(`#${tag}`);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-2xl bg-[#FAF6F0] border border-[#EADBC8] text-xs font-bold text-[#6C5B52] hover:bg-[#FDF3E7] hover:border-[#E89874]"
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
              className="flex-1 py-2.5 rounded-2xl bg-[#FAF6F0] border border-[#EADBC8] text-xs font-bold text-[#6C5B52] hover:bg-[#EADBC8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-2xl bg-[#E89874] text-xs font-extrabold text-white shadow-xs hover:bg-[#d88763]"
            >
              Add Tag
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};