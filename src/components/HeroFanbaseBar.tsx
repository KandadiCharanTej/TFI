'use client';

import React from 'react';
import { FANBASE_LIST } from '@/data/teluguCinemaDatabase';
import { useUser } from '@/utils/userContext';
import { soundManager } from '@/utils/audio';
import clsx from 'clsx';

export function HeroFanbaseBar() {
  const { profile, setFanIdentity } = useUser();

  const handleSelect = (id: any) => {
    soundManager.playClick(720);
    setFanIdentity(id);
  };

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-black uppercase tracking-wider bg-[#141313] text-[#F6BE18] px-3 py-1 rounded-lg border border-[#141313] shadow-[2px_2px_0_#141313]">
          SLAP YOUR HERO STICKER:
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl px-2">
        {FANBASE_LIST.map(fan => {
          const isSelected = profile.fanIdentity === fan.id;
          return (
            <button
              key={fan.id}
              onClick={() => handleSelect(fan.id)}
              className={clsx(
                'border-[2.5px] border-[#141313] px-3.5 py-1.5 rounded-xl font-black text-xs uppercase cursor-pointer',
                'transition-all duration-120 flex items-center gap-1.5',
                isSelected
                  ? 'bg-[#EC1276] text-white shadow-[4px_4px_0_#141313] -translate-y-0.5 rotate-[-1deg]'
                  : 'bg-white text-[#141313] shadow-[2px_2px_0_#141313] hover:-translate-y-0.5 hover:bg-[#F4F1EA]'
              )}
            >
              <span>{fan.icon}</span>
              <span>{fan.id}</span>
              <span className="text-[10px] opacity-75 hidden sm:inline">({fan.hero.split(' ')[0]})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
