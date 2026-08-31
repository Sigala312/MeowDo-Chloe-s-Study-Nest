'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Camera, 
  Lock, 
  MapPin, 
  Trophy, 
  Star, 
  Flame, 
  CheckCircle2,
  Circle,
  Loader2
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { usePageHeader } from '../../components/context/PageHeaderContext'; // 引入 Context

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

export default function ProfileSettingsPage() {
  const { setHeader } = usePageHeader();

  // Loading & State
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // 表單 State
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');

  // 第三方連結 State
  const [accounts, setAccounts] = useState({
    google: true,
    apple: true,
    line: false,
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // 1. 設定頁面動態 Header 並 Fetch Profile Data
  useEffect(() => {
    // 設定全域 Header 標題與副標題
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
  }, [setHeader, API_URL]);

  const toggleAccount = (provider: keyof typeof accounts) => {
    setAccounts((prev) => ({ ...prev, [provider]: !prev[provider] }));
  };

  // 2. 處理頭像更換 ( Base64 上傳並通知 Header 同步)
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

      // 即時預覽
      setProfile((prev) => (prev ? { ...prev, avatarUrl: base64String } : null));

      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/user/profile`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            avatarUrl: base64String,
          }),
        });

        const result = await res.json();
        if (res.ok && result.success) {
          alert('Avatar updated successfully! 🐾');
          // 關鍵：觸發全域事件，讓右上角的全域 Header 也能同步更換大頭照！
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

  // 3. 處理個人資料更新
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
        // 通知 Header 使用者名稱已更換
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2]">
        <Loader2 className="w-8 h-8 animate-spin text-[#E89874]" />
      </div>
    );
  }

  return (
    // 上方加上 pt-20，留出空間給全域 Header 浮動置頂
    <div className="relative w-full min-h-screen bg-[#FAF7F2] p-6 md:p-8 pt-20 md:pt-24 font-sans">
      <div className="max-w-[1280px] mx-auto space-y-6">
        
        {/* 主內容 layout (兩欄式) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* 左側：Profile Information (佔 2 欄) */}
          <div className="lg:col-span-2 bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-6 md:p-8 shadow-xs">
            <h2 className="text-lg font-black text-[#3D2C2E] mb-6">Profile Information</h2>

            <form onSubmit={handleSave} className="space-y-6">
              {/* 頭像區域 */}
              <div className="flex flex-col items-center sm:items-start gap-3">
                <div className="relative w-32 h-32">
                  <div className="w-full h-full rounded-full border-4 border-[#FDF3E7] shadow-inner bg-[#F4E2D8] overflow-hidden relative flex items-center justify-center text-4xl font-black text-[#E89874]">
                    {profile?.avatarUrl ? (
                      <Image
                        src={profile.avatarUrl}
                        alt="Profile Avatar"
                        fill
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
                <div className="relative">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FAF6F0] border border-[#EADBC8] text-xs font-bold text-[#3D2C2E] outline-none focus:border-[#E07A5F] transition-colors pr-10"
                  />
                  <span className="absolute right-3.5 top-3 text-base pointer-events-none opacity-80">🐱</span>
                </div>
              </div>

              {/* Email (Disabled / Locked) */}
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

              {/* Bio (Optional) */}
              <div>
                <label className="block text-xs font-extrabold text-[#3D2C2E] mb-1.5">
                  Bio (Optional)
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

              {/* Location (Optional) */}
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

              {/* Save Button */}
              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSaving}
                  className="bg-[#E89874] hover:bg-[#d88763] text-white border-none shadow-xs text-xs font-extrabold py-3 px-6 rounded-2xl flex items-center gap-2 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      Save Changes <span>🐾</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* 右側：Account Summary & Connected Accounts (佔 1 欄) */}
          <div className="space-y-6">
            
            {/* Account Summary 卡片 */}
            <div className="bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-6 shadow-xs">
              <h2 className="text-lg font-black text-[#3D2C2E] mb-4">Account Summary</h2>
              
              <div className="divide-y divide-[#F2E8DC]">
                <div className="flex items-center gap-3 py-3.5 first:pt-0">
                  <div className="relative w-10 h-10 rounded-2xl bg-[#FDF3E7] border border-[#EADBC8] overflow-hidden shrink-0 flex items-center justify-center font-extrabold text-[#E89874] text-sm">
                    {profile?.avatarUrl ? (
                      <Image src={profile.avatarUrl} alt="Avatar" fill className="object-cover" />
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

                <div className="flex items-center gap-3 py-3.5">
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

                <div className="flex items-center gap-3 py-3.5 last:pb-0">
                  <div className="w-10 h-10 rounded-2xl bg-[#FDF3E7] border border-[#EADBC8] flex items-center justify-center">
                    <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#8C7A6B]">Current Streak</p>
                    <p className="text-xs font-extrabold text-[#3D2C2E]">7 days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Connected Accounts 卡片 */}
            <div className="bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-6 shadow-xs">
              <h2 className="text-lg font-black text-[#3D2C2E] mb-4">Connected Accounts</h2>

              <div className="space-y-4">
                {/* Google */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white border border-[#EADBC8] flex items-center justify-center shadow-2xs">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-[#3D2C2E]">Google</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {accounts.google ? (
                      <>
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                        </span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => toggleAccount('google')}
                          className="text-[11px] font-bold text-[#6C5B52] bg-[#FAF6F0] border-[#EADBC8] hover:bg-[#EADBC8] py-1 px-3 rounded-xl cursor-pointer"
                        >
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="flex items-center gap-1 text-[11px] font-bold text-[#A08D80]">
                          <Circle className="w-3.5 h-3.5" /> Not connected
                        </span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => toggleAccount('google')}
                          className="text-[11px] font-bold text-[#3D2C2E] bg-[#FAF6F0] border-[#EADBC8] hover:bg-[#EADBC8] py-1 px-3 rounded-xl cursor-pointer"
                        >
                          Connect
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Apple */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white border border-[#EADBC8] flex items-center justify-center shadow-2xs">
                      <svg className="w-4 h-4 fill-black" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.62-.76 1.05-1.83.93-2.85-.9.04-2.01.6-2.65 1.35-.57.66-1.07 1.74-.93 2.75 1.02.08 2.03-.49 2.65-1.25z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-[#3D2C2E]">Apple</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {accounts.apple ? (
                      <>
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                        </span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => toggleAccount('apple')}
                          className="text-[11px] font-bold text-[#6C5B52] bg-[#FAF6F0] border-[#EADBC8] hover:bg-[#EADBC8] py-1 px-3 rounded-xl cursor-pointer"
                        >
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="flex items-center gap-1 text-[11px] font-bold text-[#A08D80]">
                          <Circle className="w-3.5 h-3.5" /> Not connected
                        </span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => toggleAccount('apple')}
                          className="text-[11px] font-bold text-[#3D2C2E] bg-[#FAF6F0] border-[#EADBC8] hover:bg-[#EADBC8] py-1 px-3 rounded-xl cursor-pointer"
                        >
                          Connect
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* LINE */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#00B900] flex items-center justify-center text-white font-black text-[10px]">
                      LINE
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-[#3D2C2E]">LINE</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {accounts.line ? (
                      <>
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                        </span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => toggleAccount('line')}
                          className="text-[11px] font-bold text-[#6C5B52] bg-[#FAF6F0] border-[#EADBC8] hover:bg-[#EADBC8] py-1 px-3 rounded-xl cursor-pointer"
                        >
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="flex items-center gap-1 text-[11px] font-bold text-[#A08D80]">
                          <Circle className="w-3.5 h-3.5" /> Not connected
                        </span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => toggleAccount('line')}
                          className="text-[11px] font-bold text-[#3D2C2E] bg-[#FAF6F0] border-[#EADBC8] hover:bg-[#EADBC8] py-1 px-3 rounded-xl cursor-pointer"
                        >
                          Connect
                        </Button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}