'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { NeoButton, NeoCard, NeoBadge } from '@/components/ui/NeoPrimitives';
import { AuctionGavelIcon } from '@/components/ui/Illustrations';
import { Users, Smartphone, ShieldCheck, Trophy, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

export default function AuctionLandingPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/games" className="inline-flex items-center gap-1 font-black text-xs hover:underline text-neutral-700">
          <ArrowLeft className="w-4 h-4" /> Back to Games
        </Link>
        <NeoBadge variant="coral">FLAGSHIP EXPERIENCE</NeoBadge>
      </div>

      {/* Hero Header */}
      <NeoCard bg="bg-[#FFCB45]" size="lg" className="text-center space-y-3">
        <div className="flex justify-center">
          <AuctionGavelIcon className="w-20 h-20" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#171717] tracking-tight">
          TFI BOX OFFICE AUCTION
        </h1>
        <p className="text-sm sm:text-base font-extrabold text-[#171717]/90 max-w-lg mx-auto">
          Manage a virtual Tollywood production budget (₹100 Cr+), outbid your friends, and build the ultimate Telugu movie collection!
        </p>

        {/* Scoring Rule Explainer */}
        <div className="bg-white p-3 rounded-xl border-2 border-[#171717] text-left text-xs font-bold space-y-1.5 mt-4">
          <div className="flex items-center gap-1 text-[#FF704D] font-black uppercase">
            <Sparkles className="w-4 h-4" /> Transparent Scoring Engine:
          </div>
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="bg-[#FFF8E9] p-2 rounded-lg border border-[#171717]">
              <span className="font-black text-sm block">40%</span> Box Office Run
            </div>
            <div className="bg-[#FFF8E9] p-2 rounded-lg border border-[#171717]">
              <span className="font-black text-sm block">30%</span> Audience Love
            </div>
            <div className="bg-[#FFF8E9] p-2 rounded-lg border border-[#171717]">
              <span className="font-black text-sm block">30%</span> Cult Replay
            </div>
          </div>
          <p className="text-[11px] text-neutral-500 text-center pt-1 italic">
            * Purely virtual fun currency. Zero real-money gambling.
          </p>
        </div>
      </NeoCard>

      {/* Select Mode */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-[#171717]">SELECT AUCTION MODE</h2>

        {/* Option 1: Pass & Play */}
        <NeoCard bg="bg-white" size="lg" className="hover:bg-[#FFF8E9] transition-all">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-[#83CBA2] border-2 border-[#171717] rounded-xl shadow-[2px_2px_0_#171717]">
                <Smartphone className="w-8 h-8 text-[#171717]" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-[#171717]">Single-Device Pass & Play</h3>
                  <NeoBadge variant="green">OFFLINE READY</NeoBadge>
                </div>
                <p className="text-xs text-neutral-600 font-semibold max-w-md">
                  One phone passed around the circle! Confidential blind bidding screens ensure friends cannot peek at bids until revealed.
                </p>
              </div>
            </div>
            <Link href="/games/auction/pass-and-play" className="w-full sm:w-auto">
              <NeoButton variant="primary" size="md" fullWidth>
                <span>PASS & PLAY</span>
                <ArrowRight className="w-4 h-4" />
              </NeoButton>
            </Link>
          </div>
        </NeoCard>

        {/* Option 2: Online Multiplayer */}
        <NeoCard bg="bg-white" size="lg" className="hover:bg-[#FFF8E9] transition-all">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-[#4385EA] border-2 border-[#171717] rounded-xl shadow-[2px_2px_0_#171717] text-white">
                <Users className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-[#171717]">Online Live Auction Room</h3>
                  <NeoBadge variant="cobalt">MULTI-PHONE</NeoBadge>
                </div>
                <p className="text-xs text-neutral-600 font-semibold max-w-md">
                  Create a custom room code. Friends join on their own phones with real-time bidding, anti-sniping timers, and live bids!
                </p>
              </div>
            </div>
            <Link href="/rooms" className="w-full sm:w-auto">
              <NeoButton variant="coral" size="md" fullWidth>
                <span>ONLINE ROOMS</span>
                <ArrowRight className="w-4 h-4" />
              </NeoButton>
            </Link>
          </div>
        </NeoCard>
      </div>
    </div>
  );
}
