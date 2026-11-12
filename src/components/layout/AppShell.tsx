'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gamepad2, Users, User } from 'lucide-react';
import { CinemaClapperIcon } from '@/components/ui/Illustrations';

export const AppHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-[#FFF8E9] border-b-3 border-[#171717] px-4 py-3 shadow-[0_2px_0_#171717]">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <CinemaClapperIcon className="w-8 h-8 group-hover:rotate-6 transition-transform" />
          <div>
            <span className="text-xl font-black tracking-tight text-[#171717] block leading-none">
              TFI <span className="text-[#FF704D]">&</span> PITCH
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#171717]/70">
              తెలుగు సినిమా గేమ్స్
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/games"
            className="hidden sm:inline-flex px-3 py-1 bg-[#FFCB45] border-2 border-[#171717] rounded-lg font-black text-xs shadow-[2px_2px_0_#171717] hover:translate-x-0.5 hover:translate-y-0.5"
          >
            PLAY NOW 🍿
          </Link>
          <Link
            href="/profile"
            className="w-9 h-9 bg-[#CBB8F5] border-2 border-[#171717] rounded-full flex items-center justify-center font-black text-sm shadow-[2px_2px_0_#171717]"
          >
            <User className="w-4 h-4 text-[#171717]" />
          </Link>
        </div>
      </div>
    </header>
  );
};

const BottomNavContent: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Games', href: '/games', icon: Gamepad2 },
    { label: 'Rooms', href: '/rooms', icon: Users },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className="flex justify-around items-center">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              isActive
                ? 'bg-[#FFCB45] border-2 border-[#171717] shadow-[2px_2px_0_#171717] -translate-y-1'
                : 'text-[#171717]/70 hover:text-[#171717]'
            }`}
          >
            <Icon className="w-5 h-5 stroke-[2.5]" />
            <span className="text-[10px] font-black uppercase mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-3 border-[#171717] px-2 py-2 sm:hidden shadow-[0_-2px_0_#171717]">
      <Suspense fallback={<div className="h-10" />}>
        <BottomNavContent />
      </Suspense>
    </nav>
  );
};
