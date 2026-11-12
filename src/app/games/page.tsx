'use client';

import React from 'react';
import Link from 'next/link';
import { NeoCard, NeoButton, NeoBadge } from '@/components/ui/NeoPrimitives';
import { TeluguHeroIcon, AuctionGavelIcon, CinemaClapperIcon, CharadesMaskIcon } from '@/components/ui/Illustrations';
import { Gamepad2, ArrowRight } from 'lucide-react';

export default function GamesCataloguePage() {
  const games = [
    {
      id: 'auction',
      name: 'TFI Box Office Auction',
      telugu: 'బాక్స్ ఆఫీస్ వేలం',
      description: 'The flagship auction game! Budget ₹100 Cr, manage purse, bid against friends, and score massive points based on Box Office, Audience reception, and Cult Repeat Value.',
      modes: ['Online Multiplayer', 'Single Device Pass-and-Play'],
      players: '2-10 Players',
      href: '/games/auction',
      bg: 'bg-[#FFCB45]',
      icon: AuctionGavelIcon,
      tag: 'FLAGSHIP',
      tagColor: 'coral' as const,
    },
    {
      id: 'head-set-go',
      name: 'Head Set Go',
      telugu: 'హెడ్ సెట్ గో',
      description: 'Place your phone on your forehead! Friends mimic, describe, and quote legendary Telugu dialogues while you guess before the buzzer sounds.',
      modes: ['Forehead / Tilt Controls', 'Touch Button Controls'],
      players: '2+ Players',
      href: '/games/head-set-go',
      bg: 'bg-[#83CBA2]',
      icon: TeluguHeroIcon,
      tag: 'PARTY FAVORITE',
      tagColor: 'yellow' as const,
    },
    {
      id: 'transify',
      name: 'Transify',
      telugu: 'ట్రాన్సిఫై',
      description: 'Crazy English literal translations of Telugu movie names! The Judge reads out the English phrase, and friends race to decode the Telugu original.',
      modes: ['Single Device Pass-and-Play', 'Judge Scoring Mode'],
      players: '2-8 Players',
      href: '/games/transify',
      bg: 'bg-[#CBB8F5]',
      icon: CinemaClapperIcon,
      tag: 'COMEDY',
      tagColor: 'lavender' as const,
    },
    {
      id: 'dumb-charades',
      name: 'Dumb Charades',
      teluguTitle: 'డంబ్ చారేడ్స్',
      description: 'Two teams clash! Pass the phone with a private tap-to-reveal curtain so opponents cannot see the secret movie before you act it out.',
      modes: ['Team 1 vs Team 2', 'Curtain Screen'],
      players: '4-12 Players (2 Teams)',
      href: '/games/dumb-charades',
      bg: 'bg-[#FF704D]',
      icon: CharadesMaskIcon,
      tag: 'TEAM BATTLE',
      tagColor: 'green' as const,
    },
    {
      id: 'emoji-cinema',
      name: 'Emoji Cinema',
      telugu: 'ఎమోజి సినిమా',
      description: 'Test your brain against rapid-fire emoji puzzles representing blockbusters, heroes, and cult song sequences.',
      modes: ['Solo Time Attack', 'Pass & Score'],
      players: '1-6 Players',
      href: '/games/emoji-cinema',
      bg: 'bg-[#4385EA]',
      icon: CinemaClapperIcon,
      tag: 'TRIVIA PUZZLE',
      tagColor: 'white' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-[#FFCB45] border-3 border-[#171717] rounded-xl shadow-[3px_3px_0_#171717]">
          <Gamepad2 className="w-8 h-8 text-[#171717]" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#171717]">
            TELUGU CINEMA GAMES
          </h1>
          <p className="text-xs sm:text-sm font-bold text-neutral-600">
            5 unique party games crafted exclusively for Tollywood lovers.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <NeoCard key={game.id} bg={game.bg} size="lg" className="flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 bg-white border-3 border-[#171717] rounded-2xl shadow-[3px_3px_0_#171717] shrink-0">
                  <Icon className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <NeoBadge variant={game.tagColor}>{game.tag}</NeoBadge>
                    <span className="text-xs font-black bg-[#171717] text-white px-2 py-0.5 rounded">
                      {game.players}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-[#171717]">{game.name}</h2>
                  <p className="text-xs font-semibold text-[#171717]/80 line-clamp-2 md:line-clamp-none max-w-xl">
                    {game.description}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {game.modes.map((m, i) => (
                      <span key={i} className="text-[11px] font-bold bg-white/80 border border-[#171717] px-2 py-0.5 rounded-full">
                        ✓ {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto shrink-0">
                <Link href={game.href}>
                  <NeoButton variant="white" fullWidth size="md">
                    <span>PLAY NOW</span>
                    <ArrowRight className="w-4 h-4" />
                  </NeoButton>
                </Link>
              </div>
            </NeoCard>
          );
        })}
      </div>
    </div>
  );
}
