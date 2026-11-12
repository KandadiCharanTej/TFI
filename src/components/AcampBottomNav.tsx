'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gamepad2, Radio, User } from 'lucide-react';
import clsx from 'clsx';
import { soundManager } from '@/utils/audio';

export function AcampBottomNav() {
  const pathname = usePathname();

  const items = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Games', href: '/games', icon: Gamepad2 },
    { label: 'Rooms', href: '/rooms', icon: Radio },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-2 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-md bg-white border-[3px] border-[#141313] rounded-2xl shadow-[0_4px_0_#141313] p-1.5 flex items-center justify-around">
      {items.map(item => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => soundManager.playClick(600)}
            className={clsx(
              'flex-1 py-1.5 flex flex-col items-center justify-center rounded-xl transition-all',
              isActive
                ? 'bg-[#F6BE18] text-[#141313] font-black border-[2px] border-[#141313] shadow-[2px_2px_0_#141313]'
                : 'text-[#141313]/80 font-bold hover:bg-[#F4F1EA]'
            )}
          >
            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] uppercase tracking-wider mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
