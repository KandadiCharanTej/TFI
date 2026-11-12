'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gamepad2, Users, User, Menu, Bell } from 'lucide-react';
import { ClapperboardDoodle, DoodleStar } from '@/components/ui/EditorialArt';

export const AppHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-[#FFF8E9] px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Left hamburger / menu */}
        <Link href="/profile" className="p-1 hover:bg-[#FFCB45]/30 rounded-lg text-[#171717]">
          <Menu className="w-5 h-5 stroke-[2.5]" />
        </Link>

        {/* Center Logo matching reference: small clapperboard + "TFI & Pitch" */}
        <Link href="/" className="flex items-center gap-1.5 group">
          <ClapperboardDoodle className="w-7 h-7 -rotate-6 transition-transform group-hover:rotate-0" />
          <span className="text-xl font-black tracking-tight text-[#171717]">
            TFI & Pitch
          </span>
        </Link>

        {/* Right notification bell */}
        <div className="relative">
          <button className="p-1 hover:bg-[#FFCB45]/30 rounded-lg text-[#171717]">
            <Bell className="w-5 h-5 stroke-[2.5]" />
          </button>
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF704D] rounded-full border border-[#171717]" />
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
    <div className="flex justify-around items-center max-w-md mx-auto">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center py-1 px-3 transition-transform ${
              isActive ? 'text-[#171717] scale-105 font-black' : 'text-[#171717]/60 font-bold hover:text-[#171717]'
            }`}
          >
            <div className={`p-1 rounded-xl ${isActive ? 'bg-[#FFCB45] border-2 border-[#171717] shadow-[1.5px_1.5px_0_#171717]' : ''}`}>
              <Icon className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFF8E9] border-t-2 border-[#171717] py-2 px-3 shadow-[0_-2px_0_#171717]">
      <Suspense fallback={<div className="h-10" />}>
        <BottomNavContent />
      </Suspense>
    </nav>
  );
};
