'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, Pause, SkipBack, SkipForward, Volume2, CloudRain } from 'lucide-react';

export const AmbientPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
      {/* 膠帶裝飾 */}
      <div className="absolute top-2 left-4 w-12 h-3 bg-[#E2C7B3]/60 -rotate-6 rounded-xs" />

      {/* 音樂區塊 */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-[#EADBC8] shrink-0">
          <Image
            src="/未命名設計__1_-removebg-preview.png"
            alt="Lofi Cover"
            fill
            className="object-cover bg-[#F4E2D8]"
          />
        </div>

        <div>
          <span className="text-xs font-extrabold text-[#3D2C2E] flex items-center gap-1">
            Focus with Mochi 🎧
          </span>
          <h4 className="text-sm font-black text-[#3D2C2E] mt-0.5">lofi study beats</h4>
          <p className="text-xs font-bold text-[#8C7A6B]">Chill & focus</p>
        </div>

        {/* 播放控制項 */}
        <div className="flex items-center gap-2 ml-auto md:ml-6">
          <button className="p-1.5 text-[#8C7A6B] hover:text-[#3D2C2E]">
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-9 h-9 rounded-full bg-[#3D2C2E] text-white flex items-center justify-center hover:bg-[#2A1E1F] shadow-xs"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>
          <button className="p-1.5 text-[#8C7A6B] hover:text-[#3D2C2E]">
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 背景白噪音設定 */}
      <div className="flex items-center gap-4 w-full md:w-auto bg-[#FAF6F0] p-3 rounded-2xl border border-[#EADBC8]">
        <span className="text-xs font-extrabold text-[#3D2C2E] whitespace-nowrap">
          Background Sound
        </span>

        <div className="flex items-center gap-2 bg-[#FFFDF9] border border-[#EADBC8] rounded-xl px-3 py-1.5">
          <CloudRain className="w-4 h-4 text-[#8C7A6B]" />
          <select className="text-xs font-bold bg-transparent text-[#3D2C2E] outline-none cursor-pointer">
            <option>Rain</option>
            <option>Cafe</option>
            <option>Forest</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-[#8C7A6B]" />
          <input
            type="range"
            min="0"
            max="100"
            defaultValue="60"
            className="w-20 accent-[#5C4033] h-1.5 bg-[#EADBC8] rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};