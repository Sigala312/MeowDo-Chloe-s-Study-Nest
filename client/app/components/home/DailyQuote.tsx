'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '../ui/Card';

export const DailyQuote: React.FC = () => {
  const [bio, setBio] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  useEffect(() => {
    const fetchUserBio = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch(`${API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await res.json();
        if (res.ok && result.success && result.data?.bio) {
          setBio(result.data.bio);
        }
      } catch (err) {
        console.error('Failed to fetch user bio in DailyQuote:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserBio();
  }, [API_URL]);

  return (
    <Card className="relative overflow-hidden bg-[#FFFDF9]/90 backdrop-blur-sm border-[#EADBC8] p-5">
      <h3 className="text-base font-extrabold text-[#3D2C2E] mb-2 relative z-10">
        Daily Quote
      </h3>

      <div className="flex items-end justify-between relative min-h-[75px]">
        {/* 左側金句/Bio文字 */}
        <div className="flex gap-2 items-start max-w-[65%] relative z-10 pb-1">
          <span className="text-[#E07A5F] text-lg leading-none">♡</span>
          <p className="text-xs font-bold text-[#6C5B52] leading-relaxed">
            {isLoading
              ? 'Loading daily quote...'
              : bio || 'Small steps every day, lead to big changes.'}
          </p>
        </div>

        {/* 右側貓咪插圖 */}
        <div className="absolute -bottom-3 -right-3 w-32 h-24 pointer-events-none select-none z-0">
          <Image
            src="/螢幕擷取畫面_2026-08-17_144945-removebg-preview.png"
            alt="Daily Quote Cat"
            fill
            sizes="128px"
            className="object-contain object-bottom-right"
            priority
          />
        </div>
      </div>
    </Card>
  );
};