'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/utils/userContext';
import { FANBASE_LIST } from '@/data/teluguCinemaDatabase';
import { Film, Users, Trophy, User, Volume2, VolumeX, Sparkles } from 'lucide-react';
import clsx from 'clsx';

export function AcampNavbar() {
  const pathname = usePathname();
  const { profile, toggleSound } = useUser();
  const activeFan = FANBASE_LIST.find(f => f.id === profile.fanIdentity) || FANBASE_LIST[0];

  const navLinks = [
    { label: 'HOME', href: '/' },
    { label: 'GAMES', href: '/games' },
    { label: 'ROOMS', href: '/rooms' },
    { label: 'AUCTION', href: '/games/box-office-auction' },
    { label: 'PROFILE', href: '/profile' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#EAE6DF]/90 backdrop-blur-md border-b-[3px] border-[#141313]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Stamp Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-[#F6BE18] border-[2.5px] border-[#141313] flex items-center justify-center font-black text-lg shadow-[2px_2px_0_#141313] group-hover:rotate-6 transition-transform">
            🎬
          </div>
          <div className="flex flex-col">
            <span className="font-block text-2xl sm:text-3xl text-[#141313] tracking-wide leading-none">
              TFI &amp; PITCH
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#EC1276]">
              CINEMA • FRIENDS • FUN
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map(link => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'px-3.5 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider border-[2px] transition-all',
                  isActive
                    ? 'bg-[#141313] text-[#F6BE18] border-[#141313] shadow-[3px_3px_0_#141313]'
                    : 'bg-white text-[#141313] border-[#141313] shadow-[2px_2px_0_#141313] hover:-translate-y-0.5'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Controls: Fanbase Pill & Sound Toggle */}
        <div className="flex items-center gap-2">
          {/* Active Fan Avatar Pill */}
          <Link
            href="/profile"
            className="flex items-center gap-1.5 bg-white border-[2px] border-[#141313] px-2.5 py-1 rounded-xl shadow-[2px_2px_0_#141313] hover:-translate-y-0.5 transition-transform"
            title="Click to change fanbase identity in profile"
          >
            <span>{activeFan.icon}</span>
            <span className="font-mono text-xs font-bold text-[#141313] hidden sm:inline">
              {profile.name || activeFan.id}
            </span>
          </Link>

          {/* Audio SFX Toggle */}
          <button
            onClick={toggleSound}
            className={clsx(
              'w-9 h-9 rounded-xl border-[2px] border-[#141313] flex items-center justify-center cursor-pointer shadow-[2px_2px_0_#141313] transition-all',
              profile.soundEnabled ? 'bg-[#00C853] text-[#141313]' : 'bg-white/80 text-gray-500'
            )}
            title={profile.soundEnabled ? 'Sound FX Enabled (Click to Mute)' : 'Sound Muted (Click to Enable)'}
          >
            {profile.soundEnabled ? <Volume2 size={18} strokeWidth={2.5} /> : <VolumeX size={18} strokeWidth={2.5} />}
          </button>
        </div>
      </div>
    </header>
  );
}

