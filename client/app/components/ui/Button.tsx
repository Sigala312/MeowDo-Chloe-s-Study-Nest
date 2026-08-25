'use client';

import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    // 基礎樣式
    const baseStyles =
      'inline-flex items-center justify-center font-bold transition-all duration-200 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5E3C]/40 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

    // 變體樣式 (Variants)
    const variantStyles = {
      primary:
        'bg-[#8B5E3C] hover:bg-[#784E2F] text-amber-50 shadow-md shadow-[#8B5E3C]/20 hover:shadow-lg hover:-translate-y-0.5',
      secondary:
        'bg-[#F9F5F0]/90 hover:bg-white text-[#8B5E3C] border border-[#D0BBA2] shadow-sm hover:shadow hover:-translate-y-0.5',
      outline:
        'bg-transparent hover:bg-[#8B5E3C]/10 text-[#6C4E31] border-2 border-[#8B5E3C]/40',
      ghost:
        'bg-transparent hover:bg-[#8B5E3C]/10 text-[#8B5E3C] hover:text-[#6C4E31]',
      danger:
        'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 hover:shadow-lg hover:-translate-y-0.5',
    };

    // 尺寸樣式 (Sizes)
    const sizeStyles = {
      sm: 'py-1.5 px-3 text-xs rounded-xl gap-1.5',
      md: 'py-2.5 px-5 text-sm rounded-2xl gap-2',
      lg: 'py-3.5 px-7 text-base rounded-2xl gap-2.5',
      icon: 'p-2.5 rounded-2xl aspect-square',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <motion.button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
        {...props}
      >
        {/* 載入中 Spinner */}
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}

        {/* 文字內容 */}
        {children && <span>{children}</span>}

        {/* 右側圖示 */}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';