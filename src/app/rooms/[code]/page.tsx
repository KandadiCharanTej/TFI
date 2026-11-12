'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { DieCutCard } from '@/components/DieCutCard';
import { AcampButton } from '@/components/AcampButton';
import { ResultConfetti } from '@/components/ResultConfetti';
import { useUser } from '@/utils/userContext';
import { AuctionRoomState, AuctionPlayer } from '@/types';
import { calculateAuctionScores, PlayerFinalScore } from '@/utils/auctionScoring';
import { soundManager, triggerHaptic } from '@/utils/audio';
import { Copy, Users, Clock, Gavel, Check, X, ShieldAlert, Trophy, Award, Radio } from 'lucide-react';
import clsx from 'clsx';

export default function OnlineAuctionRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = ((params?.code as string) || '').toUpperCase();
  const { profile } = useUser();

  const [room, setRoom] = useState<AuctionRoomState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [bidError, setBidError] = useState<string | null>(null);

  // Computed results state when finished
  const [finalScores, setFinalScores] = useState<PlayerFinalScore[]>([]);

  // Fetch room state
  const fetchRoomState = useCallback(async () => {
    if (!roomCode) return;
    try {
      const res = await fetch(`/api/auction/room?code=${roomCode}`);
      if (!res.ok) {
        if (res.status === 404) setError('Room not found or expired.');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setRoom(data.room);

      // If room finished, compute final scores
      if (data.room.status === 'finished' && finalScores.length === 0) {
        const scores = calculateAuctionScores(data.room.players);
        setFinalScores(scores);
      }

      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, [roomCode, finalScores.length]);

  // Polling loop for real-time synchronization (every 1 second)
  useEffect(() => {
    fetchRoomState();
    const interval = setInterval(fetchRoomState, 1000);
    return () => clearInterval(interval);
  }, [fetchRoomState]);

  // Host: Start Auction
  const handleHostStart = async () => {
    soundManager.playFanfare();
    try {
      const res = await fetch('/api/auction/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          roomCode,
          playerId: profile.id,
        }),
      });
      const data = await res.json();
      if (data.room) setRoom(data.room);
    } catch {}
  };

  // Place Bid
  const handlePlaceBid = async (incrementCr: number) => {
    soundManager.playBid();
    triggerHaptic(40);
    setBidError(null);

    try {
      const res = await fetch('/api/auction/bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode,
          playerId: profile.id,
          incrementCr,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBidError(data.error || 'Bid rejected');
        soundManager.playPass();
      } else if (data.room) {
        setRoom(data.room);
      }
    } catch {
      setBidError('Failed to place bid');
    }
  };

  // Player Fold / Pass
  const handleFold = async () => {
    soundManager.playPass();
    triggerHaptic(20);
    try {
      const res = await fetch('/api/auction/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'fold',
          roomCode,
          playerId: profile.id,
        }),
      });
      const data = await res.json();
      if (data.room) setRoom(data.room);
    } catch {}
  };

  // Host: Advance to Next Lot
  const handleHostAdvance = async () => {
    soundManager.playClick();
    try {
      const res = await fetch('/api/auction/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'advance',
          roomCode,
          playerId: profile.id,
        }),
      });
      const data = await res.json();
      if (data.room) setRoom(data.room);
    } catch {}
  };

  const handleCopyLink = () => {
    soundManager.playClick();
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 rounded-full border-4 border-[#141313] border-t-[#F6BE18] animate-spin"></div>
        <p className="font-mono text-sm font-bold text-[#141313]">Connecting to Room #{roomCode}...</p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center space-y-4">
        <DieCutCard className="p-8 space-y-4">
          <div className="text-4xl">⚠️</div>
          <h2 className="font-block text-3xl uppercase text-[#141313]">ROOM NOT FOUND</h2>
          <p className="text-xs font-semibold text-gray-600">
            {error || 'The room does not exist or has expired.'}
          </p>
          <Link href="/rooms">
            <AcampButton variant="yellow" size="md" fullWidth>
              ← Back to Rooms Hub
            </AcampButton>
          </Link>
        </DieCutCard>
      </div>
    );
  }

  const isHost = room.hostId === profile.id;
  const currentLot = room.lots[room.currentLotIndex];
  const me = room.players.find(p => p.id === profile.id);
  const myPurse = me?.purseCr ?? room.startingPurseCr;
  const isMeFolded = me?.isFolded ?? false;
  const isMeHighestBidder = room.highestBidderId === profile.id;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border-2 border-[#141313] rounded-2xl px-4 py-2.5 shadow-[3px_3px_0_#141313]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#00C853] animate-pulse"></span>
          <span className="font-mono font-black text-sm uppercase">ROOM: #{room.roomCode}</span>
          <button
            onClick={handleCopyLink}
            className="text-[10px] font-black uppercase bg-[#F4F1EA] border border-[#141313] px-2 py-0.5 rounded hover:bg-gray-200 cursor-pointer flex items-center gap-1"
          >
            <Copy size={12} />
            <span>{copied ? 'COPIED!' : 'COPY CODE'}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="font-mono text-xs font-bold bg-[#FFF9E6] border border-[#141313] px-2.5 py-1 rounded-lg">
            YOUR PURSE: <strong className="text-[#00C853]">₹{myPurse} CR</strong>
          </div>
          <span className="text-xs font-bold bg-[#EAE6DF] px-2.5 py-1 rounded-lg border border-[#141313]">
            {room.players.length} Players
          </span>
        </div>
      </div>


      {/* =========================================================================
          STAGE 1: LOBBY (WAITING FOR PLAYERS & HOST START)
          ========================================================================= */}
      {room.status === 'lobby' && (
        <div className="max-w-2xl mx-auto space-y-6 text-center">
          
          <div className="space-y-1">
            <span className="bg-[#00E5FF] text-[#141313] font-black text-xs uppercase px-3 py-1 rounded-md border border-[#141313]">
              LOBBY GATHERING
            </span>
            <h1 className="font-block text-5xl uppercase text-[#141313]">
              ROOM #{room.roomCode}
            </h1>
            <p className="text-xs font-bold text-[#141313]/70">
              Share this code with your friends. Everyone starts with ₹{room.startingPurseCr} Cr virtual purse!
            </p>
          </div>

          <DieCutCard className="p-6 space-y-6 text-left">
            
            <div>
              <div className="font-black text-xs uppercase text-[#141313] mb-2 flex items-center justify-between">
                <span>CONNECTED PRODUCERS ({room.players.length}/10):</span>
                <span className="text-[10px] font-mono text-gray-500">Live Presence</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {room.players.map((p, idx) => (
                  <div
                    key={p.id}
                    className="bg-[#F4F1EA] border-2 border-[#141313] rounded-xl p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎬</span>
                      <div>
                        <div className="font-bold text-xs text-[#141313]">
                          {p.name} {p.id === room.hostId && '👑 (Host)'} {p.id === profile.id && '(You)'}
                        </div>
                        <div className="text-[10px] font-mono text-gray-500">Purse: ₹{p.purseCr} Cr</div>
                      </div>
                    </div>
                    <span className="text-xs font-black bg-white px-2 py-0.5 rounded border border-[#141313]">
                      {p.fanIdentity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tournament Settings Overview */}
            <div className="bg-[#FFF9E6] border-2 border-[#141313] rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
              <div>Lots: <strong>{room.lots.length} Movies</strong></div>
              <div>Purse: <strong>₹{room.startingPurseCr} Cr per player</strong></div>
              <div>Pool: <strong className="uppercase">{room.poolType}</strong></div>
            </div>

            {/* Host Start Action */}
            {isHost ? (
              <AcampButton onClick={handleHostStart} variant="yellow" size="lg" fullWidth>
                🔨 Start Box Office Auction
              </AcampButton>
            ) : (
              <div className="bg-white border-2 border-dashed border-[#141313] rounded-xl p-4 text-center font-bold text-xs text-gray-600 animate-pulse">
                ⏳ Waiting for the Host ({room.players[0]?.name}) to launch the auction...
              </div>
            )}

          </DieCutCard>
        </div>
      )}


      {/* =========================================================================
          STAGE 2: ACTIVE BIDDING PHASE (AUTHORITATIVE TIMER & REALTIME BIDS)
          ========================================================================= */}
      {room.status === 'bidding' && currentLot && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Lot Display (Col 8) */}
          <div className="lg:col-span-8 space-y-4">
            <DieCutCard className="p-6 space-y-4 bg-white">
              
              {/* Header Lot Index and Timer */}
              <div className="flex items-center justify-between">
                <span className="bg-[#141313] text-[#F6BE18] font-black text-xs uppercase px-3 py-1 rounded-lg">
                  LOT #{room.currentLotIndex + 1} OF {room.lots.length}
                </span>

                {/* Authoritative Timer with Anti-Snipe highlight */}
                <div
                  className={clsx(
                    'font-mono font-black text-xl px-4 py-1.5 rounded-xl border-2 border-[#141313] flex items-center gap-1.5',
                    room.timerSeconds <= 5
                      ? 'bg-[#EC1276] text-white animate-pulse'
                      : 'bg-[#F6BE18] text-[#141313]'
                  )}
                >
                  <Clock size={18} />
                  <span>{room.timerSeconds}s</span>
                </div>
              </div>

              {/* Movie Details */}
              <div className="text-center space-y-1 pt-2">
                <h2 className="font-telugu font-black text-4xl sm:text-5xl text-[#141313]">
                  {currentLot.teluguTitle}
                </h2>
                <div className="font-block text-3xl sm:text-4xl uppercase text-[#EC1276]">
                  {currentLot.englishTitle} ({currentLot.year})
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#141313]/80">
                  Lead Hero: <strong>{currentLot.hero}</strong> • Director: <strong>{currentLot.director}</strong>
                </div>
              </div>

              {/* Current High Bid Lockup */}
              <div className="bg-[#F4F1EA] border-2 border-[#141313] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[3px_3px_0_#141313]">
                <div className="text-left">
                  <div className="text-[10px] font-black uppercase text-gray-500">CURRENT HIGHEST BID</div>
                  <div className="font-mono text-4xl font-black text-[#EC1276]">
                    ₹{room.currentBidCr} CR
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-black uppercase text-gray-500">HIGHEST BIDDER</div>
                  <div className="font-block text-xl text-[#141313]">
                    {room.highestBidderName ? `👑 ${room.highestBidderName}` : 'No Bids Yet (Base Price)'}
                  </div>
                </div>
              </div>

              {/* Synergy Tags */}
              <div className="flex flex-wrap gap-1.5 justify-center">
                {currentLot.auctionLot?.synergyTags.map(tag => (
                  <span key={tag} className="text-[10px] font-black bg-[#EAE6DF] border border-[#141313] px-2.5 py-0.5 rounded">
                    🏷️ {tag}
                  </span>
                ))}
              </div>

              {/* Bid error notification */}
              {bidError && (
                <div className="bg-red-100 text-red-700 text-xs font-bold p-2.5 rounded-xl border border-red-500 text-center">
                  {bidError}
                </div>
              )}

              {/* BID CONTROLS */}
              {!isMeFolded ? (
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 5].map(inc => {
                      const nextBid = room.currentBidCr + inc;
                      const canAfford = nextBid <= myPurse;

                      return (
                        <button
                          key={inc}
                          disabled={!canAfford}
                          onClick={() => handlePlaceBid(inc)}
                          className={clsx(
                            'border-[2.5px] border-[#141313] py-3 rounded-xl font-black text-sm uppercase cursor-pointer',
                            'shadow-[3px_3px_0_#141313] transition-all active:translate-x-[2px] active:translate-y-[2px]',
                            canAfford ? 'bg-[#00C853] text-white hover:bg-[#00b34a]' : 'opacity-40 cursor-not-allowed bg-gray-200 text-gray-500'
                          )}
                        >
                          +₹{inc} Cr Bid
                        </button>
                      );
                    })}
                  </div>

                  <AcampButton onClick={handleFold} variant="magenta" size="md" fullWidth>
                    ✕ Fold / Pass this Lot
                  </AcampButton>
                </div>
              ) : (
                <div className="bg-[#F4F1EA] border-2 border-dashed border-[#141313] rounded-xl p-4 text-center font-bold text-xs text-gray-500">
                  You have folded for this movie lot. Waiting for lot timer to expire...
                </div>
              )}

            </DieCutCard>
          </div>

          {/* Right Sidebar: All Players Purse Tracker (Col 4) */}
          <div className="lg:col-span-4 space-y-4">
            <DieCutCard className="p-4 space-y-3 bg-[#F4F1EA]">
              <div className="font-black text-xs uppercase text-[#141313] border-b border-[#141313]/20 pb-1.5 flex items-center justify-between">
                <span>PRODUCER PURSES:</span>
                <span className="text-[10px] font-mono">₹ CR</span>
              </div>

              <div className="space-y-1.5 max-h-96 overflow-y-auto">
                {room.players.map(p => {
                  const isLeader = room.highestBidderId === p.id;
                  const isFolded = p.isFolded;

                  return (
                    <div
                      key={p.id}
                      className={clsx(
                        'border-2 border-[#141313] rounded-xl p-2.5 flex items-center justify-between',
                        isLeader ? 'bg-[#D7FADC]' : isFolded ? 'bg-gray-100 opacity-60' : 'bg-white'
                      )}
                    >
                      <div>
                        <div className="font-bold text-xs text-[#141313]">
                          {p.name} {isLeader && '👑'} {isFolded && '(Folded)'}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {p.wonLots.length} movies won
                        </div>
                      </div>
                      <div className="font-mono font-black text-sm text-[#141313]">
                        ₹{p.purseCr} Cr
                      </div>
                    </div>
                  );
                })}
              </div>
            </DieCutCard>
          </div>

        </div>
      )}


      {/* =========================================================================
          STAGE 3: LOT SOLD TRANSITION SCREEN
          ========================================================================= */}
      {room.status === 'lot-sold' && currentLot && (
        <div className="max-w-xl mx-auto space-y-6 text-center">
          <DieCutCard className="p-8 space-y-6 bg-white">
            
            <div className="inline-block bg-[#141313] text-white font-black text-xs uppercase px-4 py-1.5 rounded-full">
              HAMMER DOWN • LOT #{room.currentLotIndex + 1}
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-block text-4xl sm:text-5xl uppercase text-[#141313]">
                {room.highestBidderId ? 'SOLD!' : 'UNSOLD!'}
              </h3>
              <p className="font-block text-2xl text-[#EC1276]">
                {room.highestBidderName ? `Winner: ${room.highestBidderName}` : 'No valid bids submitted'}
              </p>
            </div>

            <div className="bg-[#F4F1EA] border-2 border-[#141313] rounded-2xl p-4">
              <div className="font-telugu font-black text-2xl text-[#141313]">
                {currentLot.teluguTitle}
              </div>
              <div className="font-block text-xl text-[#141313]">
                {currentLot.englishTitle} ({currentLot.year})
              </div>
              {room.highestBidderId && (
                <div className="font-mono text-xl font-black text-[#00C853] mt-1">
                  Purchase Price: ₹{room.currentBidCr} Cr
                </div>
              )}
            </div>

            {isHost ? (
              <AcampButton onClick={handleHostAdvance} variant="yellow" size="lg" fullWidth>
                Advance to Next Movie Lot →
              </AcampButton>
            ) : (
              <div className="text-xs font-bold text-gray-500 italic animate-pulse">
                Host ({room.players[0]?.name}) will advance to the next lot shortly...
              </div>
            )}

          </DieCutCard>
        </div>
      )}


      {/* =========================================================================
          STAGE 4: FINAL AUCTION RESULTS & SCORING LEADERBOARD
          ========================================================================= */}
      {room.status === 'finished' && (
        <div className="max-w-3xl mx-auto space-y-6 text-center">
          <ResultConfetti />

          <div className="space-y-1">
            <span className="bg-[#F6BE18] text-[#141313] font-black text-xs uppercase px-4 py-1.5 rounded-full border-2 border-[#141313]">
              TOURNAMENT COMPLETE!
            </span>
            <h2 className="font-block text-5xl sm:text-7xl uppercase text-[#141313]">
              STAR PRODUCER OF THE YEAR
            </h2>
            <div className="font-block text-3xl sm:text-4xl text-[#EC1276]">
              👑 {finalScores[0]?.player.name}
            </div>
          </div>

          <DieCutCard className="p-6 space-y-6 text-left bg-white">
            
            <div className="font-black text-sm uppercase text-[#141313] border-b-2 border-[#141313]/20 pb-2">
              PRODUCER RANKINGS &amp; VALUATION ENGINE
            </div>

            <div className="space-y-3">
              {finalScores.map((fs, idx) => (
                <div
                  key={fs.player.id}
                  className={clsx(
                    'border-2 border-[#141313] rounded-2xl p-4 shadow-[3px_3px_0_#141313] space-y-2',
                    idx === 0 ? 'bg-[#FFF9E6]' : 'bg-white'
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-[#141313] text-[#F6BE18] flex items-center justify-center font-block text-lg">
                        #{fs.rank}
                      </span>
                      <div>
                        <div className="font-block text-xl uppercase text-[#141313]">
                          {fs.player.name} {fs.player.id === profile.id && '(You)'}
                        </div>
                        <div className="text-[10px] font-mono text-gray-500">
                          Spent ₹{fs.totalSpentCr} Cr • ₹{fs.remainingPurseCr} Cr left
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] font-black uppercase text-gray-500">COLLECTION SCORE</div>
                      <div className="font-mono text-3xl font-black text-[#EC1276]">
                        {fs.collectionScore} PTS
                      </div>
                    </div>
                  </div>

                  {/* Achievements */}
                  {fs.achievements.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {fs.achievements.map((ach, i) => (
                        <span key={i} className="text-[10px] font-black bg-[#EAE6DF] border border-[#141313] px-2 py-0.5 rounded">
                          {ach}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Won movies */}
                  <div className="border-t border-[#141313]/15 pt-2">
                    <div className="text-[10px] font-bold text-gray-500 mb-1">
                      MOVIES ACQUIRED ({fs.player.wonLots.length}):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {fs.player.wonLots.map(m => (
                        <span key={m.id} className="text-xs font-bold bg-[#F4F1EA] border border-[#141313]/40 px-2 py-0.5 rounded">
                          🎬 {m.englishTitle} ({m.year})
                        </span>
                      ))}
                      {fs.player.wonLots.length === 0 && (
                        <span className="text-xs text-gray-400 italic">No movies acquired</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/rooms" className="flex-1">
                <AcampButton variant="yellow" size="lg" fullWidth>
                  🔨 Host Another Room
                </AcampButton>
              </Link>
              <Link href="/games" className="flex-1">
                <AcampButton variant="white" size="lg" fullWidth>
                  ← Back to Games Menu
                </AcampButton>
              </Link>
            </div>

          </DieCutCard>
        </div>
      )}

    </div>
  );
}
