'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function StudyNestLoginPage() {
  const router = useRouter();
  const backgroundImageUrl = '/pexels-fabavica-19067613.jpg';

  // 表單與狀態控制
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 登入處理
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('登入資訊：', { email, password });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // router.push('/dashboard');
    } catch (error) {
      console.error('登入失敗：', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 第三方登入處理
  const handleSocialLogin = (provider: 'google' | 'apple') => {
    console.log(`觸發 ${provider} 登入`);
  };

  return (
    <div 
      className="h-screen w-full flex items-center justify-center p-4 font-sans relative overflow-hidden bg-cover bg-center bg-no-repeat select-none"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      {/* 背景遮罩與暖色光影 */}
      <div className="absolute inset-0 bg-[#785232]/10 mix-blend-multiply pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 via-transparent to-stone-900/10 pointer-events-none" />

      {/* 主卡片容器 */}
      <div className="relative w-full max-w-sm md:max-w-[400px] bg-[#FAF6F0]/50 backdrop-blur-md rounded-[2.5rem] md:rounded-[3rem] px-6 py-6 md:px-8 md:py-7 shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-white/60 flex flex-col items-center text-stone-700 overflow-y-auto max-h-[95vh]">
        
        {/* Logo 標誌區域 */}
        <div className="relative my-1 flex justify-center items-center w-full">
          <div className="absolute w-32 h-32 md:w-36 md:h-36 bg-amber-200/50 rounded-full blur-2xl pointer-events-none" />

          <div className="relative w-full max-w-[150px] md:max-w-[160px] aspect-square flex items-center justify-center">
            <Image 
              src="/螢幕擷取畫面_2026-07-31_153200-removebg-preview.png"
              alt="MeowDo Study Nest Logo" 
              width={200}
              height={200}
              className="w-full h-full object-contain drop-shadow-sm"
              priority
            />
          </div>
        </div>

        {/* 1. 標語區域 (比照設計圖) */}
        <div className="text-center mt-1 mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-[#6C4E31] tracking-tight">Welcome Back!</h2>
          <p className="text-[#8B5E3C]/90 font-medium text-[11px] md:text-xs tracking-wide mt-1 max-w-[240px] mx-auto leading-relaxed">
            Every day is a new snapshot.<br />
            Let&apos;s make it count.
          </p>
        </div>

        {/* 2. 登入表單 */}
        <form onSubmit={handleLogin} className="w-full space-y-2.5 mb-3">
          {/* Email / Username 輸入框 */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5E3C]/60" />
            <input 
              type="text" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email or username"
              className="w-full bg-white/70 border border-[#D0BBA2]/50 rounded-2xl py-2.5 pl-11 pr-4 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/20 transition-all placeholder:text-stone-400 font-medium text-stone-700"
            />
          </div>

          {/* Password 輸入框 (附帶眼睛圖示切換) */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5E3C]/60" />
            <input 
              type={showPassword ? 'text' : 'password'} 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-white/70 border border-[#D0BBA2]/50 rounded-2xl py-2.5 pl-11 pr-10 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/20 transition-all placeholder:text-stone-400 font-medium text-stone-700"
            />
            {/* 顯示/隱藏密碼按鈕 */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#8B5E3C] transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* 3. Forgot password? 連結 */}
          <div className="flex justify-end pt-0.5">
            <button
              type="button"
              onClick={() => router.push('/forgot-password')}
              className="text-[11px] md:text-xs font-medium text-[#8B5E3C]/80 hover:text-[#6C4E31] transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          {/* Log In 按鈕 */}
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full mt-1 py-3 px-6 bg-[#8B5E3C] hover:bg-[#784E2F] text-amber-50 font-bold rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm md:text-base cursor-pointer active:scale-[0.98] disabled:opacity-80"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-amber-100" />
            ) : (
              <span className="tracking-wide">Log In</span>
            )}
          </button>
        </form>

        {/* 4. 分隔線 (簡潔 'or' 風格) */}
        <div className="w-full flex items-center gap-3 my-2">
          <div className="h-[1px] flex-1 bg-[#D8C7B5]/60" />
          <span className="text-xs text-[#8B5E3C]/60 font-medium">or</span>
          <div className="h-[1px] flex-1 bg-[#D8C7B5]/60" />
        </div>

        {/* 5. 寬版第三方登入按鈕 */}
        <div className="w-full space-y-2 mb-4">
          {/* Continue with Google */}
          <button 
            type="button"
            onClick={() => handleSocialLogin('google')}
            className="w-full py-2.5 px-4 bg-white/80 hover:bg-white text-stone-700 font-semibold rounded-2xl border border-stone-200/80 shadow-sm transition-all flex items-center justify-center gap-2.5 text-xs md:text-sm cursor-pointer active:scale-[0.98]"
          >
            <svg className="w-4 h-4 md:w-4.5 md:h-4.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Continue with Apple */}
          <button 
            type="button"
            onClick={() => handleSocialLogin('apple')}
            className="w-full py-2.5 px-4 bg-white/80 hover:bg-white text-stone-700 font-semibold rounded-2xl border border-stone-200/80 shadow-sm transition-all flex items-center justify-center gap-2.5 text-xs md:text-sm cursor-pointer active:scale-[0.98]"
          >
            <svg className="w-4 h-4 md:w-4.5 md:h-4.5 fill-stone-800" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.67-.82 1.13-1.96.99-3.1-.97.04-2.17.65-2.86 1.46-.61.72-1.15 1.88-.99 3 .1.01 2.19-.54 2.86-1.36z"/>
            </svg>
            <span>Continue with Apple</span>
          </button>
        </div>

        {/* 6. 底部註冊文字連結 */}
        <p className="text-xs text-stone-500 font-medium">
          Don&apos;t have an account?{' '}
          <button 
            type="button"
            onClick={() => router.push('/signup')}
            className="text-[#C07A5D] hover:text-[#A05A3D] font-semibold cursor-pointer transition-colors"
          >
            Sign up
          </button>
        </p>

      </div>
    </div>
  );
}