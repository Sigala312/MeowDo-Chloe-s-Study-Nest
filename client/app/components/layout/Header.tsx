'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, CheckCheck, Trash2, Eye, Check } from 'lucide-react';
import { usePageHeader } from '../context/PageHeaderContext';
import { DropdownMenu, UserProfile } from '../ui/DropdownMenu';
import { TomatoBadge } from '../ui/TomatoBadge';

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  content: string;
  isRead: boolean;
  linkUrl?: string;
  createdAt: string;
}

export default function Header() {
  const router = useRouter();
  const { title, subtitle } = usePageHeader();
  const [user, setUser] = useState<UserProfile | null>(null);

  // 通知相關 State
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // 1. 抓取未讀通知數量
  const fetchUnreadCount = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${API_URL}/api/notification/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setUnreadCount(result.data.count);
      }
    } catch (err) {
      console.error('Failed to fetch unread notification count:', err);
    }
  }, [API_URL]);

  // 2. 抓取通知列表
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${API_URL}/api/notification`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setNotifications(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  // 3. 抓取 User Profile & 初始化通知計數
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch(`${API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await res.json();
        if (res.ok && result.success) {
          setUser({
            name: result.data.name,
            email: result.data.email,
            avatarUrl: result.data.avatarUrl,
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile in Header:', err);
      }
    };

    fetchUserProfile();
    fetchUnreadCount();

    window.addEventListener('user-profile-updated', fetchUserProfile);
    window.addEventListener('notification-updated', fetchUnreadCount);

    return () => {
      window.removeEventListener('user-profile-updated', fetchUserProfile);
      window.removeEventListener('notification-updated', fetchUnreadCount);
    };
  }, [API_URL, fetchUnreadCount]);

  // 4. 點擊外部自動關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 切換選單顯示狀態
  const toggleDropdown = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen((prev) => !prev);
  };

  // 標記單筆或全部已讀
  const handleMarkAsRead = async (notificationIds?: string[], e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${API_URL}/api/notification/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notificationIds }),
      });

      if (res.ok) {
        if (notificationIds && notificationIds.length > 0) {
          setNotifications((prev) =>
            prev.map((item) =>
              notificationIds.includes(item.id) ? { ...item, isRead: true } : item
            )
          );
        } else {
          setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
        }
        fetchUnreadCount();
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  // 刪除單筆通知
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${API_URL}/api/notification/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setNotifications((prev) => prev.filter((item) => item.id !== id));
        fetchUnreadCount();
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  // 點擊通知項目：僅標為已讀，不進入連結
  const handleItemClick = (item: NotificationItem) => {
    if (!item.isRead) {
      handleMarkAsRead([item.id]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-8 pt-6 pb-2 pointer-events-none">
      {/* 定義 YT 風格鈴鐺左右搖晃動畫 */}
      <style jsx global>{`
        @keyframes bell-ring {
          0% { transform: rotate(0); }
          15% { transform: rotate(15deg); }
          30% { transform: rotate(-15deg); }
          45% { transform: rotate(10deg); }
          60% { transform: rotate(-10deg); }
          75% { transform: rotate(5deg); }
          85% { transform: rotate(-5deg); }
          100% { transform: rotate(0); }
        }
        .group:hover .animate-bell-ring {
          animation: bell-ring 0.8s ease-in-out forwards;
          transform-origin: top center;
        }
      `}</style>

      <div className="pointer-events-auto">
        {title && (
          <h1 className="text-2xl md:text-3xl font-black text-[#3D2C2E] flex items-center gap-2">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-xs md:text-sm font-bold text-[#8C7A6B] mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* 右上角按鈕組 */}
      <div className="flex items-center gap-3 pointer-events-auto ml-auto">
        <TomatoBadge  />

        {/* 通知鈴鐺與下拉選單 */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={toggleDropdown}
            className="group relative p-2.5 rounded-2xl bg-[#FFFDF9]/80 backdrop-blur-md border border-[#EADBC8] text-[#6C5B52] hover:bg-white transition-all shadow-xs cursor-pointer overflow-visible"
          >
            <Bell className="w-4 h-4 animate-bell-ring" />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3 z-10">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E07A5F] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E07A5F] border-2 border-white"></span>
              </span>
            )}
          </button>

          {/* 下拉選單面板 */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-2xl bg-[#FFFDF9]/95 backdrop-blur-md border border-[#EADBC8] shadow-xl z-50 overflow-hidden flex flex-col max-h-[480px]">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#EADBC8]/60 bg-white/50">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-[#3D2C2E] text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#E07A5F]/10 text-[#E07A5F] font-semibold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={(e) => handleMarkAsRead(undefined, e)}
                    className="text-xs font-semibold text-[#8C7A6B] hover:text-[#E07A5F] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="overflow-y-auto flex-1 divide-y divide-[#EADBC8]/30">
                {isLoading ? (
                  <div className="py-8 text-center text-xs text-[#8C7A6B] font-bold">
                    Loading notifications...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#8C7A6B] font-bold">
                    No notifications yet 🐾
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 relative group/item ${
                        item.isRead ? 'bg-transparent opacity-70' : 'bg-[#E07A5F]/5'
                      } hover:bg-white/80`}
                    >
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#E07A5F] mt-1.5 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <p className="text-xs font-black text-[#3D2C2E] truncate">
                            {item.title}
                          </p>
                          <span className="text-[10px] text-[#8C7A6B] shrink-0">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-[#6C5B52] leading-relaxed">
                          {item.content}
                        </p>
                      </div>

                      {/* Action Icons (Mark as Read / Delete) */}
                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity">
                        {!item.isRead ? (
                          <button
                            onClick={(e) => handleMarkAsRead([item.id], e)}
                            className="p-1 rounded-md text-[#8C7A6B] hover:text-[#E07A5F] hover:bg-[#FAF6F0] transition-colors cursor-pointer"
                            title="Mark as read"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span title="Read">
                            <Check className="w-3.5 h-3.5 text-[#7A9A70] p-0.5" />
                          </span>
                        )}
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="p-1 rounded-md text-[#8C7A6B] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <DropdownMenu user={user} onLogout={handleLogout} align="right" />
      </div>
    </div>
  );
}