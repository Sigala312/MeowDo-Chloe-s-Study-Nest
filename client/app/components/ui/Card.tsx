'use client';

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'white' | 'cream' | 'glass';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'white',
  ...props
}) => {
  const bgStyles = {
    white: 'bg-[#FFFDF9]/90 border-[#EADBC8]/60 shadow-[0_4px_20px_rgba(139,94,60,0.05)]',
    cream: 'bg-[#F9F3EA]/80 border-[#E5D4C0]/70 shadow-sm',
    glass: 'bg-white/60 backdrop-blur-md border-white/60 shadow-sm',
  };

  return (
    <div
      className={`rounded-[28px] border p-6 transition-all duration-200 ${bgStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};