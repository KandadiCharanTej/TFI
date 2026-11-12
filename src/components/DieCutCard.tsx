import React, { ReactNode } from 'react';
import clsx from 'clsx';

interface DieCutCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export function DieCutCard({
  children,
  className,
  onClick,
  hoverEffect = true,
}: DieCutCardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-[#FFFFFF] border-[3px] border-[#141313] rounded-2xl relative',
        'shadow-[0_0_0_5px_#FFFFFF,0_0_0_7px_#141313,6px_8px_0_5px_rgba(20,19,19,0.18)]',
        hoverEffect && 'transition-transform duration-150 hover:-translate-y-1 hover:rotate-[-0.5deg]',
        onClick && 'cursor-pointer active:translate-y-1',
        className
      )}
    >
      {children}
    </div>
  );
}

