'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { DieCutCard } from '@/components/DieCutCard';
import { AcampButton } from '@/components/AcampButton';
import { HeroFanbaseBar } from '@/components/HeroFanbaseBar';
import { GraffitiSmiley, StarSparkle, StreetCrown, LightningBolt } from '@/components/StreetDecorations';
import { useUser } from '@/utils/userContext';
import { FANBASE_LIST, TELUGU_CINEMA_DATABASE } from '@/data/teluguCinemaDatabase';
import { soundManager } from '@/utils/audio';
import { Play, Users, Trophy, Sparkles, Flame, ShieldAlert, ArrowRight, Gavel, HelpCircle, Eye } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { profile } = useUser();
  const activeFan = FANBASE_LIST.find(f => f.id === profile.fanIdentity) || FANBASE_LIST[0];

  // Quick mini-widget state for live interactive cards on homepage
  const [transifyIdx, setTransifyIdx] = useState(0);
  const [charadesPeek, setCharadesPeek] = useState(false);
  const [fhIdx, setFhIdx] = useState(0);
  const [demoBidCr, setDemoBidCr] = useState(25);
  const [roomCodeInput, setRoomCodeInput] = useState('');

  const transifySamples = [
    { q: '"Wife In Home, Lover In Kitchen"', a: 'Intlo Illalu Vantintlo Priyuralu' },
    { q: '"The Federal Rogue / Street Goon"', a: 'Pokiri (Superstar Bob)' },
    { q: '"What Happened To This Municipal City?"', a: 'Ee Nagaraniki Emaindi (ENE)' },
    { q: '"Did You Think I Am A Rose? I Am Burning Wildfire!"', a: 'Pushpa: The Rise (Allu Arjun)' },
    { q: '"Running Competition Horse"', a: 'Race Gurram (Kill Bill Pandey)' },
  ];

  const foreheadSamples = [
    { hint: 'RACE GURRAM • BRAHMI', title: 'KILL BILL PANDEY' },
    { hint: 'SVSC • PRAKASH RAJ', title: 'RELANGI MAVAYYA' },
    { hint: 'ADHURS • NTR & BRAHMI', title: 'BHATTU & CHARI' },
    { hint: 'VENKY • WASHINGTON DC', title: 'GAJALA SOFTWARE' },
  ];

  const handleNextTransify = () => {
    soundManager.playClick(680);
    setTransifyIdx((transifyIdx + 1) % transifySamples.length);
  };

  const handleNextForehead = (correct: boolean) => {
    if (correct) soundManager.playCorrect();
    else soundManager.playPass();
    setFhIdx((fhIdx + 1) % foreheadSamples.length);
  };

  const handleBumpBid = (amt: number) => {
    soundManager.playBid();
    setDemoBidCr(prev => prev + amt);
  };

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCodeInput.trim()) return;
    router.push(`/rooms?code=${roomCodeInput.trim().toUpperCase()}`);
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-8 pt-4 pb-16 flex flex-col justify-between max-w-6xl mx-auto space-y-10">
      
      {/* =========================================================================
          HERO CENTERPIECE DIE-CUT STICKER LOGO (ACAMP OVERFLOW 1:1 REPLICATION)
          ========================================================================= */}
      <section className="relative w-full text-center pt-2">
        
        {/* Tarak Character Sticker (Left Flank) */}
        <div className="hidden lg:block absolute -left-4 xl:left-2 top-6 w-48 xl:w-56 pointer-events-none z-20 select-none">
          <img
            src="/images/characters/tarak.png"
            alt="Young Tiger Tarak"
            className="w-full h-auto drop-shadow-[6px_8px_0_#141313] -rotate-6 hover:rotate-0 transition-transform duration-300"
          />
          <div className="bg-[#F6BE18] text-[#141313] font-black text-[10px] uppercase px-2 py-0.5 rounded border border-[#141313] shadow-[2px_2px_0_#141313] inline-block -rotate-3 mt-1">
            🐅 YOUNG TIGER • TARAK
          </div>
        </div>

        {/* Darling Character Sticker (Right Flank) */}
        <div className="hidden lg:block absolute -right-4 xl:right-2 top-6 w-48 xl:w-56 pointer-events-none z-20 select-none">
          <img
            src="/images/characters/darling.png"
            alt="Rebel Star Darling"
            className="w-full h-auto drop-shadow-[6px_8px_0_#141313] rotate-6 hover:rotate-0 transition-transform duration-300"
          />
          <div className="bg-[#EC1276] text-white font-black text-[10px] uppercase px-2 py-0.5 rounded border border-[#141313] shadow-[2px_2px_0_#141313] inline-block rotate-3 mt-1">
            🦖 REBEL STAR • DARLING
          </div>
        </div>

        {/* Floating Doodles around Logo */}
        <div className="relative inline-block px-4 sm:px-12 py-2">
          {/* Top-Left Starburst */}
          <div className="absolute -top-6 -left-2 sm:left-2 z-30 drop-shadow-[2px_3px_0_#141313]">
            <StarSparkle className="w-16 h-16 sm:w-24 sm:h-24" />
          </div>

          {/* Top-Right Street Crown */}
          <div className="absolute -top-12 right-0 sm:right-4 z-30">
            <StreetCrown className="w-20 h-20 sm:w-28 sm:h-28" />
          </div>

          {/* DIE-CUT STICKER MASSIVE LOCKUP */}
          <div className="relative inline-block select-none">
            {/* Top Arched Yellow Block ("TFI & PITCH") */}
            <div className="inline-block bg-[#F6BE18] border-[5px] border-[#141313] px-6 sm:px-14 pt-3 pb-6 sm:pb-8 rounded-[28px] shadow-[0_0_0_6px_#FFFFFF,0_0_0_10px_#141313] -rotate-2">
              <h1 className="font-block text-5xl sm:text-8xl md:text-9xl uppercase leading-none tracking-tight text-[#141313]">
                TFI &amp; PITCH
              </h1>
            </div>

            {/* Overlapping Magenta Brush Script ("OVERFLOW!") */}
            <div className="relative -mt-8 sm:-mt-12 rotate-[-3deg]">
              <div className="inline-flex items-center justify-center bg-[#141313] px-5 sm:px-10 py-2 sm:py-3 rounded-[34px] shadow-[0_0_0_6px_#FFFFFF,0_0_0_9px_#141313,8px_12px_0_#141313]">
                {/* Laughing Comic Face inside the O */}
                <span className="inline-flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-[#EC1276] border-4 border-[#141313] mr-2 shrink-0">
                  <span className="w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-[#141313] flex items-center justify-center font-black text-xs sm:text-base text-[#141313]">
                    😆
                  </span>
                </span>
                <span className="font-brush text-4xl sm:text-7xl md:text-8xl text-[#EC1276] tracking-wide drop-shadow-[4px_5px_0_#000000]">
                  VERFLOW!
                </span>
              </div>
            </div>
          </div>

          {/* Bottom-Right Pink Spray Lightning */}
          <div className="absolute -bottom-8 -right-2 sm:right-6 z-20">
            <LightningBolt className="w-14 h-14 sm:w-20 sm:h-20" />
          </div>
        </div>

        {/* Hand-Drawn Pink Oval Banner (Tagline) */}
        <div className="mt-5 flex flex-col items-center justify-center gap-2">
          <div className="relative inline-block px-8 py-2">
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 320 70"
              fill="none"
              preserveAspectRatio="none"
            >
              <ellipse cx="160" cy="35" rx="152" ry="26" stroke="#EC1276" strokeWidth="3.5" transform="rotate(-1.5 160 35)" />
              <path d="M95 6 L215 4" stroke="#EC1276" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="font-block text-2xl sm:text-4xl text-[#141313] tracking-wider uppercase">
              CINEMA • FRIENDS • FUN
            </span>
          </div>

          {/* Active Fanbase Dialogue Pill */}
          <div className="bg-[#EC1276] text-white font-black text-xs sm:text-sm uppercase tracking-wider px-5 py-1.5 -rotate-1 shadow-[3px_3px_0_#141313] border-2 border-[#141313] rounded-lg">
            <span>{activeFan.icon} {activeFan.name}: "{activeFan.dialogue}"</span>
          </div>
        </div>

      </section>


      {/* =========================================================================
          FANBASE STICKER SLAP STRIP
          ========================================================================= */}
      <section className="w-full">
        <HeroFanbaseBar />
      </section>


      {/* =========================================================================
          PRIMARY PLAY ACTIONS: "PLAY TOGETHER" VS "PLAY ONLINE"
          ========================================================================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pass-and-Play Single Device Hub */}
        <DieCutCard className="p-6 bg-gradient-to-br from-white to-[#F4F1EA] flex flex-col justify-between overflow-hidden relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="bg-[#F6BE18] text-[#141313] text-xs font-black uppercase px-3 py-1 rounded-md border border-[#141313]">
                  📱 SINGLE-DEVICE MODE
                </span>
                <span className="font-mono text-xs font-bold text-[#141313]/60">OFFLINE READY</span>
              </div>
              <h2 className="font-block text-3xl sm:text-4xl text-[#141313] uppercase leading-tight">
                PLAY WITH FRIENDS
              </h2>
              <p className="text-sm font-semibold text-[#141313]/80">
                Sitting together in room or college canteen? Pass one phone around for Dumb Charades, Head Set Go, Transify, or Pass-and-Play Auction!
              </p>
            </div>
            
            {/* Natural Star Nani Character Sticker */}
            <div className="w-24 sm:w-32 shrink-0 self-center sm:self-auto select-none">
              <img
                src="/images/characters/nani.png"
                alt="Natural Star Nani"
                className="w-full h-auto drop-shadow-[4px_6px_0_#141313] rotate-3 hover:rotate-0 transition-transform"
              />
              <div className="text-center font-black text-[9px] uppercase bg-white border border-[#141313] rounded px-1 mt-0.5 shadow-[1px_1px_0_#141313]">
                🏏 NATURAL STAR
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/games" className="flex-1">
              <AcampButton variant="yellow" size="lg" fullWidth>
                🎮 Browse 5 Games
              </AcampButton>
            </Link>
            <Link href="/games/head-set-go">
              <AcampButton variant="white" size="lg">
                ⚡ Quick Play
              </AcampButton>
            </Link>
          </div>
        </DieCutCard>

        {/* Online Multiplayer Hub */}
        <DieCutCard className="p-6 bg-gradient-to-br from-white to-[#EAE6DF] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="bg-[#00E5FF] text-[#141313] text-xs font-black uppercase px-3 py-1 rounded-md border border-[#141313]">
                🌐 ONLINE MULTIPLAYER
              </span>
              <span className="font-mono text-xs font-bold text-[#EC1276]">REALTIME BIDDING</span>
            </div>
            <h2 className="font-block text-3xl sm:text-4xl text-[#141313] uppercase leading-tight">
              BOX OFFICE AUCTION ROOM
            </h2>
            <p className="text-sm font-semibold text-[#141313]/80 mt-1">
              Create a custom room with a 5-letter code. Friends join on their own phones with a virtual ₹100 Cr purse!
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <form onSubmit={handleJoinByCode} className="flex gap-2">
              <input
                type="text"
                placeholder="ENTER 5-LETTER CODE (e.g. TFI88)"
                value={roomCodeInput}
                onChange={e => setRoomCodeInput(e.target.value.toUpperCase())}
                maxLength={6}
                className="flex-1 bg-white border-[2.5px] border-[#141313] px-3 py-2.5 rounded-xl font-mono font-bold text-sm uppercase placeholder:normal-case shadow-[3px_3px_0_#141313] focus:outline-none focus:bg-[#FFF9E6]"
              />
              <AcampButton type="submit" variant="cyan" size="md">
                Join
              </AcampButton>
            </form>

            <div className="flex gap-2">
              <Link href="/rooms" className="flex-1">
                <AcampButton variant="magenta" size="md" fullWidth>
                  🔨 Create Live Auction Room
                </AcampButton>
              </Link>
            </div>
          </div>
        </DieCutCard>

      </section>


      {/* =========================================================================
          FLAGSHIP FEATURE: TFI BOX OFFICE AUCTION SHOWCASE
          ========================================================================= */}
      <section className="w-full">
        <DieCutCard className="p-6 bg-[#F6BE18] border-[4px] border-[#141313] relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-7 lg:col-span-6 space-y-2 text-left z-10">
              <div className="inline-flex items-center gap-2 bg-[#141313] text-[#F6BE18] px-3 py-1 rounded-lg text-xs font-black uppercase">
                <Gavel size={15} />
                <span>FLAGSHIP TOURNAMENT GAME</span>
              </div>
              <h3 className="font-block text-4xl sm:text-5xl text-[#141313] uppercase leading-none">
                TFI BOX OFFICE AUCTION
              </h3>
              <p className="text-sm font-bold text-[#141313]/85">
                Every player gets a virtual purse (₹50 Cr - ₹200 Cr). Bid live against your friends on iconic Telugu cinema lots like Pokiri, Jersey, Athadu, and RRR!
              </p>
              <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs font-bold">
                <span className="bg-white px-2 py-0.5 rounded border border-[#141313]">40% Box Office</span>
                <span className="bg-white px-2 py-0.5 rounded border border-[#141313]">30% Talk/Word-of-Mouth</span>
                <span className="bg-white px-2 py-0.5 rounded border border-[#141313]">30% Cult Value</span>
                <span className="bg-[#EC1276] text-white px-2 py-0.5 rounded border border-[#141313]">⚠️ Beware Meme Traps!</span>
              </div>
            </div>

            <div className="md:col-span-5 lg:col-span-3 flex flex-col gap-3 z-10">
              <Link href="/games/box-office-auction/pass-and-play">
                <AcampButton variant="black" size="lg" fullWidth>
                  📱 Pass &amp; Play
                </AcampButton>
              </Link>
              <Link href="/rooms">
                <AcampButton variant="magenta" size="lg" fullWidth>
                  🌐 Online Room
                </AcampButton>
              </Link>
            </div>

            {/* Character Graphic: Darling Prabhas - Box Office King */}
            <div className="hidden lg:flex lg:col-span-3 justify-center items-center relative">
              <div className="relative group">
                <div className="relative w-44 h-56 transition-transform duration-200 group-hover:scale-105">
                  <Image
                    src="/images/characters/darling.png"
                    alt="Darling Prabhas"
                    fill
                    className="object-contain drop-shadow-[5px_5px_0_#141313]"
                    sizes="176px"
                  />
                </div>
                <div className="absolute -bottom-2 -left-2 bg-[#EC1276] text-white font-block text-xs uppercase px-2.5 py-1 rounded-md border-2 border-[#141313] shadow-[2px_2px_0_#141313] -rotate-3 whitespace-nowrap">
                  🦖 BOX OFFICE SULTAN
                </div>
              </div>
            </div>

          </div>
        </DieCutCard>
      </section>


      {/* =========================================================================
          THE FIVE PLAYABLE TELUGU CINEMA GAMES (GENUINELY PLAYABLE)
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#141313]/20 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎬</span>
            <h3 className="font-block text-2xl sm:text-3xl uppercase tracking-wide">
              THE 5 CINEMA GAMES
            </h3>
          </div>
          <span className="text-xs font-black uppercase bg-white border border-[#141313] px-2.5 py-1 rounded-lg">
            100% TELUGU CINEMA
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* GAME 1: HEAD SET GO */}
          <DieCutCard className="p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-[#F6BE18] text-[#141313] text-[10px] font-black uppercase px-2 py-0.5 rounded border border-[#141313]">
                  GAME 01 • FOREHEAD
                </span>
                <span className="font-mono text-xs font-bold text-[#141313]/60">GYRO / SWIPE</span>
              </div>
              <h4 className="font-block text-2xl uppercase text-[#141313]">HEAD SET GO!</h4>
              <p className="text-xs font-semibold text-[#141313]/70 mt-0.5">
                Hold phone horizontally on forehead. Friends act out clues; tilt down or tap right for correct!
              </p>

              {/* Live Mini Preview */}
              <div className="mt-3 bg-[#141313] text-white rounded-xl p-3 text-center border-2 border-[#141313]">
                <div className="text-[10px] font-bold text-[#F6BE18] uppercase">
                  {foreheadSamples[fhIdx].hint}
                </div>
                <div className="font-block text-xl tracking-wide text-white mt-0.5">
                  {foreheadSamples[fhIdx].title}
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNextForehead(false)}
                  className="acamp-btn bg-[#EC1276] text-white font-black text-xs uppercase py-1.5 rounded-lg"
                >
                  ✕ Pass
                </button>
                <button
                  onClick={() => handleNextForehead(true)}
                  className="acamp-btn bg-[#00C853] text-white font-black text-xs uppercase py-1.5 rounded-lg"
                >
                  ✓ Correct
                </button>
              </div>
              <Link href="/games/head-set-go" className="block">
                <AcampButton variant="yellow" size="sm" fullWidth>
                  ▶ Launch Head Set Go
                </AcampButton>
              </Link>
            </div>
          </DieCutCard>

          {/* GAME 2: TRANSIFY */}
          <DieCutCard className="p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-[#EC1276] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded border border-[#141313]">
                  GAME 02 • 1 JUDGE + N
                </span>
                <span className="font-mono text-xs font-bold text-[#141313]/60">TIMED DEC</span>
              </div>
              <h4 className="font-block text-2xl uppercase text-[#141313]">TRANSIFY DECODER</h4>
              <p className="text-xs font-semibold text-[#141313]/70 mt-0.5">
                Judge reads funny literal English translation; friends shout Telugu movie title!
              </p>

              {/* Live Mini Preview */}
              <div className="mt-3 bg-[#EAE6DF] rounded-xl p-3 text-center border-2 border-[#141313]">
                <div className="text-[10px] font-bold uppercase text-[#EC1276]">ENGLISH TWIST PROMPT</div>
                <div className="font-extrabold text-xs text-[#141313] mt-0.5 min-h-[32px] flex items-center justify-center">
                  {transifySamples[transifyIdx].q}
                </div>
                <div className="border-t border-dashed border-[#141313]/30 my-1.5"></div>
                <div className="text-[11px] font-black text-[#141313] bg-[#F6BE18] px-2 py-0.5 rounded border border-[#141313] inline-block">
                  Ans: {transifySamples[transifyIdx].a}
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <button
                onClick={handleNextTransify}
                className="acamp-btn w-full bg-[#141313] text-[#F6BE18] font-black text-xs uppercase py-1.5 rounded-lg"
              >
                ↻ Next Demo Clue
              </button>
              <Link href="/games/transify" className="block">
                <AcampButton variant="magenta" size="sm" fullWidth>
                  ▶ Launch Transify
                </AcampButton>
              </Link>
            </div>
          </DieCutCard>

          {/* GAME 3: DUMB CHARADES */}
          <DieCutCard className="p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-[#00C853] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded border border-[#141313]">
                  GAME 03 • TEAM VS TEAM
                </span>
                <span className="font-mono text-xs font-bold text-[#141313]/60">PEEK SHUTTER</span>
              </div>
              <h4 className="font-block text-2xl uppercase text-[#141313]">DUMB CHARADES</h4>
              <p className="text-xs font-semibold text-[#141313]/70 mt-0.5">
                Team A vs Team B. Secret movie title is revealed only while pressing privacy shutter!
              </p>

              {/* Live Mini Preview with Hold-to-Peek */}
              <div
                onMouseDown={() => setCharadesPeek(true)}
                onMouseUp={() => setCharadesPeek(false)}
                onTouchStart={() => setCharadesPeek(true)}
                onTouchEnd={() => setCharadesPeek(false)}
                className="mt-3 bg-[#F4F1EA] rounded-xl p-3 text-center border-2 border-dashed border-[#141313] cursor-pointer select-none"
              >
                <div className="text-[10px] font-bold uppercase text-[#141313]/70">PRIVACY SHUTTER</div>
                <div className="font-extrabold text-sm text-[#141313] mt-1">
                  {charadesPeek ? '🎬 RANGASTHALAM (2018)' : '🔒 HOLD TO PEEK MOVIE'}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Link href="/games/dumb-charades" className="block">
                <AcampButton variant="green" size="sm" fullWidth>
                  ▶ Launch Dumb Charades
                </AcampButton>
              </Link>
            </div>
          </DieCutCard>

          {/* GAME 4: EMOJI CINEMA */}
          <DieCutCard className="p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-[#00E5FF] text-[#141313] text-[10px] font-black uppercase px-2 py-0.5 rounded border border-[#141313]">
                  GAME 04 • QUIZ TRIVIA
                </span>
                <span className="font-mono text-xs font-bold text-[#141313]/60">4 CHOICES</span>
              </div>
              <h4 className="font-block text-2xl uppercase text-[#141313]">EMOJI CINEMA</h4>
              <p className="text-xs font-semibold text-[#141313]/70 mt-0.5">
                Decode iconic Telugu movies from emoji puzzles with explanations on movie trivia!
              </p>

              {/* Live Mini Preview */}
              <div className="mt-3 bg-white rounded-xl p-3 text-center border-2 border-[#141313]">
                <div className="text-2xl tracking-widest my-1">
                  🪵 🪓 🧔 🔴
                </div>
                <div className="text-[11px] font-bold text-[#141313]/70">
                  Can you guess the 2021 Allu Arjun blockbuster?
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Link href="/games/emoji-cinema" className="block">
                <AcampButton variant="cyan" size="sm" fullWidth>
                  ▶ Launch Emoji Cinema
                </AcampButton>
              </Link>
            </div>
          </DieCutCard>

          {/* GAME 5: BOX OFFICE AUCTION */}
          <DieCutCard className="p-4 md:col-span-2 flex flex-col justify-between bg-gradient-to-r from-white to-[#FFF9E6]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-[#EC1276] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded border border-[#141313]">
                  GAME 05 • FLAGSHIP TOURNAMENT
                </span>
                <span className="font-mono text-xs font-bold text-[#141313]/60">PASS &amp; PLAY + ONLINE</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-block text-2xl uppercase text-[#141313]">BOX OFFICE AUCTION</h4>
                  <p className="text-xs font-semibold text-[#141313]/70 mt-0.5">
                    Compete to build the highest-grossing collection. ₹100 Cr purse per player!
                  </p>
                </div>
                {/* Live interactive bid demo */}
                <div className="bg-[#F6BE18] border-2 border-[#141313] rounded-xl px-3 py-1.5 flex items-center gap-3">
                  <div>
                    <div className="text-[9px] font-black uppercase">LIVE BID LOT #01</div>
                    <div className="font-block text-lg">POKIRI (2006)</div>
                  </div>
                  <div className="font-block text-2xl text-[#EC1276]">₹{demoBidCr} CR</div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => handleBumpBid(5)}
                className="acamp-btn bg-[#EC1276] text-white font-black text-xs uppercase px-4 py-2 rounded-xl"
              >
                🔨 Tap +₹5 Cr Demo Bid
              </button>
              <Link href="/games/box-office-auction/pass-and-play" className="flex-1">
                <AcampButton variant="yellow" size="sm" fullWidth>
                  Single-Device Pass &amp; Play
                </AcampButton>
              </Link>
              <Link href="/rooms" className="flex-1">
                <AcampButton variant="black" size="sm" fullWidth>
                  Multiplayer Room
                </AcampButton>
              </Link>
            </div>
          </DieCutCard>

        </div>
      </section>


      {/* =========================================================================
          FOOTER BRAND SIGNATURE
          ========================================================================= */}
      <footer className="w-full text-center border-t-2 border-[#141313]/20 pt-6 pb-4">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-[#141313]/70">
          <span>TFI &amp; PITCH © 2026</span>
          <span>•</span>
          <span>TELUGU CULTURAL GAMING PLATFORM</span>
          <span>•</span>
          <span>EDITION 01: ACAMP OVERFLOW</span>
        </div>
      </footer>

    </div>
  );
}

