'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DUMB_CHARADES_DATA } from '@/data/content';
import { DumbCharadesItem } from '@/types';
import { MimeActorIllustration } from '@/components/ui/EditorialArt';
import { ArrowLeft, Clock, Check, X, RotateCcw, Trophy, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DumbCharadesPage() {
  const [gameState, setGameState] = useState<'setup' | 'handoff' | 'playing' | 'results'>('setup');
  const [teamAScore, setTeamAScore] = useState<number>(12); // sample starting / reference looks
  const [teamBScore, setTeamBScore] = useState<number>(10);
  const [currentTurn, setCurrentTurn] = useState<'Team A' | 'Team B'>('Team A');
  const [timeLeft, setTimeLeft] = useState<number>(60); // 01:00 matching reference
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const totalRounds = 6;

  const [deck, setDeck] = useState<DumbCharadesItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const startCharades = () => {
    const shuffled = [...DUMB_CHARADES_DATA].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setTeamAScore(0);
    setTeamBScore(0);
    setCurrentTurn('Team A');
    setRoundNumber(1);
    setTimeLeft(60);
    setGameState('handoff');
  };

  useEffect(() => {
    if (gameState !== 'playing') return;
    if (timeLeft <= 0) {
      handleFinishTurn(false);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleFinishTurn = (isGuessed: boolean) => {
    if (isGuessed) {
      if (currentTurn === 'Team A') setTeamAScore((s) => s + 1);
      else setTeamBScore((s) => s + 1);
    }

    if (roundNumber >= totalRounds) {
      setGameState('results');
      confetti({ particleCount: 90, spread: 70 });
    } else {
      setRoundNumber((r) => r + 1);
      setCurrentTurn((t) => (t === 'Team A' ? 'Team B' : 'Team A'));
      setCurrentIndex((i) => (i + 1) % deck.length);
      setTimeLeft(60);
      setGameState('handoff');
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentItem = deck[currentIndex] || DUMB_CHARADES_DATA[0];

  return (
    <div className="max-w-md mx-auto space-y-4 pb-12">
      {/* SETUP */}
      {gameState === 'setup' && (
        <div className="bg-white border-2 border-[#171717] rounded-3xl p-6 shadow-[3px_3px_0_#171717] space-y-4 text-center">
          <div className="flex items-center justify-between">
            <Link href="/games" className="p-1 hover:bg-[#FFCB45]/30 rounded-lg">
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </Link>
            <h1 className="text-xl font-black text-[#171717]">Dumb Charades</h1>
            <div className="w-5" />
          </div>

          <div className="w-24 h-24 mx-auto flex items-center justify-center">
            <MimeActorIllustration className="w-24 h-24" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-[#171717]">Act it Out!</h2>
            <p className="text-xs font-semibold text-neutral-600 max-w-xs mx-auto">
              Team A vs Team B. One player receives a secret Telugu movie title and acts it out with gestures only!
            </p>
          </div>

          <button
            onClick={startCharades}
            className="w-full py-4 bg-[#FFCB45] border-2 border-[#171717] rounded-2xl font-black text-base shadow-[2.5px_2.5px_0_#171717] hover:bg-[#ffd45e] active:translate-x-0.5 active:translate-y-0.5 mt-2 cursor-pointer transition-all"
          >
            Start Battle 🔥
          </button>
        </div>
      )}

      {/* HANDOFF CURTAIN */}
      {gameState === 'handoff' && (
        <div className="bg-[#FFCB45] border-2 border-[#171717] rounded-3xl p-8 shadow-[3.5px_3.5px_0_#171717] space-y-5 text-center">
          <div className="inline-block px-3 py-1 bg-white border-2 border-[#171717] rounded-full text-xs font-black">
            Turn: {currentTurn}
          </div>
          <h2 className="text-3xl font-black text-[#171717]">
            Pass Device to <br /> {currentTurn} Actor
          </h2>
          <p className="text-xs font-bold text-neutral-800">
            Teammates look away! Only the acting player should reveal the secret movie title.
          </p>

          <button
            onClick={() => setGameState('playing')}
            className="w-full py-4 bg-white border-2 border-[#171717] rounded-2xl font-black text-base shadow-[2.5px_2.5px_0_#171717] hover:bg-neutral-50 active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Eye className="w-5 h-5" />
            <span>Show Secret Movie</span>
          </button>
        </div>
      )}

      {/* GAMEPLAY MATCHING REFERENCE SCREEN 7 */}
      {gameState === 'playing' && (
        <div className="space-y-4">
          {/* Top Bar: Back arrow, "Dumb Charades" */}
          <div className="flex items-center justify-between px-1">
            <button onClick={() => setGameState('setup')} className="p-1 hover:bg-[#FFCB45]/30 rounded-lg">
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <h1 className="text-lg font-black text-[#171717]">Dumb Charades</h1>
            <div className="w-5" />
          </div>

          {/* Team A and Team B Cards matching reference screen 7 */}
          <div className="grid grid-cols-2 gap-3">
            {/* Team A (Blue Card) */}
            <div className="p-4 bg-[#B3D4FC] border-2 border-[#171717] rounded-2xl shadow-[2.5px_2.5px_0_#171717] text-center">
              <span className="text-xs font-black text-[#171717] block">Team A</span>
              <span className="text-2xl font-black text-[#171717]">{teamAScore}</span>
            </div>

            {/* Team B (Pink Card) */}
            <div className="p-4 bg-[#FFA6BA] border-2 border-[#171717] rounded-2xl shadow-[2.5px_2.5px_0_#171717] text-center">
              <span className="text-xs font-black text-[#171717] block">Team B</span>
              <span className="text-2xl font-black text-[#171717]">{teamBScore}</span>
            </div>
          </div>

          {/* Secret Movie Title Reveal for the Actor */}
          <div className="p-3 bg-white border-2 border-[#171717] rounded-2xl text-center shadow-[1.5px_1.5px_0_#171717]">
            <span className="text-[11px] font-black uppercase text-neutral-500">Secret Movie (Only You See This):</span>
            <div className="text-xl font-black text-[#171717] mt-0.5">
              {currentItem.movieEnglish} ({currentItem.movieTelugu})
            </div>
          </div>

          {/* Center Mime Silhouette Card matching reference screen 7 */}
          <div className="bg-white border-2 border-[#171717] rounded-3xl p-6 shadow-[3px_3px_0_#171717] flex flex-col items-center justify-center text-center">
            <MimeActorIllustration className="w-36 h-36" />
            <h3 className="text-base font-black text-[#171717] mt-2">
              Act out the movie!
            </h3>
          </div>

          {/* Center Yellow Pill Timer matching reference screen 7: e.g. [⏱️ 01:00] with small rays */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <div className="flex items-center gap-1.5 bg-[#FFCB45] px-5 py-2 rounded-full border-2 border-[#171717] shadow-[2px_2px_0_#171717] text-sm font-black">
              <Clock className="w-4 h-4 stroke-[3]" />
              <span>{formatTimer(timeLeft)}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => handleFinishTurn(false)}
              className="py-3.5 bg-[#FFA6BA] border-2 border-[#171717] rounded-2xl font-black text-sm text-[#171717] shadow-[2.5px_2.5px_0_#171717] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-1.5"
            >
              <X className="w-5 h-5 stroke-[3]" />
              <span>Time Out / Pass</span>
            </button>
            <button
              onClick={() => handleFinishTurn(true)}
              className="py-3.5 bg-[#88D49E] border-2 border-[#171717] rounded-2xl font-black text-sm text-[#171717] shadow-[2.5px_2.5px_0_#171717] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-1.5"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>Team Guessed It!</span>
            </button>
          </div>
        </div>
      )}

      {/* RESULTS */}
      {gameState === 'results' && (
        <div className="bg-white border-2 border-[#171717] rounded-3xl p-6 shadow-[3px_3px_0_#171717] space-y-4 text-center">
          <div className="w-16 h-16 bg-[#FFCB45] rounded-2xl border-2 border-[#171717] mx-auto flex items-center justify-center shadow-[2px_2px_0_#171717]">
            <Trophy className="w-10 h-10 text-[#171717]" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-[#171717]">
              {teamAScore > teamBScore ? 'Team A Wins! 🏆' : teamBScore > teamAScore ? 'Team B Wins! 🏆' : "It's a Tie! 🤝"}
            </h2>
            <p className="text-xs font-bold text-neutral-600">
              Team A: {teamAScore} Pts | Team B: {teamBScore} Pts
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={startCharades}
              className="py-3 bg-[#FFCB45] border-2 border-[#171717] rounded-xl font-black text-xs shadow-[2px_2px_0_#171717] flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Rematch</span>
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
