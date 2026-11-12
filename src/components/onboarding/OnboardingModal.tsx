'use client';

import React, { useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { NeoButton, NeoCard } from '@/components/ui/NeoPrimitives';
import { TeluguHeroIcon, CinemaClapperIcon } from '@/components/ui/Illustrations';
import { Sparkles, ArrowRight, Languages } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { preferences, setDisplayName, setLanguageMode, completeOnboarding } = useUserStore();
  const [step, setStep] = useState<number>(1);
  const [nameInput, setNameInput] = useState<string>(preferences.displayName);
  const [langPreference, setLangPreference] = useState<'telugu' | 'both'>('both');

  if (preferences.hasCompletedOnboarding) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#171717]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {step === 1 && (
          <NeoCard bg="bg-[#FFF8E9]" size="lg" className="text-center">
            <div className="flex justify-center mb-4">
              <TeluguHeroIcon className="w-20 h-20" />
            </div>
            <h1 className="text-3xl font-black text-[#171717] tracking-tight">
              TFI & PITCH
            </h1>
            <p className="text-sm font-bold text-[#FF704D] mt-1 uppercase tracking-wider">
              Cinema. Friends. Fun.
            </p>
            <p className="text-sm font-medium text-neutral-700 mt-3">
              The ultimate Telugu cinema party games platform! Guess movies, translate crazy titles, act out charades & battle in Box Office auctions.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <NeoButton
                variant="primary"
                fullWidth
                size="lg"
                onClick={() => setStep(2)}
              >
                <span>GET STARTED</span>
                <ArrowRight className="w-5 h-5" />
              </NeoButton>
              <button
                onClick={completeOnboarding}
                className="text-xs font-bold text-neutral-600 hover:text-black py-2 underline"
              >
                Skip as Guest
              </button>
            </div>
          </NeoCard>
        )}

        {step === 2 && (
          <NeoCard bg="bg-white" size="lg">
            <div className="flex items-center gap-2 mb-2">
              <Languages className="w-6 h-6 text-[#4385EA]" />
              <h2 className="text-xl font-black">Choose Language Mode</h2>
            </div>
            <p className="text-xs text-neutral-600 mb-4">
              How would you like Telugu cinema clues and titles to be shown?
            </p>

            <div className="space-y-3 mb-6">
              <div
                onClick={() => setLangPreference('both')}
                className={`p-3 rounded-xl border-3 border-[#171717] cursor-pointer transition-all ${
                  langPreference === 'both'
                    ? 'bg-[#FFCB45] shadow-[3px_3px_0_#171717] -translate-y-0.5'
                    : 'bg-[#FFF8E9] opacity-80'
                }`}
              >
                <div className="font-extrabold text-sm">Telugu + English Transliteration</div>
                <div className="text-xs text-neutral-700 mt-0.5">
                  e.g., పోకిరి (Pokiri) — Great for all friends!
                </div>
              </div>

              <div
                onClick={() => setLangPreference('telugu')}
                className={`p-3 rounded-xl border-3 border-[#171717] cursor-pointer transition-all ${
                  langPreference === 'telugu'
                    ? 'bg-[#FFCB45] shadow-[3px_3px_0_#171717] -translate-y-0.5'
                    : 'bg-[#FFF8E9] opacity-80'
                }`}
              >
                <div className="font-extrabold text-sm">Pure Telugu Script Only</div>
                <div className="text-xs text-neutral-700 mt-0.5">
                  e.g., పోకిరి — For hardcore Tollywood pandits!
                </div>
              </div>
            </div>

            <NeoButton
              variant="coral"
              fullWidth
              size="md"
              onClick={() => {
                setLanguageMode(langPreference);
                setStep(3);
              }}
            >
              Next Step
            </NeoButton>
          </NeoCard>
        )}

        {step === 3 && (
          <NeoCard bg="bg-[#FFF8E9]" size="lg">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-[#FFCB45]" />
              <h2 className="text-xl font-black">Choose Your Display Name</h2>
            </div>
            <p className="text-xs text-neutral-600 mb-4">
              Enter your party nickname or Tollywood persona.
            </p>

            <div className="mb-4">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Vintage_Chiru, Pokiri_Pandu"
                maxLength={20}
                className="w-full px-4 py-3 bg-white border-3 border-[#171717] rounded-xl font-bold text-base shadow-[3px_3px_0_#171717] focus:outline-none focus:bg-[#FFF8E9]"
              />
            </div>

            <NeoButton
              variant="green"
              fullWidth
              size="lg"
              onClick={() => {
                setDisplayName(nameInput.trim() || 'MegaFan_99');
                completeOnboarding();
              }}
            >
              Let&apos;s Play! 🎬
            </NeoButton>
          </NeoCard>
        )}
      </div>
    </div>
  );
};
