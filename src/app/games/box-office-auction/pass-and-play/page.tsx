'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DieCutCard } from '@/components/DieCutCard';
import { AcampButton } from '@/components/AcampButton';
import { ResultConfetti } from '@/components/ResultConfetti';
import { getAuctionLotsPool } from '@/data/teluguCinemaDatabase';
import { TeluguMovie, AuctionPlayer, FanIdentity } from '@/types';
import { calculateAuctionScores, PlayerFinalScore } from '@/utils/auctionScoring';
import { soundManager, triggerHaptic } from '@/utils/audio';
import { Gavel, Eye, EyeOff, ShieldAlert, Trophy, Award, Check, X, ArrowRight, UserPlus, Trash2 } from 'lucide-react';
import clsx from 'clsx';

type AuctionPhase = 'setup' | 'lot-reveal' | 'pass-device' | 'private-turn' | 'reveal-bids' | 'final-results';

export default function PassAndPlayAuctionPage() {
  // Setup options
  const [playerNames, setPlayerNames] = useState<string[]>(['Producer Ravi', 'Producer Bunny', 'Producer Siva']);
  const [startingPurseCr, setStartingPurseCr] = useState<number>(100);
  const [maxLots, setMaxLots] = useState<number>(8);
  const [poolType, setPoolType] = useState<'balanced' | 'nostalgia' | 'tier1' | 'chaos'>('balanced');

  // Game execution state
  const [phase, setPhase] = useState<AuctionPhase>('setup');
  const [players, setPlayers] = useState<AuctionPlayer[]>([]);
  const [lots, setLots] = useState<TeluguMovie[]>([]);
  const [currentLotIndex, setCurrentLotIndex] = useState<number>(0);

  // Private turn tracking within a lot
  const [currentBiddingPlayerIndex, setCurrentBiddingPlayerIndex] = useState<number>(0);
  const [bidsMap, setBidsMap] = useState<Record<string, number>>({}); // playerId -> bidCr (0 if pass)
  const [currentBidInput, setCurrentBidInput] = useState<number>(0);

  // Results state
  const [finalScores, setFinalScores] = useState<PlayerFinalScore[]>([]);

  // Add new player to setup
  const handleAddPlayer = () => {
    if (playerNames.length >= 8) return;
    soundManager.playClick();
    setPlayerNames(prev => [...prev, `Producer ${prev.length + 1}`]);
  };

  const handleRemovePlayer = (idx: number) => {
    if (playerNames.length <= 2) return;
    soundManager.playClick();
    setPlayerNames(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpdatePlayerName = (idx: number, val: string) => {
    setPlayerNames(prev => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  // Start Auction Flow
  const handleStartAuction = () => {
    soundManager.playClick();
    const lotsPool = getAuctionLotsPool(poolType, maxLots);
    setLots(lotsPool);

    const initialPlayers: AuctionPlayer[] = playerNames.map((name, i) => {
      const fanIdentities: FanIdentity[] = ['bhAAi', 'Bob', 'Darling', 'Tarak', 'OG', 'Boss', 'Natural Star'];
      return {
        id: `p_${i + 1}`,
        name: name.trim() || `Producer ${i + 1}`,
        fanIdentity: fanIdentities[i % fanIdentities.length],
        purseCr: startingPurseCr,
        initialPurseCr: startingPurseCr,
        wonLots: [],
        totalSpentCr: 0,
      };
    });

    setPlayers(initialPlayers);
    setCurrentLotIndex(0);
    startNewLot(lotsPool[0]);
  };

  const startNewLot = (lot: TeluguMovie) => {
    setBidsMap({});
    setCurrentBiddingPlayerIndex(0);
    setCurrentBidInput(lot?.auctionLot?.basePriceCr || 10);
    setPhase('lot-reveal');
  };

  // Begin collecting private bids
  const handleBeginBidding = () => {
    soundManager.playClick();
    setPhase('pass-device');
  };

  // Device handed over to player
  const handlePlayerReady = () => {
    soundManager.playClick();
    const player = players[currentBiddingPlayerIndex];
    const lot = lots[currentLotIndex];
    const base = lot?.auctionLot?.basePriceCr || 10;
    // Preset current bid input to base or affordable amount
    setCurrentBidInput(Math.min(base, player.purseCr));
    setPhase('private-turn');
  };

  // Submit player's secret bid
  const handleSubmitPrivateBid = (isFold: boolean) => {
    const player = players[currentBiddingPlayerIndex];
    const bidAmount = isFold ? 0 : currentBidInput;

    soundManager.playBid();
    triggerHaptic(35);

    setBidsMap(prev => ({
      ...prev,
      [player.id]: bidAmount,
    }));

    if (currentBiddingPlayerIndex + 1 < players.length) {
      setCurrentBiddingPlayerIndex(prev => prev + 1);
      setPhase('pass-device');
    } else {
      // All players have placed bids -> Reveal!
      soundManager.playGavel();
      setPhase('reveal-bids');
    }
  };

  // Resolve current lot winner
  const currentLot = lots[currentLotIndex];

  const getLotWinner = () => {
    let highestBid = 0;
    let winningPlayerId: string | null = null;

    Object.entries(bidsMap).forEach(([playerId, bid]) => {
      if (bid > highestBid) {
        highestBid = bid;
        winningPlayerId = playerId;
      }
    });

    return {
      highestBid,
      winningPlayer: players.find(p => p.id === winningPlayerId) || null,
      isUnsold: highestBid === 0,
    };
  };

  // Confirm winner and advance lot
  const handleAdvanceLot = () => {
    const { highestBid, winningPlayer, isUnsold } = getLotWinner();

    // Deduct purse and assign movie to winner
    if (!isUnsold && winningPlayer) {
      setPlayers(prev =>
        prev.map(p => {
          if (p.id === winningPlayer.id) {
            return {
              ...p,
              purseCr: p.purseCr - highestBid,
              totalSpentCr: p.totalSpentCr + highestBid,
              wonLots: [...p.wonLots, currentLot],
            };
          }
          return p;
        })
      );
    }

    if (currentLotIndex + 1 < lots.length) {
      const nextIdx = currentLotIndex + 1;
      setCurrentLotIndex(nextIdx);
      startNewLot(lots[nextIdx]);
    } else {
      // Auction completed! Compute scores
      const updatedPlayers = players.map(p => {
        if (!isUnsold && winningPlayer && p.id === winningPlayer.id) {
          return {
            ...p,
            purseCr: p.purseCr - highestBid,
            totalSpentCr: p.totalSpentCr + highestBid,
            wonLots: [...p.wonLots, currentLot],
          };
        }
        return p;
      });

      const scores = calculateAuctionScores(updatedPlayers);
      setFinalScores(scores);
      soundManager.playFanfare();
      setPhase('final-results');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* =========================================================================
          SETUP SCREEN
          ========================================================================= */}
      {phase === 'setup' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-2">
            <Link href="/games" className="text-xs font-black uppercase bg-white border border-[#141313] px-2.5 py-1 rounded-lg">
              ← Back to Games
            </Link>
          </div>

          <div className="text-center space-y-1">
            <span className="bg-[#F6BE18] text-[#141313] font-black text-xs uppercase px-3 py-1 rounded-md border border-[#141313]">
              GAME 05 • PASS &amp; PLAY (OFFLINE)
            </span>
            <h1 className="font-block text-4xl sm:text-6xl uppercase text-[#141313] tracking-tight">
              BOX OFFICE AUCTION
            </h1>
            <p className="text-sm font-bold text-[#141313]/80">
              Gather friends around one shared phone or laptop. Bid secretly, reveal lots, and find out who builds the ultimate Telugu cinema empire!
            </p>
          </div>

          <DieCutCard className="p-6 space-y-6">
            
            {/* Player list setup */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-black text-xs uppercase tracking-wider text-[#141313]">
                  1. Players (2 to 8 Producers):
                </label>
                {playerNames.length < 8 && (
                  <button
                    onClick={handleAddPlayer}
                    className="text-xs font-black text-[#EC1276] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <UserPlus size={14} />
                    <span>+ Add Player</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {playerNames.map((name, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-6 font-mono text-xs font-bold text-gray-500">#{i + 1}</span>
                    <input
                      type="text"
                      value={name}
                      onChange={e => handleUpdatePlayerName(i, e.target.value)}
                      className="flex-1 bg-white border-2 border-[#141313] px-3 py-1.5 rounded-xl font-bold text-xs shadow-[2px_2px_0_#141313]"
                    />
                    {playerNames.length > 2 && (
                      <button
                        onClick={() => handleRemovePlayer(i)}
                        className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                        title="Remove player"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Starting Budget Presets */}
            <div>
              <label className="block font-black text-xs uppercase tracking-wider mb-2 text-[#141313]">
                2. Starting Virtual Budget per Player:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[50, 100, 150, 200].map(amt => (
                  <button
                    key={amt}
                    onClick={() => setStartingPurseCr(amt)}
                    className={clsx(
                      'border-2 border-[#141313] py-2 rounded-xl font-mono font-black text-sm text-center cursor-pointer',
                      startingPurseCr === amt
                        ? 'bg-[#F6BE18] text-[#141313] shadow-[3px_3px_0_#141313]'
                        : 'bg-white text-[#141313] hover:bg-[#F4F1EA]'
                    )}
                  >
                    ₹{amt} Cr
                  </button>
                ))}
              </div>
            </div>

            {/* Movie Pool & Lots count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-black text-xs uppercase tracking-wider mb-2 text-[#141313]">
                  3. Total Movie Lots:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 8, 12].map(l => (
                    <button
                      key={l}
                      onClick={() => setMaxLots(l)}
                      className={clsx(
                        'border-2 border-[#141313] py-2 rounded-xl font-mono font-black text-xs cursor-pointer',
                        maxLots === l ? 'bg-[#EC1276] text-white' : 'bg-white text-[#141313]'
                      )}
                    >
                      {l} Lots
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-black text-xs uppercase tracking-wider mb-2 text-[#141313]">
                  4. Movie Pool:
                </label>
                <select
                  value={poolType}
                  onChange={e => setPoolType(e.target.value as any)}
                  className="w-full bg-white border-2 border-[#141313] px-3 py-2 rounded-xl font-bold text-xs shadow-[2px_2px_0_#141313] cursor-pointer"
                >
                  <option value="balanced">Balanced Mix (Blockbusters + Cult)</option>
                  <option value="nostalgia">2000s Nostalgia Pool</option>
                  <option value="tier1">Tier-1 Star Titan Pool</option>
                  <option value="chaos">Chaos Pool (High Meme Traps!)</option>
                </select>
              </div>
            </div>

            <AcampButton onClick={handleStartAuction} variant="yellow" size="lg" fullWidth>
              🔨 Start Box Office Auction
            </AcampButton>

          </DieCutCard>
        </div>
      )}


      {/* =========================================================================
          STAGE 1: LOT REVEAL SCREEN (SHOWN TO ALL FRIENDS)
          ========================================================================= */}
      {phase === 'lot-reveal' && currentLot && (
        <div className="max-w-2xl mx-auto space-y-6">
          
          <div className="flex items-center justify-between">
            <span className="bg-[#141313] text-[#F6BE18] font-black text-xs uppercase px-3 py-1 rounded-lg">
              LOT #{currentLotIndex + 1} OF {lots.length}
            </span>
            <span className="font-mono text-xs font-bold text-[#141313]/70">
              POOL: {poolType.toUpperCase()}
            </span>
          </div>

          <DieCutCard className="p-8 text-center space-y-6 bg-white">
            
            <div className="inline-block bg-[#F6BE18] text-[#141313] font-black text-xs uppercase px-4 py-1 rounded-full border-2 border-[#141313] shadow-[2px_2px_0_#141313]">
              UP FOR BIDDING
            </div>

            <div className="space-y-1">
              <h2 className="font-telugu font-black text-4xl sm:text-5xl text-[#141313]">
                {currentLot.teluguTitle}
              </h2>
              <div className="font-block text-3xl sm:text-5xl uppercase text-[#EC1276]">
                {currentLot.englishTitle} ({currentLot.year})
              </div>
              <div className="text-sm font-bold text-[#141313]/80">
                Hero: <strong>{currentLot.hero}</strong> • Director: <strong>{currentLot.director}</strong>
              </div>
            </div>

            {/* Base Price and Tags */}
            <div className="bg-[#F4F1EA] border-2 border-[#141313] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[3px_3px_0_#141313]">
              <div className="text-left">
                <div className="text-[10px] font-black uppercase text-gray-500">BASE PRICE</div>
                <div className="font-block text-3xl text-[#141313]">
                  ₹{currentLot.auctionLot?.basePriceCr || 10} CR
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 justify-center sm:justify-end">
                {currentLot.auctionLot?.synergyTags.map(tag => (
                  <span key={tag} className="text-[10px] font-black bg-white px-2.5 py-1 rounded-md border border-[#141313]">
                    🏷️ {tag}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-xs font-bold text-[#141313]/75 italic">
              "{currentLot.auctionLot?.tagline || 'A historic classic in Telugu cinema history.'}"
            </p>

            <AcampButton onClick={handleBeginBidding} variant="magenta" size="lg" fullWidth>
              🔒 Begin Secret Bidding Round
            </AcampButton>

          </DieCutCard>
        </div>
      )}


      {/* =========================================================================
          STAGE 2: PASS DEVICE SCREEN (COMPLETE PRIVACY GUARANTEE)
          ========================================================================= */}
      {phase === 'pass-device' && (
        <div className="max-w-xl mx-auto space-y-6 text-center">
          <DieCutCard className="p-8 space-y-6 bg-gradient-to-br from-white to-[#F4F1EA]">
            
            <div className="w-20 h-20 rounded-full bg-[#EC1276] text-white border-4 border-[#141313] flex items-center justify-center font-block text-3xl mx-auto shadow-[4px_4px_0_#141313]">
              📱
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black uppercase text-[#EC1276]">
                SECRET HANDOFF SCREEN
              </span>
              <h2 className="font-block text-4xl sm:text-5xl uppercase text-[#141313]">
                PASS PHONE TO:
              </h2>
              <div className="font-block text-3xl text-[#141313] bg-[#F6BE18] px-4 py-2 rounded-xl border-2 border-[#141313] inline-block shadow-[3px_3px_0_#141313]">
                {players[currentBiddingPlayerIndex]?.name}
              </div>
            </div>

            <p className="text-xs font-semibold text-[#141313]/70 max-w-sm mx-auto">
              Previous bids are completely hidden. Make sure nobody else is looking over your shoulder!
            </p>

            <AcampButton onClick={handlePlayerReady} variant="black" size="lg" fullWidth>
              👁️ I am {players[currentBiddingPlayerIndex]?.name} (Ready to Bid)
            </AcampButton>

          </DieCutCard>
        </div>
      )}


      {/* =========================================================================
          STAGE 3: PRIVATE TURN SCREEN (BID OR FOLD)
          ========================================================================= */}
      {phase === 'private-turn' && (
        <div className="max-w-xl mx-auto space-y-6 text-center">
          {(() => {
            const player = players[currentBiddingPlayerIndex];
            const basePrice = currentLot?.auctionLot?.basePriceCr || 10;
            const canAfford = player.purseCr >= basePrice;

            return (
              <DieCutCard className="p-8 space-y-6 bg-white">
                
                <div className="flex items-center justify-between border-b-2 border-[#141313]/20 pb-2">
                  <div className="text-left">
                    <span className="text-[10px] font-black uppercase text-gray-500">BIDDER</span>
                    <div className="font-block text-xl text-[#141313]">{player.name}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase text-gray-500">YOUR PURSE</span>
                    <div className="font-mono text-xl font-black text-[#00C853]">₹{player.purseCr} CR</div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-black uppercase text-[#EC1276]">BIDDING ON LOT</div>
                  <div className="font-block text-2xl uppercase text-[#141313]">
                    {currentLot.englishTitle} ({currentLot.year})
                  </div>
                  <div className="text-xs font-bold text-gray-500">Base Price: ₹{basePrice} Cr</div>
                </div>

                {canAfford ? (
                  <div className="space-y-4">
                    <div className="bg-[#FFF9E6] border-2 border-[#141313] rounded-2xl p-4 space-y-2">
                      <div className="text-xs font-black uppercase">YOUR SECRET BID:</div>
                      <div className="font-mono text-4xl font-black text-[#EC1276]">
                        ₹{currentBidInput} CR
                      </div>

                      {/* Quick bid adjuster buttons */}
                      <div className="flex justify-center gap-2 pt-1">
                        {[1, 2, 5, 10].map(add => {
                          const nextVal = currentBidInput + add;
                          const isValid = nextVal <= player.purseCr;
                          return (
                            <button
                              key={add}
                              disabled={!isValid}
                              onClick={() => {
                                soundManager.playClick();
                                setCurrentBidInput(nextVal);
                              }}
                              className={clsx(
                                'border-2 border-[#141313] px-2.5 py-1 rounded-lg font-mono font-bold text-xs',
                                isValid ? 'bg-white hover:bg-gray-100 cursor-pointer' : 'opacity-40 cursor-not-allowed'
                              )}
                            >
                              +{add} Cr
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <AcampButton
                        onClick={() => handleSubmitPrivateBid(true)}
                        variant="white"
                        size="md"
                        fullWidth
                      >
                        ✕ Pass / Fold (₹0)
                      </AcampButton>
                      <AcampButton
                        onClick={() => handleSubmitPrivateBid(false)}
                        variant="green"
                        size="md"
                        fullWidth
                      >
                        ✓ Submit ₹{currentBidInput} Cr Bid
                      </AcampButton>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 text-xs font-bold text-red-600">
                      ⚠️ You cannot afford the base price of ₹{basePrice} Cr (Remaining purse: ₹{player.purseCr} Cr).
                    </div>
                    <AcampButton
                      onClick={() => handleSubmitPrivateBid(true)}
                      variant="magenta"
                      size="md"
                      fullWidth
                    >
                      Fold (Pass Lot)
                    </AcampButton>
                  </div>
                )}

              </DieCutCard>
            );
          })()}
        </div>
      )}


      {/* =========================================================================
          STAGE 4: REVEAL ALL BIDS SCREEN
          ========================================================================= */}
      {phase === 'reveal-bids' && (
        <div className="max-w-2xl mx-auto space-y-6 text-center">
          {(() => {
            const { highestBid, winningPlayer, isUnsold } = getLotWinner();

            return (
              <DieCutCard className="p-8 space-y-6 bg-white">
                
                <div className="text-center space-y-1">
                  <span className="bg-[#141313] text-[#F6BE18] font-black text-xs uppercase px-3 py-1 rounded-full">
                    GAVEL STRIKE • REVEAL ALL BIDS
                  </span>
                  <h3 className="font-block text-4xl uppercase text-[#141313]">
                    {isUnsold ? 'LOT UNSOLD!' : `SOLD TO ${winningPlayer?.name}!`}
                  </h3>
                </div>

                {/* Movie badge */}
                <div className="bg-[#F4F1EA] border-2 border-[#141313] rounded-xl p-3">
                  <div className="font-telugu font-black text-2xl text-[#141313]">
                    {currentLot.teluguTitle}
                  </div>
                  <div className="font-block text-xl text-[#EC1276]">
                    {currentLot.englishTitle} ({currentLot.year})
                  </div>
                  {!isUnsold && (
                    <div className="font-mono text-lg font-black text-[#00C853] mt-1">
                      Winning Bid: ₹{highestBid} Cr
                    </div>
                  )}
                </div>

                {/* All bids breakdown table */}
                <div className="space-y-1.5 text-left">
                  <div className="text-xs font-black uppercase text-gray-500 px-1">ALL SUBMITTED BIDS:</div>
                  {players.map(p => {
                    const bid = bidsMap[p.id] || 0;
                    const isWinner = winningPlayer && p.id === winningPlayer.id;

                    return (
                      <div
                        key={p.id}
                        className={clsx(
                          'border-2 border-[#141313] rounded-xl p-3 flex items-center justify-between',
                          isWinner ? 'bg-[#D7FADC] font-black' : 'bg-white'
                        )}
                      >
                        <div className="font-bold text-xs">
                          {p.name} {isWinner && '👑 (WINNER)'}
                        </div>
                        <div className="font-mono font-black text-sm">
                          {bid > 0 ? `₹${bid} Cr` : 'Folded (₹0)'}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <AcampButton onClick={handleAdvanceLot} variant="yellow" size="lg" fullWidth>
                  {currentLotIndex + 1 < lots.length ? 'Advance to Next Lot →' : 'View Tournament Results 🏆'}
                </AcampButton>

              </DieCutCard>
            );
          })()}
        </div>
      )}


      {/* =========================================================================
          STAGE 5: FINAL TOURNAMENT RESULTS & SCORING LEADERBOARD
          ========================================================================= */}
      {phase === 'final-results' && (
        <div className="max-w-3xl mx-auto space-y-6 text-center">
          <ResultConfetti />

          <div className="space-y-1">
            <span className="bg-[#F6BE18] text-[#141313] font-black text-xs uppercase px-4 py-1.5 rounded-full border-2 border-[#141313]">
              AUCTION COMPLETE!
            </span>
            <h2 className="font-block text-5xl sm:text-7xl uppercase text-[#141313]">
              STAR PRODUCER OF THE YEAR
            </h2>
            <div className="font-block text-3xl sm:text-4xl text-[#EC1276]">
              👑 {finalScores[0]?.player.name}
            </div>
          </div>

          <DieCutCard className="p-6 space-y-6 text-left">
            
            <div className="font-black text-sm uppercase text-[#141313] border-b-2 border-[#141313]/20 pb-2">
              PRODUCER RANKINGS &amp; COLLECTION SCORES
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
                        <div className="font-block text-xl uppercase text-[#141313]">{fs.player.name}</div>
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

                  {/* Achievements and tags */}
                  {fs.achievements.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {fs.achievements.map((ach, i) => (
                        <span key={i} className="text-[10px] font-black bg-[#EAE6DF] border border-[#141313] px-2 py-0.5 rounded">
                          {ach}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Won lots pills */}
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
              <AcampButton onClick={handleStartAuction} variant="yellow" size="lg" fullWidth>
                🔄 Play New Auction
              </AcampButton>
              <Link href="/games" className="w-full">
                <AcampButton variant="white" size="md" fullWidth>
                  ← Back to Games
                </AcampButton>
              </Link>
            </div>

          </DieCutCard>
        </div>
      )}

    </div>
  );
}

