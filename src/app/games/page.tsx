'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DieCutCard } from '@/components/DieCutCard';
import { AcampButton } from '@/components/AcampButton';
import { Users, Clock, Flame, ShieldAlert, Sparkles, Gavel, Play, Shuffle } from 'lucide-react';
import clsx from 'clsx';

export default function GamesCataloguePage() {
  const [filter, setFilter] = useState<'all' | 'single' | 'team' | 'auction'>('all');

  const games = [
    {
      id: 'head-set-go',
      title: 'HEAD SET GO',
      teluguTitle: 'హెడ్ సెట్ గో!',
      tagline: 'Hold phone to forehead; friends act and shout clues!',
      type: 'Single-Device',
      category: 'single',
      players: '2+ Players',
      time: '60s - 180s',
      badgeColor: 'bg-[#F6BE18]',
      accentColor: '#F6BE18',
      description: 'One player places the phone on their forehead in landscape mode. Teammates give clues to guess the Telugu hero, character, dialogue, or movie. Tilt down or tap right for correct, tilt up or tap left to pass!',
      features: ['Landscape Forehead UI', 'Screen Wake Lock API', 'Touch & Gyroscope Tilt Controls', 'Telugu & English Clues'],
      href: '/games/head-set-go',
      buttonText: 'Play Head Set Go',
    },
    {
      id: 'transify',
      title: 'TRANSIFY',
      teluguTitle: 'ట్రాన్సిఫై',
      tagline: 'Guess Telugu movie titles from funny broken-English translations!',
      type: 'Single-Device',
      category: 'single',
      players: '3+ Players (1 Judge + Friends)',
      time: '60s - 120s',
      badgeColor: 'bg-[#EC1276]',
      accentColor: '#EC1276',
      description: 'One person acts as Judge holding the phone. Read hilarious literal English translations like "The Federal Rogue" (Pokiri) or "Wife In Home, Lover In Kitchen". Friends shout out the correct Telugu cinema title!',
      features: ['Judge Private Answer Shutter', 'Literal Titles, Dialogues & Memes', 'Immediate Card Advance', 'Live Score Tracking'],
      href: '/games/transify',
      buttonText: 'Play Transify',
    },
    {
      id: 'dumb-charades',
      title: 'DUMB CHARADES',
      teluguTitle: 'మూగ నాటకం (డంబ్ చారేడ్స్)',
      tagline: 'Act out Telugu blockbusters without uttering a single word!',
      type: 'Single-Device Team Game',
      category: 'team',
      players: '4+ Players (Team A vs Team B)',
      time: '60s - 90s per turn',
      badgeColor: 'bg-[#00C853]',
      accentColor: '#00C853',
      description: 'The quintessential Indian party game built for Telugu cinema lovers. Features an actor privacy shutter (hold to peek secret movie title) to ensure opposing teammates never see the card!',
      features: ['Hold-to-Peek Privacy Shutter', 'Team Scoreboard & Turn Switcher', 'Actor Handoff Screen', 'Curated Blockbusters to Cult Classics'],
      href: '/games/dumb-charades',
      buttonText: 'Play Dumb Charades',
    },
    {
      id: 'emoji-cinema',
      title: 'EMOJI CINEMA',
      teluguTitle: 'ఎమోజి సినిమా',
      tagline: 'Decode Telugu cinema classics from creative emoji combinations!',
      type: 'Single-Device Quiz',
      category: 'single',
      players: '1-6 Players',
      time: 'Untimed or 20s/Question',
      badgeColor: 'bg-[#00E5FF]',
      accentColor: '#00E5FF',
      description: 'Four emojis describe a memorable Telugu movie. Select the right answer from 4 choices and uncover delightful cinema trivia explaining the hidden meaning behind the emojis!',
      features: ['Visual Emoji Combinations', 'Instant Answer Feedback', 'Telugu Cinema Trivia Explanations', 'Streak & Accuracy Tracking'],
      href: '/games/emoji-cinema',
      buttonText: 'Play Emoji Cinema',
    },
    {
      id: 'box-office-auction',
      title: 'TFI BOX OFFICE AUCTION',
      teluguTitle: 'బాక్స్ ఆఫీస్ వేలంపాట',
      tagline: 'Build your dream ₹100 Cr Telugu movie collection through high-stakes bidding!',
      type: 'Single-Device & Online Multiplayer',
      category: 'auction',
      players: '2-10 Players',
      time: '10-20 Lots (~15 min)',
      badgeColor: 'bg-[#F6BE18]',
      accentColor: '#EC1276',
      description: 'The flagship game of TFI & Pitch! Receive virtual budgets (₹50 Cr - ₹200 Cr) and bid on legendary Telugu movie lots. Supports both Single-Device Pass-and-Play and Online Multiplayer Rooms with server-authoritative timers and anti-sniping rules!',
      features: ['Pass & Play (Single Phone)', 'Online Multiplayer Room Code', '40% BO + 30% Talk + 30% Cult Scoring', 'Synergy Combos & Meme Disaster Traps'],
      href: '/games/box-office-auction/pass-and-play',
      altHref: '/rooms',
      buttonText: 'Pass & Play Auction',
      altButtonText: 'Online Multiplayer Room',
    },
  ];

  const filteredGames = games.filter(g => {
    if (filter === 'all') return true;
    if (filter === 'single') return g.category === 'single';
    if (filter === 'team') return g.category === 'team';
    if (filter === 'auction') return g.category === 'auction';
    return true;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-6 space-y-8">
      
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-block bg-[#141313] text-[#F6BE18] font-black text-xs uppercase px-3.5 py-1 rounded-lg">
          5 OFFICIAL CINEMA PARTY GAMES
        </div>
        <h1 className="font-block text-5xl sm:text-7xl uppercase text-[#141313] tracking-tight">
          GAMES CATALOGUE
        </h1>
        <p className="text-sm sm:text-base font-bold text-[#141313]/80 max-w-xl mx-auto">
          Every game is built exclusively around Telugu cinema culture, dialogues, heroes, and memes.
        </p>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {[
            { id: 'all', label: 'All 5 Games' },
            { id: 'single', label: 'Single-Device' },
            { id: 'team', label: 'Team Party' },
            { id: 'auction', label: 'Box Office Auction' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={clsx(
                'border-[2px] border-[#141313] px-3.5 py-1.5 rounded-xl font-black text-xs uppercase cursor-pointer transition-all',
                filter === f.id
                  ? 'bg-[#141313] text-[#F6BE18] shadow-[3px_3px_0_#141313]'
                  : 'bg-white text-[#141313] shadow-[2px_2px_0_#141313] hover:bg-[#F4F1EA]'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Games List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGames.map((game, idx) => (
          <DieCutCard key={game.id} className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={clsx('text-[#141313] text-[11px] font-black uppercase px-2.5 py-0.5 rounded border border-[#141313]', game.badgeColor)}>
                  {game.type}
                </span>
                <span className="font-mono text-xs font-bold text-[#141313]/70">
                  {game.players}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <h3 className="font-block text-3xl sm:text-4xl uppercase text-[#141313]">
                  {game.title}
                </h3>
              </div>
              <div className="font-telugu text-sm font-bold text-[#EC1276]">
                {game.teluguTitle}
              </div>

              <p className="text-xs sm:text-sm font-bold text-[#141313]/85 mt-2">
                {game.tagline}
              </p>

              <p className="text-xs font-semibold text-[#141313]/70 mt-2 leading-relaxed">
                {game.description}
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {game.features.map(feat => (
                  <span key={feat} className="text-[10px] font-bold bg-[#EAE6DF] border border-[#141313]/40 px-2 py-0.5 rounded">
                    ✓ {feat}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link href={game.href} className="flex-1">
                <AcampButton variant={game.category === 'auction' ? 'yellow' : 'magenta'} size="md" fullWidth>
                  ▶ {game.buttonText}
                </AcampButton>
              </Link>
              {game.altHref && (
                <Link href={game.altHref} className="flex-1">
                  <AcampButton variant="black" size="md" fullWidth>
                    🌐 {game.altButtonText}
                  </AcampButton>
                </Link>
              )}
            </div>
          </DieCutCard>
        ))}
      </div>

    </div>
  );
}
