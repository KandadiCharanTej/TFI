'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';
import { TELUGU_MOVIES } from '@/data/content';
import { AuctionPlayer, calculatePlayerCollectionScore, calculateMovieScore, validateBid } from '@/lib/auctionEngine';
import { AuctionLot } from '@/types';
import { TeluguHeroSplash, WoodenGavelIllustration, DoodleStar } from '@/components/ui/EditorialArt';
import { ArrowLeft, Clock, Users, Trophy, RotateCcw, Copy, Check, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';

function OnlineAuctionRoomContent({ paramsPromise }: { paramsPromise: Promise<{ code: string }> }) {
  const resolvedParams = use(paramsPromise);
  const roomCode = resolvedParams.code;
  const searchParams = useSearchParams();
  const initialBudgetParam = Number(searchParams.get('budget')) || 100;

  const { preferences } = useUserStore();

  const [roomState, setRoomState] = useState<'lobby' | 'auction' | 'results'>('lobby');
  const [copied, setCopied] = useState<boolean>(false);

  // Simulated multiplayer players list
  const [players, setPlayers] = useState<AuctionPlayer[]>([
    {
      id: 'p-me',
      name: preferences.displayName || 'Charan',
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

  const [lots, setLots] = useState<AuctionLot[]>([]);
  const [currentLotIndex, setCurrentLotIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(12); // 00:12 matching reference screen 9
  const [bidError, setBidError] = useState<string | null>(null);

  useEffect(() => {
    const selected = [...TELUGU_MOVIES].slice(0, 5).map((m, idx) => ({
      ...m,
      lotNumber: idx + 1,
      currentBid: idx === 0 ? 20 : 0, // matching reference starting bid ₹ 20 Cr
      highestBidderId: null,
      highestBidderName: null,
      status: 'upcoming' as const,
    }));
    setLots(selected);
  }, []);

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

    // Friendly AI peer bidding simulation
    if (timeLeft === 6 && Math.random() > 0.4) {
      const otherPlayers = players.filter((p) => p.id !== 'p-me');
      const randomBidder = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
      const lot = lots[currentLotIndex];
      const nextBid = lot.currentBid > 0 ? lot.currentBid + 5 : lot.basePriceCr;

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
        if (timeLeft <= 4) {
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
    setTimeLeft(12);
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

    if (timeLeft <= 4) {
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
      setTimeLeft(12);
    } else {
      setRoomState('results');
      confetti({ particleCount: 120, spread: 80 });
    }
  };

  const currentLot = lots[currentLotIndex] || {
    titleEnglish: 'Jersey',
    basePriceCr: 5,
    currentBid: 20,
    highestBidderName: null,
  };

  const myPlayer = players.find((p) => p.id === 'p-me')!;

  return (
    <div className="max-w-md mx-auto space-y-3 pb-12">
      {/* 1. LOBBY */}
      {roomState === 'lobby' && (
        <div className="bg-white border-2 border-[#171717] rounded-3xl p-6 shadow-[3px_3px_0_#171717] space-y-4 text-center">
          <div className="flex items-center justify-between">
            <Link href="/rooms" className="p-1 hover:bg-[#FFCB45]/30 rounded-lg">
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </Link>
            <h1 className="text-xl font-black text-[#171717]">Room Lobby</h1>
            <div className="w-5" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-black uppercase text-neutral-500">Room Code</span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-black text-[#FF704D] tracking-widest">{roomCode}</span>
              <button onClick={copyInvite} className="p-1 hover:bg-neutral-100 rounded border border-neutral-300">
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="bg-[#FFF8E9] p-3 rounded-2xl border-2 border-[#171717] space-y-2 text-left">
            <span className="text-xs font-black uppercase text-neutral-500">Connected ({players.length}):</span>
            {players.map((p, idx) => (
              <div key={p.id} className="flex justify-between items-center text-xs font-bold">
                <span>{idx + 1}. {p.name} {p.id === 'p-me' ? '(You)' : ''}</span>
                <span className="text-neutral-600">₹{p.initialBudget} Cr</span>
              </div>
            ))}
          </div>

          <button
            onClick={startLiveAuction}
            className="w-full py-4 bg-[#FFCB45] border-2 border-[#171717] rounded-2xl font-black text-base shadow-[2.5px_2.5px_0_#171717] hover:bg-[#ffd45e] active:translate-x-0.5 active:translate-y-0.5 mt-2"
          >
            Start Auction 🔨
          </button>
        </div>
      )}

      {/* 2. LIVE AUCTION MATCHING EXACT REFERENCE SCREEN 9 */}
      {roomState === 'auction' && (
        <div className="space-y-3">
          {/* Top Bar: Back arrow, "TFI Box Office Auction" */}
          <div className="flex items-center justify-between px-1">
            <button onClick={() => setRoomState('lobby')} className="p-1 hover:bg-[#FFCB45]/30 rounded-lg">
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <h1 className="text-base font-black text-[#171717]">TFI Box Office Auction</h1>
            <div className="w-5" />
          </div>

          {/* Mode Pill matching reference screen 9: [Online Mode • Room: TFI123] */}
          <div className="flex justify-center">
            <div className="px-4 py-1 bg-[#D7E8FC] border-2 border-[#171717] rounded-full text-xs font-black text-[#171717] shadow-[1.5px_1.5px_0_#171717]">
              Online Mode • Room: {roomCode}
            </div>
          </div>

          {/* Big Movie Box with Hero Art & Crowd sketch matching reference screen 9 */}
          <div className="bg-white border-2 border-[#171717] rounded-3xl p-4 shadow-[3px_3px_0_#171717] text-center space-y-2 overflow-hidden relative">
            <div className="flex justify-center -my-2">
              <TeluguHeroSplash className="w-36 h-36" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#171717] leading-tight">
                {currentLot.titleEnglish}
              </h2>
              <p className="text-xs font-bold text-neutral-600">
                Base Price: ₹{currentLot.basePriceCr} Cr
              </p>
            </div>
          </div>

          {/* Budget & Highest Bid Cards matching reference screen 9 */}
          <div className="grid grid-cols-2 gap-3">
            {/* Left: Your Budget (Purple card: ₹ 100 Cr) */}
            <div className="p-3.5 bg-[#D2C2F8] border-2 border-[#171717] rounded-2xl shadow-[2px_2px_0_#171717] text-center">
              <span className="text-xs font-bold text-[#171717] block">Your Budget</span>
              <span className="text-xl font-black text-[#171717]">₹ {myPlayer.remainingBudget} Cr</span>
            </div>

            {/* Right: Highest Bid (Green card: ₹ 20 Cr) */}
            <div className="p-3.5 bg-[#88D49E] border-2 border-[#171717] rounded-2xl shadow-[2px_2px_0_#171717] text-center">
              <span className="text-xs font-bold text-[#171717] block">Highest Bid</span>
              <span className="text-xl font-black text-[#171717]">₹ {currentLot.currentBid} Cr</span>
            </div>
          </div>

          {/* Center Timer Pill matching reference screen 9: [⏱️ 00:12] */}
          <div className="flex justify-center pt-0.5">
            <div className="flex items-center gap-1.5 bg-[#FFCB45] px-4 py-1.5 rounded-full border-2 border-[#171717] shadow-[1.5px_1.5px_0_#171717] text-xs font-black">
              <Clock className="w-3.5 h-3.5 stroke-[3]" />
              <span>00:{timeLeft.toString().padStart(2, '0')}</span>
            </div>
          </div>

          {/* 3 Bid Increment Buttons matching reference screen 9: [+₹5 Cr] [+₹10 Cr] [+₹20 Cr] */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[5, 10, 20].map((inc) => (
              <button
                key={inc}
                onClick={() => handlePlaceBid(inc)}
                className="py-2.5 bg-white border-2 border-[#171717] rounded-xl font-black text-xs text-[#171717] shadow-[1.5px_1.5px_0_#171717] active:translate-x-0.5 active:translate-y-0.5 hover:bg-neutral-50 transition-all"
              >
                +₹{inc} Cr
              </button>
            ))}
          </div>

          {/* Bid Now Primary Button matching reference screen 9: large bold yellow button */}
          <button
            onClick={() => handlePlaceBid(5)}
            className="w-full py-4 bg-[#FFCB45] border-2 border-[#171717] rounded-2xl font-black text-lg text-[#171717] shadow-[2.5px_2.5px_0_#171717] hover:bg-[#ffd45e] active:translate-x-0.5 active:translate-y-0.5 uppercase tracking-wide cursor-pointer transition-all mt-1"
          >
            BID NOW
          </button>
        </div>
      )}

      {/* 3. RESULTS */}
      {roomState === 'results' && (
        <div className="bg-white border-2 border-[#171717] rounded-3xl p-6 shadow-[3px_3px_0_#171717] space-y-4 text-center">
          <div className="w-16 h-16 bg-[#FFCB45] rounded-2xl border-2 border-[#171717] mx-auto flex items-center justify-center shadow-[2px_2px_0_#171717]">
            <Trophy className="w-10 h-10 text-[#171717]" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-[#171717]">Auction Completed!</h2>
            <p className="text-xs font-bold text-neutral-600">Room Leaderboard</p>
          </div>

          <div className="space-y-2 text-left">
            {[...players]
              .sort((a, b) => b.totalScore - a.totalScore)
              .map((p, idx) => (
                <div key={p.id} className="p-3 bg-[#FFF8E9] border-2 border-[#171717] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-[#171717] text-white rounded-full text-xs font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-black text-sm">{p.name} {p.id === 'p-me' ? '(You)' : ''}</span>
                  </div>
                  <span className="font-black text-sm">{p.totalScore} Pts</span>
                </div>
              ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setRoomState('lobby')}
              className="py-3 bg-[#FFCB45] border-2 border-[#171717] rounded-xl font-black text-xs shadow-[2px_2px_0_#171717] flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Back to Lobby</span>
            </button>
            <Link href="/rooms" className="block">
              <button className="w-full py-3 bg-[#FFF8E9] border-2 border-[#171717] rounded-xl font-black text-xs shadow-[2px_2px_0_#171717]">
                Exit Room
              </button>
            </Link>
          </div>
        </div>
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
