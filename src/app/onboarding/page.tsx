'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DieCutCard } from '@/components/DieCutCard';
import { AcampButton } from '@/components/AcampButton';
import { useUser } from '@/utils/userContext';
import { FANBASE_LIST } from '@/data/teluguCinemaDatabase';
import { FanIdentity, LanguagePref } from '@/types';
import { soundManager } from '@/utils/audio';
import { StarSparkle, StreetCrown, LightningBolt, GraffitiSmiley } from '@/components/StreetDecorations';
import { ArrowRight, Check } from 'lucide-react';
import clsx from 'clsx';

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, updateProfile, setFanIdentity, setLanguagePref } = useUser();
  const [step, setStep] = useState<number>(1);
  const [nameInput, setNameInput] = useState<string>(profile.name || 'TFI Producer');

  const handleNextStep = () => {
    soundManager.playClick();
    if (step === 3) {
      updateProfile({ name: nameInput.trim() || 'TFI Producer' });
      soundManager.playFanfare();
      router.push('/');
    } else {
      setStep(prev => prev + 1);
    }
  };

  return (
    <div className="w-full min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl mx-auto space-y-6">
        
        {/* Step indicator */}
        <div className="flex items-center justify-between text-xs font-black uppercase text-[#141313]/60 px-2">
          <span>STEP {step} OF 3</span>
          <button
            onClick={() => router.push('/')}
            className="hover:underline text-[#EC1276] cursor-pointer"
          >
            Skip to Home →
          </button>
        </div>

        <DieCutCard className="p-8 text-center space-y-6 bg-white relative overflow-hidden">
          
          {/* =========================================================================
              SCREEN 1: WELCOME & LOGO
              ========================================================================= */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="relative inline-block my-2">
                <StarSparkle className="w-14 h-14 absolute -top-4 -left-4" />
                <div className="bg-[#F6BE18] border-[4px] border-[#141313] px-8 py-4 rounded-2xl shadow-[4px_4px_0_#141313] -rotate-2">
                  <h1 className="font-block text-5xl sm:text-6xl uppercase text-[#141313]">
                    TFI &amp; PITCH
                  </h1>
                </div>
                <div className="bg-[#EC1276] text-white font-brush text-2xl uppercase tracking-widest px-4 py-1 rounded-xl border-2 border-[#141313] rotate-2 shadow-[2px_2px_0_#141313] -mt-2 inline-block">
                  CINEMA • FRIENDS • FUN
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-bold text-[#141313]/85 leading-relaxed">
                  The Telugu-first cultural party gaming platform! Play with friends sitting together or bid in real-time box office auctions across devices.
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 font-mono text-[11px] font-bold text-[#141313]/70 pt-1">
                  <span>🎬 5 Original Games</span>
                  <span>•</span>
                  <span>🔥 100% Telugu Cinema</span>
                  <span>•</span>
                  <span>⚡ Zero Login Required</span>
                </div>
              </div>

              <AcampButton onClick={handleNextStep} variant="yellow" size="lg" fullWidth>
                Get Started →
              </AcampButton>
            </div>
          )}


          {/* =========================================================================
              SCREEN 2: LANGUAGE PREFERENCE
              ========================================================================= */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="bg-[#141313] text-[#F6BE18] font-black text-xs uppercase px-3 py-1 rounded-md">
                  CHOOSE SCRIPT
                </span>
                <h2 className="font-block text-4xl uppercase text-[#141313]">
                  HOW DO YOU PREFER SCRIPT?
                </h2>
                <p className="text-xs font-bold text-[#141313]/70">
                  You can change this anytime from your profile settings.
                </p>
              </div>

              <div className="space-y-3 text-left">
                {[
                  {
                    id: 'te-en',
                    label: 'Telugu + English Transliteration',
                    telugu: 'తెలుగు + ఇంగ్లీష్ (సినిమా. స్నేహితులు. ఫన్.)',
                    desc: 'Best for mixed groups reading both Telugu script and English phonetics.',
                  },
                  {
                    id: 'te',
                    label: 'Telugu Script Only',
                    telugu: 'కేవలం తెలుగు లిపి (సినిమా. స్నేహితులు. సరదా.)',
                    desc: 'Authentic pure Telugu typography across all clues and movie titles.',
                  },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setLanguagePref(opt.id as LanguagePref)}
                    className={clsx(
                      'w-full border-2 border-[#141313] p-4 rounded-2xl text-left cursor-pointer transition-all',
                      profile.languagePref === opt.id
                        ? 'bg-[#F6BE18] text-[#141313] shadow-[4px_4px_0_#141313]'
                        : 'bg-white hover:bg-[#F4F1EA]'
                    )}
                  >
                    <div className="font-black text-sm uppercase">{opt.label}</div>
                    <div className="font-telugu text-xs font-bold mt-1 text-[#141313]/90">{opt.telugu}</div>
                    <div className="text-[11px] font-semibold text-gray-600 mt-1">{opt.desc}</div>
                  </button>
                ))}
              </div>

              <AcampButton onClick={handleNextStep} variant="magenta" size="lg" fullWidth>
                Continue to Fanbase Avatar →
              </AcampButton>
            </div>
          )}


          {/* =========================================================================
              SCREEN 3: PRODUCER NAME & FANBASE SELECTION
              ========================================================================= */}
          {step === 3 && (
            <div className="space-y-6 text-left">
              <div className="text-center space-y-1">
                <span className="bg-[#00C853] text-white font-black text-xs uppercase px-3 py-1 rounded-md border border-[#141313]">
                  PROFILE SETUP
                </span>
                <h2 className="font-block text-4xl uppercase text-[#141313]">
                  CHOOSE YOUR PRODUCER IDENTITY
                </h2>
              </div>

              <div>
                <label className="block font-black text-xs uppercase mb-1">
                  Your Display Name:
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  maxLength={20}
                  className="w-full bg-[#FFF9E6] border-2 border-[#141313] px-3.5 py-2.5 rounded-xl font-bold text-sm shadow-[2px_2px_0_#141313] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-black text-xs uppercase mb-1.5">
                  Favorite Hero Fanbase Identity:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FANBASE_LIST.map(fan => (
                    <button
                      key={fan.id}
                      onClick={() => setFanIdentity(fan.id)}
                      className={clsx(
                        'border-2 border-[#141313] p-2.5 rounded-xl text-left cursor-pointer transition-all flex items-center gap-2',
                        profile.fanIdentity === fan.id
                          ? 'bg-[#EC1276] text-white shadow-[3px_3px_0_#141313]'
                          : 'bg-white hover:bg-gray-100'
                      )}
                    >
                      <span className="text-xl">{fan.icon}</span>
                      <div className="font-bold text-xs">
                        <div>{fan.id}</div>
                        <div className="text-[10px] opacity-75">{fan.hero.split(' ')[0]}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <AcampButton onClick={handleNextStep} variant="yellow" size="lg" fullWidth>
                🚀 Let's Play TFI &amp; Pitch!
              </AcampButton>
            </div>
          )}

        </DieCutCard>

      </div>
    </div>
  );
}

