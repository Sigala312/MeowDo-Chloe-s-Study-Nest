'use client';

import React from 'react';
import { Check } from 'lucide-react';

export interface SessionItem {
  id: number;
  title: string;
  duration: string;
  time: string;
  status: 'completed' | 'in_progress' | 'pending';
}

interface FocusSessionsListProps {
  sessions: SessionItem[];
}

export const FocusSessionsList: React.FC<FocusSessionsListProps> = ({ sessions }) => {
  const completedCount = sessions.filter((s) => s.status === 'completed').length;

  return (
    <div className="bg-[#FFFDF9] border border-[#EADBC8] rounded-3xl p-6 shadow-xs flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-extrabold text-[#3D2C2E]">Today's Focus Sessions</h3>
        <span className="text-xs font-bold text-[#8C7A6B]">
          {completedCount} / {sessions.length} completed
        </span>
      </div>

      <div className="space-y-2.5">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`flex items-center justify-between p-3 rounded-2xl border transition-colors ${
              session.status === 'in_progress'
                ? 'bg-[#FDF3E7] border-[#E89874]'
                : 'bg-[#FAF6F0]/60 border-[#EADBC8]/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">🍅</span>
              <div>
                <h4 className="text-xs font-black text-[#3D2C2E]">{session.title}</h4>
                <p className="text-[10px] font-bold text-[#8C7A6B]">{session.duration}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#8C7A6B]">{session.time}</span>
              {session.status === 'completed' && (
                <div className="w-5 h-5 rounded-full bg-[#E2C7B3] flex items-center justify-center text-white">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
              {session.status === 'in_progress' && (
                <span className="text-xs font-extrabold text-[#E07A5F] bg-[#FFFDF9] px-2 py-0.5 rounded-lg border border-[#E07A5F]/30">
                  In progress
                </span>
              )}
              {session.status === 'pending' && (
                <span className="text-xs font-bold text-[#B0A397]">—</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};