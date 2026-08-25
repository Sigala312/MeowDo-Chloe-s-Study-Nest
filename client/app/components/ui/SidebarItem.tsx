'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  badgeCount?: number;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  isActive = false,
  onClick,
  badgeCount,
}) => {
  return (
    <motion.button
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-base font-semibold transition-all duration-200 cursor-pointer ${
        isActive
          ? 'bg-[#F4E2D8] text-[#3D2C2E] shadow-sm'
          : 'text-[#6C5B52] hover:bg-[#F5ECE3]/60 hover:text-[#3D2C2E]'
      }`}
    >
      <div className="flex items-center gap-3.5">
        <span className={`text-xl ${isActive ? 'text-[#E07A5F]' : 'text-[#8C7A6B]'}`}>
          {icon}
        </span>
        <span>{label}</span>
      </div>
      {badgeCount !== undefined && (
        <span className="bg-[#E07A5F] text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {badgeCount}
        </span>
      )}
    </motion.button>
  );
};