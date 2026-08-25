'use client';

import React, { useState } from 'react';
import { RouletteHeader } from '../../components/roulette/RouletteHeader';
import { RouletteWheel, Reward } from '../../components/roulette/RouletteWheel';
import { RewardsList } from '../../components/roulette/RewardsList';
import { RecentHistory, HistoryItem } from '../../components/roulette/RecentHistory';
import { WeeklyProgress } from '../../components/roulette/WeeklyProgress';

const REWARDS: Reward[] = [
  { id: 1, title: '50 XP', icon: '⭐', desc: 'Gain 50 EXP' },
  { id: 2, title: 'Snack x1', icon: '🐟', desc: 'Get a virtual snack' },
  { id: 3, title: 'Random Reward', icon: '🎁', desc: 'Surprise is waiting!' },
  { id: 4, title: 'Take a Break', icon: '❤️', desc: 'Take a 10-min break' },
  { id: 5, title: 'Focus Time +15 min', icon: '📖', desc: 'Add 15 min to your timer' },
  { id: 6, title: 'Drink x1', icon: '🍵', desc: 'Get a virtual drink' },
];

const RECENT_HISTORY: HistoryItem[] = [
  { id: 1, title: '50 XP', icon: '⭐', time: 'May 16, 2024 10:24 AM' },
  { id: 2, title: 'Snack x1', icon: '🐟', time: 'May 15, 2024 7:41 PM' },
  { id: 3, title: 'Take a Break (10 min)', icon: '❤️', time: 'May 14, 2024 3:18 PM' },
  { id: 4, title: 'Focus Time +15 min', icon: '📖', time: 'May 13, 2024 9:05 AM' },
  { id: 5, title: 'Random Reward', icon: '🎁', time: 'May 12, 2024 6:32 PM' },
];

export default function RoulettePage() {
  const [spinsLeft, setSpinsLeft] = useState(2);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonReward, setWonReward] = useState<Reward | null>(null);

  const handleSpin = () => {
    if (isSpinning || spinsLeft <= 0) return;

    setIsSpinning(true);
    setWonReward(null);

    const prizeIndex = Math.floor(Math.random() * REWARDS.length);
    const sectorAngle = 360 / REWARDS.length;
    const targetSectorCenter = 360 - (prizeIndex * sectorAngle + sectorAngle / 2);
    const totalNewRotation = rotation + 1800 + (targetSectorCenter - (rotation % 360));

    setRotation(totalNewRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setSpinsLeft((prev) => prev - 1);
      setWonReward(REWARDS[prizeIndex]);
    }, 4500);
  };

  return (
    <div className="relative min-h-screen p-6 md:p-8 space-y-8 max-w-[1200px] mx-auto">
      {/* 頂部 Header */}
      <RouletteHeader spinsLeft={spinsLeft} />

      {/* 中央輪盤 */}
      <RouletteWheel
        rewards={REWARDS}
        rotation={rotation}
        isSpinning={isSpinning}
        spinsLeft={spinsLeft}
        wonReward={wonReward}
        onSpin={handleSpin}
      />

      {/* 下方雙欄：獎品表 & 歷史紀錄 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RewardsList rewards={REWARDS} />
        <RecentHistory history={RECENT_HISTORY} />
      </div>

      {/* 底部週進度 */}
      <WeeklyProgress earnedSpins={4} maxSpins={7} />
    </div>
  );
}