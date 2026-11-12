'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DieCutCard } from '@/components/DieCutCard';
import { AcampButton } from '@/components/AcampButton';
import { ResultConfetti } from '@/components/ResultConfetti';
import { getCharadesDeck } from '@/data/teluguCinemaDatabase';
import { TeluguMovie } from '@/types';
import { soundManager, triggerHaptic } from '@/utils/audio';
import { Users, Eye, EyeOff, Check, X, ShieldAlert, Trophy, Award, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

type Phase = 'setup' | 'handoff' | 'acting' | 'turn-summary' | 'winner';

export default function DumbCharadesPage() {
  // Setup options
  const [teamAName, setTeamAName] = useState<string>('Kakinada Kings');
  const [teamBName, setTeamBName] = useState<string>('Guntur Gondus');
  const [difficulty, setDifficulty] = useState<string>('all');
  const [roundDuration, setRoundDuration] = useState<number>(60);
  const [maxRounds, setMaxRounds] = useState<number>(3); // Rounds per team

  // Game execution state
  const [phase, setPhase] = useState<Phase>('setup');
  const [deck, setDeck] = useState<TeluguMovie[]>([]);
  const [deckIndex, setDeckIndex] = useState<number>(0);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [activeTeam, setActiveTeam] = useState<'A' | 'B'>('A');

  // Scores
  const [teamAScore, setTeamAScore] = useState<number>(0);
  const [teamBScore, setTeamBScore] = useState<number>(0);

  // Turn timer and privacy
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isPeeking, setIsPeeking] = useState<boolean>(false);
  const [lastTurnWon, setLastTurnWon] = useState<boolean>(false);

  // Start game flow
  const handleStartGame = () => {
    soundManager.playClick();
    const filtered = getCharadesDeck(difficulty);
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    setDeck(shuffled);
    setDeckIndex(0);
    setCurrentRound(1);
    setActiveTeam('A');
    setTeamAScore(0);
    setTeamBScore(0);
    setPhase('handoff');
  };

  // Start acting turn
  const handleStartTurn = () => {
    soundManager.playClick();
    setTimeLeft(roundDuration);
    setIsPeeking(false);
    setPhase('acting');
  };

  // Turn timer
  useEffect(() => {
    if (phase !== 'acting') return;

    if (timeLeft <= 0) {
      handleFinishTurn(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 5 && prev > 1) {
          soundManager.playTick(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, timeLeft]);

  // Complete turn
  const handleFinishTurn = (won: boolean) => {
    setLastTurnWon(won);
    if (won) {
      soundManager.playCorrect();
      triggerHaptic(50);
      if (activeTeam === 'A') setTeamAScore(prev => prev + 1);
      else setTeamBScore(prev => prev + 1);
    } else {
      soundManager.playPass();
      triggerHaptic(25);
    }

    setPhase('turn-summary');
  };

  // Advance turn or end game
  const handleNextTurn = () => {
    soundManager.playClick();
    setDeckIndex(prev => prev + 1);

    if (activeTeam === 'A') {
      setActiveTeam('B');
      setPhase('handoff');
    } else {
      // Completed round for both teams
      if (currentRound >= maxRounds) {
        soundManager.playFanfare();
        setPhase('winner');
      } else {
        setCurrentRound(prev => prev + 1);
        setActiveTeam('A');
        setPhase('handoff');
      }
    }
  };

  const currentMovie = deck[deckIndex] || deck[0];
  const activeTeamTitle = activeTeam === 'A' ? teamAName : teamBName;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* =========================================================================
          SETUP SCREEN
          ========================================================================= */}
      {phase === 'setup' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-2">
            <Link href="/games" className="text-xs font-black uppercase bg-white border border-[#141313] px-2.5 py-1 rounded-lg">
              ← Back to Games
            </Link>
          </div>

          <div className="text-center space-y-1">
            <span className="bg-[#00C853] text-white font-black text-xs uppercase px-3 py-1 rounded-md border border-[#141313]">
              GAME 03 • SINGLE-DEVICE TEAM GAME
            </span>
            <h1 className="font-block text-5xl sm:text-6xl uppercase text-[#141313] tracking-tight">
              DUMB CHARADES
            </h1>
            <p className="text-sm font-bold text-[#141313]/80">
              Act out Telugu movies without making a sound! Protect secrets with the hold-to-peek privacy shutter.
            </p>
          </div>

          <DieCutCard className="p-6 space-y-6">
            
            {/* Team Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-black text-xs uppercase tracking-wider mb-1 text-[#141313]">
                  Team A Name:
                </label>
                <input
                  type="text"
                  value={teamAName}
                  onChange={e => setTeamAName(e.target.value)}
                  className="w-full bg-[#FFF9E6] border-2 border-[#141313] px-3 py-2 rounded-xl font-extrabold text-sm shadow-[2px_2px_0_#141313]"
                />
              </div>

              <div>
                <label className="block font-black text-xs uppercase tracking-wider mb-1 text-[#141313]">
                  Team B Name:
                </label>
                <input
                  type="text"
                  value={teamBName}
                  onChange={e => setTeamBName(e.target.value)}
                  className="w-full bg-[#FCE8F3] border-2 border-[#141313] px-3 py-2 rounded-xl font-extrabold text-sm shadow-[2px_2px_0_#141313]"
                />
              </div>
            </div>

            {/* Rounds & Timer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-black text-xs uppercase tracking-wider mb-1 text-[#141313]">
                  Rounds per Team:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[3, 5, 7].map(r => (
                    <button
                      key={r}
                      onClick={() => setMaxRounds(r)}
                      className={clsx(
                        'border-2 border-[#141313] py-2 rounded-xl font-black text-xs cursor-pointer',
                        maxRounds === r ? 'bg-[#141313] text-[#F6BE18]' : 'bg-white text-[#141313]'
                      )}
                    >
                      {r} Rounds
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-black text-xs uppercase tracking-wider mb-1 text-[#141313]">
                  Timer per Turn:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[45, 60, 90].map(s => (
                    <button
                      key={s}
                      onClick={() => setRoundDuration(s)}
                      className={clsx(
                        'border-2 border-[#141313] py-2 rounded-xl font-mono font-black text-xs cursor-pointer',
                        roundDuration === s ? 'bg-[#00C853] text-white' : 'bg-white text-[#141313]'
                      )}
                    >
                      {s}s
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <AcampButton onClick={handleStartGame} variant="green" size="lg" fullWidth>
              ▶ Start Charades Tournament
            </AcampButton>

          </DieCutCard>
        </div>
      )}


      {/* =========================================================================
          ACTOR HANDOFF & PRIVACY PEEK SCREEN
          ========================================================================= */}
      {phase === 'handoff' && (
        <div className="max-w-xl mx-auto space-y-6 text-center">
          
          {/* Live Score Strip */}
          <div className="flex items-center justify-center gap-4">
            <div className="bg-[#FFF9E6] border-2 border-[#141313] px-4 py-2 rounded-xl shadow-[3px_3px_0_#141313]">
              <div className="text-[10px] font-black uppercase text-[#141313]/70">{teamAName}</div>
              <div className="font-mono text-2xl font-black">{teamAScore} PTS</div>
            </div>
            <div className="font-block text-xl">VS</div>
            <div className="bg-[#FCE8F3] border-2 border-[#141313] px-4 py-2 rounded-xl shadow-[3px_3px_0_#141313]">
              <div className="text-[10px] font-black uppercase text-[#141313]/70">{teamBName}</div>
              <div className="font-mono text-2xl font-black">{teamBScore} PTS</div>
            </div>
          </div>

          <DieCutCard className="p-8 space-y-6">
            <div className="inline-block bg-[#141313] text-white font-black text-xs uppercase px-4 py-1.5 rounded-full">
              ROUND {currentRound} OF {maxRounds} • TURN FOR: {activeTeamTitle}
            </div>

            <h2 className="font-block text-4xl sm:text-5xl uppercase text-[#141313]">
              PASS PHONE TO ACTOR!
            </h2>
            <p className="text-sm font-bold text-[#141313]/80">
              Only the actor from <strong>{activeTeamTitle}</strong> should look at the screen. Opponents and teammates must not look!
            </p>

            {/* PRIVACY SHUTTER: HOLD TO PEEK */}
            <div className="space-y-2">
              <div className="text-[11px] font-black uppercase text-[#EC1276]">
                ACTOR PRIVACY SHUTTER (TOUCH &amp; HOLD TO REVEAL)
              </div>
              <div
                onMouseDown={() => setIsPeeking(true)}
                onMouseUp={() => setIsPeeking(false)}
                onTouchStart={() => setIsPeeking(true)}
                onTouchEnd={() => setIsPeeking(false)}
                className={clsx(
                  'border-[3px] border-[#141313] rounded-2xl p-6 min-h-[140px] flex flex-col items-center justify-center transition-all cursor-pointer select-none',
                  isPeeking
                    ? 'bg-[#F6BE18] text-[#141313] shadow-[4px_4px_0_#141313]'
                    : 'bg-[#141313] text-white/60 hover:text-white'
                )}
              >
                {isPeeking ? (
                  <div className="space-y-1">
                    <div className="font-telugu font-black text-3xl text-[#141313]">
                      {currentMovie.teluguTitle}
                    </div>
                    <div className="font-block text-2xl uppercase text-[#EC1276]">
                      {currentMovie.englishTitle} ({currentMovie.year})
                    </div>
                    <div className="text-xs font-bold text-[#141313]/80">
                      Hero: {currentMovie.hero} • Director: {currentMovie.director}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <div className="text-3xl">🔒</div>
                    <div className="font-black text-sm uppercase tracking-wider text-[#F6BE18]">
                      PRESS AND HOLD TO PEEK MOVIE
                    </div>
                    <div className="text-[10px] text-white/50">
                      Releasing immediately hides it
                    </div>
                  </div>
                )}
              </div>
            </div>

            <AcampButton onClick={handleStartTurn} variant="green" size="lg" fullWidth>
              ⏱ Memorized! Start Timer &amp; Act
            </AcampButton>

          </DieCutCard>
        </div>
      )}


      {/* =========================================================================
          ACTIVE ACTING TIMER SCREEN
          ========================================================================= */}
      {phase === 'acting' && (
        <div className="max-w-2xl mx-auto space-y-6 text-center">
          
          <div className="flex items-center justify-between">
            <span className="font-black text-xs uppercase bg-[#141313] text-[#F6BE18] px-3 py-1 rounded-lg">
              ACTOR: {activeTeamTitle}
            </span>
            <div className="bg-[#EC1276] text-white font-mono font-black text-xl px-4 py-1.5 rounded-xl border-2 border-[#141313]">
              ⏱ {timeLeft}s LEFT
            </div>
          </div>

          <DieCutCard className="p-8 space-y-6 bg-white">
            
            <div className="text-xs font-black uppercase text-[#141313]/60">
              ACT WITHOUT TALKING OR MAKING SOUNDS!
            </div>

            {/* Secret Card for Actor (Small reminder button) */}
            <div
              onMouseDown={() => setIsPeeking(true)}
              onMouseUp={() => setIsPeeking(false)}
              onTouchStart={() => setIsPeeking(true)}
              onTouchEnd={() => setIsPeeking(false)}
              className="bg-[#F4F1EA] border-2 border-dashed border-[#141313] rounded-xl p-3 text-xs font-bold text-center cursor-pointer select-none"
            >
              {isPeeking ? (
                <span className="text-[#EC1276] font-black text-base">
                  🎬 {currentMovie.englishTitle} ({currentMovie.year})
                </span>
              ) : (
                <span>🔒 Forgot the name? Hold here to peek</span>
              )}
            </div>

            <div className="font-block text-6xl text-[#141313] animate-pulse">
              🤫 ACTING IN PROGRESS
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <AcampButton
                onClick={() => handleFinishTurn(false)}
                variant="magenta"
                size="lg"
                fullWidth
              >
                ✕ Time Up / Skip
              </AcampButton>
              <AcampButton
                onClick={() => handleFinishTurn(true)}
                variant="green"
                size="lg"
                fullWidth
              >
                ✓ Guessed Correctly! (+1)
              </AcampButton>
            </div>

          </DieCutCard>
        </div>
      )}


      {/* =========================================================================
          TURN SUMMARY SCREEN
          ========================================================================= */}
      {phase === 'turn-summary' && (
        <div className="max-w-xl mx-auto space-y-6 text-center">
          <DieCutCard className="p-8 space-y-6">
            
            <div className="text-4xl">
              {lastTurnWon ? '🎉' : '⏳'}
            </div>

            <h3 className="font-block text-4xl uppercase text-[#141313]">
              {lastTurnWon ? 'POINT SCORED!' : 'TURN COMPLETED'}
            </h3>

            <div className="bg-[#EAE6DF] border-2 border-[#141313] rounded-xl p-4">
              <div className="text-xs font-bold uppercase text-[#141313]/70">THE MOVIE WAS:</div>
              <div className="font-telugu font-black text-2xl text-[#141313] mt-1">
                {currentMovie.teluguTitle}
              </div>
              <div className="font-block text-xl uppercase text-[#EC1276]">
                {currentMovie.englishTitle} ({currentMovie.year})
              </div>
            </div>

            <div className="flex items-center justify-around bg-white border-2 border-[#141313] rounded-xl p-3 font-mono font-bold">
              <div>{teamAName}: {teamAScore} pts</div>
              <div className="text-gray-400">|</div>
              <div>{teamBName}: {teamBScore} pts</div>
            </div>

            <AcampButton onClick={handleNextTurn} variant="yellow" size="lg" fullWidth>
              Next Turn →
            </AcampButton>

          </DieCutCard>
        </div>
      )}


      {/* =========================================================================
          WINNER DECLARATION SCREEN
          ========================================================================= */}
      {phase === 'winner' && (
        <div className="max-w-xl mx-auto space-y-6 text-center">
          <ResultConfetti />

          <div className="space-y-2">
            <span className="bg-[#F6BE18] text-[#141313] font-black text-xs uppercase px-4 py-1.5 rounded-full border-2 border-[#141313]">
              TOURNAMENT COMPLETE!
            </span>
            <h2 className="font-block text-5xl sm:text-6xl uppercase text-[#141313]">
              {teamAScore > teamBScore
                ? `${teamAName} WINS!`
                : teamBScore > teamAScore
                ? `${teamBName} WINS!`
                : 'IT IS A TIE!'}
            </h2>
          </div>

          <DieCutCard className="p-8 space-y-6">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#FFF9E6] border-2 border-[#141313] p-4 rounded-xl shadow-[3px_3px_0_#141313]">
                <div className="font-black text-xs uppercase">{teamAName}</div>
                <div className="font-mono text-4xl font-black text-[#141313] mt-1">{teamAScore}</div>
                <div className="text-[10px] font-bold text-gray-500">POINTS</div>
              </div>

              <div className="bg-[#FCE8F3] border-2 border-[#141313] p-4 rounded-xl shadow-[3px_3px_0_#141313]">
                <div className="font-black text-xs uppercase">{teamBName}</div>
                <div className="font-mono text-4xl font-black text-[#EC1276] mt-1">{teamBScore}</div>
                <div className="text-[10px] font-bold text-gray-500">POINTS</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <AcampButton onClick={handleStartGame} variant="yellow" size="lg" fullWidth>
                🔄 Play Rematch
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
