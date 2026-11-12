'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DieCutCard } from '@/components/DieCutCard';
import { AcampButton } from '@/components/AcampButton';
import { useUser } from '@/utils/userContext';
import { FANBASE_LIST } from '@/data/teluguCinemaDatabase';
import { FanIdentity, LanguagePref } from '@/types';
import { soundManager } from '@/utils/audio';
import { User, Volume2, VolumeX, Smartphone, Globe, Trophy, Check, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';

const CHARACTER_MAP: Record<string, { image: string; tag: string; bg: string }> = {
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

export default function ProfilePage() {
  const { profile, updateProfile, setFanIdentity, setLanguagePref, toggleSound, toggleHaptics } = useUser();
  const [nameInput, setNameInput] = useState<string>(profile.name);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    soundManager.playClick();
    updateProfile({ name: nameInput.trim() });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const activeFan = FANBASE_LIST.find(f => f.id === profile.fanIdentity) || FANBASE_LIST[0];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/" className="text-xs font-black uppercase bg-white border border-[#141313] px-2.5 py-1 rounded-lg">
          ← Back to Home
        </Link>
        <span className="font-mono text-xs font-bold bg-[#EAE6DF] px-2.5 py-1 rounded-lg border border-[#141313]">
          ID: {profile.id}
        </span>
      </div>

      <div className="text-center space-y-1">
        <span className="bg-[#EC1276] text-white font-black text-xs uppercase px-3 py-1 rounded-md border border-[#141313]">
          PLAYER SETTINGS
        </span>
        <h1 className="font-block text-4xl sm:text-5xl uppercase text-[#141313] tracking-tight">
          PRODUCER PROFILE
        </h1>
        <p className="text-xs font-bold text-[#141313]/70">
          Customize your nickname, fan identity, audio preferences, and script display.
        </p>
      </div>

      {/* Active Hero Identity Banner */}
      {CHARACTER_MAP[profile.fanIdentity] && (
        <div className="bg-[#FFF9E6] border-[3px] border-[#141313] rounded-2xl p-4 shadow-[4px_4px_0_#141313] flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-24 shrink-0">
              <Image
                src={CHARACTER_MAP[profile.fanIdentity].image}
                alt={activeFan.hero}
                fill
                className="object-contain drop-shadow-[3px_3px_0_#141313]"
                sizes="80px"
              />
            </div>
            <div>
              <span
                className="inline-block text-[10px] font-black uppercase text-white px-2 py-0.5 rounded border border-[#141313] shadow-[1px_1px_0_#141313]"
                style={{ backgroundColor: CHARACTER_MAP[profile.fanIdentity].bg }}
              >
                {CHARACTER_MAP[profile.fanIdentity].tag}
              </span>
              <div className="font-block text-2xl uppercase text-[#141313] mt-1">
                {activeFan.name}
              </div>
              <div className="font-telugu font-black text-sm text-[#EC1276]">
                &ldquo;{activeFan.dialogue}&rdquo;
              </div>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-[10px] font-mono text-gray-500 uppercase">OFFICIAL HERO</div>
            <div className="font-block text-lg text-[#141313]">{activeFan.hero}</div>
          </div>
        </div>
      )}

      <DieCutCard className="p-6 space-y-6">
        
        {/* Name input */}
        <form onSubmit={handleSaveName} className="space-y-2">
          <label className="block font-black text-xs uppercase tracking-wider text-[#141313]">
            Producer Display Name:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              maxLength={20}
              className="flex-1 bg-white border-[2.5px] border-[#141313] px-3.5 py-2 rounded-xl font-bold text-sm shadow-[2px_2px_0_#141313] focus:bg-[#FFF9E6] focus:outline-none"
            />
            <AcampButton type="submit" variant="yellow" size="md">
              Save
            </AcampButton>
          </div>
          {savedNotice && (
            <div className="text-xs font-black text-[#00C853] flex items-center gap-1">
              <Check size={14} /> Name updated successfully!
            </div>
          )}
        </form>

        {/* Fanbase selection */}
        <div>
          <label className="block font-black text-xs uppercase tracking-wider mb-2 text-[#141313]">
            Choose Your Hero Fanbase Identity:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {FANBASE_LIST.map(fan => {
              const isSelected = profile.fanIdentity === fan.id;
              return (
                <button
                  key={fan.id}
                  onClick={() => {
                    soundManager.playClick(700);
                    setFanIdentity(fan.id);
                  }}
                  className={clsx(
                    'border-2 border-[#141313] p-3 rounded-xl text-left cursor-pointer transition-all flex items-start gap-2.5',
                    isSelected
                      ? 'bg-[#F6BE18] text-[#141313] shadow-[3px_3px_0_#141313]'
                      : 'bg-white text-[#141313] hover:bg-[#F4F1EA]'
                  )}
                >
                  <span className="text-2xl shrink-0">{fan.icon}</span>
                  <div>
                    <div className="font-block text-base uppercase leading-tight">
                      {fan.id} • {fan.hero}
                    </div>
                    <div className="text-[11px] font-telugu font-bold text-[#141313]/80 mt-0.5">
                      "{fan.dialogue}"
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Language Preference */}
        <div>
          <label className="block font-black text-xs uppercase tracking-wider mb-2 text-[#141313]">
            Script &amp; Language Preference:
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'te', label: 'తెలుగు (Telugu Only)', desc: 'Pure Telugu script display' },
              { id: 'te-en', label: 'Telugu + English', desc: 'Telugu script with English transliteration' },
            ].map(lang => (
              <button
                key={lang.id}
                onClick={() => {
                  soundManager.playClick();
                  setLanguagePref(lang.id as LanguagePref);
                }}
                className={clsx(
                  'border-2 border-[#141313] p-3 rounded-xl text-left cursor-pointer transition-all',
                  profile.languagePref === lang.id
                    ? 'bg-[#EC1276] text-white shadow-[3px_3px_0_#141313]'
                    : 'bg-white text-[#141313] hover:bg-[#F4F1EA]'
                )}
              >
                <div className="font-black text-xs uppercase">{lang.label}</div>
                <div className={clsx('text-[10px] font-semibold mt-0.5', profile.languagePref === lang.id ? 'text-white/80' : 'text-gray-500')}>
                  {lang.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Toggles: Audio and Haptics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t-2 border-[#141313]/10">
          <button
            onClick={toggleSound}
            className={clsx(
              'border-2 border-[#141313] p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all shadow-[2px_2px_0_#141313]',
              profile.soundEnabled ? 'bg-[#D7FADC]' : 'bg-gray-100'
            )}
          >
            <div className="flex items-center gap-2 text-xs font-black uppercase">
              {profile.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>Arcade Audio SFX</span>
            </div>
            <span className="font-mono text-xs font-bold">
              {profile.soundEnabled ? 'ON' : 'MUTED'}
            </span>
          </button>

          <button
            onClick={toggleHaptics}
            className={clsx(
              'border-2 border-[#141313] p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all shadow-[2px_2px_0_#141313]',
              profile.hapticsEnabled ? 'bg-[#D7FADC]' : 'bg-gray-100'
            )}
          >
            <div className="flex items-center gap-2 text-xs font-black uppercase">
              <Smartphone size={16} />
              <span>Haptic Vibration</span>
            </div>
            <span className="font-mono text-xs font-bold">
              {profile.hapticsEnabled ? 'ENABLED' : 'OFF'}
            </span>
          </button>
        </div>

      </DieCutCard>

    </div>
  );
}

