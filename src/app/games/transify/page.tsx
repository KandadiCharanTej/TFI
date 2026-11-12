'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TRANSIFY_DATA } from '@/data/content';
import { TransifyItem } from '@/types';
import { NeoButton, NeoCard, NeoBadge } from '@/components/ui/NeoPrimitives';
import { CinemaClapperIcon } from '@/components/ui/Illustrations';
import { Timer, Eye, EyeOff, Check, SkipForward, ArrowLeft, Trophy, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TransifyPage() {
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'results'>('setup');
  const [judgeName, setJudgeName] = useState<string>('Judge Harsha');
  const [timerSeconds, setTimerSeconds] = useState<number>(45);
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isSecretRevealed, setIsSecretRevealed] = useState<boolean>(false);

  const [deck, setDeck] = useState<TransifyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [history, setHistory] = useState<{ item: TransifyItem; guessed: boolean }[]>([]);

  const startTransify = () => {
    const shuffled = [...TRANSIFY_DATA].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setHistory([]);
    setTimeLeft(timerSeconds);
    setIsPaused(false);
    setIsSecretRevealed(false);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState !== 'playing' || isPaused) return;
    if (timeLeft <= 0) {
      handleNext(false);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, isPaused, timeLeft]);

  const handleNext = (wasGuessed: boolean) => {
    if (currentIndex >= deck.length) {
      finishGame();
      return;
    }
    const current = deck[currentIndex];
    if (wasGuessed) {
      setScore((s) => s + 10);
    }
    setHistory((prev) => [...prev, { item: current, guessed: wasGuessed }]);

    if (currentIndex + 1 >= deck.length) {
      finishGame();
    } else {
      setCurrentIndex((i) => i + 1);
      setTimeLeft(timerSeconds);
      setIsSecretRevealed(false);
    }
  };

  const finishGame = () => {
    setGameState('results');
    confetti({ particleCount: 90, spread: 70 });
  };

  const currentItem = deck[currentIndex];

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {gameState === 'setup' && (
        <NeoCard bg="bg-[#CBB8F5]" size="lg" className="space-y-6">
          <div className="flex items-center justify-between">
            <Link href="/games" className="inline-flex items-center gap-1 font-black text-xs hover:underline">
              <ArrowLeft className="w-4 h-4" /> Back to Games
            </Link>
            <NeoBadge variant="yellow">PARTY TRANSLATION</NeoBadge>
          </div>

          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <CinemaClapperIcon className="w-20 h-20" />
            </div>
            <h1 className="text-3xl font-black text-[#171717]">TRANSIFY</h1>
            <p className="text-sm font-extrabold text-[#171717]/80">
              Guess Telugu movie titles from wacky broken-English literal translations!
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider block">Designate The Judge</label>
            <input
              type="text"
              value={judgeName}
              onChange={(e) => setJudgeName(e.target.value)}
              placeholder="e.g. Judge Suresh"
              className="w-full px-4 py-2.5 bg-white border-2 border-[#171717] rounded-xl font-bold text-sm shadow-[2px_2px_0_#171717]"
            />
            <p className="text-[11px] text-neutral-700">
              The Judge holds the phone, reads the English translation aloud, and clicks Correct when someone shouts the right answer!
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider block">Round Timer</label>
            <div className="grid grid-cols-3 gap-2">
              {[30, 45, 60].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setTimerSeconds(sec)}
                  className={`py-2 rounded-xl border-2 border-[#171717] font-black text-xs transition-all ${
                    timerSeconds === sec
                      ? 'bg-[#FFCB45] shadow-[2px_2px_0_#171717] -translate-y-0.5'
                      : 'bg-white'
                  }`}
                >
                  {sec}s per title
                </button>
              ))}
            </div>
          </div>

          <NeoButton variant="primary" fullWidth size="lg" onClick={startTransify}>
            START TRANSIFY ROUND 🎭
          </NeoButton>
        </NeoCard>
      )}

      {gameState === 'playing' && currentItem && (
        <div className="space-y-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between bg-white p-3 rounded-xl border-3 border-[#171717] shadow-[3px_3px_0_#171717]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black bg-[#CBB8F5] border border-[#171717] px-2 py-0.5 rounded">
                Judge: {judgeName}
              </span>
              <span className="text-xs font-bold text-neutral-600">
                {currentIndex + 1} / {deck.length}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 font-black text-lg">
                <Timer className="w-5 h-5 text-[#FF704D]" />
                <span className={timeLeft <= 10 ? 'text-red-600 animate-pulse' : ''}>{timeLeft}s</span>
              </div>
              <span className="text-xs font-black bg-[#FFCB45] border-2 border-[#171717] px-2 py-0.5 rounded">
                Score: {score}
              </span>
            </div>
          </div>

          {/* Funny Translation Prompt */}
          <NeoCard bg="bg-[#FFF8E9]" size="lg" className="text-center py-8 space-y-4">
            <NeoBadge variant="coral">TRANSLATED ENGLISH PHRASE</NeoBadge>
            <div className="text-2xl sm:text-3xl md:text-4xl font-black text-[#171717] italic px-2">
              &ldquo;{currentItem.funnyTranslation}&rdquo;
            </div>
            <p className="text-xs font-bold text-neutral-600">
              🗣️ Judge: Read this aloud to the room. Friends have to guess the Telugu film!
            </p>
          </NeoCard>

          {/* Judge Secret View */}
          <div className="bg-white border-3 border-[#171717] rounded-2xl p-4 shadow-[4px_4px_0_#171717] space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black uppercase tracking-wider text-neutral-500">
                Judge Confidential Answer
              </div>
              <button
                onClick={() => setIsSecretRevealed(!isSecretRevealed)}
                className="inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 bg-[#FFCB45] border border-[#171717] rounded-lg"
              >
                {isSecretRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {isSecretRevealed ? 'HIDE' : 'REVEAL TO JUDGE'}
              </button>
            </div>

            {isSecretRevealed ? (
              <div className="p-3 bg-[#FFF8E9] border-2 border-[#171717] rounded-xl space-y-1 animate-in fade-in">
                <div className="text-xl font-black text-[#171717]">
                  {currentItem.actualMovieTelugu} ({currentItem.actualMovieEnglish})
                </div>
                <div className="text-xs font-bold text-neutral-700">
                  Hint: {currentItem.hint}
                </div>
                <div className="text-[11px] text-neutral-500 italic">
                  Why: {currentItem.explanation}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-neutral-100 border-2 border-dashed border-neutral-300 rounded-xl text-center text-xs font-bold text-neutral-500">
                Tap Reveal to see the actual Telugu title & hints
              </div>
            )}
          </div>

          {/* Judge Controls */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => handleNext(false)}
              className="py-3.5 bg-[#FF704D] text-white border-3 border-[#171717] rounded-2xl font-black text-sm shadow-[3px_3px_0_#171717] active:translate-y-1 flex items-center justify-center gap-2"
            >
              <SkipForward className="w-5 h-5" />
              <span>PASS / TIME OUT</span>
            </button>
            <button
              onClick={() => handleNext(true)}
              className="py-3.5 bg-[#83CBA2] text-[#171717] border-3 border-[#171717] rounded-2xl font-black text-sm shadow-[3px_3px_0_#171717] active:translate-y-1 flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>CORRECT (+10 PTS)</span>
            </button>
          </div>
        </div>
      )}

      {gameState === 'results' && (
        <NeoCard bg="bg-[#FFF8E9]" size="lg" className="space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <Trophy className="w-16 h-16 text-[#FFCB45]" />
            </div>
            <h2 className="text-3xl font-black text-[#171717]">TRANSIFY COMPLETE!</h2>
            <p className="text-sm font-bold text-neutral-600">
              Total Score: <span className="text-xl font-black text-[#FF704D]">{score} Points</span>
            </p>
          </div>

          {/* History */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            <div className="text-xs font-black uppercase">Round Review:</div>
            {history.map((h, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border-2 border-[#171717] text-xs font-bold ${
                  h.guessed ? 'bg-green-100' : 'bg-red-50'
                }`}
              >
                <div className="flex justify-between">
                  <span className="font-black">&ldquo;{h.item.funnyTranslation}&rdquo;</span>
                  <span>{h.guessed ? '✓ +10 pts' : '✕ Missed'}</span>
                </div>
                <div className="text-neutral-700 mt-1">
                  Answer: {h.item.actualMovieTelugu} ({h.item.actualMovieEnglish})
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <NeoButton variant="primary" fullWidth size="md" onClick={startTransify}>
              <RotateCcw className="w-4 h-4" />
              <span>PLAY AGAIN</span>
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
