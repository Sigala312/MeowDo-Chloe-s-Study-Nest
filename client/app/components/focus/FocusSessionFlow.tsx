'use client';

import React from 'react';

export const FocusSessionFlow: React.FC = () => {
  const steps = [
    { type: 'Focus', time: '25 min', icon: '🍅', active: true },
    { type: 'Short Break', time: '5 min', icon: '☕', active: false },
    { type: 'Focus', time: '25 min', icon: '🍅', active: false },
    { type: 'Long Break', time: '15 min', icon: '🫐', active: false },
  ];

  return (
    <div className="bg-[#FFFDF9] border border-[#EADBC8] rounded-2xl p-4 flex items-center justify-around gap-2 shadow-xs overflow-x-auto">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div
            className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-all shrink-0 ${
              step.active
                ? 'bg-[#FDF3E7] border-[#E89874] shadow-2xs'
                : 'bg-[#FAF6F0]/50 border-transparent text-[#8C7A6B]'
            }`}
          >
            <span className="text-xl">{step.icon}</span>
            <div>
              <p className="text-xs font-black text-[#3D2C2E]">{step.type}</p>
              <p className="text-[10px] font-bold text-[#8C7A6B]">{step.time}</p>
            </div>
          </div>

          {index < steps.length - 1 && (
            <span className="text-[#D0BBA2] font-bold text-sm shrink-0">→</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};