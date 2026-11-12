'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WoodenGavelIllustration, DoodleStar } from '@/components/ui/EditorialArt';
import { ArrowLeft, Users, Smartphone, ArrowRight } from 'lucide-react';

export default function AuctionLandingPage() {
  return (
    <div className="max-w-md mx-auto space-y-4 pb-12">
      <div className="flex items-center justify-between px-1">
        <Link href="/games" className="p-1 hover:bg-[#FFCB45]/30 rounded-lg">
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </Link>
        <h1 className="text-xl font-black text-[#171717]">Box Office Auction</h1>
        <div className="w-5" />
      </div>

      {/* Hero Card */}
      <div className="bg-[#D2C2F8] border-2 border-[#171717] rounded-3xl p-6 shadow-[3px_3px_0_#171717] text-center space-y-2">
        <div className="w-20 h-20 bg-white border-2 border-[#171717] rounded-2xl mx-auto flex items-center justify-center shadow-[2px_2px_0_#171717]">
          <WoodenGavelIllustration className="w-14 h-14" />
        </div>
        <h2 className="text-2xl font-black text-[#171717]">TFI Box Office Auction</h2>
        <p className="text-xs font-semibold text-[#171717]/85 max-w-xs mx-auto">
          Manage your virtual Tollywood budget (₹100 Cr), bid against friends, and build the highest-grossing Telugu movie empire!
        </p>
      </div>

      {/* Select Mode */}
      <div className="space-y-3 pt-1">
        {/* Pass and Play Mode */}
        <Link href="/games/auction/pass-and-play" className="block group">
          <div className="p-4 bg-white border-2 border-[#171717] rounded-2xl shadow-[2.5px_2.5px_0_#171717] flex items-center justify-between hover:bg-[#FFF8E9] transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#88D49E] border-2 border-[#171717] rounded-xl">
                <Smartphone className="w-6 h-6 text-[#171717]" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#171717]">Pass &amp; Play (Single-Device)</h3>
                <p className="text-xs font-semibold text-neutral-600">One phone with secret blind bidding screens</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 stroke-[2.5] text-neutral-500 group-hover:text-black" />
          </div>
        </Link>

        {/* Online Multiplayer Mode */}
        <Link href="/rooms" className="block group">
          <div className="p-4 bg-white border-2 border-[#171717] rounded-2xl shadow-[2.5px_2.5px_0_#171717] flex items-center justify-between hover:bg-[#FFF8E9] transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#B3D4FC] border-2 border-[#171717] rounded-xl">
                <Users className="w-6 h-6 text-[#171717]" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#171717]">Online Live Rooms</h3>
                <p className="text-xs font-semibold text-neutral-600">Join room codes across different phones</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 stroke-[2.5] text-neutral-500 group-hover:text-black" />
          </div>
        </Link>
      </div>
    </div>
  );
}
