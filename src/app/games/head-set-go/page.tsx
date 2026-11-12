'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HEAD_SET_GO_DATA } from '@/data/content';
import { HeadSetGoCard } from '@/types';
import { HeadSetGoForeheadIllustration, ForeheadPlayerIcon, DoodleStar } from '@/components/ui/EditorialArt';
import { ArrowLeft, Clock, Check, X, RotateCcw, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HeadSetGoPage() {
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'results'>('setup');
  const [timerDuration, setTimerDuration] = useState<number>(90); // 01:30 matching reference
  const [timeLeft, setTimeLeft] = useState<number>(90);
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const totalRounds = 5;

  const [deck, setDeck] = useState<HeadSetGoCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [correctCards, setCorrectCards] = useState<HeadSetGoCard[]>([]);
  const [skippedCards, setSkippedCards] = useState<HeadSetGoCard[]>([]);

  const startRound = () => {
    const shuffled = [...HEAD_SET_GO_DATA].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setRoundNumber(1);
    setCorrectCards([]);
    setSkippedCards([]);
    setTimeLeft(timerDuration);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState !== 'playing') return;
    if (timeLeft <= 0) {
      finishGame();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleAction = (isCorrect: boolean) => {
    const currentCard = deck[currentIndex];
    if (isCorrect) {
      setScore((s) => s + 1);
      setCorrectCards((prev) => [...prev, currentCard]);
    } else {
      setSkippedCards((prev) => [...prev, currentCard]);
    }

    if (roundNumber >= totalRounds || currentIndex + 1 >= deck.length) {
      finishGame();
    } else {
      setRoundNumber((r) => r + 1);
      setCurrentIndex((i) => i + 1);
    }
  };

  const finishGame = () => {
    setGameState('results');
    confetti({ particleCount: 90, spread: 70 });
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentCard = deck[currentIndex] || HEAD_SET_GO_DATA[0];

  return (
    <div className="max-w-md mx-auto space-y-4 pb-12">
      {/* SETUP SCREEN */}
      {gameState === 'setup' && (
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-between px-1">
            <Link href="/games" className="p-1 hover:bg-[#FFCB45]/30 rounded-lg">
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </Link>
            <h1 className="text-xl font-black text-[#171717]">Head Set Go</h1>
            <div className="w-5" />
          </div>

          <div className="bg-white border-2 border-[#171717] rounded-3xl p-6 shadow-[3px_3px_0_#171717] space-y-4">
            <div className="w-20 h-20 bg-[#B3D4FC] rounded-2xl border-2 border-[#171717] mx-auto flex items-center justify-center shadow-[2px_2px_0_#171717]">
              <ForeheadPlayerIcon className="w-14 h-14" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-[#171717]">Guess the Movie!</h2>
              <p className="text-xs font-semibold text-neutral-600 max-w-xs mx-auto">
                Hold phone on your forehead! Friends shout clues to make you guess before the clock runs out.
              </p>
            </div>

            {/* Timer preset: 01:30 matching reference */}
            <div className="pt-2">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-500 block mb-2">Round Timer</span>
              <div className="grid grid-cols-3 gap-2">
                {[60, 90, 120].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimerDuration(t)}
                    className={`py-2 rounded-xl border-2 border-[#171717] text-xs font-black transition-all ${
                      timerDuration === t ? 'bg-[#FFCB45] shadow-[2px_2px_0_#171717]' : 'bg-white'
                    }`}
                  >
                    {formatTimer(t)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startRound}
              className="w-full py-4 bg-[#FFCB45] border-2 border-[#171717] rounded-2xl font-black text-base shadow-[2.5px_2.5px_0_#171717] hover:bg-[#ffd45e] active:translate-x-0.5 active:translate-y-0.5 mt-2 cursor-pointer transition-all"
            >
              Start Game 🎬
            </button>
          </div>
        </div>
      )}

      {/* GAMEPLAY SCREEN MATCHING REFERENCE SCREEN 5 */}
      {gameState === 'playing' && (
        <div className="space-y-4">
          {/* Top Bar: Back arrow, "Head Set Go", yellow pill timer */}
          <div className="flex items-center justify-between px-1">
            <button onClick={() => setGameState('setup')} className="p-1 hover:bg-[#FFCB45]/30 rounded-lg">
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <h1 className="text-lg font-black text-[#171717]">Head Set Go</h1>
            
            {/* Yellow pill timer matching reference screen 5 */}
            <div className="flex items-center gap-1 bg-[#FFCB45] px-3 py-1 rounded-full border-2 border-[#171717] shadow-[1.5px_1.5px_0_#171717] text-xs font-black">
              <Clock className="w-3.5 h-3.5 stroke-[3]" />
              <span>{formatTimer(timeLeft)}</span>
            </div>
          </div>

          {/* Forehead Phone Frame with Hands Illustration */}
          <HeadSetGoForeheadIllustration movieName={currentCard.english} />

          {/* Prompt line matching reference: "Guess the Movie!" with doodles */}
          <div className="flex items-center justify-center gap-2 text-center py-1">
            <DoodleStar className="w-3.5 h-3.5 text-[#171717]" />
            <span className="text-sm font-black text-[#171717] tracking-wide">Guess the Movie!</span>
            <DoodleStar className="w-3.5 h-3.5 text-[#171717]" />
          </div>

          {/* Clues for Friends */}
          <div className="bg-white/70 border border-[#171717] rounded-xl p-2.5 text-center text-xs font-bold text-neutral-700">
            Clues: {currentCard.clues.slice(0, 3).join(' • ')}
          </div>

          {/* Big Correct & Skip buttons matching reference screen 5 */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* Green Correct Button */}
            <button
              onClick={() => handleAction(true)}
              className="py-4 bg-[#88D49E] border-2 border-[#171717] rounded-2xl font-black text-sm text-[#171717] shadow-[2.5px_2.5px_0_#171717] active:translate-x-0.5 active:translate-y-0.5 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:bg-[#77c78e]"
            >
              <Check className="w-6 h-6 stroke-[3]" />
              <span>Correct</span>
            </button>

            {/* Pink Skip Button */}
            <button
              onClick={() => handleAction(false)}
              className="py-4 bg-[#FFA6BA] border-2 border-[#171717] rounded-2xl font-black text-sm text-[#171717] shadow-[2.5px_2.5px_0_#171717] active:translate-x-0.5 active:translate-y-0.5 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:bg-[#ff8da6]"
            >
              <X className="w-6 h-6 stroke-[3]" />
              <span>Skip</span>
            </button>
          </div>

          {/* Footer Stats matching reference screen 5: Score: X | Round: 1/5 */}
          <div className="flex items-center justify-between px-2 pt-2 text-xs font-black text-[#171717]">
            <span>Score: {score}</span>
            <span>Round: {roundNumber}/{totalRounds}</span>
          </div>
        </div>
      )}

      {/* RESULTS SCREEN */}
      {gameState === 'results' && (
        <div className="bg-white border-2 border-[#171717] rounded-3xl p-6 shadow-[3px_3px_0_#171717] space-y-4 text-center">
          <div className="w-16 h-16 bg-[#FFCB45] rounded-2xl border-2 border-[#171717] mx-auto flex items-center justify-center shadow-[2px_2px_0_#171717]">
            <Trophy className="w-10 h-10 text-[#171717]" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-[#171717]">Round Finished!</h2>
            <p className="text-xs font-bold text-neutral-600">
              You scored <span className="text-[#FF704D] font-black">{score}</span> out of {totalRounds}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={startRound}
              className="py-3 bg-[#FFCB45] border-2 border-[#171717] rounded-xl font-black text-xs shadow-[2px_2px_0_#171717] flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
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
