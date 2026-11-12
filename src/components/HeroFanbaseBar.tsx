'use client';

import React from 'react';
import Image from 'next/image';
import { FANBASE_LIST } from '@/data/teluguCinemaDatabase';
import { useUser } from '@/utils/userContext';
import { soundManager } from '@/utils/audio';
import clsx from 'clsx';

const CHARACTER_ART_MAP: Record<string, { image: string; tag: string; bg: string }> = {
  Darling: {
    image: '/images/characters/darling.png',
    tag: '🦖 REBEL STAR • PRABHAS',
    bg: '#EC1276',
  },
  Tarak: {
    image: '/images/characters/tarak.png',
    tag: '🐅 YOUNG TIGER • JR NTR',
    bg: '#F6BE18',
  },
  'Natural Star': {
    image: '/images/characters/nani.png',
    tag: '🏏 NATURAL STAR • NANI',
    bg: '#00E5FF',
  },
};

export function HeroFanbaseBar() {
  const { profile, setFanIdentity } = useUser();

  const handleSelect = (id: any) => {
    soundManager.playClick(720);
    setFanIdentity(id);
  };

  const activeFan = FANBASE_LIST.find(f => f.id === profile.fanIdentity) || FANBASE_LIST[0];
  const activeChar = CHARACTER_ART_MAP[profile.fanIdentity];

  return (
    <div className="w-full flex flex-col items-center gap-3">
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

      {/* Dynamic Character Spotlight Banner when Tarak, Darling, or Nani is active */}
      {activeChar && (
        <div className="w-full max-w-xl mx-auto mt-1 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-white border-[3px] border-[#141313] rounded-2xl p-3 shadow-[4px_4px_0_#141313] flex items-center justify-between gap-3 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-20 shrink-0">
                <Image
                  src={activeChar.image}
                  alt={activeFan.hero}
                  fill
                  className="object-contain drop-shadow-[2px_2px_0_#141313]"
                  sizes="64px"
                />
              </div>
              <div className="space-y-0.5 text-left">
                <span
                  className="inline-block text-[10px] font-black uppercase text-white px-2 py-0.5 rounded border border-[#141313] shadow-[1px_1px_0_#141313]"
                  style={{ backgroundColor: activeChar.bg }}
                >
                  {activeChar.tag}
                </span>
                <div className="font-telugu font-black text-sm text-[#141313]">
                  &ldquo;{activeFan.dialogue}&rdquo;
                </div>
                <div className="text-[10px] font-mono font-bold text-gray-500">
                  Fanbase: {activeFan.name} • {activeFan.title}
                </div>
              </div>
            </div>

            <div className="shrink-0 hidden sm:block">
              <span className="bg-[#FFF9E6] border border-[#141313] text-[10px] font-black uppercase px-2 py-1 rounded shadow-[2px_2px_0_#141313]">
                ACTIVE AVATAR
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


