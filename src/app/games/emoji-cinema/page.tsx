'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { EMOJI_CINEMA_DATA } from '@/data/content';
import { EmojiCinemaItem } from '@/types';
import { NeoButton, NeoCard, NeoBadge } from '@/components/ui/NeoPrimitives';
import { CinemaClapperIcon } from '@/components/ui/Illustrations';
import { Timer, ArrowLeft, Trophy, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function EmojiCinemaPage() {
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'results'>('setup');
  const [timerSeconds, setTimerSeconds] = useState<number>(20);
  const [timeLeft, setTimeLeft] = useState<number>(20);

  const [deck, setDeck] = useState<EmojiCinemaItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [history, setHistory] = useState<{ emojis: string; chosen: string; correct: string; isCorrect: boolean; explanation: string }[]>([]);

  const startEmojiCinema = () => {
    const shuffled = [...EMOJI_CINEMA_DATA].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setHistory([]);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setTimeLeft(timerSeconds);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState !== 'playing' || isAnswerRevealed) return;
    if (timeLeft <= 0) {
      handleOptionPick(-1); // Timed out
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, isAnswerRevealed, timeLeft]);

  const handleOptionPick = (optionIndex: number) => {
    if (isAnswerRevealed) return;
    setSelectedOption(optionIndex);
    setIsAnswerRevealed(true);

    const currentItem = deck[currentIndex];
    const pickedOption = optionIndex >= 0 ? currentItem.options[optionIndex] : null;
    const isCorrect = pickedOption ? pickedOption.isCorrect : false;
    const correctOption = currentItem.options.find((o) => o.isCorrect);

    if (isCorrect) {
      setScore((s) => s + 10);
      confetti({ particleCount: 30, spread: 50 });
    }

    setHistory((prev) => [
      ...prev,
      {
        emojis: currentItem.emojis,
        chosen: pickedOption ? pickedOption.english : 'Timed out',
        correct: correctOption ? correctOption.english : '',
        isCorrect,
        explanation: currentItem.explanation,
      },
    ]);
  };

  const nextPuzzle = () => {
    if (currentIndex + 1 >= deck.length) {
      setGameState('results');
      confetti({ particleCount: 90, spread: 70 });
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
      setTimeLeft(timerSeconds);
    }
  };

  const currentItem = deck[currentIndex];

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {gameState === 'setup' && (
        <NeoCard bg="bg-[#4385EA]" size="lg" className="space-y-6 text-white">
          <div className="flex items-center justify-between">
            <Link href="/games" className="inline-flex items-center gap-1 font-black text-xs hover:underline text-white">
              <ArrowLeft className="w-4 h-4" /> Back to Games
            </Link>
            <NeoBadge variant="yellow">EMOJI PUZZLE</NeoBadge>
          </div>

          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <CinemaClapperIcon className="w-20 h-20" />
            </div>
            <h1 className="text-3xl font-black text-white">EMOJI CINEMA</h1>
            <p className="text-sm font-extrabold text-white/90">
              Decode the Telugu movie title from emoji clues before the timer runs out!
            </p>
          </div>

          <div className="bg-white text-[#171717] p-4 rounded-2xl border-3 border-[#171717] space-y-2">
            <label className="text-xs font-black uppercase text-neutral-600 block">Timer Per Question</label>
            <div className="grid grid-cols-3 gap-2">
              {[15, 20, 30].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimerSeconds(t)}
                  className={`py-2 rounded-xl border-2 border-[#171717] font-black text-xs transition-all ${
                    timerSeconds === t
                      ? 'bg-[#FFCB45] shadow-[2px_2px_0_#171717] -translate-y-0.5'
                      : 'bg-neutral-100'
                  }`}
                >
                  {t} Seconds
                </button>
              ))}
            </div>
          </div>

          <NeoButton variant="primary" fullWidth size="lg" onClick={startEmojiCinema}>
            START EMOJI QUIZ 🧩
          </NeoButton>
        </NeoCard>
      )}

      {gameState === 'playing' && currentItem && (
        <div className="space-y-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between bg-white p-3 rounded-xl border-3 border-[#171717] shadow-[3px_3px_0_#171717]">
            <span className="text-xs font-black bg-[#4385EA] text-white px-2.5 py-1 rounded-lg">
              Question {currentIndex + 1} / {deck.length}
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 font-black text-xl text-[#171717]">
                <Timer className="w-5 h-5 text-[#FF704D]" />
                <span className={timeLeft <= 5 ? 'text-red-600 animate-pulse' : ''}>{timeLeft}s</span>
              </div>
              <span className="text-xs font-black bg-[#FFCB45] border-2 border-[#171717] px-2 py-0.5 rounded">
                Score: {score}
              </span>
            </div>
          </div>

          {/* Emoji Clue Banner */}
          <NeoCard bg="bg-[#FFF8E9]" size="lg" className="text-center py-8 space-y-3">
            <NeoBadge variant="coral">GUESS THE TELUGU MOVIE</NeoBadge>
            <div className="text-4xl sm:text-5xl tracking-widest my-4 filter drop-shadow">
              {currentItem.emojis}
            </div>
            <p className="text-xs font-bold text-neutral-500">
              Select the correct film that matches this emoji combination:
            </p>
          </NeoCard>

          {/* 4 Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentItem.options.map((option, idx) => {
              let btnClass = 'bg-white hover:bg-neutral-50';
              if (isAnswerRevealed) {
                if (option.isCorrect) {
                  btnClass = 'bg-[#83CBA2] border-green-700 text-black';
                } else if (selectedOption === idx) {
                  btnClass = 'bg-[#FF704D] border-red-700 text-white';
                } else {
                  btnClass = 'bg-neutral-100 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswerRevealed}
                  onClick={() => handleOptionPick(idx)}
                  className={`p-4 rounded-2xl border-3 border-[#171717] font-black text-left shadow-[3px_3px_0_#171717] transition-all flex items-center justify-between ${btnClass}`}
                >
                  <div>
                    <div className="text-base">{option.telugu}</div>
                    <div className="text-xs opacity-80">{option.english}</div>
                  </div>
                  {isAnswerRevealed && option.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-green-900 shrink-0" />
                  )}
                  {isAnswerRevealed && selectedOption === idx && !option.isCorrect && (
                    <XCircle className="w-5 h-5 text-white shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner when answered */}
          {isAnswerRevealed && (
            <div className="p-4 bg-white border-3 border-[#171717] rounded-2xl shadow-[4px_4px_0_#171717] space-y-3 animate-in fade-in">
              <div className="text-xs font-black uppercase text-neutral-500">Clue Explanation:</div>
              <p className="text-sm font-bold text-[#171717]">
                💡 {currentItem.explanation}
              </p>
              <NeoButton variant="primary" fullWidth size="md" onClick={nextPuzzle}>
                {currentIndex + 1 >= deck.length ? 'SEE RESULTS 🏆' : 'NEXT PUZZLE ➡️'}
              </NeoButton>
            </div>
          )}
        </div>
      )}

      {gameState === 'results' && (
        <NeoCard bg="bg-[#FFF8E9]" size="lg" className="space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <Trophy className="w-16 h-16 text-[#FFCB45]" />
            </div>
            <h2 className="text-3xl font-black text-[#171717]">QUIZ FINISHED!</h2>
            <p className="text-sm font-bold text-neutral-600">
              Total Score: <span className="text-2xl font-black text-[#FF704D]">{score} / {deck.length * 10}</span>
            </p>
          </div>

          {/* Review List */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            <div className="text-xs font-black uppercase">Question Breakdown:</div>
            {history.map((h, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border-2 border-[#171717] text-xs font-bold ${
                  h.isCorrect ? 'bg-green-100' : 'bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base">{h.emojis}</span>
                  <span className={h.isCorrect ? 'text-green-800 font-black' : 'text-red-700 font-black'}>
                    {h.isCorrect ? '✓ +10' : '✕ Missed'}
                  </span>
                </div>
                <div>Correct Answer: {h.correct}</div>
                <div className="text-[11px] text-neutral-600 italic mt-0.5">{h.explanation}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <NeoButton variant="primary" fullWidth size="md" onClick={startEmojiCinema}>
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
