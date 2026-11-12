import React from 'react';

export const CinemaClapperIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="4" y="14" width="40" height="28" rx="3" fill="#171717" stroke="#171717" strokeWidth="3" />
    <rect x="6" y="16" width="36" height="24" rx="2" fill="#FFCB45" />
    <path d="M4 14L40 6L44 14L4 14Z" fill="#171717" stroke="#171717" strokeWidth="3" />
    <path d="M12 12L16 6" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
    <path d="M22 10L26 4" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
    <path d="M32 8L36 2" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
    <circle cx="24" cy="28" r="6" fill="#FF704D" stroke="#171717" strokeWidth="2" />
    <path d="M22 25L28 28L22 31V25Z" fill="#FFFFFF" />
  </svg>
);

export const TeluguHeroIcon: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Sunglasses Neo-Brutalist Icon */}
    <circle cx="32" cy="32" r="28" fill="#FFCB45" stroke="#171717" strokeWidth="4" />
    {/* Cool Raybans */}
    <rect x="12" y="24" width="16" height="12" rx="3" fill="#171717" stroke="#171717" strokeWidth="2" />
    <rect x="36" y="24" width="16" height="12" rx="3" fill="#171717" stroke="#171717" strokeWidth="2" />
    <path d="M28 27H36" stroke="#171717" strokeWidth="4" />
    <line x1="8" y1="26" x2="12" y2="28" stroke="#171717" strokeWidth="3" />
    <line x1="56" y1="26" x2="52" y2="28" stroke="#171717" strokeWidth="3" />
    {/* Big Confident Smile / Mustache */}
    <path d="M20 44C26 50 38 50 44 44" stroke="#171717" strokeWidth="4" strokeLinecap="round" />
    <path d="M24 39C28 36 36 36 40 39" stroke="#171717" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const AuctionGavelIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="18" y="6" width="12" height="20" rx="3" transform="rotate(45 18 6)" fill="#FF704D" stroke="#171717" strokeWidth="3" />
    <rect x="22" y="20" width="6" height="22" rx="2" transform="rotate(-45 22 20)" fill="#FFCB45" stroke="#171717" strokeWidth="3" />
    <rect x="4" y="40" width="40" height="6" rx="2" fill="#83CBA2" stroke="#171717" strokeWidth="3" />
  </svg>
);

export const CharadesMaskIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M8 14C8 28 16 38 24 38C32 38 40 28 40 14C40 10 32 6 24 6C16 6 8 10 8 14Z" fill="#CBB8F5" stroke="#171717" strokeWidth="3" />
    <ellipse cx="17" cy="18" rx="4" ry="2" fill="#171717" />
    <ellipse cx="31" cy="18" rx="4" ry="2" fill="#171717" />
    <path d="M18 28C21 32 27 32 30 28" stroke="#171717" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

