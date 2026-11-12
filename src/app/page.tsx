'use client';

import React from 'react';
import Link from 'next/link';
import { useUserStore } from '@/store/useUserStore';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import { CinemaCoupleHero, ForeheadPlayerIcon, PopcornEmojiIcon, WoodenGavelIllustration, DoodleStar } from '@/components/ui/EditorialArt';
import { Play, Users, LogIn, ChevronRight, Sparkles } from 'lucide-react';

export default function HomePage() {
  const { preferences } = useUserStore();

  return (
    <div className="max-w-md mx-auto space-y-4 pb-12 relative">
      <OnboardingModal />

      {/* Greeting Matching Reference Screen 3 */}
      <div className="flex items-center justify-between px-1">
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight">
              Hey, {preferences.displayName || 'Charan'}! 👋
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-[#171717]/80">
            Ready for some movie fun?
          </p>
        </div>
        <DoodleStar className="w-5 h-5 text-[#FFCB45]" />
      </div>

      {/* Hero Banner Illustration (Reference Screen 3: Guy in sunglasses + Girl with Charminar sketch) */}
      <div className="bg-[#FFFFFF] border-2 border-[#171717] rounded-3xl p-3 shadow-[2.5px_2.5px_0_#171717] overflow-hidden relative">
        <CinemaCoupleHero className="w-full h-32 object-contain" />
      </div>

      {/* Quick Play Primary CTA (Reference Screen 3: Large bold yellow pill) */}
      <Link href="/games/head-set-go" className="block">
        <button className="w-full py-4 bg-[#FFCB45] border-2 border-[#171717] rounded-2xl font-black text-lg text-[#171717] shadow-[2.5px_2.5px_0_#171717] hover:bg-[#ffd45e] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer transition-all">
          <span>Quick Play</span>
          <Play className="w-5 h-5 fill-[#171717]" />
        </button>
      </Link>

      {/* Two Secondary Action Cards (Reference Screen 3: Coral 'Create Room' & Purple 'Join Room') */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/rooms" className="block">
          <div className="p-4 bg-[#FF9E80] border-2 border-[#171717] rounded-2xl shadow-[2.5px_2.5px_0_#171717] flex flex-col items-center justify-center text-center cursor-pointer hover:-translate-y-0.5 transition-all">
            <Users className="w-7 h-7 text-[#171717] mb-1.5 stroke-[2.2]" />
            <span className="text-sm font-black text-[#171717] leading-tight">Create <br /> Room</span>
          </div>
        </Link>

        <Link href="/rooms" className="block">
          <div className="p-4 bg-[#D2C2F8] border-2 border-[#171717] rounded-2xl shadow-[2.5px_2.5px_0_#171717] flex flex-col items-center justify-center text-center cursor-pointer hover:-translate-y-0.5 transition-all">
            <LogIn className="w-7 h-7 text-[#171717] mb-1.5 stroke-[2.2]" />
            <span className="text-sm font-black text-[#171717] leading-tight">Join <br /> Room</span>
          </div>
        </Link>
      </div>

      {/* Featured Games Section (Reference Screen 3: "Featured Games" with "See All ->") */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-black text-[#171717] uppercase tracking-wide">
            Featured Games
          </h2>
          <Link href="/games" className="text-xs font-black flex items-center gap-0.5 text-[#171717]/80 hover:text-black">
            <span>See All</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </Link>
        </div>

        {/* Featured Card 1: Head Set Go (Matching reference screen 3 featured item) */}
        <Link href="/games/head-set-go" className="block">
          <div className="p-3 bg-[#FFFFFF] border-2 border-[#171717] rounded-2xl shadow-[2.5px_2.5px_0_#171717] flex items-center justify-between hover:bg-[#FFF8E9] transition-all">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-[#FFF8E9] border-2 border-[#171717] rounded-xl shrink-0">
                <ForeheadPlayerIcon className="w-9 h-9" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#171717]">Head Set Go</h3>
                <p className="text-xs font-semibold text-neutral-600">Guess the movie!</p>
              </div>
            </div>
            <div className="p-1.5 bg-[#FFCB45] border-2 border-[#171717] rounded-xl shadow-[1px_1px_0_#171717]">
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </div>
          </div>
        </Link>

        {/* Featured Card 2: Box Office Auction */}
        <Link href="/games/auction" className="block">
          <div className="p-3 bg-[#FFFFFF] border-2 border-[#171717] rounded-2xl shadow-[2.5px_2.5px_0_#171717] flex items-center justify-between hover:bg-[#FFF8E9] transition-all">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-[#FFF8E9] border-2 border-[#171717] rounded-xl shrink-0">
                <WoodenGavelIllustration className="w-9 h-9" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#171717]">TFI Box Office Auction</h3>
                <p className="text-xs font-semibold text-neutral-600">Bid &amp; Build your empire!</p>
              </div>
            </div>
            <div className="p-1.5 bg-[#FFCB45] border-2 border-[#171717] rounded-xl shadow-[1px_1px_0_#171717]">
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
