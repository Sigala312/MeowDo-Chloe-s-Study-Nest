// 在顯示罐頭數量的元件中 (例如 TomatoBadge.tsx 或 Header.tsx)
import React, { useState, useEffect, useCallback } from 'react';

export const TomatoBadge = () => {
  const [tomatoes, setTomatoes] = useState<number>(0);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // 抓取最新的罐頭/番茄數量
  const fetchTomatoes = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${API_URL}/api/wheel/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (res.ok && result.success) {
        // 假設後端回傳的是 result.data.tomatoes
        setTomatoes(result.data.tomatoes);
      }
    } catch (err) {
      console.error('Failed to fetch tomato count:', err);
    }
  }, [API_URL]);

  useEffect(() => {
    // 頁面首次載入時抓取一次
    fetchTomatoes();

    // 監聽來自 TodayTasks 的廣播事件
    const handleUpdate = () => {
      fetchTomatoes();
    };

    window.addEventListener('cat-food-updated', handleUpdate);
    window.addEventListener('tomatoes-updated', handleUpdate);

    return () => {
      window.removeEventListener('cat-food-updated', handleUpdate);
      window.removeEventListener('tomatoes-updated', handleUpdate);
    };
  }, [fetchTomatoes]);

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF9F3] border border-[#F5E6D8]">
      <span className="text-base select-none">🥫</span>
      <span className="text-xs font-black text-[#3D2C2E]">{tomatoes}</span>
    </div>
  );
};