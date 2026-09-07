'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Music, Settings, Heart, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2 } from 'lucide-react';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <Card className="p-6 bg-[#FAF6F0] rounded-3xl border border-[#EADBC8]/60 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-[#8C7A6B]" />
          <h2 className="font-bold text-[#5C4B43]">Music Player</h2>
        </div>
        <button className="text-[#A08D80] hover:text-[#5C4B43]">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* 專輯封面與曲目名稱 */}
      <div className="flex items-center gap-4 bg-[#FFFDF9] p-3 rounded-2xl border border-[#EADBC8]/40 shadow-sm relative">
        <div className="w-16 h-16 bg-[#D8E2DC] rounded-xl flex-shrink-0 flex items-center justify-center text-2xl shadow-inner">
          🌊
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-extrabold text-[#4A3E3D] text-sm truncate">lofi vibes</h4>
          <p className="text-xs text-[#A08D80] truncate">Chill Study Playlist</p>
        </div>
        <button className="text-[#E07A5F] hover:scale-110 transition-transform">
          <Heart className="w-5 h-5 fill-current" />
        </button>
      </div>

      {/* 進度條 */}
      <div className="mt-4">
        <div className="w-full bg-[#EADBC8]/60 h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#E07A5F] h-full w-1/3 rounded-full" />
        </div>
        <div className="flex justify-between text-[10px] font-bold text-[#A08D80] mt-1">
          <span>1:32</span>
          <span>3:24</span>
        </div>
      </div>

      {/* 控制按鈕區 */}
      <div className="flex items-center justify-between text-[#8C7A6B] mt-2">
        <button className="hover:text-[#5C4B43]"><Shuffle className="w-4 h-4" /></button>
        <button className="hover:text-[#5C4B43]"><SkipBack className="w-4 h-4" /></button>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 bg-[#E07A5F] hover:bg-[#D0694E] text-white rounded-full flex items-center justify-center shadow-md transition-all active:scale-95"
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>
        <button className="hover:text-[#5C4B43]"><SkipForward className="w-4 h-4" /></button>
        <button className="hover:text-[#5C4B43]"><Repeat className="w-4 h-4" /></button>
      </div>

      {/* 音量控制與吉祥物 */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#EADBC8]/40">
        <div className="flex items-center gap-2 w-1/2">
          <Volume2 className="w-4 h-4 text-[#A08D80]" />
          <input type="range" className="w-full accent-[#E07A5F] h-1 bg-[#EADBC8] rounded-lg" />
        </div>
        <span className="text-sm">🐱🎵</span>
      </div>
    </Card>
  );
};