'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { ArrowRight, Calendar } from 'lucide-react';

interface UpcomingGroup {
  dateLabel: string;
  items: { id: string; title: string }[];
}

const upcomingGroups: UpcomingGroup[] = [
  {
    dateLabel: 'Tomorrow',
    items: [
      { id: '1', title: 'Practice React API' },
      { id: '2', title: 'Write diary' },
    ],
  },
  {
    dateLabel: 'Aug 17 (Sun)',
    items: [{ id: '3', title: 'Review vocabulary' }],
  },
  {
    dateLabel: 'Aug 18 (Mon)',
    items: [{ id: '4', title: 'Finish portfolio' }],
  },
];

export const UpcomingTasks: React.FC = () => {
  return (
    <Card className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold text-[#3D2C2E]">Upcoming</h3>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#8C7A6B] hover:text-[#E07A5F] transition-colors"
        >
          <Calendar className="w-3.5 h-3.5" />
          View Calendar <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Date Groups Container */}
      <div className="bg-[#FAF5EE]/70 rounded-2xl p-4 space-y-3.5 border border-[#EADBC8]/40">
        {upcomingGroups.map((group) => (
          <div key={group.dateLabel} className="space-y-2">
            <span className="text-xs font-extrabold text-[#8C7A6B] block">
              {group.dateLabel}
            </span>
            <div className="space-y-1.5">
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 text-xs font-bold text-[#3D2C2E]"
                >
                  <div className="w-4 h-4 rounded-md border-2 border-[#D5C4B3] bg-white shrink-0" />
                  <span>{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};