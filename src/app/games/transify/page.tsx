'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TRANSIFY_DATA } from '@/data/content';
import { TransifyItem } from '@/types';
import { ArrowLeft, Clock, Check, X, RotateCcw, Trophy, Eye, EyeOff } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TransifyPage() {
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'results'>('setup');
  const [timeLeft, setTimeLeft] = useState<number>(90); // 01:30 matching reference
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const totalRounds = 5;

  const [deck, setDeck] = useState<TransifyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [isJudgeAnswerVisible, setIsJudgeAnswerVisible] = useState<boolean>(true); // default answer visible in parentheses matching reference: (Answer: Pokiri)

  const startTransify = () => {
    const shuffled = [...TRANSIFY_DATA].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setRoundNumber(1);
    setTimeLeft(90);
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
    if (isCorrect) {
      setScore((s) => s + 1);
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

  const currentItem = deck[currentIndex] || TRANSIFY_DATA[0];

  return (
    <div className="max-w-md mx-auto space-y-4 pb-12">
      {/* SETUP */}
      {gameState === 'setup' && (
        <div className="bg-white border-2 border-[#171717] rounded-3xl p-6 shadow-[3px_3px_0_#171717] space-y-4 text-center">
          <div className="flex items-center justify-between">
            <Link href="/games" className="p-1 hover:bg-[#FFCB45]/30 rounded-lg">
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </Link>
            <h1 className="text-xl font-black text-[#171717]">Transify</h1>
            <div className="w-5" />
          </div>

          <div className="w-20 h-20 bg-[#FFA6BA] rounded-2xl border-2 border-[#171717] mx-auto flex items-center justify-center shadow-[2px_2px_0_#171717] text-3xl">
            🎭
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-[#171717]">Crack Funny Translations</h2>
            <p className="text-xs font-semibold text-neutral-600 max-w-xs mx-auto">
              Read out funny broken-English literal translations. Friends race to guess the real Telugu movie!
            </p>
          </div>

          <button
            onClick={startTransify}
            className="w-full py-4 bg-[#FFCB45] border-2 border-[#171717] rounded-2xl font-black text-base shadow-[2.5px_2.5px_0_#171717] hover:bg-[#ffd45e] active:translate-x-0.5 active:translate-y-0.5 mt-2 cursor-pointer transition-all"
          >
            Start Round 🚀
          </button>
        </div>
      )}

      {/* GAMEPLAY MATCHING REFERENCE SCREEN 6 */}
      {gameState === 'playing' && (
        <div className="space-y-4">
          {/* Top Bar: Back arrow, "Transify", Yellow Pill Timer 01:30 */}
          <div className="flex items-center justify-between px-1">
            <button onClick={() => setGameState('setup')} className="p-1 hover:bg-[#FFCB45]/30 rounded-lg">
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <h1 className="text-lg font-black text-[#171717]">Transify</h1>

            <div className="flex items-center gap-1 bg-[#FFCB45] px-3 py-1 rounded-full border-2 border-[#171717] shadow-[1.5px_1.5px_0_#171717] text-xs font-black">
              <Clock className="w-3.5 h-3.5 stroke-[3]" />
              <span>{formatTimer(timeLeft)}</span>
            </div>
          </div>

          {/* Big Pink Question Card matching reference screen 6 */}
          <div className="bg-[#FFA6BA] border-2 border-[#171717] rounded-3xl p-8 shadow-[3.5px_3.5px_0_#171717] flex flex-col items-center justify-center text-center min-h-[190px]">
            <h2 className="text-2xl sm:text-3xl font-black text-[#171717] uppercase tracking-wide leading-tight">
              {currentItem.funnyTranslation}
            </h2>
          </div>

          {/* Answer in parentheses matching reference: (Answer: Pokiri) */}
          <div className="text-center py-1">
            <div className="inline-flex items-center gap-2">
              <span className="text-sm font-black text-[#171717]">
                {isJudgeAnswerVisible ? `(Answer: ${currentItem.actualMovieEnglish})` : '(Answer Hidden)'}
              </span>
              <button
                onClick={() => setIsJudgeAnswerVisible(!isJudgeAnswerVisible)}
                className="p-1 text-neutral-600 hover:text-black"
                title="Toggle answer visibility"
              >
                {isJudgeAnswerVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Skip & Correct controls matching reference screen 6 */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* Skip Button (Pink) */}
            <button
              onClick={() => handleAction(false)}
              className="py-4 bg-[#FFA6BA] border-2 border-[#171717] rounded-2xl font-black text-sm text-[#171717] shadow-[2.5px_2.5px_0_#171717] active:translate-x-0.5 active:translate-y-0.5 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:bg-[#ff8da6]"
            >
              <X className="w-6 h-6 stroke-[3]" />
              <span>Skip</span>
            </button>

            {/* Correct Button (Green) */}
            <button
              onClick={() => handleAction(true)}
              className="py-4 bg-[#88D49E] border-2 border-[#171717] rounded-2xl font-black text-sm text-[#171717] shadow-[2.5px_2.5px_0_#171717] active:translate-x-0.5 active:translate-y-0.5 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:bg-[#77c78e]"
            >
              <Check className="w-6 h-6 stroke-[3]" />
              <span>Correct</span>
            </button>
          </div>

          {/* Footer stats matching reference: Score: 1 | Round: 1/5 */}
          <div className="flex items-center justify-between px-2 pt-2 text-xs font-black text-[#171717]">
            <span>Score: {score}</span>
            <span>Round: {roundNumber}/{totalRounds}</span>
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
            <h2 className="text-2xl font-black text-[#171717]">Transify Finished!</h2>
            <p className="text-xs font-bold text-neutral-600">
              Final Score: <span className="text-[#FF704D] font-black">{score}</span> / {totalRounds}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={startTransify}
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
