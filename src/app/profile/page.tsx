'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useUserStore } from '@/store/useUserStore';
import { TeluguHeroSplash, FilmReelIcon } from '@/components/ui/EditorialArt';
import { ArrowLeft, User, Languages, Volume2, VolumeX, Smartphone, Check } from 'lucide-react';

export default function ProfilePage() {
  const { preferences, setDisplayName, setLanguageMode, toggleSound, toggleHaptics } = useUserStore();
  const [editingName, setEditingName] = useState<string>(preferences.displayName);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingName.trim()) {
      setDisplayName(editingName.trim());
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4 pb-12">
      <div className="flex items-center justify-between px-1">
        <Link href="/" className="p-1 hover:bg-[#FFCB45]/30 rounded-lg">
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </Link>
        <h1 className="text-xl font-black text-[#171717]">Profile &amp; Settings</h1>
        <div className="w-5" />
      </div>

      {/* Profile Card */}
      <div className="bg-[#FFA6BA] border-2 border-[#171717] rounded-3xl p-5 shadow-[3px_3px_0_#171717] flex items-center gap-4">
        <div className="w-16 h-16 bg-white border-2 border-[#171717] rounded-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-[1.5px_1.5px_0_#171717]">
          <TeluguHeroSplash className="w-20 h-20" />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-white border border-[#171717] rounded-md">
            Tollywood Fan
          </span>
          <h2 className="text-2xl font-black text-[#171717] mt-1 leading-tight">{preferences.displayName}</h2>
          <p className="text-xs font-semibold text-neutral-800">Ready for Telugu cinema party games!</p>
        </div>
      </div>

      {/* Settings Options */}
      <div className="bg-white border-2 border-[#171717] rounded-3xl p-5 shadow-[3px_3px_0_#171717] space-y-4">
        <form onSubmit={handleSave} className="space-y-2">
          <label className="text-xs font-black uppercase text-neutral-500 block">Edit Nickname</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              className="flex-1 px-3 py-2 border-2 border-[#171717] rounded-xl font-black text-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#FFCB45] border-2 border-[#171717] rounded-xl font-black text-xs shadow-[1.5px_1.5px_0_#171717]"
            >
              Save
            </button>
          </div>
          {savedNotice && (
            <p className="text-xs text-green-700 font-black flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Updated!
            </p>
          )}
        </form>

        {/* Language Preference */}
        <div className="pt-2 border-t border-neutral-200 space-y-2">
          <label className="text-xs font-black uppercase text-neutral-500 block">Display Mode</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setLanguageMode('both')}
              className={`p-3 rounded-xl border-2 border-[#171717] font-black text-xs text-left ${
                preferences.languageMode === 'both' ? 'bg-[#FFCB45] shadow-[2px_2px_0_#171717]' : 'bg-neutral-50'
              }`}
            >
              Telugu + English Translit
            </button>
            <button
              onClick={() => setLanguageMode('telugu')}
              className={`p-3 rounded-xl border-2 border-[#171717] font-black text-xs text-left ${
                preferences.languageMode === 'telugu' ? 'bg-[#FFCB45] shadow-[2px_2px_0_#171717]' : 'bg-neutral-50'
              }`}
            >
              Pure Telugu Script
            </button>
          </div>
        </div>

        {/* Audio Effects */}
        <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-black">
            {preferences.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>Game Sound Effects</span>
          </div>
          <button
            onClick={toggleSound}
            className={`px-3 py-1 rounded-lg border-2 border-[#171717] font-black text-xs ${
              preferences.soundEnabled ? 'bg-[#88D49E]' : 'bg-neutral-200'
            }`}
          >
            {preferences.soundEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </div>
  );
}
