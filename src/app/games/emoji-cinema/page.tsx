'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DieCutCard } from '@/components/DieCutCard';
import { AcampButton } from '@/components/AcampButton';
import { ResultConfetti } from '@/components/ResultConfetti';
import { getEmojiCinemaDeck } from '@/data/teluguCinemaDatabase';
import { TeluguMovie } from '@/types';
import { soundManager, triggerHaptic } from '@/utils/audio';
import { Check, X, Sparkles, Award, ArrowRight, RotateCcw, HelpCircle } from 'lucide-react';
import clsx from 'clsx';

type GameState = 'setup' | 'playing' | 'feedback' | 'results';

export default function EmojiCinemaPage() {
  // Setup options
  const [difficulty, setDifficulty] = useState<string>('all');
  const [totalQuestions, setTotalQuestions] = useState<number>(10);

  // Active state
  const [gameState, setGameState] = useState<GameState>('setup');
  const [deck, setDeck] = useState<TeluguMovie[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  // History tracking for final review
  const [history, setHistory] = useState<{
    movie: TeluguMovie;
    userAnswer: string;
    correctAnswer: string;
    wasCorrect: boolean;
  }[]>([]);

  // Start game flow
  const handleStart = () => {
    soundManager.playClick();
    const filtered = getEmojiCinemaDeck(difficulty);
    const shuffled = [...filtered].sort(() => 0.5 - Math.random()).slice(0, totalQuestions);
    setDeck(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedOption(null);
    setHistory([]);
    setGameState('playing');
  };

  const handleSelectOption = (option: string) => {
    if (gameState !== 'playing' || selectedOption !== null) return;

    setSelectedOption(option);
    const currentMovie = deck[currentIndex];
    const correct = currentMovie.emojiClue?.correctAnswer === option;
    setIsCorrect(correct);

    if (correct) {
      soundManager.playCorrect();
      triggerHaptic(40);
      setScore(prev => prev + 10 + streak * 2);
      setStreak(prev => prev + 1);
    } else {
      soundManager.playPass();
      triggerHaptic(20);
      setStreak(0);
    }

    setHistory(prev => [
      ...prev,
      {
        movie: currentMovie,
        userAnswer: option,
        correctAnswer: currentMovie.emojiClue?.correctAnswer || currentMovie.englishTitle,
        wasCorrect: correct,
      },
    ]);

    setGameState('feedback');
  };

  const handleNextQuestion = () => {
    soundManager.playClick();
    setSelectedOption(null);

    if (currentIndex + 1 >= deck.length) {
      soundManager.playFanfare();
      setGameState('results');
    } else {
      setCurrentIndex(prev => prev + 1);
      setGameState('playing');
    }
  };

  const currentMovie = deck[currentIndex];
  const clue = currentMovie?.emojiClue;

  // Compute Fan IQ Title based on final score
  const getFanTitle = () => {
    const accuracy = history.length > 0 ? (history.filter(h => h.wasCorrect).length / history.length) * 100 : 0;
    if (accuracy >= 90) return '🏆 BOX OFFICE BADSHAH (Top 1% TFI Fan)';
    if (accuracy >= 70) return '👑 CULT CINEMA CONNOISSEUR';
    if (accuracy >= 50) return '🍿 FIRST DAY FIRST SHOW JUNKIE';
    return '🎬 CASUAL THEATRE AUDIENCE';
  };

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
            <span className="bg-[#00E5FF] text-[#141313] font-black text-xs uppercase px-3 py-1 rounded-md border border-[#141313]">
              GAME 04 • CINEMA EMOJI QUIZ
            </span>
            <h1 className="font-block text-5xl sm:text-6xl uppercase text-[#141313] tracking-tight">
              EMOJI CINEMA
            </h1>
            <p className="text-sm font-bold text-[#141313]/80">
              Can you decode iconic Telugu blockbusters and comedy classics from pure emoji clues?
            </p>
          </div>

          <DieCutCard className="p-6 space-y-6">
            
            {/* Number of questions */}
            <div>
              <label className="block font-black text-xs uppercase tracking-wider mb-2 text-[#141313]">
                1. Number of Questions:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 15].map(q => (
                  <button
                    key={q}
                    onClick={() => setTotalQuestions(q)}
                    className={clsx(
                      'border-2 border-[#141313] py-2 rounded-xl font-mono font-black text-sm cursor-pointer transition-all',
                      totalQuestions === q
                        ? 'bg-[#00E5FF] text-[#141313] shadow-[3px_3px_0_#141313]'
                        : 'bg-white text-[#141313] hover:bg-[#F4F1EA]'
                    )}
                  >
                    {q} Questions
                  </button>
                ))}
              </div>
            </div>

            {/* Example preview */}
            <div className="bg-[#EAE6DF] border-2 border-[#141313] rounded-xl p-4 text-center">
              <span className="text-[10px] font-black uppercase text-[#EC1276]">EXAMPLE CLUE</span>
              <div className="text-3xl my-1.5">
                🪵 🪓 🧔 🔴
              </div>
              <div className="text-xs font-bold text-[#141313]">
                Red Sandalwood + Axe + Beard + Red = <strong>Pushpa: The Rise</strong>
              </div>
            </div>

            <AcampButton onClick={handleStart} variant="cyan" size="lg" fullWidth>
              ▶ Start Emoji Cinema Quiz
            </AcampButton>

          </DieCutCard>
        </div>
      )}


      {/* =========================================================================
          ACTIVE PLAYING / FEEDBACK SCREEN
          ========================================================================= */}
      {(gameState === 'playing' || gameState === 'feedback') && clue && (
        <div className="max-w-2xl mx-auto space-y-4">
          
          {/* Progress Header */}
          <div className="flex items-center justify-between">
            <span className="bg-[#141313] text-[#00E5FF] font-mono font-bold text-xs px-3 py-1 rounded-lg border-2 border-[#141313]">
              QUESTION {currentIndex + 1} / {deck.length}
            </span>

            <div className="flex items-center gap-2 font-mono font-bold text-xs">
              {streak > 1 && (
                <span className="bg-[#EC1276] text-white px-2.5 py-1 rounded-lg border-2 border-[#141313] animate-bounce">
                  🔥 {streak}x STREAK
                </span>
              )}
              <span className="bg-[#F6BE18] text-[#141313] px-3 py-1 rounded-lg border-2 border-[#141313]">
                SCORE: {score} PTS
              </span>
            </div>
          </div>

          <DieCutCard className="p-8 text-center space-y-6">
            
            <div className="text-xs font-black uppercase text-[#141313]/60">
              GUESS THE TELUGU MOVIE:
            </div>

            {/* Emojis Display */}
            <div className="bg-[#F4F1EA] border-[3px] border-[#141313] rounded-2xl py-8 px-4 flex items-center justify-center shadow-[4px_4px_0_#141313]">
              <span className="text-5xl sm:text-7xl tracking-widest drop-shadow-[2px_2px_0_#141313]">
                {clue.emojis}
              </span>
            </div>

            {/* 4 Multiple Choice Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {clue.options.map(option => {
                const isSelected = selectedOption === option;
                const isCorrectOption = clue.correctAnswer === option;

                let btnStyle = 'bg-white text-[#141313] hover:bg-[#F4F1EA]';
                if (gameState === 'feedback') {
                  if (isCorrectOption) {
                    btnStyle = 'bg-[#00C853] text-white shadow-[4px_4px_0_#141313]';
                  } else if (isSelected && !isCorrectOption) {
                    btnStyle = 'bg-[#EC1276] text-white shadow-[4px_4px_0_#141313]';
                  } else {
                    btnStyle = 'opacity-40 bg-white text-[#141313]';
                  }
                }

                return (
                  <button
                    key={option}
                    disabled={gameState === 'feedback'}
                    onClick={() => handleSelectOption(option)}
                    className={clsx(
                      'border-[2.5px] border-[#141313] p-4 rounded-xl font-block text-lg uppercase tracking-wide',
                      'transition-all duration-120 cursor-pointer shadow-[3px_3px_0_#141313]',
                      btnStyle
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {/* FEEDBACK EXPLANATION ACCORDION */}
            {gameState === 'feedback' && (
              <div className="bg-[#FFF9E6] border-2 border-[#141313] rounded-xl p-4 text-left space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <span className={clsx('font-black text-xs uppercase px-2.5 py-0.5 rounded border border-[#141313]', isCorrect ? 'bg-[#00C853] text-white' : 'bg-[#EC1276] text-white')}>
                    {isCorrect ? '✓ CORRECT! (+10 PTS)' : '✕ INCORRECT'}
                  </span>
                  <span className="font-block text-lg uppercase text-[#141313]">
                    {clue.correctAnswer}
                  </span>
                </div>

                <p className="text-xs font-semibold text-[#141313]/90 leading-relaxed">
                  💡 <strong>Cinema Trivia:</strong> {clue.explanation}
                </p>

                <div className="pt-2">
                  <AcampButton onClick={handleNextQuestion} variant="yellow" size="md" fullWidth>
                    {currentIndex + 1 >= deck.length ? 'See Final Scorecard →' : 'Next Emoji Puzzle →'}
                  </AcampButton>
                </div>
              </div>
            )}

          </DieCutCard>
        </div>
      )}


      {/* =========================================================================
          RESULTS SCREEN
          ========================================================================= */}
      {gameState === 'results' && (
        <div className="max-w-2xl mx-auto space-y-6 text-center">
          <ResultConfetti />

          <div className="space-y-1">
            <span className="bg-[#00C853] text-white font-black text-xs uppercase px-4 py-1.5 rounded-full border border-[#141313]">
              QUIZ COMPLETE!
            </span>
            <h2 className="font-block text-5xl sm:text-6xl uppercase text-[#141313]">
              EMOJI CINEMA SCORE
            </h2>
            <div className="font-mono text-4xl font-black text-[#EC1276]">
              {score} PTS
            </div>
            <div className="font-black text-sm uppercase text-[#141313] bg-[#F6BE18] px-4 py-1 rounded-lg border-2 border-[#141313] inline-block mt-1">
              {getFanTitle()}
            </div>
          </div>

          <DieCutCard className="p-6 space-y-6">
            
            {/* Question breakdown */}
            <div className="space-y-2 max-h-60 overflow-y-auto text-left pr-1">
              {history.map((h, i) => (
                <div key={i} className="bg-white border-2 border-[#141313] rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="text-lg">{h.movie.emojiClue?.emojis}</div>
                    <div className="font-block text-base uppercase text-[#141313]">
                      {h.correctAnswer}
                    </div>
                  </div>
                  <span className={clsx('text-xs font-black px-2 py-0.5 rounded border border-[#141313]', h.wasCorrect ? 'bg-[#00C853] text-white' : 'bg-[#EC1276] text-white')}>
                    {h.wasCorrect ? '✓ CORRECT' : '✕ WRONG'}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <AcampButton onClick={handleStart} variant="cyan" size="lg" fullWidth>
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

