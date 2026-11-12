'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { DieCutCard } from '@/components/DieCutCard';
import { AcampButton } from '@/components/AcampButton';
import { useUser } from '@/utils/userContext';
import { FANBASE_LIST } from '@/data/teluguCinemaDatabase';
import { soundManager } from '@/utils/audio';
import { Radio, PlusCircle, Users, ArrowRight, ShieldCheck, Sparkles, Gavel } from 'lucide-react';
import clsx from 'clsx';

function RoomsHubContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || '';

  const { profile } = useUser();
  const activeFan = FANBASE_LIST.find(f => f.id === profile.fanIdentity) || FANBASE_LIST[0];

  // Join state
  const [joinCode, setJoinCode] = useState<string>(initialCode);
  const [joinName, setJoinName] = useState<string>(profile.name || 'TFI Producer');
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  // Create state
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [startingPurseCr, setStartingPurseCr] = useState<number>(100);
  const [maxLots, setMaxLots] = useState<number>(10);
  const [poolType, setPoolType] = useState<'balanced' | 'nostalgia' | 'tier1' | 'chaos'>('balanced');
  const [createError, setCreateError] = useState<string | null>(null);

  // Handle Join Room
  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      setJoinError('Please enter a 5-letter room code');
      return;
    }

    setIsJoining(true);
    setJoinError(null);

    try {
      const res = await fetch('/api/auction/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode: joinCode.trim().toUpperCase(),
          player: {
            id: profile.id,
            name: joinName.trim() || profile.name || 'Producer',
            fanIdentity: profile.fanIdentity,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setJoinError(data.error || 'Failed to join room');
        setIsJoining(false);
        return;
      }

      soundManager.playFanfare();
      router.push(`/rooms/${data.room.roomCode}`);
    } catch (err: any) {
      setJoinError('Network error connecting to room');
      setIsJoining(false);
    }
  };

  // Handle Create Room
  const handleCreateRoom = async () => {
    setIsCreating(true);
    setCreateError(null);

    try {
      const res = await fetch('/api/auction/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: {
            id: profile.id,
            name: profile.name || 'Host Producer',
            fanIdentity: profile.fanIdentity,
          },
          options: {
            poolType,
            startingPurseCr,
            maxLots,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error || 'Failed to create room');
        setIsCreating(false);
        return;
      }

      soundManager.playFanfare();
      router.push(`/rooms/${data.room.roomCode}`);
    } catch (err: any) {
      setCreateError('Network error creating room');
      setIsCreating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="bg-[#00E5FF] text-[#141313] font-black text-xs uppercase px-3 py-1 rounded-md border border-[#141313]">
          ONLINE MULTIPLAYER HUB
        </span>
        <h1 className="font-block text-5xl sm:text-7xl uppercase text-[#141313] tracking-tight">
          AUCTION ROOMS
        </h1>
        <p className="text-sm sm:text-base font-bold text-[#141313]/80 max-w-xl mx-auto">
          Play together across separate mobile phones and laptops with real-time bidding, anti-sniping, and live purse balances!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* JOIN ROOM CARD */}
        <DieCutCard className="p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#141313] text-[#F6BE18] flex items-center justify-center font-bold text-sm">
                1
              </span>
              <h3 className="font-block text-3xl uppercase text-[#141313]">
                JOIN AN EXISTING ROOM
              </h3>
            </div>

            <p className="text-xs font-semibold text-[#141313]/70">
              Have a 5-letter room code from a friend? Enter it below to step into the auction arena.
            </p>

            <form onSubmit={handleJoinRoom} className="space-y-3 pt-2">
              <div>
                <label className="block font-black text-xs uppercase mb-1">
                  5-Letter Room Code:
                </label>
                <input
                  type="text"
                  placeholder="e.g. TFI88"
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  className="w-full bg-[#F4F1EA] border-[2.5px] border-[#141313] px-3 py-2.5 rounded-xl font-mono font-black text-lg tracking-widest uppercase shadow-[3px_3px_0_#141313] focus:bg-[#FFF9E6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-black text-xs uppercase mb-1">
                  Your Producer Display Name:
                </label>
                <input
                  type="text"
                  value={joinName}
                  onChange={e => setJoinName(e.target.value)}
                  className="w-full bg-[#F4F1EA] border-[2.5px] border-[#141313] px-3 py-2.5 rounded-xl font-bold text-sm shadow-[3px_3px_0_#141313] focus:bg-white focus:outline-none"
                />
              </div>

              {joinError && (
                <div className="bg-red-100 text-red-700 text-xs font-bold p-2.5 rounded-xl border border-red-500">
                  {joinError}
                </div>
              )}

              <AcampButton
                type="submit"
                disabled={isJoining}
                variant="cyan"
                size="lg"
                fullWidth
              >
                {isJoining ? 'Connecting...' : '🚀 Enter Auction Room'}
              </AcampButton>
            </form>
          </div>
        </DieCutCard>


        {/* CREATE ROOM CARD */}
        <DieCutCard className="p-6 flex flex-col justify-between bg-gradient-to-br from-white to-[#FFF9E6]">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#EC1276] text-white flex items-center justify-center font-bold text-sm">
                2
              </span>
              <h3 className="font-block text-3xl uppercase text-[#141313]">
                CREATE A NEW ROOM
              </h3>
            </div>

            <p className="text-xs font-semibold text-[#141313]/70">
              Host a tournament for your friend group or family. Customize budgets and movie catalog pools.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block font-black text-xs uppercase mb-1">
                  Starting Purse Budget:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[50, 100, 150, 200].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setStartingPurseCr(amt)}
                      className={clsx(
                        'border-2 border-[#141313] py-1.5 rounded-xl font-mono font-bold text-xs cursor-pointer',
                        startingPurseCr === amt ? 'bg-[#F6BE18] text-[#141313] shadow-[2px_2px_0_#141313]' : 'bg-white'
                      )}
                    >
                      ₹{amt} Cr
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-xs uppercase mb-1">
                    Lots:
                  </label>
                  <select
                    value={maxLots}
                    onChange={e => setMaxLots(Number(e.target.value))}
                    className="w-full bg-white border-2 border-[#141313] px-2 py-2 rounded-xl font-bold text-xs shadow-[2px_2px_0_#141313]"
                  >
                    <option value={5}>5 Lots (~5 min)</option>
                    <option value={10}>10 Lots (~12 min)</option>
                    <option value={15}>15 Lots (~18 min)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-black text-xs uppercase mb-1">
                    Movie Pool:
                  </label>
                  <select
                    value={poolType}
                    onChange={e => setPoolType(e.target.value as any)}
                    className="w-full bg-white border-2 border-[#141313] px-2 py-2 rounded-xl font-bold text-xs shadow-[2px_2px_0_#141313]"
                  >
                    <option value="balanced">Balanced Pool</option>
                    <option value="nostalgia">2000s Nostalgia</option>
                    <option value="tier1">Tier-1 Star Titan</option>
                    <option value="chaos">Chaos &amp; Memes</option>
                  </select>
                </div>
              </div>

              {createError && (
                <div className="bg-red-100 text-red-700 text-xs font-bold p-2.5 rounded-xl border border-red-500">
                  {createError}
                </div>
              )}

              <AcampButton
                onClick={handleCreateRoom}
                disabled={isCreating}
                variant="magenta"
                size="lg"
                fullWidth
              >
                {isCreating ? 'Creating Room...' : '🔨 Generate Room & Code'}
              </AcampButton>
            </div>
          </div>
        </DieCutCard>

      </div>

    </div>
  );
}

export default function RoomsHubPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[50vh] flex items-center justify-center font-mono text-sm font-bold">
        Loading Rooms Hub...
      </div>
    }>
      <RoomsHubContent />
    </Suspense>
  );
}
