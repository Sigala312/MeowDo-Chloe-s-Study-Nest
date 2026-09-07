'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { ClipboardList, Plus, Check } from 'lucide-react';

export const TodaysFocus: React.FC = () => {
  const tasks = [
    { id: '1', title: 'Read 20 pages', tag: 'Study', tagBg: 'bg-[#EBF4EC]', tagText: 'text-[#4A7C59]', count: '2 Pomodoros', completed: false },
    { id: '2', title: 'Practice React API', tag: 'Coding', tagBg: 'bg-[#E6F0FA]', tagText: 'text-[#3B719F]', count: '3 Pomodoros', completed: true },
    { id: '3', title: 'Morning exercise', tag: 'Health', tagBg: 'bg-[#FDE8E8]', tagText: 'text-[#C55353]', count: '1 Pomodoro', completed: false },
    { id: '4', title: 'Review vocabulary', tag: 'Study', tagBg: 'bg-[#EBF4EC]', tagText: 'text-[#4A7C59]', count: '2 Pomodoros', completed: false },
  ];

  return (
    <Card className="p-6 bg-[#FAF6F0] rounded-3xl border border-[#EADBC8]/60 shadow-sm h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-[#8C7A6B]" />
            <h2 className="font-bold text-[#5C4B43]">Today's Focus</h2>
          </div>
          <button className="text-xs font-bold bg-[#F3E9DC] hover:bg-[#EADBC8] text-[#6C5B52] px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Task
          </button>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="p-3 bg-[#FFFDF9] rounded-2xl border border-[#EADBC8]/40 flex items-center justify-between shadow-sm hover:border-[#D0BBA2] transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FAF6F0] rounded-xl text-lg">📖</div>
                <div>
                  <h4 className={`text-sm font-bold ${task.completed ? 'line-through text-[#A08D80]' : 'text-[#4A3E3D]'}`}>{task.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${task.tagBg} ${task.tagText}`}>{task.tag}</span>
                    <span className="text-[11px] text-[#A08D80]">{task.count}</span>
                  </div>
                </div>
              </div>
              <input 
                type="checkbox" 
                defaultChecked={task.completed} 
                className="w-4 h-4 accent-[#E07A5F] rounded cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-xs font-bold text-[#8C7A6B] mt-4 flex items-center justify-center gap-1">
        🐱 You can do it! 🐾
      </div>
    </Card>
  );
};