'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { 
  Camera, 
  Lock, 
  MapPin, 
  Trophy, 
  Star, 
  Gift,
  Loader2,
  Sparkles,
  PawPrint
} from 'lucide-react';
import { usePageHeader } from '../../components/context/PageHeaderContext';
import { REWARD_ASSETS } from '../../constants/rewards';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  bio?: string | null;
  location?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
  _count?: {
    tasks: number;
    categories: number;
  };
}

interface RewardItem {
  title: string;
  imageKey?: string;
  imageUrl?: string;
}

interface LastDraw {
  rewardTitle: string;
  drawnAt: string;
  isRedeemed: boolean;
  imageUrl?: string;
  imageKey?: string;
}

export default function ProfileSettingsPage() {
  const { setHeader } = usePageHeader();

  // Loading & State
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Wheel Rewards State
  const [drawnRewards, setDrawnRewards] = useState<RewardItem[]>([]);
  const [lastDraw, setLastDraw] = useState<LastDraw | null>(null);
  const [isRewardsLoading, setIsRewardsLoading] = useState(true);

  // 表單 State
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // 抓取轉盤狀態 API
  const fetchWheelRewards = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/wheel/status`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const result = await res.json();

      if (res.ok) {
        const data = result.data || result;
        
        if (data.drawnRewardTitles && Array.isArray(data.drawnRewardTitles)) {
          const formattedRewards: RewardItem[] = data.drawnRewardTitles.map((item: any) => {
            if (typeof item === 'string') {
              return { title: item, imageKey: item };
            }
            return {
              title: item.title || item.name || 'Reward',
              imageKey: item.imageKey || item.key || item.title || item.name,
              imageUrl: item.imageUrl || item.image || item.icon,
            };
          });
          setDrawnRewards(formattedRewards);
        }

        if (data.lastDraw) {
          setLastDraw(data.lastDraw);
        }
      }
    } catch (err) {
      console.error('Failed to fetch wheel rewards:', err);
    } finally {
      setIsRewardsLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    setHeader({
      title: 'Personal Information 🐾',
      subtitle: 'Manage your profile and account settings.',
    });

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();

        if (res.ok && result.success) {
          const data: UserProfile = result.data;
          setProfile(data);
          setDisplayName(data.name || '');
          setEmail(data.email || '');
          setBio(data.bio || '');
          setLocation(data.location || '');
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
    fetchWheelRewards();

    window.addEventListener('wheel-spun', fetchWheelRewards);
    return () => {
      window.removeEventListener('wheel-spun', fetchWheelRewards);
    };
  }, [setHeader, API_URL, fetchWheelRewards]);

  // 處理頭像更換
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File size is too large! Max 2MB allowed. 🐾');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64String = reader.result as string;
      setProfile((prev) => (prev ? { ...prev, avatarUrl: base64String } : null));

      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/user/profile`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ avatarUrl: base64String }),
        });

        const result = await res.json();
        if (res.ok && result.success) {
          alert('Avatar updated successfully! 🐾');
          window.dispatchEvent(new Event('user-profile-updated'));
        } else {
          alert(result.message || 'Upload failed.');
        }
      } catch (err) {
        console.error('Avatar upload error:', err);
        alert('An error occurred while uploading. Please try again.');
      }
    };
  };

  // 處理個人資料更新
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/user/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: displayName,
          bio,
          location,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert('Profile updated successfully! 🐾');
        setProfile((prev) => (prev ? { ...prev, name: displayName, bio, location } : null));
        window.dispatchEvent(new Event('user-profile-updated'));
      } else {
        alert(result.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const formattedMemberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'May 12, 2024';

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2]">
        <Loader2 className="w-8 h-8 animate-spin text-[#E89874]" />
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-[#FAF7F2] p-6 md:p-8 pt-20 md:pt-24 font-sans">
      <div className="max-w-[1280px] mx-auto space-y-6">
        
        {/* 主內容 layout (兩欄式) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* 左側：Profile Information */}
          <div className="lg:col-span-2 bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-6 md:p-8 shadow-xs relative overflow-hidden">
            <h2 className="text-lg font-black text-[#3D2C2E] mb-6">Profile Information</h2>

            <form onSubmit={handleSave} className="space-y-6 relative z-10">
              {/* 頭像區域 */}
              <div className="flex flex-col items-center sm:items-start gap-3">
                <div className="relative w-32 h-32">
                  <div className="w-full h-full rounded-full border-4 border-[#FDF3E7] shadow-inner bg-[#F4E2D8] overflow-hidden relative flex items-center justify-center text-4xl font-black text-[#E89874]">
                    {profile?.avatarUrl ? (
                      <Image
                        src={profile.avatarUrl}
                        alt="Profile Avatar"
                        fill
                        sizes="128px"
                        className="object-cover"
                        priority
                        unoptimized
                      />
                    ) : (
                      displayName[0]?.toUpperCase() || '🐱'
                    )}
                  </div>
                  
                  <label 
                    htmlFor="avatar-upload" 
                    className="absolute bottom-0 right-0 z-10 p-2.5 rounded-full bg-[#FFFDF9] border border-[#EADBC8] text-[#6C5B52] hover:bg-[#FDF3E7] shadow-md cursor-pointer transition-transform active:scale-95"
                  >
                    <Camera className="w-4 h-4 text-[#8C7A6B]" />
                    <input 
                      id="avatar-upload" 
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>

                <div className="text-center sm:text-left">
                  <p className="text-xs font-bold text-[#6C5B52]">Change Avatar</p>
                  <p className="text-[11px] font-medium text-[#A08D80] mt-0.5">JPG, PNG or GIF. Max 2MB</p>
                </div>
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-xs font-extrabold text-[#3D2C2E] mb-1.5">
                  Display Name
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FAF6F0] border border-[#EADBC8] text-xs font-bold text-[#3D2C2E] outline-none focus:border-[#E07A5F] transition-colors pr-10"
                  />
                  <img
                    src="/螢幕擷取畫面_2026-09-10_024104-removebg-preview.png"
                    alt="Cat Icon"
                    className="absolute right-3.5 w-5 h-5 object-contain pointer-events-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-extrabold text-[#3D2C2E] mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-3 rounded-2xl bg-[#F5EFE8]/60 border border-[#EADBC8] text-xs font-bold text-[#8C7A6B] cursor-not-allowed pr-10"
                  />
                  <Lock className="w-4 h-4 text-[#A08D80] absolute right-3.5 top-3.5" />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-extrabold text-[#3D2C2E] mb-1.5">
                  Daily Quote (Optional)
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    maxLength={120}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FAF6F0] border border-[#EADBC8] text-xs font-bold text-[#3D2C2E] outline-none focus:border-[#E07A5F] transition-colors resize-none"
                  />
                  <span className="absolute right-3.5 bottom-3 text-[10px] font-bold text-[#A08D80]">
                    {bio.length} / 120
                  </span>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-extrabold text-[#3D2C2E] mb-1.5">
                  Location (Optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF6F0] border border-[#EADBC8] text-xs font-bold text-[#3D2C2E] outline-none focus:border-[#E07A5F] transition-colors"
                  />
                  <MapPin className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* 按鈕 */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#E89874] hover:bg-[#d88763] disabled:opacity-50 text-white font-extrabold text-xs py-3 px-6 rounded-2xl flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer transition-colors border-none shadow-xs z-10"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span>Save Changes</span>
                      <PawPrint className="w-4 h-4 fill-white text-white shrink-0" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* 左下角貓咪裝飾圖 */}
            <img
              src="/未命名設計__1_-removebg-preview.png"
              alt="Decoration"
              className="absolute bottom-0 left-10 w-12 md:w-16 pointer-events-none z-0 opacity-90 select-none"
            />
          </div>

          {/* 右側：Account Summary & Wheel Rewards */}
          <div className="space-y-6">
            
            {/* Account Summary 卡片 */}
            <div className="bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-6 shadow-xs">
              <h2 className="text-lg font-black text-[#3D2C2E] mb-4">Account Summary</h2>
              
              <div className="divide-y divide-[#F2E8DC]">
                <div className="flex items-center gap-3 py-3.5 first:pt-0">
                  <div className="relative w-10 h-10 rounded-2xl bg-[#FDF3E7] border border-[#EADBC8] overflow-hidden shrink-0 flex items-center justify-center font-extrabold text-[#E89874] text-sm">
                    {profile?.avatarUrl ? (
                      <Image src={profile.avatarUrl} alt="Avatar" fill sizes="40px" className="object-cover" />
                    ) : (
                      profile?.name?.[0]?.toUpperCase() || '🐱'
                    )}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#8C7A6B]">Member since</p>
                    <p className="text-xs font-extrabold text-[#3D2C2E]">{formattedMemberSince}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#FDF3E7] border border-[#EADBC8] flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-[#E07A5F]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#8C7A6B]">Total Tasks</p>
                    <p className="text-xs font-extrabold text-[#3D2C2E]">
                      {profile?._count?.tasks ?? 0} Tasks
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-3.5 last:pb-0">
                  <div className="w-10 h-10 rounded-2xl bg-[#FDF3E7] border border-[#EADBC8] flex items-center justify-center">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#8C7A6B]">Categories Created</p>
                    <p className="text-xs font-extrabold text-[#3D2C2E]">
                      {profile?._count?.categories ?? 0} Categories
                    </p>
                  </div>
                </div>
              </div>
            </div>

           {/* My Rewards 卡片 */}
<div className="bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-6 shadow-xs">
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-2">
      <Gift className="w-5 h-5 text-[#E07A5F]" />
      <h2 className="text-lg font-black text-[#3D2C2E]">My Rewards</h2>
    </div>
    <span className="text-xs font-bold text-[#8C7A6B] bg-[#FAF6F0] border border-[#EADBC8] px-3 py-1 rounded-full">
      {drawnRewards.length} Won
    </span>
  </div>

  {isRewardsLoading ? (
    <div className="flex items-center justify-center py-10">
      <Loader2 className="w-6 h-6 animate-spin text-[#E89874]" />
    </div>
  ) : drawnRewards.length === 0 ? (
    <div className="text-center py-8 bg-[#FAF6F0]/60 border border-dashed border-[#EADBC8] rounded-2xl p-4">
      <Sparkles className="w-8 h-8 text-[#DFA382] mx-auto mb-2 opacity-60" />
      <p className="text-xs font-bold text-[#6C5B52]">No rewards yet</p>
      <p className="text-[11px] font-medium text-[#A08D80] mt-0.5">
        Spin the wheel to get exciting prizes! 🐾
      </p>
    </div>
  ) : (
    /* 改為 2 欄網格布局，放大圖片視覺 */
    <div className="grid grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
      {drawnRewards.map((reward, index) => {
        const isLatest = lastDraw?.rewardTitle === reward.title;

        // 轉為蛇形命名進行匹配
        const rawKey = reward.imageKey || reward.title || '';
        const normalizedKey = rawKey
          .trim()
          .toLowerCase()
          .replace(/[\s-]+/g, '_');

        const matchedAsset = REWARD_ASSETS[normalizedKey] || REWARD_ASSETS[rawKey];
        const displayImage = matchedAsset?.image || reward.imageUrl || (isLatest ? lastDraw?.imageUrl : null);
        const isRedeemed = isLatest && lastDraw?.isRedeemed;

        return (
          <div
            key={index}
            className={`group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-[#FAF6F0] border border-[#EADBC8]/70 hover:border-[#E89874] transition-all hover:shadow-xs text-center ${
              isRedeemed ? 'opacity-60 grayscale' : ''
            }`}
          >
            {/* 放大顯示圖片外框 */}
            <div className="relative w-20 h-20 rounded-2xl bg-[#FFFDF9] border border-[#EADBC8]/50 flex items-center justify-center shrink-0 shadow-xs p-2 mb-2 group-hover:scale-105 transition-transform">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={reward.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Gift className="w-10 h-10 text-[#E07A5F]" />
              )}
            </div>

            {/* 標題與日期 */}
            <p className="text-xs font-extrabold text-[#3D2C2E] line-clamp-1 w-full px-1">
              {reward.title}
            </p>
            
            

            {/* 已兌換時標示 */}
            {isRedeemed && (
              <span className="absolute top-2 right-2 text-[9px] font-extrabold text-[#8C7A6B] bg-[#EADBC8] px-1.5 py-0.5 rounded-md">
                Redeemed
              </span>
            )}
          </div>
        );
      })}
    </div>
  )}
</div>

          </div>

        </div>
      </div>
    </div>
  );
}