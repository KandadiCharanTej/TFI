'use client';

import React from 'react';
import Link from 'next/link';
import { useUserStore } from '@/store/useUserStore';
import { NeoButton, NeoCard, NeoBadge } from '@/components/ui/NeoPrimitives';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import { TeluguHeroIcon, AuctionGavelIcon, CinemaClapperIcon, CharadesMaskIcon } from '@/components/ui/Illustrations';
import { Flame, Sparkles, Play, Users, Trophy, ChevronRight, Zap } from 'lucide-react';

export default function HomePage() {
  const { preferences } = useUserStore();

  const gamesList = [
    {
      id: 'auction',
      title: 'TFI Box Office Auction',
      teluguTitle: 'బాక్స్ ఆఫీస్ వేలం',
      description: 'Bid virtual budget to build the highest-grossing Telugu movie empire! Online & Single-device.',
      tag: 'FLAGSHIP GAME',
      tagColor: 'coral' as const,
      bg: 'bg-[#FFCB45]',
      accentBg: 'bg-[#FFF8E9]',
      players: '2-10 Players',
      href: '/games/auction',
      icon: AuctionGavelIcon,
    },
    {
      id: 'head-set-go',
      title: 'Head Set Go',
      teluguTitle: 'హెడ్ సెట్ గో',
      description: 'Hold phone on your forehead! Friends shout clues to guess Telugu movies, heroes & dialogues.',
      tag: 'PARTY HIT',
      tagColor: 'green' as const,
      bg: 'bg-[#83CBA2]',
      accentBg: 'bg-white',
      players: '2+ Players',
      href: '/games/head-set-go',
      icon: TeluguHeroIcon,
    },
    {
      id: 'transify',
      title: 'Transify',
      teluguTitle: 'ట్రాన్సిఫై',
      description: 'Guess real Telugu movies from hilarious broken literal English translations.',
      tag: 'COMEDY GOLD',
      tagColor: 'lavender' as const,
      bg: 'bg-[#CBB8F5]',
      accentBg: 'bg-white',
      players: '2-8 Players',
      href: '/games/transify',
      icon: CinemaClapperIcon,
    },
    {
      id: 'dumb-charades',
      title: 'Dumb Charades',
      teluguTitle: 'డంబ్ చారేడ్స్',
      description: 'Pass device secretly! Act out tough & iconic Telugu titles without saying a word.',
      tag: 'TEAM BATTLE',
      tagColor: 'yellow' as const,
      bg: 'bg-[#FF704D]',
      accentBg: 'bg-[#FFF8E9]',
      players: '2 Teams',
      href: '/games/dumb-charades',
      icon: CharadesMaskIcon,
    },
    {
      id: 'emoji-cinema',
      title: 'Emoji Cinema',
      teluguTitle: 'ఎమోజి సినిమా',
      description: 'Decipher popular Tollywood blockbusters from wacky emoji combinations against time.',
      tag: 'BRAIN TEASER',
      tagColor: 'cobalt' as const,
      bg: 'bg-[#4385EA]',
      accentBg: 'bg-white',
      players: 'Solo / Pass',
      href: '/games/emoji-cinema',
      icon: CinemaClapperIcon,
    },
  ];

  return (
    <div className="space-y-6">
      <OnboardingModal />

      {/* Hero Banner */}
      <NeoCard bg="bg-[#FFCB45]" size="lg" className="relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full border-2 border-[#171717] font-black text-xs shadow-[2px_2px_0_#171717]">
              <Flame className="w-4 h-4 text-[#FF704D] fill-[#FF704D]" />
              <span>Namaskaram, {preferences.displayName}!</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#171717] leading-tight">
              CINEMA. FRIENDS. <br className="hidden sm:inline" />
              <span className="text-[#FF704D] drop-shadow-[2px_2px_0_#171717]">PURE FUN.</span>
            </h1>
            <p className="text-sm md:text-base font-bold text-[#171717]/80 max-w-lg">
              Telugu party games designed for pure celebration of Tollywood culture. No sign up needed!
            </p>

            <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
              <Link href="/games/auction">
                <NeoButton variant="coral" size="md">
                  <Play className="w-5 h-5 fill-white" />
                  <span>PLAY AUCTION</span>
                </NeoButton>
              </Link>
              <Link href="/rooms">
                <NeoButton variant="white" size="md">
                  <Users className="w-5 h-5" />
                  <span>ONLINE ROOMS</span>
                </NeoButton>
              </Link>
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-center bg-white p-4 rounded-2xl border-3 border-[#171717] shadow-[4px_4px_0_#171717]">
            <TeluguHeroIcon className="w-24 h-24 sm:w-28 sm:h-28" />
          </div>
        </div>
      </NeoCard>

      {/* Quick Action Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Link href="/games/head-set-go">
          <NeoCard bg="bg-white" size="sm" className="hover:bg-[#FFF8E9] text-center flex flex-col items-center justify-center p-3">
            <Zap className="w-6 h-6 text-[#FF704D] mb-1" />
            <span className="text-xs font-black uppercase">Quick Pass & Play</span>
          </NeoCard>
        </Link>
        <Link href="/rooms">
          <NeoCard bg="bg-white" size="sm" className="hover:bg-[#FFF8E9] text-center flex flex-col items-center justify-center p-3">
            <Users className="w-6 h-6 text-[#4385EA] mb-1" />
            <span className="text-xs font-black uppercase">Join Room</span>
          </NeoCard>
        </Link>
        <Link href="/games" className="col-span-2 sm:col-span-1">
          <NeoCard bg="bg-[#CBB8F5]" size="sm" className="hover:bg-[#bfa8f2] text-center flex flex-col items-center justify-center p-3">
            <Sparkles className="w-6 h-6 text-[#171717] mb-1" />
            <span className="text-xs font-black uppercase">All 5 Games</span>
          </NeoCard>
        </Link>
      </div>

      {/* Featured Games Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#FF704D]" />
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#171717]">
              CINEMA PARTY GAMES
            </h2>
          </div>
          <Link href="/games" className="text-xs font-extrabold flex items-center gap-1 hover:underline text-[#171717]">
            VIEW ALL <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gamesList.map((game) => {
            const Icon = game.icon;
            return (
              <NeoCard key={game.id} bg={game.bg} className="flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <NeoBadge variant={game.tagColor}>{game.tag}</NeoBadge>
                    <span className="text-xs font-bold bg-[#171717] text-white px-2 py-0.5 rounded border border-[#171717]">
                      {game.players}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white rounded-xl border-2 border-[#171717] shadow-[2px_2px_0_#171717]">
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black leading-tight text-[#171717]">
                        {game.title}
                      </h3>
                      <p className="text-xs font-bold text-[#171717]/80">
                        {game.teluguTitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-[#171717]/90 mt-2 mb-4 leading-relaxed">
                    {game.description}
                  </p>
                </div>

                <Link href={game.href} className="w-full">
                  <NeoButton variant="white" fullWidth size="md">
                    <Play className="w-4 h-4 fill-[#171717]" />
                    <span>PLAY GAME</span>
                  </NeoButton>
                </Link>
              </NeoCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
