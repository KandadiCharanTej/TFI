'use client';

import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { soundManager, triggerHaptic } from '@/utils/audio';

interface AcampButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'yellow' | 'magenta' | 'black' | 'white' | 'green' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function AcampButton({
  children,
  variant = 'yellow',
  size = 'md',
  fullWidth = false,
  className,
  onClick,
  disabled,
  ...props
}: AcampButtonProps) {
  const variantStyles = {
    yellow: 'bg-[#F6BE18] text-[#141313] hover:bg-[#fed434]',
    magenta: 'bg-[#EC1276] text-white hover:bg-[#d40c66]',
    black: 'bg-[#141313] text-[#F6BE18] hover:bg-[#252424]',
    white: 'bg-white text-[#141313] hover:bg-[#f3f0ea]',
    green: 'bg-[#00C853] text-white hover:bg-[#00b34a]',
    cyan: 'bg-[#00E5FF] text-[#141313] hover:bg-[#00d0e8]',
  };

  const sizeStyles = {
    sm: 'text-xs font-black px-3 py-1.5 rounded-lg uppercase tracking-wider',
    md: 'text-sm font-black px-5 py-2.5 rounded-xl uppercase tracking-wider',
    lg: 'text-base sm:text-lg font-black px-6 py-3.5 rounded-2xl uppercase tracking-wider',
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    soundManager.playClick();
    triggerHaptic(35);
    if (onClick) onClick(e);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={clsx(
        'border-[2.5px] border-[#141313] shadow-[4px_4px_0_#141313]',
        'transition-all duration-100 select-none cursor-pointer',
        'active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#141313]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-[4px_4px_0_#141313]',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
