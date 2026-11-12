'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { HEAD_SET_GO_DATA } from '@/data/content';
import { HeadSetGoCard } from '@/types';
import { NeoButton, NeoCard, NeoBadge } from '@/components/ui/NeoPrimitives';
import { TeluguHeroIcon } from '@/components/ui/Illustrations';
import { Timer, RotateCcw, Check, SkipForward, ArrowLeft, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HeadSetGoPage() {
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'results'>('setup');
  const [timerDuration, setTimerDuration] = useState<number>(60);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [category, setCategory] = useState<'All' | 'Movie' | 'Dialogue' | 'Actor' | 'Character'>('All');
  
  const [deck, setDeck] = useState<HeadSetGoCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [correctCards, setCorrectCards] = useState<HeadSetGoCard[]>([]);
  const [skippedCards, setSkippedCards] = useState<HeadSetGoCard[]>([]);

  // Orientation tilt detection
  const [tiltActive, setTiltActive] = useState<boolean>(false);
  const lastBetaRef = useRef<number | null>(null);
  const cooldownRef = useRef<boolean>(false);

  const startGame = () => {
    let filtered = [...HEAD_SET_GO_DATA];
    if (category !== 'All') {
      filtered = filtered.filter((c) => c.type === category);
    }
    // Shuffle
    filtered = filtered.sort(() => Math.random() - 0.5);
    setDeck(filtered);
    setCurrentIndex(0);
    setCorrectCards([]);
    setSkippedCards([]);
    setTimeLeft(timerDuration);
    setGameState('playing');
  };

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return;
    if (timeLeft <= 0) {
      setGameState('results');
      confetti({ particleCount: 80, spread: 70 });
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  // Motion sensor handling for Forehead Tilt
  useEffect(() => {
    if (gameState !== 'playing' || !tiltActive) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (cooldownRef.current) return;
      const beta = e.beta; // In degree -180 to 180 (tilt front-to-back)
      if (beta === null) return;

      // Tilt down (towards forehead floor): beta > 70
      // Tilt up (towards forehead sky): beta < 15
      if (beta > 65) {
        handleAnswer(true);
        triggerCooldown();
      } else if (beta < 20) {
        handleAnswer(false);
        triggerCooldown();
      }
    };

    const triggerCooldown = () => {
      cooldownRef.current = true;
      setTimeout(() => {
        cooldownRef.current = false;
      }, 1500);
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [gameState, tiltActive, currentIndex, deck]);

  const handleAnswer = (isCorrect: boolean) => {
    if (currentIndex >= deck.length) {
      setGameState('results');
      return;
    }
    const currentCard = deck[currentIndex];
    if (isCorrect) {
      setCorrectCards((prev) => [...prev, currentCard]);
    } else {
      setSkippedCards((prev) => [...prev, currentCard]);
    }
    if (currentIndex + 1 >= deck.length) {
      setGameState('results');
      confetti({ particleCount: 100, spread: 80 });
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const requestTiltPermission = async () => {
    if (typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function') {
      try {
        const response = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
        if (response === 'granted') {
          setTiltActive(true);
        }
      } catch (e) {
        console.error('Sensor error', e);
      }
    } else {
      setTiltActive(!tiltActive);
    }
  };

  const currentCard = deck[currentIndex];

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {gameState === 'setup' && (
        <NeoCard bg="bg-[#83CBA2]" size="lg" className="space-y-6">
          <div className="flex items-center justify-between">
            <Link href="/games" className="inline-flex items-center gap-1 font-black text-xs hover:underline">
              <ArrowLeft className="w-4 h-4" /> Back to Games
            </Link>
            <NeoBadge variant="yellow">SINGLE DEVICE</NeoBadge>
          </div>

          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <TeluguHeroIcon className="w-20 h-20" />
            </div>
            <h1 className="text-3xl font-black text-[#171717]">HEAD SET GO!</h1>
            <p className="text-sm font-extrabold text-[#171717]/80">
              Hold the phone on your forehead. Friends shout clues to guess the Telugu cinema item!
            </p>
          </div>

          {/* Category selection */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider block">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {(['All', 'Movie', 'Dialogue', 'Actor', 'Character'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-3 rounded-xl border-2 border-[#171717] font-black text-xs transition-all ${
                    category === cat
                      ? 'bg-[#FFCB45] shadow-[2px_2px_0_#171717] -translate-y-0.5'
                      : 'bg-white opacity-90'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Timer selection */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider block">Timer Duration</label>
            <div className="grid grid-cols-3 gap-2">
              {[60, 90, 120].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimerDuration(t)}
                  className={`py-2 px-3 rounded-xl border-2 border-[#171717] font-black text-xs transition-all ${
                    timerDuration === t
                      ? 'bg-[#FF704D] text-white shadow-[2px_2px_0_#171717] -translate-y-0.5'
                      : 'bg-white text-black'
                  }`}
                >
                  {t} Seconds
                </button>
              ))}
            </div>
          </div>

          {/* Tilt sensor toggle */}
          <div className="p-3 bg-white rounded-xl border-2 border-[#171717] flex items-center justify-between shadow-[2px_2px_0_#171717]">
            <div>
              <div className="font-extrabold text-xs">Forehead Tilt Sensor</div>
              <div className="text-[11px] text-neutral-600">Tilt down for correct, tilt up to skip</div>
            </div>
            <button
              onClick={requestTiltPermission}
              className={`px-3 py-1 text-xs font-black rounded-lg border-2 border-[#171717] ${
                tiltActive ? 'bg-[#83CBA2] text-black' : 'bg-neutral-200 text-neutral-600'
              }`}
            >
              {tiltActive ? 'ENABLED' : 'TOUCH ONLY'}
            </button>
          </div>

          <NeoButton variant="primary" fullWidth size="lg" onClick={startGame}>
            START GAME (START GUESSING!) 🎬
          </NeoButton>
        </NeoCard>
      )}

      {gameState === 'playing' && currentCard && (
        <div className="min-h-[75vh] flex flex-col justify-between space-y-4">
          {/* Top Bar with Timer */}
          <div className="flex items-center justify-between bg-white p-3 rounded-xl border-3 border-[#171717] shadow-[3px_3px_0_#171717]">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-[#FF704D]" />
              <span className={`text-2xl font-black ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-[#171717]'}`}>
                {timeLeft}s
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black bg-[#83CBA2] border-2 border-[#171717] px-2 py-0.5 rounded">
                ✓ {correctCards.length}
              </span>
              <span className="text-xs font-black bg-[#FF704D] text-white border-2 border-[#171717] px-2 py-0.5 rounded">
                ✕ {skippedCards.length}
              </span>
            </div>
          </div>

          {/* Big Forehead Display Card */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#FFF8E9] border-4 border-[#171717] rounded-3xl shadow-[6px_6px_0_#171717] text-center my-auto min-h-[360px]">
            <NeoBadge variant="coral" className="mb-3">
              {currentCard.type} • {currentCard.era}
            </NeoBadge>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#171717] tracking-tight leading-tight mb-2">
              {currentCard.telugu}
            </h2>
            <p className="text-xl sm:text-2xl font-extrabold text-[#4385EA] mb-6">
              {currentCard.english}
            </p>

            <div className="flex flex-wrap justify-center gap-2 max-w-md">
              {currentCard.clues.map((clue, i) => (
                <span
                  key={i}
                  className="bg-white border-2 border-[#171717] text-xs font-black px-3 py-1 rounded-full shadow-[2px_2px_0_#171717]"
                >
                  💡 {clue}
                </span>
              ))}
            </div>
          </div>

          {/* Touch Fallback Controls */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswer(false)}
              className="py-4 bg-[#FF704D] text-white border-3 border-[#171717] rounded-2xl font-black text-lg shadow-[4px_4px_0_#171717] active:translate-y-1 flex items-center justify-center gap-2"
            >
              <SkipForward className="w-6 h-6" />
              <span>SKIP (పాస్)</span>
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="py-4 bg-[#83CBA2] text-[#171717] border-3 border-[#171717] rounded-2xl font-black text-lg shadow-[4px_4px_0_#171717] active:translate-y-1 flex items-center justify-center gap-2"
            >
              <Check className="w-6 h-6 stroke-[3]" />
              <span>CORRECT (రైట్)</span>
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
            <h2 className="text-3xl font-black text-[#171717]">ROUND FINISHED!</h2>
            <p className="text-sm font-bold text-neutral-600">
              Great party round! Here is how you performed.
            </p>
          </div>

          {/* Score stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-[#83CBA2] rounded-xl border-2 border-[#171717] shadow-[2px_2px_0_#171717]">
              <div className="text-2xl font-black">{correctCards.length}</div>
              <div className="text-[11px] font-extrabold uppercase">Correct</div>
            </div>
            <div className="p-3 bg-[#FF704D] text-white rounded-xl border-2 border-[#171717] shadow-[2px_2px_0_#171717]">
              <div className="text-2xl font-black">{skippedCards.length}</div>
              <div className="text-[11px] font-extrabold uppercase">Skipped</div>
            </div>
            <div className="p-3 bg-[#FFCB45] rounded-xl border-2 border-[#171717] shadow-[2px_2px_0_#171717]">
              <div className="text-2xl font-black">
                {correctCards.length + skippedCards.length > 0
                  ? Math.round((correctCards.length / (correctCards.length + skippedCards.length)) * 100)
                  : 0}%
              </div>
              <div className="text-[11px] font-extrabold uppercase">Accuracy</div>
            </div>
          </div>

          {/* Card Review */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            <div className="text-xs font-black uppercase">Card Breakdown:</div>
            {correctCards.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-2 bg-green-100 border border-[#171717] rounded-lg text-xs font-bold">
                <span>✓ {c.telugu} ({c.english})</span>
                <span className="text-green-800 font-extrabold">Correct</span>
              </div>
            ))}
            {skippedCards.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-2 bg-red-100 border border-[#171717] rounded-lg text-xs font-bold">
                <span>✕ {c.telugu} ({c.english})</span>
                <span className="text-red-700 font-extrabold">Skipped</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <NeoButton variant="primary" fullWidth size="md" onClick={startGame}>
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
