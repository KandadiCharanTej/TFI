'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TELUGU_MOVIES } from '@/data/content';
import { AuctionPlayer, AuctionLot, calculatePlayerCollectionScore, calculateMovieScore } from '@/lib/auctionEngine';
import { TeluguHeroSplash, WoodenGavelIllustration, DoodleStar } from '@/components/ui/EditorialArt';
import { ArrowLeft, Clock, Users, Trophy, RotateCcw, Eye, Shield, Check, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SingleDeviceAuctionPage() {
  const [stage, setStage] = useState<'setup' | 'lot-card' | 'pass-prompt' | 'private-bid' | 'lot-reveal' | 'results'>('setup');
  
  // Setup inputs
  const [playerNamesInput, setPlayerNamesInput] = useState<string>('Charan, Henry, Kalyan');
  const [budgetPreset, setBudgetPreset] = useState<number>(100);
  const [lotCount, setLotCount] = useState<number>(5);

  // Active game state
  const [players, setPlayers] = useState<AuctionPlayer[]>([]);
  const [lots, setLots] = useState<AuctionLot[]>([]);
  const [currentLotIndex, setCurrentLotIndex] = useState<number>(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  
  // Bids map for current lot
  const [currentLotBids, setCurrentLotBids] = useState<{ [playerId: string]: number }>({});
  const [playerBidInput, setPlayerBidInput] = useState<number>(0);

  const initAuction = () => {
    const names = playerNamesInput
      .split(',')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    if (names.length < 2) {
      alert('Please enter at least 2 player names separated by commas.');
      return;
    }

    const initialPlayers: AuctionPlayer[] = names.map((name, idx) => ({
      id: `p-${idx + 1}`,
      name,
      initialBudget: budgetPreset,
      remainingBudget: budgetPreset,
      acquiredLots: [],
      totalScore: 0,
    }));

    const shuffled = [...TELUGU_MOVIES].sort(() => Math.random() - 0.5).slice(0, lotCount);
    const auctionLots: AuctionLot[] = shuffled.map((movie, index) => ({
      ...movie,
      lotNumber: index + 1,
      currentBid: 0,
      highestBidderId: null,
      highestBidderName: null,
      status: 'upcoming',
    }));

    setPlayers(initialPlayers);
    setLots(auctionLots);
    setCurrentLotIndex(0);
    setCurrentPlayerIndex(0);
    setCurrentLotBids({});
    setStage('lot-card');
  };

  const currentLot = lots[currentLotIndex] || {
    ...TELUGU_MOVIES[0],
    lotNumber: 1,
    currentBid: 20,
    highestBidderId: null,
    highestBidderName: null,
    status: 'upcoming' as const,
  };

  const activePlayer = players[currentPlayerIndex];

  const handlePrivateBidSubmit = (bid: number) => {
    const updatedBids = { ...currentLotBids, [activePlayer.id]: bid };
    setCurrentLotBids(updatedBids);

    if (currentPlayerIndex + 1 < players.length) {
      setCurrentPlayerIndex((prev) => prev + 1);
      setPlayerBidInput(0);
      setStage('pass-prompt');
    } else {
      resolveLot(updatedBids);
    }
  };

  const resolveLot = (bids: { [playerId: string]: number }) => {
    let highestBid = 0;
    let winningPlayerId: string | null = null;

    Object.entries(bids).forEach(([pId, bidAmount]) => {
      if (bidAmount > highestBid && bidAmount >= currentLot.basePriceCr) {
        highestBid = bidAmount;
        winningPlayerId = pId;
      }
    });

    const updatedLots = [...lots];
    const winningPlayer = players.find((p) => p.id === winningPlayerId);

    if (winningPlayerId && winningPlayer) {
      updatedLots[currentLotIndex] = {
        ...currentLot,
        currentBid: highestBid,
        highestBidderId: winningPlayerId,
        highestBidderName: winningPlayer.name,
        status: 'sold',
      };

      setPlayers((prev) =>
        prev.map((p) => {
          if (p.id === winningPlayerId) {
            const newRemaining = p.remainingBudget - highestBid;
            const updatedLotsList = [...p.acquiredLots, updatedLots[currentLotIndex]];
            const { totalScore } = calculatePlayerCollectionScore({
              ...p,
              remainingBudget: newRemaining,
              acquiredLots: updatedLotsList,
            });
            return {
              ...p,
              remainingBudget: newRemaining,
              acquiredLots: updatedLotsList,
              totalScore,
            };
          }
          return p;
        })
      );
    } else {
      updatedLots[currentLotIndex] = {
        ...currentLot,
        status: 'unsold',
      };
    }

    setLots(updatedLots);
    setStage('lot-reveal');
  };

  const handleNextLot = () => {
    if (currentLotIndex + 1 < lots.length) {
      setCurrentLotIndex((prev) => prev + 1);
      setStage('lot-card');
    } else {
      setStage('results');
      confetti({ particleCount: 120, spread: 80 });
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4 pb-12">
      {/* 1. SETUP */}
      {stage === 'setup' && (
        <div className="bg-white border-2 border-[#171717] rounded-3xl p-6 shadow-[3px_3px_0_#171717] space-y-4 text-center">
          <div className="flex items-center justify-between">
            <Link href="/games/auction" className="p-1 hover:bg-[#FFCB45]/30 rounded-lg">
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </Link>
            <h1 className="text-xl font-black text-[#171717]">Pass &amp; Play Auction</h1>
            <div className="w-5" />
          </div>

          <div className="w-20 h-20 bg-[#D2C2F8] rounded-2xl border-2 border-[#171717] mx-auto flex items-center justify-center shadow-[2px_2px_0_#171717]">
            <WoodenGavelIllustration className="w-14 h-14" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-[#171717]">Single-Device Auction</h2>
            <p className="text-xs font-semibold text-neutral-600 max-w-xs mx-auto">
              Pass one phone around the circle! Friends place secret blind bids, and the highest bidder claims the blockbuster.
            </p>
          </div>

          <div className="space-y-3 text-left pt-2">
            <div>
              <label className="text-xs font-black uppercase text-neutral-600 block mb-1">
                Player Names (comma separated)
              </label>
              <input
                type="text"
                value={playerNamesInput}
                onChange={(e) => setPlayerNamesInput(e.target.value)}
                className="w-full px-3 py-2 border-2 border-[#171717] rounded-xl font-bold text-xs shadow-[2px_2px_0_#171717]"
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase text-neutral-600 block mb-1">
                Purse Budget per Player
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[50, 100, 150].map((b) => (
                  <button
                    key={b}
                    onClick={() => setBudgetPreset(b)}
                    className={`py-2 rounded-xl border-2 border-[#171717] font-black text-xs ${
                      budgetPreset === b ? 'bg-[#FFCB45]' : 'bg-neutral-100'
                    }`}
                  >
                    ₹{b} Cr
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={initAuction}
            className="w-full py-4 bg-[#FFCB45] border-2 border-[#171717] rounded-2xl font-black text-base shadow-[2.5px_2.5px_0_#171717] hover:bg-[#ffd45e] active:translate-x-0.5 active:translate-y-0.5 mt-2 cursor-pointer transition-all"
          >
            Start Auction 🔨
          </button>
        </div>
      )}

      {/* 2. LOT CARD MATCHING REFERENCE SCREEN 9 */}
      {stage === 'lot-card' && (
        <div className="space-y-3">
          {/* Top Bar: Back arrow, "TFI Box Office Auction" */}
          <div className="flex items-center justify-between px-1">
            <button onClick={() => setStage('setup')} className="p-1 hover:bg-[#FFCB45]/30 rounded-lg">
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <h1 className="text-base font-black text-[#171717]">TFI Box Office Auction</h1>
            <div className="w-5" />
          </div>

          {/* Mode Pill matching reference screen 9: [Online Mode • Room: TFI123] */}
          <div className="flex justify-center">
            <div className="px-4 py-1 bg-[#D7E8FC] border-2 border-[#171717] rounded-full text-xs font-black text-[#171717] shadow-[1.5px_1.5px_0_#171717]">
              Pass &amp; Play • Lot #{currentLot.lotNumber} of {lots.length}
            </div>
          </div>

          {/* Big Featured Movie Box with Hero Art & Crowd sketch matching reference screen 9 */}
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
              <span className="text-xl font-black text-[#171717]">₹ {budgetPreset} Cr</span>
            </div>

            {/* Right: Highest Bid (Green card: ₹ 20 Cr) */}
            <div className="p-3.5 bg-[#88D49E] border-2 border-[#171717] rounded-2xl shadow-[2px_2px_0_#171717] text-center">
              <span className="text-xs font-bold text-[#171717] block">Base / Top Bid</span>
              <span className="text-xl font-black text-[#171717]">₹ {currentLot.basePriceCr} Cr</span>
            </div>
          </div>

          {/* Center Timer Pill matching reference screen 9: [⏱️ 00:12] */}
          <div className="flex justify-center pt-1">
            <div className="flex items-center gap-1.5 bg-[#FFCB45] px-4 py-1.5 rounded-full border-2 border-[#171717] shadow-[1.5px_1.5px_0_#171717] text-xs font-black">
              <Clock className="w-3.5 h-3.5 stroke-[3]" />
              <span>00:15</span>
            </div>
          </div>

          {/* Start Bidding CTA */}
          <button
            onClick={() => {
              setCurrentPlayerIndex(0);
              setCurrentLotBids({});
              setStage('pass-prompt');
            }}
            className="w-full py-4 bg-[#FFCB45] border-2 border-[#171717] rounded-2xl font-black text-lg text-[#171717] shadow-[2.5px_2.5px_0_#171717] hover:bg-[#ffd45e] active:translate-x-0.5 active:translate-y-0.5 uppercase tracking-wide cursor-pointer transition-all"
          >
            BID NOW
          </button>
        </div>
      )}

      {/* 3. PASS PROMPT PRIVACY SCREEN */}
      {stage === 'pass-prompt' && activePlayer && (
        <div className="bg-[#171717] text-white border-2 border-[#171717] rounded-3xl p-8 shadow-[3.5px_3.5px_0_#171717] text-center space-y-4">
          <Shield className="w-16 h-16 text-[#FFCB45] mx-auto" />
          <div className="space-y-1">
            <span className="text-xs font-black uppercase text-[#FFA6BA] tracking-wider">Secret Turn</span>
            <h2 className="text-2xl font-black">
              Pass phone to <br /> <span className="text-[#FFCB45] text-3xl">{activePlayer.name}</span>
            </h2>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto">
              Other players look away! Enter your private blind bid on the next screen.
            </p>
          </div>

          <button
            onClick={() => {
              setPlayerBidInput(currentLot.basePriceCr);
              setStage('private-bid');
            }}
            className="w-full py-4 bg-[#FFCB45] border-2 border-[#171717] rounded-2xl font-black text-sm text-[#171717] shadow-[2.5px_2.5px_0_#171717] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Eye className="w-4 h-4 stroke-[3]" />
            <span>I Am {activePlayer.name} (Enter Bid)</span>
          </button>
        </div>
      )}

      {/* 4. PRIVATE BID ENTRY */}
      {stage === 'private-bid' && activePlayer && (
        <div className="bg-white border-2 border-[#171717] rounded-3xl p-6 shadow-[3px_3px_0_#171717] space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <span className="text-[11px] font-black uppercase text-neutral-500">Player</span>
              <div className="text-lg font-black">{activePlayer.name}</div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-black uppercase text-neutral-500">Purse Remaining</span>
              <div className="text-lg font-black text-[#88D49E]">₹{activePlayer.remainingBudget} Cr</div>
            </div>
          </div>

          <div className="p-3 bg-[#FFF8E9] border-2 border-[#171717] rounded-2xl text-center">
            <span className="text-xs font-bold text-neutral-600">Lot #{currentLot.lotNumber}:</span>
            <div className="text-lg font-black text-[#171717]">{currentLot.titleEnglish}</div>
            <div className="text-xs font-black text-[#FF704D]">Base Price: ₹{currentLot.basePriceCr} Cr</div>
          </div>

          {/* Bid Selector with buttons matching reference: +₹5 Cr, +₹10 Cr, +₹20 Cr */}
          <div className="space-y-2">
            <span className="text-xs font-black uppercase text-neutral-600 block text-center">Your Bid Amount</span>
            <div className="text-3xl font-black text-center text-[#FF704D] py-2">
              ₹ {playerBidInput} Cr
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 20].map((inc) => (
                <button
                  key={inc}
                  onClick={() => setPlayerBidInput((prev) => Math.min(activePlayer.remainingBudget, prev + inc))}
                  className="py-2.5 bg-white border-2 border-[#171717] rounded-xl font-black text-xs shadow-[1.5px_1.5px_0_#171717] active:translate-y-0.5"
                >
                  +₹{inc} Cr
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => handlePrivateBidSubmit(0)}
              className="py-3 bg-neutral-100 border-2 border-[#171717] rounded-xl font-black text-xs hover:bg-neutral-200"
            >
              Pass (No Bid)
            </button>
            <button
              disabled={playerBidInput > activePlayer.remainingBudget || playerBidInput < currentLot.basePriceCr}
              onClick={() => handlePrivateBidSubmit(playerBidInput)}
              className="py-3 bg-[#FFCB45] border-2 border-[#171717] rounded-xl font-black text-xs shadow-[2px_2px_0_#171717] disabled:opacity-50"
            >
              Submit Bid 🔨
            </button>
          </div>
        </div>
      )}

      {/* 5. LOT REVEAL */}
      {stage === 'lot-reveal' && (
        <div className="bg-white border-2 border-[#171717] rounded-3xl p-6 shadow-[3px_3px_0_#171717] space-y-4 text-center">
          <span className="text-xs font-black px-3 py-1 bg-[#FFCB45] border-2 border-[#171717] rounded-full inline-block">
            Auction Result
          </span>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-[#171717]">{currentLot.titleEnglish}</h2>
            {currentLot.status === 'sold' ? (
              <p className="text-sm font-black text-green-700">
                🎉 Sold to {currentLot.highestBidderName} for ₹{currentLot.currentBid} Cr!
              </p>
            ) : (
              <p className="text-sm font-black text-red-600">
                ❌ Unsold (No bids met starting price)
              </p>
            )}
          </div>

          {/* Reveal all submitted bids */}
          <div className="bg-[#FFF8E9] p-3 rounded-2xl border-2 border-[#171717] text-left space-y-1.5">
            <span className="text-[11px] font-black uppercase text-neutral-500 block mb-1">Submitted Bids:</span>
            {players.map((p) => {
              const b = currentLotBids[p.id] || 0;
              const isWinner = p.id === currentLot.highestBidderId;
              return (
                <div key={p.id} className="flex justify-between text-xs font-bold">
                  <span>{p.name}:</span>
                  <span className={isWinner ? 'font-black text-green-800' : ''}>
                    {b > 0 ? `₹${b} Cr ${isWinner ? '👑 Won' : ''}` : 'Passed'}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleNextLot}
            className="w-full py-4 bg-[#FFCB45] border-2 border-[#171717] rounded-2xl font-black text-sm text-[#171717] shadow-[2.5px_2.5px_0_#171717] hover:bg-[#ffd45e] active:translate-x-0.5 active:translate-y-0.5 mt-2"
          >
            {currentLotIndex + 1 < lots.length ? 'Next Movie Lot ➡️' : 'See Final Standings 🏆'}
          </button>
        </div>
      )}

      {/* 6. FINAL RESULTS */}
      {stage === 'results' && (
        <div className="bg-white border-2 border-[#171717] rounded-3xl p-6 shadow-[3px_3px_0_#171717] space-y-4 text-center">
          <div className="w-16 h-16 bg-[#FFCB45] rounded-2xl border-2 border-[#171717] mx-auto flex items-center justify-center shadow-[2px_2px_0_#171717]">
            <Trophy className="w-10 h-10 text-[#171717]" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-[#171717]">Auction Champion!</h2>
            <p className="text-xs font-bold text-neutral-600">Final Producer Leaderboard</p>
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
                    <span className="font-black text-sm">{p.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-sm">{p.totalScore} Pts</span>
                    <span className="text-[10px] text-neutral-500 block">Movies: {p.acquiredLots.length}</span>
                  </div>
                </div>
              ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={initAuction}
              className="py-3 bg-[#FFCB45] border-2 border-[#171717] rounded-xl font-black text-xs shadow-[2px_2px_0_#171717] flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>New Auction</span>
            </button>
            <Link href="/games" className="block">
              <button className="w-full py-3 bg-[#FFF8E9] border-2 border-[#171717] rounded-xl font-black text-xs shadow-[2px_2px_0_#171717]">
                Back to Games
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
