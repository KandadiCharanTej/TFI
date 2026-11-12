'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { EMOJI_CINEMA_DATA } from '@/data/content';
import { EmojiCinemaItem } from '@/types';
import { PopcornEmojiIcon } from '@/components/ui/EditorialArt';
import { ArrowLeft, Clock, RotateCcw, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function EmojiCinemaPage() {
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'results'>('setup');
  const [timeLeft, setTimeLeft] = useState<number>(45); // 00:45 matching reference
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const totalRounds = 5;

  const [deck, setDeck] = useState<EmojiCinemaItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  const startQuiz = () => {
    const shuffled = [...EMOJI_CINEMA_DATA].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setRoundNumber(1);
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(45);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState !== 'playing' || isAnswered) return;
    if (timeLeft <= 0) {
      handleOptionPick(-1);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, isAnswered, timeLeft]);

  const handleOptionPick = (optionIndex: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIndex);
    setIsAnswered(true);

    const currentItem = deck[currentIndex];
    const picked = optionIndex >= 0 ? currentItem.options[optionIndex] : null;

    if (picked && picked.isCorrect) {
      setScore((s) => s + 1);
      confetti({ particleCount: 30, spread: 50 });
    }

    setTimeout(() => {
      if (roundNumber >= totalRounds || currentIndex + 1 >= deck.length) {
        setGameState('results');
        confetti({ particleCount: 90, spread: 70 });
      } else {
        setRoundNumber((r) => r + 1);
        setCurrentIndex((i) => i + 1);
        setSelectedOption(null);
        setIsAnswered(false);
        setTimeLeft(45);
      }
    }, 1200);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentItem = deck[currentIndex] || EMOJI_CINEMA_DATA[0];

  return (
    <div className="max-w-md mx-auto space-y-4 pb-12">
      {/* SETUP */}
      {gameState === 'setup' && (
        <div className="bg-white border-2 border-[#171717] rounded-3xl p-6 shadow-[3px_3px_0_#171717] space-y-4 text-center">
          <div className="flex items-center justify-between">
            <Link href="/games" className="p-1 hover:bg-[#FFCB45]/30 rounded-lg">
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </Link>
            <h1 className="text-xl font-black text-[#171717]">Emoji Cinema</h1>
            <div className="w-5" />
          </div>

          <div className="w-20 h-20 bg-[#FFE082] rounded-2xl border-2 border-[#171717] mx-auto flex items-center justify-center shadow-[2px_2px_0_#171717]">
            <PopcornEmojiIcon className="w-14 h-14" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-[#171717]">Guess the Movie!</h2>
            <p className="text-xs font-semibold text-neutral-600 max-w-xs mx-auto">
              Decipher popular Telugu movies from emoji clues before the timer runs out!
            </p>
          </div>

          <button
            onClick={startQuiz}
            className="w-full py-4 bg-[#FFCB45] border-2 border-[#171717] rounded-2xl font-black text-base shadow-[2.5px_2.5px_0_#171717] hover:bg-[#ffd45e] active:translate-x-0.5 active:translate-y-0.5 mt-2 cursor-pointer transition-all"
          >
            Start Quiz 🍿
          </button>
        </div>
      )}

      {/* GAMEPLAY MATCHING REFERENCE SCREEN 8 */}
      {gameState === 'playing' && (
        <div className="space-y-4">
          {/* Top Bar: Back arrow, "Emoji Cinema", yellow pill timer 00:45 */}
          <div className="flex items-center justify-between px-1">
            <button onClick={() => setGameState('setup')} className="p-1 hover:bg-[#FFCB45]/30 rounded-lg">
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <h1 className="text-lg font-black text-[#171717]">Emoji Cinema</h1>

            <div className="flex items-center gap-1 bg-[#FFCB45] px-3 py-1 rounded-full border-2 border-[#171717] shadow-[1.5px_1.5px_0_#171717] text-xs font-black">
              <Clock className="w-3.5 h-3.5 stroke-[3]" />
              <span>{formatTimer(timeLeft)}</span>
            </div>
          </div>

          {/* Big White Emoji Clue Box matching reference screen 8: Popcorn + Heart + Clapperboard */}
          <div className="bg-white border-2 border-[#171717] rounded-3xl p-8 shadow-[3px_3px_0_#171717] flex items-center justify-center min-h-[160px] text-center">
            <span className="text-4xl sm:text-5xl tracking-widest filter drop-shadow-sm">
              {currentItem.emojis}
            </span>
          </div>

          {/* 4 Answer options in 2x2 grid matching reference screen 8: [A. Arjun Reddy] [B. Jersey] [C. Geetha Govindam] [D. Majili] */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {currentItem.options.map((option, idx) => {
              const letter = ['A', 'B', 'C', 'D'][idx];
              let cardStyle = 'bg-white hover:bg-neutral-50';

              if (isAnswered) {
                if (option.isCorrect) {
                  cardStyle = 'bg-[#88D49E] text-black font-black';
                } else if (selectedOption === idx) {
                  cardStyle = 'bg-[#FFA6BA] text-black font-black';
                } else {
                  cardStyle = 'bg-neutral-100 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleOptionPick(idx)}
                  className={`p-3.5 border-2 border-[#171717] rounded-2xl shadow-[2px_2px_0_#171717] font-black text-xs text-left cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 ${cardStyle}`}
                >
                  <span className="text-neutral-500 mr-1.5">{letter}.</span>
                  <span>{option.english}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation reveal */}
          {isAnswered && (
            <div className="p-3 bg-[#FFF8E9] border-2 border-[#171717] rounded-xl text-center text-xs font-bold text-neutral-800 animate-in fade-in">
              💡 {currentItem.explanation}
            </div>
          )}

          {/* Footer stats */}
          <div className="flex items-center justify-between px-2 pt-2 text-xs font-black text-[#171717]">
            <span>Score: {score}</span>
            <span>Question: {roundNumber}/{totalRounds}</span>
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
            <h2 className="text-2xl font-black text-[#171717]">Quiz Completed!</h2>
            <p className="text-xs font-bold text-neutral-600">
              Score: <span className="text-[#FF704D] font-black">{score}</span> / {totalRounds}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={startQuiz}
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
