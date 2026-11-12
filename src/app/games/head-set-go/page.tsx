'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { DieCutCard } from '@/components/DieCutCard';
import { AcampButton } from '@/components/AcampButton';
import { ResultConfetti } from '@/components/ResultConfetti';
import { TELUGU_CINEMA_DATABASE, getHeadSetGoDeck } from '@/data/teluguCinemaDatabase';
import { TeluguMovie } from '@/types';
import { soundManager, triggerHaptic } from '@/utils/audio';
import { Play, RotateCcw, Check, X, Pause, PlayCircle, Eye, ArrowLeft, Volume2 } from 'lucide-react';
import clsx from 'clsx';

type GameState = 'setup' | 'countdown' | 'playing' | 'paused' | 'results';

export default function HeadSetGoPage() {
  // Setup state
  const [category, setCategory] = useState<string>('all');
  const [duration, setDuration] = useState<number>(60);
  const [gameState, setGameState] = useState<GameState>('setup');

  // Active game state
  const [deck, setDeck] = useState<TeluguMovie[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [prepCountdown, setPrepCountdown] = useState<number>(5);

  // Score tracking
  const [correctCards, setCorrectCards] = useState<TeluguMovie[]>([]);
  const [skippedCards, setSkippedCards] = useState<TeluguMovie[]>([]);

  // Feedback flash state
  const [feedback, setFeedback] = useState<'correct' | 'skip' | null>(null);

  // Wake lock ref
  const wakeLockRef = useRef<any>(null);

  // Acquire Wake Lock
  const requestWakeLock = async () => {
    if (typeof window !== 'undefined' && 'wakeLock' in navigator) {
      try {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      } catch {}
    }
  };

  const releaseWakeLock = () => {
    if (wakeLockRef.current) {
      try {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      } catch {}
    }
  };

  // Start game flow
  const handleStartGame = () => {
    soundManager.playClick();
    const filtered = getHeadSetGoDeck(category);
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    setDeck(shuffled);
    setCurrentIndex(0);
    setCorrectCards([]);
    setSkippedCards([]);
    setTimeLeft(duration);
    setPrepCountdown(5);
    setGameState('countdown');
    requestWakeLock();
  };

  // Preparation Countdown (5 to 1)
  useEffect(() => {
    if (gameState !== 'countdown') return;

    if (prepCountdown > 0) {
      soundManager.playTick(true);
      const timer = setTimeout(() => {
        setPrepCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      soundManager.playFanfare();
      setGameState('playing');
    }
  }, [gameState, prepCountdown]);

  // Main Playing Timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft <= 0) {
      handleGameOver();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 6 && prev > 1) {
          soundManager.playTick(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  // Gyroscope / Device Orientation Handling (Tilt down = Correct, Tilt up = Skip)
  useEffect(() => {
    if (gameState !== 'playing') return;

    let lastTiltTime = 0;
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const now = Date.now();
      if (now - lastTiltTime < 1200) return; // Debounce 1.2s

      const beta = e.beta; // Tilt front/back [-180, 180]
      if (beta === null) return;

      // When phone is on forehead in landscape:
      // Tilting head down tilts phone screen downwards
      if (beta > 65) {
        lastTiltTime = now;
        handleAction('correct');
      } else if (beta < -30) {
        lastTiltTime = now;
        handleAction('skip');
      }
    };

    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, [gameState, currentIndex, deck]);

  // Action handlers
  const handleAction = (type: 'correct' | 'skip') => {
    if (gameState !== 'playing' || currentIndex >= deck.length) return;

    const currentCard = deck[currentIndex];

    if (type === 'correct') {
      soundManager.playCorrect();
      triggerHaptic(50);
      setCorrectCards(prev => [...prev, currentCard]);
      setFeedback('correct');
    } else {
      soundManager.playPass();
      triggerHaptic(30);
      setSkippedCards(prev => [...prev, currentCard]);
      setFeedback('skip');
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex + 1 >= deck.length) {
        handleGameOver();
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    }, 200);
  };

  const handleGameOver = () => {
    releaseWakeLock();
    soundManager.playFanfare();
    setGameState('results');
  };

  const currentMovie = deck[currentIndex];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6">
      
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
            <span className="bg-[#F6BE18] text-[#141313] font-black text-xs uppercase px-3 py-1 rounded-md border border-[#141313]">
              GAME 01 • SINGLE-DEVICE FOREHEAD
            </span>
            <h1 className="font-block text-5xl sm:text-6xl uppercase text-[#141313] tracking-tight">
              HEAD SET GO!
            </h1>
            <p className="text-sm font-bold text-[#141313]/80">
              Hold the phone horizontally on your forehead. Friends shout clues—guess as many as you can before the timer runs out!
            </p>
          </div>

          <DieCutCard className="p-6 space-y-6">
            
            {/* Category selection */}
            <div>
              <label className="block font-black text-xs uppercase tracking-wider mb-2 text-[#141313]">
                1. Select Category:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'all', label: '🎬 All Cinema Mix' },
                  { id: 'heroes', label: '🔥 Heroes & Stars' },
                  { id: 'characters', label: '🎭 Cult Characters' },
                  { id: 'dialogues', label: '🗣️ Famous Dialogues' },
                  { id: 'brahmi', label: '👑 Brahmi Universe' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      soundManager.playClick();
                      setCategory(cat.id);
                    }}
                    className={clsx(
                      'border-[2px] border-[#141313] p-2.5 rounded-xl font-bold text-xs text-left cursor-pointer transition-all',
                      category === cat.id
                        ? 'bg-[#F6BE18] text-[#141313] shadow-[3px_3px_0_#141313]'
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
                  { sec: 180, label: '180s' },
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
                        ? 'bg-[#EC1276] text-white shadow-[3px_3px_0_#141313]'
                        : 'bg-white text-[#141313] hover:bg-[#F4F1EA]'
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* How to play card */}
            <div className="bg-[#F4F1EA] border-2 border-[#141313] rounded-xl p-4 text-xs font-semibold space-y-1.5">
              <div className="font-black uppercase text-[#EC1276]">HOW TO PLAY ON PHONE:</div>
              <div>• Tap <strong className="text-[#00C853]">Right Half</strong> of screen for Correct (+1 point).</div>
              <div>• Tap <strong className="text-[#EC1276]">Left Half</strong> of screen to Skip / Pass.</div>
              <div>• Optional: Tilt head down for Correct, tilt head up to Pass (Gyroscope auto-enabled).</div>
            </div>

            <AcampButton onClick={handleStartGame} variant="yellow" size="lg" fullWidth>
              ⚡ Ready! Place on Forehead
            </AcampButton>

          </DieCutCard>
        </div>
      )}


      {/* =========================================================================
          PREPARATION COUNTDOWN SCREEN (5 SECONDS)
          ========================================================================= */}
      {gameState === 'countdown' && (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-6">
          <div className="bg-[#141313] text-[#F6BE18] font-black text-sm uppercase px-6 py-2 rounded-full border-2 border-[#141313] shadow-[4px_4px_0_#141313]">
            PLACE PHONE ON FOREHEAD HORIZONTALLY!
          </div>

          <div className="w-36 h-36 rounded-full bg-[#EC1276] border-[6px] border-[#141313] flex items-center justify-center font-block text-8xl text-white shadow-[0_0_0_8px_#FFFFFF,0_0_0_12px_#141313,8px_10px_0_#141313] animate-bounce">
            {prepCountdown}
          </div>

          <p className="font-block text-2xl uppercase tracking-wider text-[#141313]">
            FRIENDS GET READY TO GIVE CLUES!
          </p>
        </div>
      )}


      {/* =========================================================================
          LANDSCAPE GAMEPLAY SCREEN (LARGE READABLE TEXT + TOUCH CONTROLS)
          ========================================================================= */}
      {gameState === 'playing' && currentMovie && (
        <div
          className={clsx(
            'relative w-full min-h-[75vh] rounded-3xl border-[5px] border-[#141313] overflow-hidden select-none transition-colors duration-200',
            feedback === 'correct' && 'bg-[#00C853]',
            feedback === 'skip' && 'bg-[#EC1276]',
            !feedback && 'bg-white shadow-[0_0_0_6px_#FFFFFF,0_0_0_10px_#141313,8px_12px_0_#141313]'
          )}
        >
          {/* Top HUD: Timer & Score */}
          <div className="absolute top-4 left-6 right-6 flex items-center justify-between z-20 pointer-events-none">
            <div className="bg-[#141313] text-white px-4 py-1.5 rounded-xl border-2 border-[#141313] font-mono font-bold text-lg">
              ⏱ {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
            </div>

            <div className="flex items-center gap-3">
              <span className="bg-[#00C853] text-white px-3 py-1 rounded-lg border-2 border-[#141313] font-black text-sm">
                ✓ {correctCards.length}
              </span>
              <span className="bg-[#EC1276] text-white px-3 py-1 rounded-lg border-2 border-[#141313] font-black text-sm">
                ✕ {skippedCards.length}
              </span>
            </div>
          </div>

          {/* Center Card Content (Displayed to Friends) */}
          <div className="w-full h-full min-h-[75vh] flex flex-col items-center justify-center px-6 text-center space-y-3">
            
            {/* Clue Category Pill */}
            <span className="bg-[#F6BE18] text-[#141313] font-black text-xs sm:text-sm uppercase px-4 py-1 rounded-full border-2 border-[#141313] shadow-[2px_2px_0_#141313]">
              {currentMovie.hero} • {currentMovie.year}
            </span>

            {/* Telugu Title */}
            <h2 className="font-telugu font-black text-4xl sm:text-6xl md:text-7xl text-[#141313] tracking-wide leading-tight">
              {currentMovie.teluguTitle}
            </h2>

            {/* English Title */}
            <div className="font-block text-3xl sm:text-5xl uppercase tracking-wider text-[#EC1276]">
              {currentMovie.englishTitle}
            </div>

            {/* Clue / Character hint */}
            <div className="max-w-lg bg-[#F4F1EA] border-2 border-[#141313] rounded-xl px-4 py-2 text-xs sm:text-sm font-extrabold text-[#141313]/90 mt-2">
              💡 {currentMovie.headSetGoClue || currentMovie.characters.join(' • ')}
            </div>

          </div>

          {/* Full Screen Touch Trigger Controls: Left Half = Skip, Right Half = Correct */}
          <div className="absolute inset-0 grid grid-cols-2 z-10 opacity-0 hover:opacity-10 transition-opacity">
            <button
              onClick={() => handleAction('skip')}
              className="bg-red-500 cursor-pointer flex items-center justify-start p-8"
              title="Tap left side to Skip"
            >
              <X size={48} className="text-white" />
            </button>
            <button
              onClick={() => handleAction('correct')}
              className="bg-green-500 cursor-pointer flex items-center justify-end p-8"
              title="Tap right side for Correct"
            >
              <Check size={48} className="text-white" />
            </button>
          </div>

          {/* Bottom On-Screen Buttons (Guaranteed fallback for all devices) */}
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between z-20">
            <AcampButton onClick={() => handleAction('skip')} variant="magenta" size="md">
              ✕ Skip Card
            </AcampButton>
            <AcampButton onClick={() => handleAction('correct')} variant="green" size="md">
              ✓ Correct! (+1)
            </AcampButton>
          </div>

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
              ROUND COMPLETE!
            </span>
            <h2 className="font-block text-5xl sm:text-6xl uppercase text-[#141313]">
              FINAL SCORECARD
            </h2>
            <div className="font-mono text-3xl font-black text-[#EC1276]">
              {correctCards.length} / {correctCards.length + skippedCards.length} CORRECT
            </div>
            <p className="text-xs font-bold text-[#141313]/70">
              Accuracy: {correctCards.length + skippedCards.length > 0
                ? Math.round((correctCards.length / (correctCards.length + skippedCards.length)) * 100)
                : 0}%
            </p>
          </div>

          <DieCutCard className="p-6 space-y-6">
            
            {/* Breakdown Lists */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Correct List */}
              <div className="bg-[#F4F1EA] border-2 border-[#141313] rounded-xl p-3">
                <div className="font-black text-xs uppercase text-[#00C853] mb-2 flex items-center justify-between">
                  <span>✓ Correct ({correctCards.length})</span>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {correctCards.map(c => (
                    <div key={c.id} className="text-xs font-bold text-[#141313] bg-white px-2.5 py-1 rounded border border-[#141313]/30">
                      {c.englishTitle} <span className="opacity-60">({c.year})</span>
                    </div>
                  ))}
                  {correctCards.length === 0 && (
                    <div className="text-xs text-gray-500 italic">No correct cards this round</div>
                  )}
                </div>
              </div>

              {/* Skipped List */}
              <div className="bg-[#F4F1EA] border-2 border-[#141313] rounded-xl p-3">
                <div className="font-black text-xs uppercase text-[#EC1276] mb-2 flex items-center justify-between">
                  <span>✕ Skipped ({skippedCards.length})</span>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {skippedCards.map(c => (
                    <div key={c.id} className="text-xs font-bold text-[#141313] bg-white px-2.5 py-1 rounded border border-[#141313]/30">
                      {c.englishTitle} <span className="opacity-60">({c.year})</span>
                    </div>
                  ))}
                  {skippedCards.length === 0 && (
                    <div className="text-xs text-gray-500 italic">Zero cards skipped! Perfect!</div>
                  )}
                </div>
              </div>

            </div>

            <div className="flex flex-wrap gap-3">
              <AcampButton onClick={handleStartGame} variant="yellow" size="lg" fullWidth>
                🔄 Play Again
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
