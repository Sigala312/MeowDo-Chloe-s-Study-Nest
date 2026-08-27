'use client';

import React from 'react';
import Image from 'next/image';
import { Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SuccessAlertProps {
  type: 'login' | 'register';
  userName?: string;
  isOpen: boolean;
  onClose: () => void;
  /** 貓咪插圖路徑，可依需求自行替換 */
  loginCatImage?: string;
  registerCatImage?: string;
}

export default function SuccessAlert({
  type,
  userName = 'Chloe',
  isOpen,
  onClose,
  loginCatImage = '/cat-login.png',     // 招手貓咪圖片路徑
  registerCatImage = '/cat-register.png' // 舉手貓咪圖片路徑
}: SuccessAlertProps) {
  const isLogin = type === 'login';

  // 顏色配置
  const config = isLogin
    ? {
        bgColor: 'bg-[#F2F7EC]/90', // 淺綠背景
        borderColor: 'border-[#D2E4C4]',
        checkCircleBg: 'bg-[#DDEBCE]',
        checkIconColor: 'text-[#4A7C38]',
        titleColor: 'text-[#3B642A]',
        pawColor: 'text-[#7A9E66]/40',
        title: 'Login Successful!',
        subTitle: `Welcome back, ${userName}!`,
        message: 'You have successfully logged in.',
        imgSrc: loginCatImage,
      }
    : {
        bgColor: 'bg-[#FFF6ED]/90', // 淺橘背景
        borderColor: 'border-[#F8DCCB]',
        checkCircleBg: 'bg-[#FCE3D2]',
        checkIconColor: 'text-[#D9743D]',
        titleColor: 'text-[#B85721]',
        pawColor: 'text-[#DF9E77]/40',
        title: 'Registration Successful!',
        subTitle: `Welcome to MeowDo, ${userName}! ♡`,
        message: 'Your account has been created successfully.',
        imgSrc: registerCatImage,
      };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className={`relative w-full max-w-lg ${config.bgColor} backdrop-blur-md border ${config.borderColor} rounded-[2rem] p-4 md:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] flex items-center gap-3 md:gap-4 overflow-hidden select-none`}
        >
          {/* 右下角淡色裝飾貓腳印 */}
          <div className={`absolute -right-2 -bottom-2 flex gap-1 ${config.pawColor} pointer-events-none transform rotate-12 opacity-60`}>
            <span className="text-2xl">🐾</span>
            <span className="text-xl translate-y-2">🐾</span>
          </div>

          {/* 右上角關閉按鈕 */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-500 hover:text-stone-800 transition-colors p-1 rounded-full hover:bg-black/5 cursor-pointer z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* 左側：勾選 Circle */}
          <div className={`shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full ${config.checkCircleBg} flex items-center justify-center`}>
            <Check className={`w-5 h-5 md:w-6 md:h-6 stroke-[3] ${config.checkIconColor}`} />
          </div>

          {/* 中間：貓咪插畫 */}
          <div className="shrink-0 relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
            <Image
              src={config.imgSrc}
              alt="Cat Illustration"
              width={80}
              height={80}
              className="w-full h-full object-contain drop-shadow-sm"
            />
          </div>

          {/* 右側：文字內容 */}
          <div className="flex-1 pr-6">
            <h3 className={`text-base md:text-lg font-bold ${config.titleColor} flex items-center gap-1.5 leading-tight`}>
              <span>{config.title}</span>
              <span className="text-sm">🐾</span>
            </h3>
            <p className="text-xs md:text-sm font-medium text-stone-700 mt-1 leading-snug">
              {config.subTitle}
            </p>
            <p className="text-[11px] md:text-xs text-stone-500 font-normal leading-snug">
              {config.message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}