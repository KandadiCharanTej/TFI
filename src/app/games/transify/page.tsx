'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DieCutCard } from '@/components/DieCutCard';
import { AcampButton } from '@/components/AcampButton';
import { ResultConfetti } from '@/components/ResultConfetti';
import { getTransifyDeck } from '@/data/teluguCinemaDatabase';
import { TeluguMovie } from '@/types';
import { soundManager, triggerHaptic } from '@/utils/audio';
import { Play, RotateCcw, Check, X, Eye, EyeOff, Pause, PlayCircle, Award, Share2 } from 'lucide-react';
import clsx from 'clsx';

type GameState = 'setup' | 'playing' | 'paused' | 'results';

export default function TransifyPage() {
  // Setup options
  const [deckCategory, setDeckCategory] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<string>('all');
  const [duration, setDuration] = useState<number>(60);
  const [judgeName, setJudgeName] = useState<string>('Judge');

  // Game state
  const [gameState, setGameState] = useState<GameState>('setup');
  const [deck, setDeck] = useState<TeluguMovie[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);

  // Score tracking
  const [correctList, setCorrectList] = useState<TeluguMovie[]>([]);
  const [skippedList, setSkippedList] = useState<TeluguMovie[]>([]);

  // Start game flow
  const handleStart = () => {
    soundManager.playClick();
    const filtered = getTransifyDeck(deckCategory, difficulty);
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    setDeck(shuffled);
    setCurrentIndex(0);
    setCorrectList([]);
    setSkippedList([]);
    setTimeLeft(duration);
    setIsAnswerRevealed(false);
    setGameState('playing');
  };

  // Timer loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (duration > 0 && timeLeft <= 0) {
      handleGameOver();
      return;
    }

    if (duration > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 5 && prev > 1) {
            soundManager.playTick(true);
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, timeLeft, duration]);

  const handleAction = (isCorrect: boolean) => {
    if (currentIndex >= deck.length) return;

    const currentCard = deck[currentIndex];

    if (isCorrect) {
      soundManager.playCorrect();
      triggerHaptic(45);
      setCorrectList(prev => [...prev, currentCard]);
    } else {
      soundManager.playPass();
      triggerHaptic(25);
      setSkippedList(prev => [...prev, currentCard]);
    }

    setIsAnswerRevealed(false);

    if (currentIndex + 1 >= deck.length) {
      handleGameOver();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleGameOver = () => {
    soundManager.playFanfare();
    setGameState('results');
  };

  const currentCard = deck[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* =========================================================================
          SETUP SCREEN
          ========================================================================= */}
      {gameState === 'setup' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-2">
            <Link href="/games" className="text-xs font-black uppercase bg-white border border-[#141313] px-2.5 py-1 rounded-lg">
              ← Back to Games
            </Link>
          </div>

          <div className="text-center space-y-1">
            <span className="bg-[#EC1276] text-white font-black text-xs uppercase px-3 py-1 rounded-md border border-[#141313]">
              GAME 02 • 1 JUDGE + FRIENDS
            </span>
            <h1 className="font-block text-5xl sm:text-6xl uppercase text-[#141313] tracking-tight">
              TRANSIFY
            </h1>
            <p className="text-sm font-bold text-[#141313]/80">
              One player acts as the Judge. Read broken English prompts aloud; friends shout the authentic Telugu cinema title!
            </p>
          </div>

          <DieCutCard className="p-6 space-y-6">
            
            {/* Category selection */}
            <div>
              <label className="block font-black text-xs uppercase tracking-wider mb-2 text-[#141313]">
                1. Select Prompt Category:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'all', label: '🔀 All Categories' },
                  { id: 'titles', label: '🎬 Literal Titles' },
                  { id: 'dialogues', label: '🗣️ Iconic Dialogues' },
                  { id: 'memes', label: '🤣 Meme Slang' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      soundManager.playClick();
                      setDeckCategory(cat.id);
                    }}
                    className={clsx(
                      'border-[2px] border-[#141313] p-2 rounded-xl font-bold text-xs text-left cursor-pointer transition-all',
                      deckCategory === cat.id
                        ? 'bg-[#EC1276] text-white shadow-[3px_3px_0_#141313]'
                        : 'bg-white text-[#141313] hover:bg-[#F4F1EA]'
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Timer Selection */}
            <div>
              <label className="block font-black text-xs uppercase tracking-wider mb-2 text-[#141313]">
                2. Round Duration:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { sec: 60, label: '60s' },
                  { sec: 90, label: '90s' },
                  { sec: 120, label: '120s' },
                  { sec: 0, label: 'Untimed' },
                ].map(t => (
                  <button
                    key={t.sec}
                    onClick={() => {
                      soundManager.playClick();
                      setDuration(t.sec);
                    }}
                    className={clsx(
                      'border-[2px] border-[#141313] py-2 rounded-xl font-mono font-bold text-sm text-center cursor-pointer transition-all',
                      duration === t.sec
                        ? 'bg-[#F6BE18] text-[#141313] shadow-[3px_3px_0_#141313]'
                        : 'bg-white text-[#141313] hover:bg-[#F4F1EA]'
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Example Preview */}
            <div className="bg-[#EAE6DF] border-2 border-[#141313] rounded-xl p-4 text-center">
              <span className="text-[10px] font-black uppercase text-[#EC1276]">EXAMPLE CLUE</span>
              <div className="font-extrabold text-base text-[#141313] mt-1">
                "The Federal Rogue / Street Goon"
              </div>
              <div className="text-xs font-black text-[#141313] bg-[#F6BE18] px-3 py-1 rounded border border-[#141313] inline-block mt-2">
                Answer: Pokiri (2006 • Superstar Bob)
              </div>
            </div>

            <AcampButton onClick={handleStart} variant="magenta" size="lg" fullWidth>
              ▶ Start Transify Round
            </AcampButton>

          </DieCutCard>
        </div>
      )}


      {/* =========================================================================
          ACTIVE PLAYING SCREEN (JUDGE INTERFACE)
          ========================================================================= */}
      {gameState === 'playing' && currentCard && (
        <div className="max-w-2xl mx-auto space-y-4">
          
          {/* Top Bar: Timer & Live Stats */}
          <div className="flex items-center justify-between">
            <div className="bg-[#141313] text-[#F6BE18] font-mono font-bold text-base px-4 py-1.5 rounded-xl border-2 border-[#141313]">
              ⏱ {duration > 0 ? `${timeLeft}s Remaining` : 'Untimed Round'}
            </div>

            <div className="flex items-center gap-2 font-mono font-bold text-xs">
              <span className="bg-[#00C853] text-white px-3 py-1 rounded-lg border-2 border-[#141313]">
                ✓ {correctList.length}
              </span>
              <span className="bg-[#EC1276] text-white px-3 py-1 rounded-lg border-2 border-[#141313]">
                ✕ {skippedList.length}
              </span>
              <span className="bg-white px-3 py-1 rounded-lg border-2 border-[#141313]">
                Card {currentIndex + 1} / {deck.length}
              </span>
            </div>
          </div>

          {/* Main Card (Judge Reads Aloud) */}
          <DieCutCard className="p-8 text-center space-y-6">
            
            <div className="inline-block bg-[#141313] text-white font-black text-xs uppercase px-3 py-1 rounded-md">
              JUDGE: READ THIS ENGLISH PROMPT ALOUD
            </div>

            {/* The English Prompt */}
            <div className="bg-[#F4F1EA] border-[3px] border-[#141313] rounded-2xl p-6 min-h-[140px] flex items-center justify-center shadow-[4px_4px_0_#141313]">
              <h2 className="font-block text-2xl sm:text-4xl text-[#141313] uppercase leading-snug">
                {currentCard.transifyPrompt?.brokenEnglish || currentCard.englishTitle}
              </h2>
            </div>

            {/* Secret Private Answer Shutter for Judge */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#141313]/70 px-2">
                <span>SECRET ANSWER (JUDGE ONLY):</span>
                <button
                  onClick={() => setIsAnswerRevealed(!isAnswerRevealed)}
                  className="text-xs font-black text-[#EC1276] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {isAnswerRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                  <span>{isAnswerRevealed ? 'Hide Answer' : 'Click to Peek Answer'}</span>
                </button>
              </div>

              <div
                onClick={() => setIsAnswerRevealed(!isAnswerRevealed)}
                className={clsx(
                  'border-[2.5px] border-[#141313] rounded-xl p-4 transition-all cursor-pointer',
                  isAnswerRevealed
                    ? 'bg-[#F6BE18] text-[#141313] shadow-[3px_3px_0_#141313]'
                    : 'bg-[#141313] text-white/50 hover:text-white'
                )}
              >
                {isAnswerRevealed ? (
                  <div className="space-y-1">
                    <div className="font-telugu font-black text-2xl text-[#141313]">
                      {currentCard.teluguTitle}
                    </div>
                    <div className="font-block text-xl uppercase tracking-wider text-[#EC1276]">
                      {currentCard.englishTitle} ({currentCard.year})
                    </div>
                    <div className="text-xs font-bold text-[#141313]/80">
                      Hero: {currentCard.hero} • Director: {currentCard.director}
                    </div>
                  </div>
                ) : (
                  <div className="font-black text-xs uppercase tracking-widest py-2">
                    🔒 CLICK TO UNVEIL SECRET ANSWER
                  </div>
                )}
              </div>
            </div>

            {/* Judge Decision Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <AcampButton
                onClick={() => handleAction(false)}
                variant="magenta"
                size="lg"
                fullWidth
              >
                ✕ Skip / Pass
              </AcampButton>
              <AcampButton
                onClick={() => handleAction(true)}
                variant="green"
                size="lg"
                fullWidth
              >
                ✓ Correct Answer (+1)
              </AcampButton>
            </div>

          </DieCutCard>
        </div>
      )}


      {/* =========================================================================
          RESULTS SCREEN
          ========================================================================= */}
      {gameState === 'results' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <ResultConfetti />

          <div className="text-center space-y-2">
            <span className="bg-[#00C853] text-white font-black text-xs uppercase px-3.5 py-1 rounded-md border border-[#141313]">
              ROUND OVER!
            </span>
            <h2 className="font-block text-5xl sm:text-6xl uppercase text-[#141313]">
              TRANSIFY RESULTS
            </h2>
            <div className="font-mono text-3xl font-black text-[#EC1276]">
              {correctList.length} / {correctList.length + skippedList.length} CORRECT
            </div>
          </div>

          <DieCutCard className="p-6 space-y-6">
            
            {/* List of cards */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {correctList.map(item => (
                <div key={item.id} className="bg-white border-2 border-[#141313] rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#EC1276]">
                      "{item.transifyPrompt?.brokenEnglish}"
                    </div>
                    <div className="font-block text-lg text-[#141313] uppercase">
                      {item.englishTitle} <span className="text-xs font-mono opacity-60">({item.year})</span>
                    </div>
                  </div>
                  <span className="bg-[#00C853] text-white text-xs font-black px-2 py-0.5 rounded border border-[#141313]">
                    ✓ WON
                  </span>
                </div>
              ))}

              {skippedList.map(item => (
                <div key={item.id} className="bg-[#F4F1EA] border-2 border-[#141313] rounded-xl p-3 flex items-center justify-between opacity-80">
                  <div>
                    <div className="text-xs font-bold text-[#141313]/70">
                      "{item.transifyPrompt?.brokenEnglish}"
                    </div>
                    <div className="font-block text-lg text-[#141313] uppercase">
                      {item.englishTitle} <span className="text-xs font-mono opacity-60">({item.year})</span>
                    </div>
                  </div>
                  <span className="bg-[#EC1276] text-white text-xs font-black px-2 py-0.5 rounded border border-[#141313]">
                    ✕ PASSED
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <AcampButton onClick={handleStart} variant="yellow" size="lg" fullWidth>
                🔄 Play Next Round
              </AcampButton>
              <Link href="/games" className="w-full">
                <AcampButton variant="white" size="md" fullWidth>
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
