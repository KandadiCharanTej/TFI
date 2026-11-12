'use client';

import React from 'react';
import Link from 'next/link';
import { DieCutCard } from '@/components/DieCutCard';
import { AcampButton } from '@/components/AcampButton';
import { Gavel, Users, Radio, ArrowLeft, Trophy, ShieldCheck, Sparkles } from 'lucide-react';

export default function BoxOfficeAuctionHub() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link href="/games" className="text-xs font-black uppercase bg-white border border-[#141313] px-2.5 py-1 rounded-lg">
          ← Back to Games
        </Link>
      </div>

      <div className="text-center space-y-2">
        <span className="bg-[#F6BE18] text-[#141313] font-black text-xs uppercase px-3 py-1 rounded-md border border-[#141313]">
          FLAGSHIP TOURNAMENT GAME
        </span>
        <h1 className="font-block text-5xl sm:text-6xl uppercase text-[#141313] tracking-tight">
          TFI BOX OFFICE AUCTION
        </h1>
        <p className="text-sm font-bold text-[#141313]/80 max-w-xl mx-auto">
          Every player starts with ₹100 Cr virtual purse. Compete to build the highest scoring Telugu cinema catalog! Choose your mode below:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Mode 1: Pass & Play */}
        <DieCutCard className="p-8 flex flex-col justify-between space-y-6 bg-white">
          <div className="space-y-3">
            <span className="bg-[#F6BE18] text-[#141313] text-xs font-black uppercase px-3 py-1 rounded border border-[#141313]">
              MODE A • OFFLINE
            </span>
            <h2 className="font-block text-3xl uppercase text-[#141313]">
              SINGLE-DEVICE PASS &amp; PLAY
            </h2>
            <p className="text-xs font-semibold text-[#141313]/80 leading-relaxed">
              Playing together on one phone or laptop sitting in the room? Take turns passing the device with complete bid secrecy and reveal winning bids together!
            </p>
            <div className="space-y-1 text-xs font-bold text-gray-600 pt-1">
              <div>✓ 2 to 8 Players on one screen</div>
              <div>✓ Secret private bidding turns</div>
              <div>✓ 100% Works offline</div>
            </div>
          </div>

          <Link href="/games/box-office-auction/pass-and-play" className="block">
            <AcampButton variant="yellow" size="lg" fullWidth>
              📱 Launch Pass &amp; Play
            </AcampButton>
          </Link>
        </DieCutCard>

        {/* Mode 2: Online Multiplayer */}
        <DieCutCard className="p-8 flex flex-col justify-between space-y-6 bg-gradient-to-br from-white to-[#FCE8F3]">
          <div className="space-y-3">
            <span className="bg-[#EC1276] text-white text-xs font-black uppercase px-3 py-1 rounded border border-[#141313]">
              MODE B • ONLINE
            </span>
            <h2 className="font-block text-3xl uppercase text-[#141313]">
              ONLINE MULTIPLAYER ROOMS
            </h2>
            <p className="text-xs font-semibold text-[#141313]/80 leading-relaxed">
              Each friend connects using their own phone via a 5-letter room code. Features 15-second countdowns, anti-sniping resets, and real-time live bidding!
            </p>
            <div className="space-y-1 text-xs font-bold text-gray-600 pt-1">
              <div>✓ Real-time multiplayer synchronization</div>
              <div>✓ Anti-sniping: late bids reset timer to 5s</div>
              <div>✓ Live purse balance updates</div>
            </div>
          </div>

          <Link href="/rooms" className="block">
            <AcampButton variant="magenta" size="lg" fullWidth>
              🌐 Online Multiplayer Rooms
            </AcampButton>
          </Link>
        </DieCutCard>

      </div>

    </div>
  );
}

