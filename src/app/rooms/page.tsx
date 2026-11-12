'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { NeoButton, NeoCard, NeoBadge } from '@/components/ui/NeoPrimitives';
import { AuctionGavelIcon } from '@/components/ui/Illustrations';
import { useUserStore } from '@/store/useUserStore';
import { Users, Plus, KeyRound, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

export default function RoomsHubPage() {
  const router = useRouter();
  const { preferences } = useUserStore();
  const [roomCodeInput, setRoomCodeInput] = useState<string>('');
  const [createdRoomCode, setCreatedRoomCode] = useState<string | null>(null);
  const [budgetPreset, setBudgetPreset] = useState<number>(100);

  const handleCreateRoom = () => {
    // Generate a punchy 6-char Tollywood room code
    const codes = ['POKIRI', 'RANGAM', 'MAGADH', 'KUSHI7', 'GABBAR', 'PUSHPA', 'ATHADU'];
    const generated = codes[Math.floor(Math.random() * codes.length)] + Math.floor(10 + Math.random() * 89);
    setCreatedRoomCode(generated);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = roomCodeInput.trim().toUpperCase();
    if (!cleanCode) return;
    router.push(`/rooms/${cleanCode}`);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-1 font-black text-xs hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <NeoBadge variant="cobalt">MULTIPLAYER LOBBY</NeoBadge>
      </div>

      <NeoCard bg="bg-[#4385EA]" size="lg" className="text-white text-center space-y-2">
        <div className="flex justify-center">
          <Users className="w-16 h-16 text-[#FFCB45]" />
        </div>
        <h1 className="text-3xl font-black text-white">ONLINE AUCTION ROOMS</h1>
        <p className="text-sm font-extrabold text-white/90">
          Play real-time Box Office Auctions with friends across different devices!
        </p>
      </NeoCard>

      {/* Join Room Box */}
      <NeoCard bg="bg-white" size="lg" className="space-y-4">
        <div className="flex items-center gap-2">
          <KeyRound className="w-6 h-6 text-[#FF704D]" />
          <h2 className="text-xl font-black text-[#171717]">JOIN EXISTING ROOM</h2>
        </div>
        <p className="text-xs text-neutral-600 font-semibold">
          Got a 6-digit room code from your friend? Enter it below to join their live auction lobby.
        </p>

        <form onSubmit={handleJoinRoom} className="space-y-3">
          <input
            type="text"
            value={roomCodeInput}
            onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
            placeholder="e.g. POKIRI45"
            maxLength={10}
            className="w-full px-4 py-3 border-3 border-[#171717] rounded-xl font-black text-lg uppercase tracking-wider shadow-[3px_3px_0_#171717] focus:outline-none"
          />
          <NeoButton variant="coral" fullWidth size="md" type="submit" disabled={!roomCodeInput.trim()}>
            <span>ENTER ROOM</span>
            <ArrowRight className="w-4 h-4" />
          </NeoButton>
        </form>
      </NeoCard>

      {/* Create Room Box */}
      <NeoCard bg="bg-[#FFF8E9]" size="lg" className="space-y-4">
        <div className="flex items-center gap-2">
          <Plus className="w-6 h-6 text-[#FFCB45]" />
          <h2 className="text-xl font-black text-[#171717]">CREATE NEW ROOM</h2>
        </div>
        <p className="text-xs text-neutral-600 font-semibold">
          Host a private auction session. You control the budget and movie count!
        </p>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-neutral-600">Select Starting Purse</label>
          <div className="grid grid-cols-3 gap-2">
            {[50, 100, 150].map((b) => (
              <button
                key={b}
                onClick={() => setBudgetPreset(b)}
                className={`py-2 rounded-xl border-2 border-[#171717] font-black text-xs ${
                  budgetPreset === b ? 'bg-[#FFCB45] shadow-[2px_2px_0_#171717]' : 'bg-white'
                }`}
              >
                ₹{b} Cr
              </button>
            ))}
          </div>
        </div>

        {createdRoomCode ? (
          <div className="p-4 bg-white rounded-2xl border-3 border-[#171717] text-center space-y-3 shadow-[4px_4px_0_#171717]">
            <div className="text-xs font-black text-neutral-500 uppercase">Room Created Successfully!</div>
            <div className="text-3xl font-black text-[#FF704D] tracking-widest bg-[#FFF8E9] py-2 rounded-xl border-2 border-dashed border-[#171717]">
              {createdRoomCode}
            </div>
            <p className="text-xs font-bold text-neutral-600">
              Share this code with your friends or enter the lobby now!
            </p>
            <Link href={`/rooms/${createdRoomCode}?host=true&budget=${budgetPreset}`}>
              <NeoButton variant="green" fullWidth size="md">
                GO TO LOBBY 🚀
              </NeoButton>
            </Link>
          </div>
        ) : (
          <NeoButton variant="primary" fullWidth size="md" onClick={handleCreateRoom}>
            GENERATE ROOM CODE ⚡
          </NeoButton>
        )}
      </NeoCard>
    </div>
  );
}
