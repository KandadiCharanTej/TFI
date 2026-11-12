'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DUMB_CHARADES_DATA } from '@/data/content';
import { DumbCharadesItem } from '@/types';
import { NeoButton, NeoCard, NeoBadge } from '@/components/ui/NeoPrimitives';
import { CharadesMaskIcon } from '@/components/ui/Illustrations';
import { Timer, Eye, Check, SkipForward, ArrowLeft, Trophy, Users, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DumbCharadesPage() {
  const [gameState, setGameState] = useState<'setup' | 'handoff' | 'acting' | 'results'>('setup');
  const [team1Name, setTeam1Name] = useState<string>('Team Chiru');
  const [team2Name, setTeam2Name] = useState<string>('Team Balayya');
  const [team1Score, setTeam1Score] = useState<number>(0);
  const [team2Score, setTeam2Score] = useState<number>(0);
  const [currentTurnTeam, setCurrentTurnTeam] = useState<1 | 2>(1);
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [totalRounds, setTotalRounds] = useState<number>(6); // 3 turns each

  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [timeLeft, setTimeLeft] = useState<number>(60);

  const [deck, setDeck] = useState<DumbCharadesItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const startCharades = () => {
    const shuffled = [...DUMB_CHARADES_DATA].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setTeam1Score(0);
    setTeam2Score(0);
    setCurrentTurnTeam(1);
    setRoundNumber(1);
    setGameState('handoff');
  };

  useEffect(() => {
    if (gameState !== 'acting') return;
    if (timeLeft <= 0) {
      handleTurnFinish(false);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleTurnFinish = (isGuessed: boolean) => {
    if (isGuessed) {
      if (currentTurnTeam === 1) {
        setTeam1Score((s) => s + 1);
      } else {
        setTeam2Score((s) => s + 1);
      }
    }

    if (roundNumber >= totalRounds) {
      setGameState('results');
      confetti({ particleCount: 100, spread: 80 });
      return;
    }

    // Switch turns
    setCurrentTurnTeam((t) => (t === 1 ? 2 : 1));
    setRoundNumber((r) => r + 1);
    setCurrentIndex((i) => (i + 1) % deck.length);
    setGameState('handoff');
  };

  const currentItem = deck[currentIndex] || DUMB_CHARADES_DATA[0];
  const activeTeamName = currentTurnTeam === 1 ? team1Name : team2Name;

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {gameState === 'setup' && (
        <NeoCard bg="bg-[#FF704D]" size="lg" className="space-y-6 text-white">
          <div className="flex items-center justify-between">
            <Link href="/games" className="inline-flex items-center gap-1 font-black text-xs hover:underline text-white">
              <ArrowLeft className="w-4 h-4" /> Back to Games
            </Link>
            <NeoBadge variant="yellow">TEAM BATTLE</NeoBadge>
          </div>

          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <CharadesMaskIcon className="w-20 h-20" />
            </div>
            <h1 className="text-3xl font-black text-white">DUMB CHARADES</h1>
            <p className="text-sm font-extrabold text-white/90">
              Act out legendary Telugu movie titles with gestures only. No speaking!
            </p>
          </div>

          {/* Team configuration */}
          <div className="space-y-3 bg-white text-[#171717] p-4 rounded-2xl border-3 border-[#171717]">
            <div>
              <label className="text-xs font-black uppercase text-neutral-500">Team 1 Name</label>
              <input
                type="text"
                value={team1Name}
                onChange={(e) => setTeam1Name(e.target.value)}
                className="w-full px-3 py-2 border-2 border-[#171717] rounded-xl font-bold text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase text-neutral-500">Team 2 Name</label>
              <input
                type="text"
                value={team2Name}
                onChange={(e) => setTeam2Name(e.target.value)}
                className="w-full px-3 py-2 border-2 border-[#171717] rounded-xl font-bold text-sm"
              />
            </div>
          </div>

          {/* Rounds & Timer */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white text-[#171717] p-3 rounded-xl border-2 border-[#171717]">
              <label className="text-xs font-black uppercase block mb-1">Rounds per Team</label>
              <select
                value={totalRounds}
                onChange={(e) => setTotalRounds(Number(e.target.value))}
                className="w-full bg-neutral-100 p-2 font-bold text-xs rounded-lg border border-[#171717]"
              >
                <option value={4}>2 each (4 turns)</option>
                <option value={6}>3 each (6 turns)</option>
                <option value={10}>5 each (10 turns)</option>
              </select>
            </div>
            <div className="bg-white text-[#171717] p-3 rounded-xl border-2 border-[#171717]">
              <label className="text-xs font-black uppercase block mb-1">Time per Turn</label>
              <select
                value={timerSeconds}
                onChange={(e) => setTimerSeconds(Number(e.target.value))}
                className="w-full bg-neutral-100 p-2 font-bold text-xs rounded-lg border border-[#171717]"
              >
                <option value={45}>45 Seconds</option>
                <option value={60}>60 Seconds</option>
                <option value={90}>90 Seconds</option>
              </select>
            </div>
          </div>

          <NeoButton variant="primary" fullWidth size="lg" onClick={startCharades}>
            START CHARADES CLASH 🔥
          </NeoButton>
        </NeoCard>
      )}

      {/* Secret Handoff Privacy Screen */}
      {gameState === 'handoff' && (
        <NeoCard bg="bg-[#FFCB45]" size="lg" className="text-center py-10 space-y-6">
          <NeoBadge variant="coral">CONFIDENTIAL HANDOFF</NeoBadge>
          <div className="space-y-2">
            <div className="text-xs font-black uppercase tracking-wider text-neutral-700">
              Round {roundNumber} of {totalRounds}
            </div>
            <h2 className="text-3xl font-black text-[#171717]">
              Pass Phone to: <br />
              <span className="text-4xl text-[#FF704D]">{activeTeamName} Actor</span>
            </h2>
            <p className="text-xs font-extrabold text-neutral-700 max-w-sm mx-auto">
              Teammates look away! Only the person acting should look at the secret movie on the next screen.
            </p>
          </div>

          <div className="pt-4">
            <NeoButton
              variant="white"
              size="lg"
              fullWidth
              onClick={() => {
                setTimeLeft(timerSeconds);
                setGameState('acting');
              }}
            >
              <Eye className="w-5 h-5" />
              <span>I AM THE ACTOR (SHOW SECRET)</span>
            </NeoButton>
          </div>
        </NeoCard>
      )}

      {/* Live Acting Screen */}
      {gameState === 'acting' && currentItem && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-3 rounded-xl border-3 border-[#171717] shadow-[3px_3px_0_#171717]">
            <div>
              <div className="text-xs font-black bg-[#FF704D] text-white px-2 py-0.5 rounded inline-block">
                Turn: {activeTeamName}
              </div>
              <div className="text-[11px] font-bold text-neutral-500 mt-0.5">
                Score: {team1Name} ({team1Score}) vs {team2Name} ({team2Score})
              </div>
            </div>
            <div className="flex items-center gap-1 font-black text-2xl text-[#171717]">
              <Timer className="w-6 h-6 text-[#FF704D]" />
              <span className={timeLeft <= 15 ? 'text-red-600 animate-pulse' : ''}>{timeLeft}s</span>
            </div>
          </div>

          {/* Confidential Movie Card */}
          <NeoCard bg="bg-[#FFF8E9]" size="lg" className="text-center py-8 space-y-3">
            <NeoBadge variant="yellow">ACT THIS MOVIE ONLY!</NeoBadge>
            <h3 className="text-3xl sm:text-4xl font-black text-[#171717]">
              {currentItem.movieTelugu}
            </h3>
            <p className="text-xl font-extrabold text-[#4385EA]">
              {currentItem.movieEnglish} ({currentItem.year})
            </p>

            <div className="bg-white p-3 rounded-xl border-2 border-[#171717] text-left max-w-md mx-auto mt-4 space-y-1">
              <div className="text-xs font-black text-neutral-500">Key Hints for the Actor:</div>
              <div className="text-xs font-bold text-neutral-800">Star: {currentItem.hero}</div>
              <div className="text-xs font-medium text-neutral-600">Scene clue: {currentItem.hint}</div>
            </div>
          </NeoCard>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => handleTurnFinish(false)}
              className="py-3.5 bg-[#FF704D] text-white border-3 border-[#171717] rounded-2xl font-black text-sm shadow-[3px_3px_0_#171717] active:translate-y-1 flex items-center justify-center gap-2"
            >
              <SkipForward className="w-5 h-5" />
              <span>TIME OUT / PASS</span>
            </button>
            <button
              onClick={() => handleTurnFinish(true)}
              className="py-3.5 bg-[#83CBA2] text-[#171717] border-3 border-[#171717] rounded-2xl font-black text-sm shadow-[3px_3px_0_#171717] active:translate-y-1 flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>TEAM GUESSED IT! (+1)</span>
            </button>
          </div>
        </div>
      )}

      {/* Results Screen */}
      {gameState === 'results' && (
        <NeoCard bg="bg-[#FFF8E9]" size="lg" className="text-center space-y-6">
          <div className="flex justify-center">
            <Trophy className="w-20 h-20 text-[#FFCB45]" />
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl font-black text-[#171717]">
              {team1Score > team2Score
                ? `${team1Name} WINS! 🏆`
                : team2Score > team1Score
                ? `${team2Name} WINS! 🏆`
                : `IT'S A DRAMATIC TIE! 🤝`}
            </h2>
            <p className="text-sm font-bold text-neutral-600">Tollywood Dumb Charades Championship</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-2xl border-3 border-[#171717] ${team1Score >= team2Score ? 'bg-[#FFCB45]' : 'bg-white'}`}>
              <div className="text-xs font-black uppercase">{team1Name}</div>
              <div className="text-3xl font-black mt-1">{team1Score} Pts</div>
            </div>
            <div className={`p-4 rounded-2xl border-3 border-[#171717] ${team2Score >= team1Score ? 'bg-[#FFCB45]' : 'bg-white'}`}>
              <div className="text-xs font-black uppercase">{team2Name}</div>
              <div className="text-3xl font-black mt-1">{team2Score} Pts</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <NeoButton variant="coral" fullWidth size="md" onClick={startCharades}>
              <RotateCcw className="w-4 h-4" />
              <span>REMATCH</span>
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
