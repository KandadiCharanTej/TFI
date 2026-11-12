'use client';

import React, { useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { NeoButton, NeoCard, NeoBadge } from '@/components/ui/NeoPrimitives';
import { TeluguHeroIcon } from '@/components/ui/Illustrations';
import { Volume2, VolumeX, Smartphone, Languages, User, Award, Check } from 'lucide-react';

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
    <div className="max-w-xl mx-auto space-y-6">
      <NeoCard bg="bg-[#FFCB45]" size="lg" className="flex items-center gap-4">
        <div className="p-2 bg-white rounded-2xl border-3 border-[#171717] shadow-[3px_3px_0_#171717]">
          <TeluguHeroIcon className="w-16 h-16" />
        </div>
        <div>
          <NeoBadge variant="coral">TOLLEYWOOD FAN</NeoBadge>
          <h1 className="text-2xl font-black text-[#171717] mt-1">{preferences.displayName}</h1>
          <p className="text-xs font-bold text-[#171717]/80">Status: Guest Star ⭐</p>
        </div>
      </NeoCard>

      {/* Profile Settings */}
      <NeoCard bg="bg-white" size="lg" className="space-y-5">
        <div className="flex items-center gap-2 border-b pb-3">
          <User className="w-5 h-5 text-[#FF704D]" />
          <h2 className="text-lg font-black text-[#171717]">PLAYER SETTINGS</h2>
        </div>

        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="text-xs font-black uppercase text-neutral-500 block mb-1">
              Display Name / Screen Alias
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                maxLength={25}
                className="flex-1 px-3 py-2 border-2 border-[#171717] rounded-xl font-black text-sm shadow-[2px_2px_0_#171717]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#83CBA2] border-2 border-[#171717] rounded-xl font-black text-xs shadow-[2px_2px_0_#171717] active:translate-y-0.5"
              >
                SAVE
              </button>
            </div>
            {savedNotice && (
              <p className="text-xs text-green-700 font-extrabold mt-1 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Updated successfully!
              </p>
            )}
          </div>
        </form>

        {/* Language Mode Toggle */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-[#4385EA]" />
            <span className="text-xs font-black uppercase text-neutral-700">Language Preference</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setLanguageMode('both')}
              className={`p-2.5 rounded-xl border-2 border-[#171717] font-black text-xs text-left ${
                preferences.languageMode === 'both' ? 'bg-[#FFCB45] shadow-[2px_2px_0_#171717]' : 'bg-neutral-50'
              }`}
            >
              Telugu + English Translit
            </button>
            <button
              onClick={() => setLanguageMode('telugu')}
              className={`p-2.5 rounded-xl border-2 border-[#171717] font-black text-xs text-left ${
                preferences.languageMode === 'telugu' ? 'bg-[#FFCB45] shadow-[2px_2px_0_#171717]' : 'bg-neutral-50'
              }`}
            >
              Pure Telugu Script Only
            </button>
          </div>
        </div>

        {/* Audio / Haptic toggles */}
        <div className="space-y-2 pt-2 border-t">
          <span className="text-xs font-black uppercase text-neutral-700 block">Game Effects</span>
          <div className="flex items-center justify-between p-3 rounded-xl border-2 border-[#171717] bg-[#FFF8E9]">
            <div className="flex items-center gap-2 font-black text-xs">
              {preferences.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>Celebration Sound Effects</span>
            </div>
            <button
              onClick={toggleSound}
              className={`px-3 py-1 rounded-lg border-2 border-[#171717] font-black text-xs ${
                preferences.soundEnabled ? 'bg-[#83CBA2]' : 'bg-neutral-200'
              }`}
            >
              {preferences.soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border-2 border-[#171717] bg-[#FFF8E9]">
            <div className="flex items-center gap-2 font-black text-xs">
              <Smartphone className="w-4 h-4" />
              <span>Haptic Vibration Feedback</span>
            </div>
            <button
              onClick={toggleHaptics}
              className={`px-3 py-1 rounded-lg border-2 border-[#171717] font-black text-xs ${
                preferences.hapticsEnabled ? 'bg-[#83CBA2]' : 'bg-neutral-200'
              }`}
            >
              {preferences.hapticsEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </NeoCard>
    </div>
  );
}
