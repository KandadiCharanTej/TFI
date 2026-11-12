'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ForeheadPlayerIcon, PopcornEmojiIcon, WoodenGavelIllustration, ClapperboardDoodle, MimeActorIllustration } from '@/components/ui/EditorialArt';
import { ArrowLeft, ChevronRight } from 'lucide-react';

export default function GamesCataloguePage() {
  const [activeTab, setActiveTab] = useState<'All' | 'Cinema' | 'Party'>('All');

  const games = [
    {
      id: 'head-set-go',
      title: 'Head Set Go',
      subtitle: 'Guess movies!',
      category: 'Party',
      href: '/games/head-set-go',
      icon: ForeheadPlayerIcon,
      bg: 'bg-[#B3D4FC]',
    },
    {
      id: 'transify',
      title: 'Transify',
      subtitle: 'Crack the funny translations!',
      category: 'Cinema',
      href: '/games/transify',
      icon: ClapperboardDoodle,
      bg: 'bg-[#FFA6BA]',
    },
    {
      id: 'dumb-charades',
      title: 'Dumb Charades',
      subtitle: 'Act it out!',
      category: 'Party',
      href: '/games/dumb-charades',
      icon: MimeActorIllustration,
      bg: 'bg-[#FF9E80]',
    },
    {
      id: 'emoji-cinema',
      title: 'Emoji Cinema',
      subtitle: 'Guess the movie!',
      category: 'Cinema',
      href: '/games/emoji-cinema',
      icon: PopcornEmojiIcon,
      bg: 'bg-[#FFE082]',
    },
    {
      id: 'auction',
      title: 'TFI Box Office Auction',
      subtitle: 'Bid & Build!',
      category: 'Cinema',
      href: '/games/auction',
      icon: WoodenGavelIllustration,
      bg: 'bg-[#D2C2F8]',
    },
  ];

  const filteredGames = activeTab === 'All' ? games : games.filter((g) => g.category === activeTab);

  return (
    <div className="max-w-md mx-auto space-y-4 pb-12">
      {/* Top Header matching reference screen 4: Back arrow + "Games" */}
      <div className="flex items-center justify-between px-1">
        <Link href="/" className="p-1 hover:bg-[#FFCB45]/30 rounded-lg">
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </Link>
        <h1 className="text-xl font-black text-[#171717] tracking-tight">
          Games
        </h1>
        <div className="w-5" /> {/* balance spacing */}
      </div>

      {/* Filter Tabs matching reference screen 4: Pills [All] [Cinema] [Party] */}
      <div className="flex items-center gap-2 pt-1">
        {(['All', 'Cinema', 'Party'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-1.5 rounded-full border-2 border-[#171717] text-xs font-black transition-all ${
              activeTab === tab
                ? 'bg-[#FFCB45] shadow-[2px_2px_0_#171717] -translate-y-0.5'
                : 'bg-white hover:bg-neutral-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Game Cards List matching reference screen 4 */}
      <div className="space-y-3 pt-2">
        {filteredGames.map((game) => {
          const Icon = game.icon;
          return (
            <Link key={game.id} href={game.href} className="block group">
              <div className="p-3 bg-white border-2 border-[#171717] rounded-2xl shadow-[2.5px_2.5px_0_#171717] flex items-center justify-between hover:bg-[#FFF8E9] transition-all">
                <div className="flex items-center gap-3.5">
                  {/* Square thumbnail with rounded border */}
                  <div className={`w-14 h-14 ${game.bg} border-2 border-[#171717] rounded-xl flex items-center justify-center p-2 shadow-[1px_1px_0_#171717] shrink-0`}>
                    <Icon className="w-9 h-9" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-[#171717] group-hover:text-[#FF704D] transition-colors leading-tight">
                      {game.title}
                    </h2>
                    <p className="text-xs font-semibold text-neutral-600 mt-0.5">
                      {game.subtitle}
                    </p>
                  </div>
                </div>

                <div className="p-1.5 bg-[#FFF8E9] group-hover:bg-[#FFCB45] border-2 border-[#171717] rounded-xl shadow-[1px_1px_0_#171717] transition-all">
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
