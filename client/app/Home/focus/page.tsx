'use client';

import React, { useState } from 'react';
import { FocusHeader } from '../../components/focus/FocusHeader';
import { FocusTimerCard } from '../../components/focus/FocusTimerCard';
import { FocusSessionFlow } from '../../components/focus/FocusSessionFlow';
import { FocusSessionsList, SessionItem } from '../../components/focus/FocusSessionsList';
import { FocusStats } from '../../components/focus/FocusStats';
import { AmbientPlayer } from '../../components/focus/AmbientPlayer';

const INITIAL_SESSIONS: SessionItem[] = [
  { id: 1, title: 'Focus #1', duration: '25 min', time: '9:00 AM', status: 'completed' },
  { id: 2, title: 'Focus #2', duration: '25 min', time: '10:00 AM', status: 'completed' },
  { id: 3, title: 'Focus #3', duration: '25 min', time: 'In progress', status: 'in_progress' },
  { id: 4, title: 'Focus #4', duration: '25 min', time: '—', status: 'pending' },
  { id: 5, title: 'Focus #5', duration: '25 min', time: '—', status: 'pending' },
];

export default function FocusPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [taskTitle, setTaskTitle] = useState('React API 串接');

  return (
    <div className="relative min-h-screen p-6 md:p-8 space-y-6 max-w-[1200px] mx-auto">
      {/* 1. Header */}
      <FocusHeader completedSessions={3} totalSessions={5} />

      {/* 2. 計時器核心卡片 */}
      <FocusTimerCard
        taskTitle={taskTitle}
        timeLeft="24:37"
        isRunning={isRunning}
        onToggleTimer={() => setIsRunning(!isRunning)}
        onResetTimer={() => setIsRunning(false)}
      />

      {/* 3. 番茄流程條 */}
      <FocusSessionFlow />

      {/* 4. 雙欄：今日紀錄 + 統計 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FocusSessionsList sessions={INITIAL_SESSIONS} />
        <FocusStats totalTime="1h 15m" completedSessions={3} xpEarned={150} />
      </div>

      {/* 5. 底部音樂與背景音播放器 */}
      <AmbientPlayer />
    </div>
  );
}