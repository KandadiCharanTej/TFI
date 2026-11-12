'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';
import { TELUGU_MOVIES } from '@/data/content';
import { AuctionPlayer, calculatePlayerCollectionScore, calculateMovieScore, validateBid } from '@/lib/auctionEngine';
import { AuctionLot } from '@/types';
import { NeoButton, NeoCard, NeoBadge } from '@/components/ui/NeoPrimitives';
import { Users, Timer, Trophy, ArrowLeft, RotateCcw, Copy, Check, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';

export const dynamic = 'force-dynamic';

function OnlineAuctionRoomContent({ paramsPromise }: { paramsPromise: Promise<{ code: string }> }) {
  const resolvedParams = use(paramsPromise);
  const roomCode = resolvedParams.code;
  const searchParams = useSearchParams();
  const isHost = searchParams.get('host') === 'true';
  const initialBudgetParam = Number(searchParams.get('budget')) || 100;

  const { preferences } = useUserStore();

  const [roomState, setRoomState] = useState<'lobby' | 'auction' | 'results'>('lobby');
  const [copied, setCopied] = useState<boolean>(false);

  // Simulated multiplayer players list (with host + joining friends)
  const [players, setPlayers] = useState<AuctionPlayer[]>([
    {
      id: 'p-me',
      name: preferences.displayName || 'TFI Producer',
      initialBudget: initialBudgetParam,
      remainingBudget: initialBudgetParam,
      acquiredLots: [],
      totalScore: 0,
    },
    {
      id: 'p-2',
      name: 'Puri_Mass',
      initialBudget: initialBudgetParam,
      remainingBudget: initialBudgetParam,
      acquiredLots: [],
      totalScore: 0,
    },
    {
      id: 'p-3',
      name: 'Trivikram_Pen',
      initialBudget: initialBudgetParam,
      remainingBudget: initialBudgetParam,
      acquiredLots: [],
      totalScore: 0,
    },
  ]);

  // Auction State
  const [lots, setLots] = useState<AuctionLot[]>([]);
  const [currentLotIndex, setCurrentLotIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [bidError, setBidError] = useState<string | null>(null);

  // Initialize lots
  useEffect(() => {
    const selected = [...TELUGU_MOVIES].slice(0, 5).map((m, idx) => ({
      ...m,
      lotNumber: idx + 1,
      currentBid: 0,
      highestBidderId: null,
      highestBidderName: null,
      status: 'upcoming' as const,
    }));
    setLots(selected);
  }, []);

  // Timer & Auto-bidding simulation from other players in the room!
  useEffect(() => {
    if (roomState !== 'auction') return;
    if (lots.length === 0) return;

    if (timeLeft <= 0) {
      finalizeCurrentLot();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    // Friendly AI peer bidding simulation if time is around 7s
    if (timeLeft === 8 && Math.random() > 0.4) {
      const otherPlayers = players.filter((p) => p.id !== 'p-me');
      const randomBidder = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
      const lot = lots[currentLotIndex];
      const nextBid = lot.currentBid > 0 ? lot.currentBid + 2 : lot.basePriceCr;

      if (randomBidder && randomBidder.remainingBudget >= nextBid) {
        setLots((prev) => {
          const updated = [...prev];
          updated[currentLotIndex] = {
            ...updated[currentLotIndex],
            currentBid: nextBid,
            highestBidderId: randomBidder.id,
            highestBidderName: randomBidder.name,
            status: 'bidding',
          };
          return updated;
        });
        if (timeLeft <= 5) {
          setTimeLeft((t) => t + 5);
        }
      }
    }

    return () => clearInterval(timer);
  }, [roomState, timeLeft, currentLotIndex, lots, players]);

  const copyInvite = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startLiveAuction = () => {
    setCurrentLotIndex(0);
    setTimeLeft(15);
    setRoomState('auction');
  };

  const handlePlaceBid = (increment: number) => {
    setBidError(null);
    const lot = lots[currentLotIndex];
    const myPlayer = players.find((p) => p.id === 'p-me')!;
    const targetBid = lot.currentBid > 0 ? lot.currentBid + increment : lot.basePriceCr;

    const validation = validateBid(targetBid, lot.currentBid, increment, myPlayer.remainingBudget, lot.basePriceCr);
    if (!validation.valid) {
      setBidError(validation.error || 'Invalid bid');
      return;
    }

    setLots((prev) => {
      const updated = [...prev];
      updated[currentLotIndex] = {
        ...updated[currentLotIndex],
        currentBid: targetBid,
        highestBidderId: myPlayer.id,
        highestBidderName: myPlayer.name,
        status: 'bidding',
      };
      return updated;
    });

    if (timeLeft <= 5) {
      setTimeLeft((t) => t + 5);
    }
  };

  const finalizeCurrentLot = () => {
    const lot = lots[currentLotIndex];
    const updatedLots = [...lots];

    if (lot.highestBidderId && lot.currentBid > 0) {
      updatedLots[currentLotIndex] = { ...lot, status: 'sold' };
      setPlayers((prev) =>
        prev.map((p) => {
          if (p.id === lot.highestBidderId) {
            const newRemaining = p.remainingBudget - lot.currentBid;
            const updatedAcquired = [...p.acquiredLots, updatedLots[currentLotIndex]];
            const { totalScore } = calculatePlayerCollectionScore({
              ...p,
              remainingBudget: newRemaining,
              acquiredLots: updatedAcquired,
            });
            return {
              ...p,
              remainingBudget: newRemaining,
              acquiredLots: updatedAcquired,
              totalScore,
            };
          }
          return p;
        })
      );
    } else {
      updatedLots[currentLotIndex] = { ...lot, status: 'unsold' };
    }

    setLots(updatedLots);

    if (currentLotIndex + 1 < lots.length) {
      setCurrentLotIndex((prev) => prev + 1);
      setTimeLeft(15);
    } else {
      setRoomState('results');
      confetti({ particleCount: 120, spread: 80 });
    }
  };

  const currentLot = lots[currentLotIndex];
  const myPlayer = players.find((p) => p.id === 'p-me')!;

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* 1. LOBBY */}
      {roomState === 'lobby' && (
        <NeoCard bg="bg-[#FFCB45]" size="lg" className="space-y-6">
          <div className="flex items-center justify-between">
            <Link href="/rooms" className="inline-flex items-center gap-1 font-black text-xs hover:underline">
              <ArrowLeft className="w-4 h-4" /> Leave Room
            </Link>
            <NeoBadge variant="coral">ROOM: {roomCode}</NeoBadge>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black text-[#171717]">AUCTION LOBBY</h1>
            <p className="text-xs font-bold text-neutral-700">
              Share the room code or invite link with your friends to join!
            </p>

            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl border-2 border-[#171717] shadow-[2px_2px_0_#171717] mt-2">
              <span className="text-xl font-black tracking-widest">{roomCode}</span>
              <button
                onClick={copyInvite}
                className="p-1 hover:bg-neutral-100 rounded border border-neutral-300"
                title="Copy Room Code"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border-3 border-[#171717] space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-xs font-black uppercase text-neutral-500">Connected Players ({players.length})</span>
              <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">● Live Realtime</span>
            </div>

            <div className="space-y-2">
              {players.map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between p-2.5 rounded-xl border-2 border-[#171717] bg-[#FFF8E9]">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#FFCB45] border border-[#171717] text-xs font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-black text-sm">{p.name} {p.id === 'p-me' ? '(You)' : ''}</span>
                  </div>
                  <span className="text-xs font-bold bg-white px-2 py-0.5 rounded border border-[#171717]">
                    Purse: ₹{p.initialBudget} Cr
                  </span>
                </div>
              ))}
            </div>
          </div>

          <NeoButton variant="coral" fullWidth size="lg" onClick={startLiveAuction}>
            START LIVE AUCTION (HOST) 🔨
          </NeoButton>
        </NeoCard>
      )}

      {/* 2. LIVE AUCTION */}
      {roomState === 'auction' && currentLot && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-3 rounded-xl border-3 border-[#171717] shadow-[3px_3px_0_#171717]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black bg-[#FF704D] text-white px-2 py-0.5 rounded">
                Lot {currentLotIndex + 1}/{lots.length}
              </span>
              <span className="text-xs font-bold text-neutral-600">
                Purse: <strong className="text-[#83CBA2]">₹{myPlayer.remainingBudget} Cr</strong>
              </span>
            </div>
            <div className="flex items-center gap-1 font-black text-2xl text-[#171717]">
              <Timer className="w-6 h-6 text-[#FF704D]" />
              <span className={timeLeft <= 5 ? 'text-red-600 animate-pulse font-black' : ''}>{timeLeft}s</span>
            </div>
          </div>

          <NeoCard bg="bg-[#FFF8E9]" size="lg" className="space-y-4 text-center">
            <NeoBadge variant="yellow">{currentLot.category} • {currentLot.ratingTier}</NeoBadge>
            <h2 className="text-3xl sm:text-4xl font-black text-[#171717]">
              {currentLot.titleTelugu}
            </h2>
            <p className="text-xl font-black text-[#4385EA]">
              {currentLot.titleEnglish} ({currentLot.year})
            </p>

            <div className="bg-white p-4 rounded-2xl border-3 border-[#171717] shadow-[3px_3px_0_#171717] space-y-1">
              <div className="text-xs font-black uppercase text-neutral-500">Highest Live Bid</div>
              <div className="text-4xl font-black text-[#FF704D]">
                {currentLot.currentBid > 0 ? `₹${currentLot.currentBid} Cr` : `Base: ₹${currentLot.basePriceCr} Cr`}
              </div>
              <div className="text-xs font-bold text-neutral-700">
                Leader: {currentLot.highestBidderName || 'No bids placed yet'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-left bg-white/70 p-3 rounded-xl border border-[#171717]">
              <div>Hero: <span className="font-black text-black">{currentLot.hero}</span></div>
              <div>Director: <span className="font-black text-black">{currentLot.director}</span></div>
              <div>Music: <span className="font-black text-black">{currentLot.musicDirector}</span></div>
              <div>Potential Score: <span className="font-black text-green-700">{calculateMovieScore(currentLot)} Pts</span></div>
            </div>

            {bidError && (
              <div className="p-2 bg-red-100 border border-red-500 rounded-lg text-xs font-black text-red-700 flex items-center gap-1 justify-center">
                <ShieldAlert className="w-4 h-4" /> {bidError}
              </div>
            )}

            <div className="space-y-2 pt-2">
              <div className="text-xs font-black uppercase text-neutral-600">Tap to place bid:</div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 5].map((inc) => (
                  <button
                    key={inc}
                    onClick={() => handlePlaceBid(inc)}
                    className="py-3 bg-[#FFCB45] border-3 border-[#171717] rounded-xl font-black text-sm shadow-[3px_3px_0_#171717] active:translate-y-1 hover:bg-[#ffc124]"
                  >
                    +₹{inc} Cr
                  </button>
                ))}
              </div>
            </div>
          </NeoCard>
        </div>
      )}

      {/* 3. RESULTS */}
      {roomState === 'results' && (
        <NeoCard bg="bg-[#FFF8E9]" size="lg" className="space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <Trophy className="w-20 h-20 text-[#FFCB45]" />
            </div>
            <h2 className="text-3xl font-black text-[#171717]">ROOM AUCTION WINNER!</h2>
            <p className="text-sm font-bold text-neutral-600">
              Live Telugu Box Office producer leaderboard:
            </p>
          </div>

          <div className="space-y-3">
            {[...players]
              .sort((a, b) => b.totalScore - a.totalScore)
              .map((p, rank) => (
                <div
                  key={p.id}
                  className={`p-4 rounded-2xl border-3 border-[#171717] shadow-[3px_3px_0_#171717] ${
                    rank === 0 ? 'bg-[#FFCB45]' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-black text-white font-black text-xs flex items-center justify-center">
                        {rank + 1}
                      </span>
                      <span className="font-black text-lg">{p.name} {p.id === 'p-me' ? '(You)' : ''}</span>
                      {rank === 0 && <span className="text-xs font-black bg-[#FF704D] text-white px-2 py-0.5 rounded">WINNER 🏆</span>}
                    </div>
                    <span className="text-xl font-black">{p.totalScore} Pts</span>
                  </div>
                  <div className="text-xs font-semibold text-neutral-600">
                    Acquired ({p.acquiredLots.length}): {p.acquiredLots.map((l) => l.titleEnglish).join(', ') || 'None'}
                  </div>
                </div>
              ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3">
            <NeoButton variant="coral" fullWidth size="md" onClick={() => setRoomState('lobby')}>
              <RotateCcw className="w-4 h-4" />
              <span>RETURN TO LOBBY</span>
            </NeoButton>
            <Link href="/rooms">
              <NeoButton variant="white" fullWidth size="md">
                EXIT ROOM
              </NeoButton>
            </Link>
          </div>
        </NeoCard>
      )}
    </div>
  );
}

export default function OnlineAuctionRoomPage({ params }: { params: Promise<{ code: string }> }) {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold">Loading Auction Room...</div>}>
      <OnlineAuctionRoomContent paramsPromise={params} />
    </Suspense>
  );
}
