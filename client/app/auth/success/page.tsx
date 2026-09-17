'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function AuthSuccessHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      router.push('/Home');
    } else {
      router.push('/login');
    }
  }, [router, searchParams]);

  return <p className="text-lg font-medium">正在完成 Google 登入，請稍候...</p>;
}

export default function AuthSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Suspense fallback={<p className="text-lg font-medium">載入中...</p>}>
        <AuthSuccessHandler />
      </Suspense>
    </div>
  );
}