'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TELUGU_MOVIES } from '@/data/content';
import { AuctionPlayer, AuctionLot, calculatePlayerCollectionScore, calculateMovieScore } from '@/lib/auctionEngine';
import { NeoButton, NeoCard, NeoBadge } from '@/components/ui/NeoPrimitives';
import { AuctionGavelIcon } from '@/components/ui/Illustrations';
import { ArrowLeft, Users, Shield, Trophy, RotateCcw, Check, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SingleDeviceAuctionPage() {
  const [stage, setStage] = useState<'setup' | 'lot-intro' | 'pass-prompt' | 'private-bid' | 'lot-reveal' | 'results'>('setup');
  
  // Setup inputs
  const [playerNamesInput, setPlayerNamesInput] = useState<string>('Tej, Henry, Charitra, Kalyan');
  const [budgetPreset, setBudgetPreset] = useState<number>(100);
  const [lotCount, setLotCount] = useState<number>(6);

  // Active game state
  const [players, setPlayers] = useState<AuctionPlayer[]>([]);
  const [lots, setLots] = useState<AuctionLot[]>([]);
  const [currentLotIndex, setCurrentLotIndex] = useState<number>(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  
  // Blind bids for current lot: map of playerId -> bidAmount (0 = pass)
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

    // Pick random lots from TELUGU_MOVIES
    const shuffledMovies = [...TELUGU_MOVIES].sort(() => Math.random() - 0.5).slice(0, lotCount);
    const auctionLots: AuctionLot[] = shuffledMovies.map((movie, index) => ({
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
    setStage('lot-intro');
  };

  const startBiddingForLot = () => {
    setCurrentPlayerIndex(0);
    setCurrentLotBids({});
    setStage('pass-prompt');
  };

  const currentLot = lots[currentLotIndex];
  const activePlayer = players[currentPlayerIndex];

  const handlePrivateBidSubmit = (bid: number) => {
    const updatedBids = { ...currentLotBids, [activePlayer.id]: bid };
    setCurrentLotBids(updatedBids);

    // If more players remain to bid
    if (currentPlayerIndex + 1 < players.length) {
      setCurrentPlayerIndex((prev) => prev + 1);
      setPlayerBidInput(0);
      setStage('pass-prompt');
    } else {
      // All players have submitted secret bids -> Resolve lot!
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

      // Deduct budget & award movie
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
      setStage('lot-intro');
    } else {
      setStage('results');
      confetti({ particleCount: 120, spread: 80 });
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* 1. SETUP */}
      {stage === 'setup' && (
        <NeoCard bg="bg-[#FFCB45]" size="lg" className="space-y-6">
          <div className="flex items-center justify-between">
            <Link href="/games/auction" className="inline-flex items-center gap-1 font-black text-xs hover:underline">
              <ArrowLeft className="w-4 h-4" /> Back to Auction Modes
            </Link>
            <NeoBadge variant="coral">PASS & PLAY</NeoBadge>
          </div>

          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <AuctionGavelIcon className="w-20 h-20" />
            </div>
            <h1 className="text-3xl font-black text-[#171717]">PASS & PLAY AUCTION</h1>
            <p className="text-sm font-extrabold text-[#171717]/80">
              One device for all friends. Place blind bids in secret, then reveal the winner!
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border-3 border-[#171717] space-y-4">
            <div>
              <label className="text-xs font-black uppercase text-neutral-600 block mb-1">
                Player Names (comma separated)
              </label>
              <input
                type="text"
                value={playerNamesInput}
                onChange={(e) => setPlayerNamesInput(e.target.value)}
                className="w-full px-3 py-2 border-2 border-[#171717] rounded-xl font-bold text-sm shadow-[2px_2px_0_#171717]"
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase text-neutral-600 block mb-1">
                Virtual Budget per Player
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[50, 100, 150, 200].map((b) => (
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

            <div>
              <label className="text-xs font-black uppercase text-neutral-600 block mb-1">
                Number of Movie Lots to Auction
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[4, 6, 8].map((count) => (
                  <button
                    key={count}
                    onClick={() => setLotCount(count)}
                    className={`py-2 rounded-xl border-2 border-[#171717] font-black text-xs ${
                      lotCount === count ? 'bg-[#83CBA2]' : 'bg-neutral-100'
                    }`}
                  >
                    {count} Movies
                  </button>
                ))}
              </div>
            </div>
          </div>

          <NeoButton variant="coral" fullWidth size="lg" onClick={initAuction}>
            START THE AUCTION! 🔨
          </NeoButton>
        </NeoCard>
      )}

      {/* 2. LOT INTRO */}
      {stage === 'lot-intro' && currentLot && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-3 rounded-xl border-3 border-[#171717] shadow-[3px_3px_0_#171717]">
            <span className="text-xs font-black bg-[#FF704D] text-white px-2.5 py-1 rounded-lg">
              Lot #{currentLot.lotNumber} of {lots.length}
            </span>
            <span className="text-xs font-bold text-neutral-600">
              Base Price: ₹{currentLot.basePriceCr} Cr
            </span>
          </div>

          <NeoCard bg="bg-[#FFF8E9]" size="lg" className="space-y-4">
            <div className="text-center space-y-1">
              <NeoBadge variant="yellow">{currentLot.category} • {currentLot.ratingTier}</NeoBadge>
              <h2 className="text-3xl sm:text-4xl font-black text-[#171717]">
                {currentLot.titleTelugu}
              </h2>
              <p className="text-xl font-extrabold text-[#4385EA]">
                {currentLot.titleEnglish} ({currentLot.year})
              </p>
            </div>

            {/* Movie Stats */}
            <div className="bg-white p-4 rounded-xl border-2 border-[#171717] space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <div>Director: <span className="text-black font-black">{currentLot.director}</span></div>
                <div>Hero: <span className="text-black font-black">{currentLot.hero}</span></div>
                <div>Music: <span className="text-black font-black">{currentLot.musicDirector}</span></div>
                <div>Starting Bid: <span className="text-[#FF704D] font-black">₹{currentLot.basePriceCr} Cr</span></div>
              </div>
              <div className="text-xs text-neutral-600 italic pt-1 border-t border-neutral-200">
                &ldquo;{currentLot.trivia}&rdquo;
              </div>
            </div>

            {/* Value Potential */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-black">
              <div className="bg-[#83CBA2] p-2 rounded-lg border border-[#171717]">
                BO: {currentLot.boxOfficeScore}/100
              </div>
              <div className="bg-[#FFCB45] p-2 rounded-lg border border-[#171717]">
                Audience: {currentLot.audienceScore}/100
              </div>
              <div className="bg-[#CBB8F5] p-2 rounded-lg border border-[#171717]">
                Cult: {currentLot.cultScore}/100
              </div>
            </div>

            <NeoButton variant="primary" fullWidth size="lg" onClick={startBiddingForLot}>
              BEGIN BLIND BIDDING 🗳️
            </NeoButton>
          </NeoCard>
        </div>
      )}

      {/* 3. PASS PROMPT PRIVACY SCREEN */}
      {stage === 'pass-prompt' && activePlayer && (
        <NeoCard bg="bg-[#171717]" size="lg" className="text-center py-12 space-y-6 text-white">
          <div className="flex justify-center">
            <Shield className="w-16 h-16 text-[#FFCB45]" />
          </div>
          <div className="space-y-2">
            <NeoBadge variant="coral">CONFIDENTIAL BIDDING</NeoBadge>
            <h2 className="text-3xl font-black">
              Hand Phone to: <br />
              <span className="text-4xl text-[#FFCB45]">{activePlayer.name}</span>
            </h2>
            <p className="text-xs font-bold text-neutral-300 max-w-sm mx-auto">
              Other players, please look away! {activePlayer.name} will enter their secret bid.
            </p>
          </div>

          <div className="pt-4">
            <NeoButton
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => {
                setPlayerBidInput(currentLot.basePriceCr);
                setStage('private-bid');
              }}
            >
              <Eye className="w-5 h-5" />
              <span>I AM {activePlayer.name.toUpperCase()} (ENTER BID)</span>
            </NeoButton>
          </div>
        </NeoCard>
      )}

      {/* 4. PRIVATE BID SCREEN */}
      {stage === 'private-bid' && activePlayer && currentLot && (
        <NeoCard bg="bg-white" size="lg" className="space-y-5">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <span className="text-xs font-black text-neutral-500 uppercase">Current Bidder</span>
              <h3 className="text-xl font-black text-[#171717]">{activePlayer.name}</h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-neutral-500 uppercase">Remaining Purse</span>
              <div className="text-xl font-black text-[#83CBA2] text-right">
                ₹{activePlayer.remainingBudget} Cr
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#FFF8E9] rounded-xl border-2 border-[#171717] text-center">
            <div className="text-xs font-bold text-neutral-600">Bidding on:</div>
            <div className="text-lg font-black text-[#171717]">
              {currentLot.titleTelugu} ({currentLot.titleEnglish})
            </div>
            <div className="text-xs font-black text-[#FF704D] mt-0.5">
              Base Price: ₹{currentLot.basePriceCr} Cr
            </div>
          </div>

          {/* Bid Selector */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-neutral-600 block">
              Enter Your Secret Bid (in ₹ Crores)
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPlayerBidInput((prev) => Math.max(currentLot.basePriceCr, prev - 2))}
                className="w-12 h-12 bg-neutral-100 border-2 border-[#171717] rounded-xl font-black text-lg"
              >
                -2
              </button>
              <input
                type="number"
                value={playerBidInput}
                onChange={(e) => setPlayerBidInput(Number(e.target.value))}
                min={currentLot.basePriceCr}
                max={activePlayer.remainingBudget}
                className="flex-1 py-3 px-4 text-center font-black text-2xl border-2 border-[#171717] rounded-xl"
              />
              <button
                onClick={() => setPlayerBidInput((prev) => Math.min(activePlayer.remainingBudget, prev + 2))}
                className="w-12 h-12 bg-[#FFCB45] border-2 border-[#171717] rounded-xl font-black text-lg"
              >
                +2
              </button>
            </div>

            {playerBidInput > activePlayer.remainingBudget && (
              <p className="text-xs font-bold text-red-600">
                Bid exceeds your available budget of ₹{activePlayer.remainingBudget} Cr!
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => handlePrivateBidSubmit(0)}
              className="py-3.5 bg-neutral-200 border-2 border-[#171717] rounded-xl font-black text-xs hover:bg-neutral-300"
            >
              PASS (NO BID)
            </button>
            <button
              disabled={playerBidInput > activePlayer.remainingBudget || playerBidInput < currentLot.basePriceCr}
              onClick={() => handlePrivateBidSubmit(playerBidInput)}
              className="py-3.5 bg-[#FF704D] text-white border-2 border-[#171717] rounded-xl font-black text-sm shadow-[2px_2px_0_#171717] disabled:opacity-50"
            >
              CONFIRM BID (₹{playerBidInput} Cr)
            </button>
          </div>
        </NeoCard>
      )}

      {/* 5. LOT REVEAL */}
      {stage === 'lot-reveal' && currentLot && (
        <NeoCard bg="bg-[#FFF8E9]" size="lg" className="space-y-5 text-center">
          <NeoBadge variant="coral">AUCTION REVEAL</NeoBadge>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-[#171717]">
              {currentLot.titleTelugu} ({currentLot.titleEnglish})
            </h2>
            <div className="text-sm font-bold">
              {currentLot.status === 'sold' ? (
                <span className="text-green-700 font-black text-lg">
                  🎉 SOLD to {currentLot.highestBidderName} for ₹{currentLot.currentBid} Cr!
                </span>
              ) : (
                <span className="text-red-600 font-black text-lg">
                  ❌ UNSOLD (No bids met starting price)
                </span>
              )}
            </div>
          </div>

          {/* Reveal all submitted bids */}
          <div className="bg-white p-3 rounded-xl border-2 border-[#171717] text-left space-y-2">
            <div className="text-xs font-black uppercase text-neutral-500">All Submitted Bids:</div>
            {players.map((p) => {
              const b = currentLotBids[p.id] || 0;
              const isWinner = p.id === currentLot.highestBidderId;
              return (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-2 rounded-lg text-xs font-bold border ${
                    isWinner ? 'bg-[#83CBA2] border-green-800' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <span className="font-extrabold">{p.name}</span>
                  <span>{b > 0 ? `₹${b} Cr ${isWinner ? '👑 WINNER' : ''}` : 'Passed'}</span>
                </div>
              );
            })}
          </div>

          <NeoButton variant="primary" fullWidth size="lg" onClick={handleNextLot}>
            {currentLotIndex + 1 < lots.length ? 'NEXT MOVIE LOT ➡️' : 'VIEW FINAL LEADERBOARD 🏆'}
          </NeoButton>
        </NeoCard>
      )}

      {/* 6. FINAL RESULTS */}
      {stage === 'results' && (
        <NeoCard bg="bg-[#FFF8E9]" size="lg" className="space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <Trophy className="w-20 h-20 text-[#FFCB45]" />
            </div>
            <h2 className="text-3xl font-black text-[#171717]">AUCTION CONCLUDED!</h2>
            <p className="text-sm font-bold text-neutral-600">
              The grand Telugu Box Office Producer Championship standings:
            </p>
          </div>

          {/* Leaderboard sorted by totalScore */}
          <div className="space-y-3">
            {[...players]
              .sort((a, b) => b.totalScore - a.totalScore)
              .map((player, rank) => {
                const totalSpent = player.initialBudget - player.remainingBudget;
                return (
                  <div
                    key={player.id}
                    className={`p-4 rounded-2xl border-3 border-[#171717] shadow-[3px_3px_0_#171717] ${
                      rank === 0 ? 'bg-[#FFCB45]' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black w-6 h-6 rounded-full bg-[#171717] text-white flex items-center justify-center">
                          {rank + 1}
                        </span>
                        <span className="text-lg font-black">{player.name}</span>
                        {rank === 0 && <span className="text-xs bg-[#FF704D] text-white px-2 py-0.5 rounded font-black">CHAMPION 👑</span>}
                      </div>
                      <div className="text-xl font-black text-[#171717]">
                        {player.totalScore} Pts
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] font-bold text-neutral-700 bg-black/5 p-2 rounded-lg">
                      <div>Movies: {player.acquiredLots.length}</div>
                      <div>Spent: ₹{totalSpent} Cr</div>
                      <div>Purse Left: ₹{player.remainingBudget} Cr</div>
                    </div>

                    {player.acquiredLots.length > 0 && (
                      <div className="mt-2 text-xs font-semibold text-neutral-600">
                        Acquired: {player.acquiredLots.map((l) => l.titleEnglish).join(', ')}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <NeoButton variant="coral" fullWidth size="md" onClick={initAuction}>
              <RotateCcw className="w-4 h-4" />
              <span>NEW AUCTION</span>
            </NeoButton>
            <Link href="/games">
              <NeoButton variant="white" fullWidth size="md">
                BACK TO GAMES
              </NeoButton>
            </Link>
          </div>
        </NeoCard>
      )}
    </div>
  );
}
