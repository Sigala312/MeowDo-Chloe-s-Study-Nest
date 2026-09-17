'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // 1. 將 Google 登入回傳的 Token 存入 localStorage
      localStorage.setItem('token', token);
      // 2. 登入成功，跳轉回主頁
      router.push('/Home');
    } else {
      // 找不到 token 則退回登入頁
      router.push('/login');
    }
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg font-medium">正在完成 Google 登入，請稍候...</p>
    </div>
  );
}