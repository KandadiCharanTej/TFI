'use client';

import React, { useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { ClapperboardDoodle, FilmReelIcon, TeluguHeroSplash, DoodleStar, CharminarSketch } from '@/components/ui/EditorialArt';
import { ArrowRight, Sparkles } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { preferences, setDisplayName, setLanguageMode, completeOnboarding } = useUserStore();
  const [step, setStep] = useState<number>(1);
  const [nameInput, setNameInput] = useState<string>(preferences.displayName);
  const [selectedLang, setSelectedLang] = useState<'telugu' | 'both'>('both');

  if (preferences.hasCompletedOnboarding) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#171717]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Mobile container framing matching reference image 1 & 2 */}
      <div className="max-w-[380px] w-full bg-[#FFF8E9] border-3 border-[#171717] rounded-[2.25rem] shadow-[6px_6px_0_#171717] overflow-hidden p-6 relative">
        {/* Decorative corner stars */}
        <DoodleStar className="absolute top-4 left-4 w-4 h-4 text-[#FFCB45]" />
        <DoodleStar className="absolute top-6 right-5 w-5 h-5 text-[#FFCB45]" />

        {/* SCREEN 1: SPLASH MATCHING REFERENCE IMAGE 1 */}
        {step === 1 && (
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex items-center gap-1 mt-2">
              <ClapperboardDoodle className="w-10 h-10 -rotate-12" />
            </div>

            {/* Title with yellow highlighter blob effect */}
            <div className="relative inline-block my-1">
              <div className="absolute inset-0 bg-[#FFCB45] -rotate-2 rounded-2xl scale-110 -z-0" />
              <h1 className="relative z-10 text-4xl sm:text-5xl font-black text-[#171717] tracking-tight px-3 py-1">
                TFI &amp; <br /> Pitch
              </h1>
            </div>

            <p className="text-xs sm:text-sm font-black text-[#171717] uppercase tracking-wider">
              Cinema. Friends. Fun.
            </p>

            {/* Illustrated mass hero with sunglasses in red shirt & Charminar behind */}
            <div className="my-1 py-1">
              <TeluguHeroSplash className="w-44 h-44 drop-shadow-sm" />
            </div>

            {/* CTA Button matching reference: yellow with arrow */}
            <div className="w-full pt-1 space-y-2">
              <button
                onClick={() => setStep(2)}
                className="w-full py-3.5 bg-[#FFCB45] border-2 border-[#171717] rounded-2xl font-black text-sm text-[#171717] shadow-[2.5px_2.5px_0_#171717] hover:bg-[#ffd45e] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>

              <button
                onClick={completeOnboarding}
                className="text-xs font-bold text-neutral-600 hover:text-black py-1"
              >
                Skip intro &amp; play as guest
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 2: PREFERENCE CARDS MATCHING REFERENCE IMAGE 2 */}
        {step === 2 && (
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-[#171717] leading-tight px-2">
              What do you <br /> love more?
            </h2>

            {/* Pink Card Option: Telugu Cinema */}
            <div
              onClick={() => setSelectedLang('telugu')}
              className={`w-full p-6 rounded-2xl border-2 border-[#171717] cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 ${
                selectedLang === 'telugu'
                  ? 'bg-[#FFA6BA] shadow-[3.5px_3.5px_0_#171717] -translate-y-0.5'
                  : 'bg-[#FFA6BA]/65 hover:bg-[#FFA6BA]/85 shadow-[2px_2px_0_#171717]'
              }`}
            >
              <FilmReelIcon className="w-12 h-12" />
              <div className="text-lg font-black text-[#171717] leading-tight">
                Telugu <br /> Cinema
              </div>
            </div>

            {/* Blue Card Option: Telugu Cinema + English Transliteration */}
            <div
              onClick={() => setSelectedLang('both')}
              className={`w-full p-5 rounded-2xl border-2 border-[#171717] cursor-pointer transition-all flex flex-col items-center justify-center ${
                selectedLang === 'both'
                  ? 'bg-[#B3D4FC] shadow-[3.5px_3.5px_0_#171717] -translate-y-0.5'
                  : 'bg-[#B3D4FC]/65 hover:bg-[#B3D4FC]/85 shadow-[2px_2px_0_#171717]'
              }`}
            >
              <div className="text-base font-black text-[#171717] leading-snug">
                Telugu Cinema <br /> + English <br /> Transliteration!
              </div>
            </div>

            {/* Next Button */}
            <div className="w-full pt-2">
              <button
                onClick={() => {
                  setLanguageMode(selectedLang);
                  setStep(3);
                }}
                className="w-full py-3.5 bg-[#FFCB45] border-2 border-[#171717] rounded-2xl font-black text-sm text-[#171717] shadow-[2.5px_2.5px_0_#171717] hover:bg-[#ffd45e] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

            {/* Charminar skyline sketch at bottom */}
            <CharminarSketch className="w-full h-10 opacity-30 mt-2" />
          </div>
        )}

        {/* SCREEN 3: NAME SELECTION */}
        {step === 3 && (
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-[#FFCB45] rounded-full border-2 border-[#171717]">
              <Sparkles className="w-8 h-8 text-[#171717]" />
            </div>

            <h2 className="text-2xl font-black text-[#171717]">
              Your Player Name
            </h2>
            <p className="text-xs font-semibold text-neutral-600">
              Enter your cinema nickname for party games &amp; auction leaderboards!
            </p>

            <div className="w-full pt-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Charan, Pokiri_Pandu"
                maxLength={20}
                className="w-full px-4 py-3 bg-white border-2 border-[#171717] rounded-2xl font-black text-center text-base shadow-[2.5px_2.5px_0_#171717] focus:outline-none"
              />
            </div>

            <button
              onClick={() => {
                setDisplayName(nameInput.trim() || 'Charan');
                completeOnboarding();
              }}
              className="w-full py-3.5 bg-[#88D49E] border-2 border-[#171717] rounded-2xl font-black text-sm text-[#171717] shadow-[2.5px_2.5px_0_#171717] hover:bg-[#72c289] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer transition-all mt-3"
            >
              <span>Let&apos;s Play! 🍿</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
