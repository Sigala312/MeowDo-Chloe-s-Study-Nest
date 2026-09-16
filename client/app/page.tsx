'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PawPrint, Leaf, Mail, Lock, Eye, EyeOff, Loader2, Globe, User, CheckCircle2, AlertCircle } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function AuthFlow() {
  const router = useRouter();
  const [view, setView] = useState<'welcome' | 'login' | 'signup'>('welcome');
  const [locale, setLocale] = useState<'zh' | 'en'>('en');

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // English Alert Modal State
  const [alertConfig, setAlertConfig] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: 'success' | 'error';
    image?: string;
    onConfirm?: () => void;
  }>({
    show: false,
    title: '',
    message: '',
    type: 'success',
  });

  const showAlert = (
    title: string, 
    message: string, 
    type: 'success' | 'error' = 'success', 
    onConfirm?: () => void,
    image: string = '/螢幕擷取畫面_2026-08-25_190915-removebg-preview.png'
  ) => {
    setAlertConfig({ show: true, title, message, type, image, onConfirm });
  };

  const closeAlert = () => {
    const callback = alertConfig.onConfirm;
    setAlertConfig(prev => ({ ...prev, show: false }));
    if (callback) callback();
  };

  const backgroundImageUrl = '/pexels-fabavica-19067613.jpg';

  // 1. Login Handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid email or password.');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      showAlert('Login Successful! 🐾', 'Welcome back to MeowDo Study Nest.', 'success', () => {
        router.push('/Home');
      });
    } catch (err: any) {
      // 👈 修改處：登入失敗時跳出帶有指定圖片的 Modal
      showAlert(
        'Login Failed ',
        err.message || 'Invalid email or password. Please try again.',
        'error',
        undefined,
        '/螢幕擷取畫面_2026-09-15_023515-removebg-preview.png'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Sign Up Handler
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showAlert(
        'Sign Up Failed 😿',
        'Passwords do not match!',
        'error',
        undefined,
        '/螢幕擷取畫面_2026-09-15_023515-removebg-preview.png'
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      showAlert('Account Created! 🎉', 'Your account is ready. Please log in.', 'success', () => {
        setPassword('');
        setConfirmPassword('');
        setView('login');
      });
    } catch (err: any) {
      showAlert(
        'Sign Up Failed ',
        err.message || 'Sign up failed. Please try again later.',
        'error',
        undefined,
        '/螢幕擷取畫面_2026-09-15_023515-removebg-preview.png'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Social Login Handler
  const handleSocialLogin = (provider: 'google' | 'apple') => {
    window.location.href = `${API_BASE_URL}/api/auth/${provider}`;
  };

  return (
    <div 
      className="h-screen w-full flex items-center justify-center p-4 font-sans relative overflow-hidden bg-cover bg-center bg-no-repeat select-none"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <div className="absolute inset-0 bg-[#785232]/10 mix-blend-multiply pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 via-transparent to-stone-900/10 pointer-events-none" />

      {/* Styled English Alert Modal */}
      <AnimatePresence>
        {alertConfig.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-xs bg-[#FAF6F0] rounded-3xl p-6 shadow-2xl border border-white/80 flex flex-col items-center text-center relative"
            >
              {alertConfig.image ? (
                <div className="relative w-20 h-20 mb-2">
                  <Image 
                    src={alertConfig.image} 
                    alt="Alert illustration" 
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                  alertConfig.type === 'success' ? 'bg-amber-100 text-[#8B5E3C]' : 'bg-red-100 text-red-600'
                }`}>
                  {alertConfig.type === 'success' ? <CheckCircle2 className="w-7 h-7" /> : <AlertCircle className="w-7 h-7" />}
                </div>
              )}

              <h3 className="text-base font-bold text-[#6C4E31] mb-1">{alertConfig.title}</h3>
              <p className="text-xs text-[#8B5E3C]/80 mb-5 font-medium leading-relaxed">{alertConfig.message}</p>

              <button
                onClick={closeAlert}
                className="w-full py-2.5 bg-[#8B5E3C] hover:bg-[#784E2F] text-amber-50 font-bold rounded-xl shadow-md transition-all text-xs cursor-pointer active:scale-95"
              >
                Continue
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Error Message Toast */}
      {errorMessage && (
        <div className="absolute top-6 z-20 bg-red-100/90 backdrop-blur-sm border border-red-300 text-red-700 px-4 py-2 rounded-xl text-xs font-semibold shadow-md">
          {errorMessage}
        </div>
      )}

      {/* Language Toggle */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
        <button
          onClick={() => setLocale(prev => prev === 'zh' ? 'en' : 'zh')}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/70 hover:bg-white/90 backdrop-blur-md rounded-full border border-white/60 text-xs font-bold text-[#6C4E31] shadow-sm transition-all cursor-pointer active:scale-95"
        >
          <Globe className="w-3.5 h-3.5 text-[#8B5E3C]" />
          <span>{locale === 'zh' ? 'EN' : '繁中'}</span>
        </button>
      </div>

      {/* Main Card */}
      <motion.div 
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full max-w-sm md:max-w-[400px] bg-[#FAF6F0]/50 backdrop-blur-md rounded-[2.5rem] md:rounded-[3rem] px-6 py-5 md:px-8 md:py-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-white/60 flex flex-col items-center text-stone-700 overflow-hidden max-h-[95vh] overflow-y-auto"
      >
        <motion.div 
          layout
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="relative my-0.5 flex justify-center items-center w-full shrink-0"
        >
          <div className="absolute w-32 h-32 md:w-36 md:h-36 bg-amber-200/50 rounded-full blur-2xl pointer-events-none" />

          <motion.div 
            layoutId="hero-logo"
            className={`relative w-full aspect-square flex items-center justify-center transition-all duration-300 ${
              view === 'welcome' ? 'max-w-[160px] md:max-w-[180px]' : 'max-w-[105px] md:max-w-[115px]'
            }`}
          >
            <Image 
              src="/螢幕擷取畫面_2026-07-31_153200-removebg-preview.png"
              alt="MeowDo Study Nest Logo" 
              width={220}
              height={220}
              className="w-full h-full object-contain drop-shadow-sm"
              priority
            />
            <span className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 text-amber-700/40 text-base md:text-lg font-serif">♡</span>
            <span className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 text-amber-700/40 text-base md:text-lg font-serif">♡</span>
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          {view === 'welcome' && (
            <motion.div
              key="welcome-content"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="w-full flex flex-col items-center"
            >
              <div className="text-center mt-1 mb-5">
                <p className="text-[#6C4E31] text-xs md:text-sm leading-relaxed max-w-[240px] mx-auto font-bold tracking-wide">
                  Capture every step<br />
                  <span className="text-[#8B5E3C]/90 font-medium text-[11px] md:text-xs tracking-wider">of your learning journey 🐾</span>
                </p>
              </div>

              <div className="w-full space-y-2 mb-3">
                <button 
                  type="button"
                  onClick={() => { setErrorMessage(''); setView('login'); }}
                  className="w-full py-2.5 md:py-3 px-6 bg-[#8B5E3C] hover:bg-[#784E2F] text-amber-50 font-bold rounded-2xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 text-sm md:text-base cursor-pointer hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <PawPrint className="w-4 h-4 md:w-5 md:h-5 fill-amber-100/20" />
                  <span className="tracking-wide">Log In</span>
                </button>

                <button 
                  type="button"
                  onClick={() => { setErrorMessage(''); setView('signup'); }}
                  className="w-full py-2.5 md:py-3 px-6 bg-[#F9F5F0]/90 hover:bg-white text-[#8B5E3C] font-bold rounded-2xl border border-[#D0BBA2] shadow-sm transition-all duration-200 flex items-center justify-center gap-2 text-sm md:text-base cursor-pointer hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <Leaf className="w-4 h-4 md:w-5 md:h-5 text-[#8B5E3C]" />
                  <span className="tracking-wide">Sign Up</span>
                </button>
              </div>

              <div className="w-full flex items-center gap-3 my-2">
                <div className="h-[1px] flex-1 bg-[#D8C7B5]/60" />
                <span className="text-[10px] md:text-[11px] text-[#8B5E3C]/70 font-bold tracking-wider uppercase">or continue with</span>
                <div className="h-[1px] flex-1 bg-[#D8C7B5]/60" />
              </div>

              <div className="flex items-center justify-center gap-5 mt-1">
                <div className="flex flex-col items-center gap-1">
                  <button 
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    className="w-10 h-10 rounded-full bg-white/90 border border-stone-200/80 shadow-sm flex items-center justify-center hover:shadow-md hover:scale-105 transition-all cursor-pointer active:scale-95"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                  </button>
                  <span className="text-[10px] font-bold text-[#6C4E31]/80 tracking-wide">Google</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <button 
                    type="button"
                    onClick={() => handleSocialLogin('apple')}
                    className="w-10 h-10 rounded-full bg-white/90 border border-stone-200/80 shadow-sm flex items-center justify-center hover:shadow-md hover:scale-105 transition-all cursor-pointer active:scale-95"
                  >
                    <svg className="w-4 h-4 fill-stone-800" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.67-.82 1.13-1.96.99-3.1-.97.04-2.17.65-2.86 1.46-.61.72-1.15 1.88-.99 3 .1.01 2.19-.54 2.86-1.36z"/>
                    </svg>
                  </button>
                  <span className="text-[10px] font-bold text-[#6C4E31]/80 tracking-wide">Apple</span>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'login' && (
            <motion.div
              key="login-content"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="w-full flex flex-col items-center"
            >
              <div className="text-center mt-0.5 mb-2">
                <h2 className="text-lg md:text-xl font-bold text-[#6C4E31] tracking-tight">Welcome Back!</h2>
                <p className="text-[#8B5E3C]/90 font-medium text-[11px] md:text-xs tracking-wide mt-0.5 leading-relaxed">
                  Every day is a new snapshot. Let&apos;s make it count.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="w-full space-y-1.5 mb-2">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5E3C]/60" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full bg-white/70 border border-[#D0BBA2]/50 rounded-2xl py-2 pl-11 pr-4 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/20 transition-all placeholder:text-stone-400 font-medium text-stone-700"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5E3C]/60" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-white/70 border border-[#D0BBA2]/50 rounded-2xl py-2 pl-11 pr-10 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/20 transition-all placeholder:text-stone-400 font-medium text-stone-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#8B5E3C] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex justify-end pt-0.5">
                  <button
                    type="button"
                    onClick={() => router.push('/forgot-password')}
                    className="text-[11px] font-medium text-[#8B5E3C]/80 hover:text-[#6C4E31] transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-6 bg-[#8B5E3C] hover:bg-[#784E2F] text-amber-50 font-bold rounded-2xl shadow-md transition-all flex items-center justify-center text-sm md:text-base cursor-pointer active:scale-[0.98] disabled:opacity-80"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-amber-100" /> : 'Log In'}
                </button>
              </form>

              <div className="w-full flex items-center gap-3 my-1">
                <div className="h-[1px] flex-1 bg-[#D8C7B5]/60" />
                <span className="text-[11px] text-[#8B5E3C]/60 font-medium">or</span>
                <div className="h-[1px] flex-1 bg-[#D8C7B5]/60" />
              </div>

              <div className="w-full space-y-1.5 mb-2">
                <button 
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  className="w-full py-2 px-4 bg-white/80 hover:bg-white text-stone-700 font-semibold rounded-2xl border border-stone-200/80 shadow-sm transition-all flex items-center justify-center gap-2.5 text-xs md:text-sm cursor-pointer active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button 
                  type="button"
                  onClick={() => handleSocialLogin('apple')}
                  className="w-full py-2 px-4 bg-white/80 hover:bg-white text-stone-700 font-semibold rounded-2xl border border-stone-200/80 shadow-sm transition-all flex items-center justify-center gap-2.5 text-xs md:text-sm cursor-pointer active:scale-[0.98]"
                >
                  <svg className="w-4 h-4 fill-stone-800" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.67-.82 1.13-1.96.99-3.1-.97.04-2.17.65-2.86 1.46-.61.72-1.15 1.88-.99 3 .1.01 2.19-.54 2.86-1.36z"/>
                  </svg>
                  <span>Continue with Apple</span>
                </button>
              </div>

              <p className="text-[11px] text-stone-500 font-medium">
                Don&apos;t have an account?{' '}
                <button 
                  type="button"
                  onClick={() => { setErrorMessage(''); setView('signup'); }}
                  className="text-[#C07A5D] hover:text-[#A05A3D] font-semibold cursor-pointer transition-colors"
                >
                  Sign up
                </button>
              </p>

              <button 
                type="button"
                onClick={() => setView('welcome')}
                className="text-[11px] text-[#8B5E3C]/70 hover:text-[#8B5E3C] hover:underline font-medium mt-1 cursor-pointer transition-colors"
              >
                ← Back
              </button>
            </motion.div>
          )}

          {view === 'signup' && (
            <motion.div
              key="signup-content"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="w-full flex flex-col items-center"
            >
              <div className="text-center mt-0.5 mb-2">
                <h2 className="text-lg md:text-xl font-bold text-[#6C4E31] tracking-tight">Create Account</h2>
                <p className="text-[#8B5E3C]/90 font-medium text-[11px] md:text-xs tracking-wide mt-0.5 leading-relaxed">
                  Join us and start capturing your study nest today.
                </p>
              </div>

              <form onSubmit={handleSignUpSubmit} className="w-full space-y-1.5 mb-2">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5E3C]/60" />
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-white/70 border border-[#D0BBA2]/50 rounded-2xl py-1.5 pl-11 pr-4 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/20 transition-all placeholder:text-stone-400 font-medium text-stone-700"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5E3C]/60" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full bg-white/70 border border-[#D0BBA2]/50 rounded-2xl py-1.5 pl-11 pr-4 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/20 transition-all placeholder:text-stone-400 font-medium text-stone-700"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5E3C]/60" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-white/70 border border-[#D0BBA2]/50 rounded-2xl py-1.5 pl-11 pr-10 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/20 transition-all placeholder:text-stone-400 font-medium text-stone-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#8B5E3C] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5E3C]/60" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full bg-white/70 border border-[#D0BBA2]/50 rounded-2xl py-1.5 pl-11 pr-4 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/20 transition-all placeholder:text-stone-400 font-medium text-stone-700"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-6 bg-[#8B5E3C] hover:bg-[#784E2F] text-amber-50 font-bold rounded-2xl shadow-md transition-all flex items-center justify-center text-sm md:text-base cursor-pointer active:scale-[0.98] disabled:opacity-80 mt-1"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-amber-100" /> : 'Create Account'}
                </button>
              </form>

              <div className="w-full flex items-center gap-3 my-1">
                <div className="h-[1px] flex-1 bg-[#D8C7B5]/60" />
                <span className="text-[11px] text-[#8B5E3C]/60 font-medium">or</span>
                <div className="h-[1px] flex-1 bg-[#D8C7B5]/60" />
              </div>

              <div className="w-full space-y-1.5 mb-2">
                <button 
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  className="w-full py-2 px-4 bg-white/80 hover:bg-white text-stone-700 font-semibold rounded-2xl border border-stone-200/80 shadow-sm transition-all flex items-center justify-center gap-2.5 text-xs md:text-sm cursor-pointer active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Sign up with Google</span>
                </button>

                <button 
                  type="button"
                  onClick={() => handleSocialLogin('apple')}
                  className="w-full py-2 px-4 bg-white/80 hover:bg-white text-stone-700 font-semibold rounded-2xl border border-stone-200/80 shadow-sm transition-all flex items-center justify-center gap-2.5 text-xs md:text-sm cursor-pointer active:scale-[0.98]"
                >
                  <svg className="w-4 h-4 fill-stone-800" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.67-.82 1.13-1.96.99-3.1-.97.04-2.17.65-2.86 1.46-.61.72-1.15 1.88-.99 3 .1.01 2.19-.54 2.86-1.36z"/>
                  </svg>
                  <span>Sign up with Apple</span>
                </button>
              </div>

              <p className="text-[11px] text-stone-500 font-medium">
                Already have an account?{' '}
                <button 
                  type="button"
                  onClick={() => { setErrorMessage(''); setView('login'); }}
                  className="text-[#C07A5D] hover:text-[#A05A3D] font-semibold cursor-pointer transition-colors"
                >
                  Log in
                </button>
              </p>

              <button 
                type="button"
                onClick={() => setView('welcome')}
                className="text-[11px] text-[#8B5E3C]/70 hover:text-[#8B5E3C] hover:underline font-medium mt-1 cursor-pointer transition-colors"
              >
                ← Back
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}