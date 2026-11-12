import React from 'react';

export function AcampBackgroundDecorations() {
  return (
    <>
      {/* Top-Left Golden Yellow Brush Swipe + Painted X (Exact Reference 1 Match) */}
      <svg
        className="fixed top-0 left-0 w-44 sm:w-72 pointer-events-none z-0 select-none opacity-80"
        viewBox="0 0 320 260"
        fill="none"
      >
        <path d="M-20 0 L260 0 L190 70 L240 85 L60 220 L20 190 L95 110 L-20 185 Z" fill="#F6BE18" />
        <path d="M-10 40 L210 -10 L140 120 L-10 140 Z" fill="#F6BE18" opacity="0.85" />
        {/* Black Brush X */}
        <path d="M22 145 L78 215 M85 152 L18 212" stroke="#141313" strokeWidth="14" strokeLinecap="round" />
      </svg>

      {/* Bottom-Left Hot Magenta Brush X + Halftone Dots (Exact Reference 1 Match) */}
      <svg
        className="fixed bottom-0 left-0 w-40 sm:w-64 pointer-events-none z-0 select-none opacity-75"
        viewBox="0 0 240 240"
        fill="none"
      >
        <path d="M-10 130 L150 250 M135 120 L-15 245" stroke="#EC1276" strokeWidth="40" strokeLinecap="round" />
        {/* Halftone Dot Ladder on Left Edge */}
        <g fill="#141313">
          <circle cx="16" cy="20" r="3.5" />
          <circle cx="34" cy="20" r="3.5" />
          <circle cx="16" cy="40" r="3.5" />
          <circle cx="34" cy="40" r="3.5" />
          <circle cx="16" cy="60" r="3.5" />
          <circle cx="34" cy="60" r="3.5" />
          <circle cx="16" cy="80" r="3.5" />
          <circle cx="34" cy="80" r="3.5" />
          <circle cx="16" cy="100" r="3.5" />
          <circle cx="34" cy="100" r="3.5" />
        </g>
      </svg>

      {/* Bottom-Right Golden Yellow Brush Swipe + White X (Exact Reference 1 Match) */}
      <svg
        className="fixed bottom-0 right-0 w-44 sm:w-72 pointer-events-none z-0 select-none opacity-80"
        viewBox="0 0 300 240"
        fill="none"
      >
        <path d="M320 40 L80 240 L320 240 Z" fill="#F6BE18" />
        <path d="M310 90 L130 240 L260 240 Z" fill="#F6BE18" />
        <path d="M210 155 L265 215 M270 155 L205 215" stroke="#EAE6DF" strokeWidth="14" strokeLinecap="round" />
      </svg>
    </>
  );
}

export function GraffitiSmiley({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="46" r="36" stroke="#141313" strokeWidth="6.5" fill="#FFFFFF" />
      {/* X Eyes */}
      <path d="M32 32 L42 42 M42 32 L32 42" stroke="#141313" strokeWidth="5" strokeLinecap="round" />
      <path d="M58 32 L68 42 M68 32 L58 42" stroke="#141313" strokeWidth="5" strokeLinecap="round" />
      {/* Wide Smile */}
      <path d="M28 54 Q50 74 72 54" stroke="#141313" strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* Spray Drips */}
      <path d="M62 66 L62 80 M48 82 L48 93 M70 76 L70 88" stroke="#141313" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}

export function StarSparkle({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none">
      <path
        d="M50 6 L60 40 L94 30 L64 54 L88 86 L52 64 L20 92 L38 56 L8 42 L42 40 Z"
        fill="#FFFFFF"
        stroke="#141313"
        strokeWidth="5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StreetCrown({ className = 'w-16 h-14' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 100" fill="none">
      <path d="M18 75 L12 22 L42 48 L62 15 L80 48 L105 26 L94 75 Z" stroke="#141313" strokeWidth="6.5" strokeLinejoin="round" fill="#F6BE18" />
      <path d="M98 15 L118 8 M102 30 L120 28 M96 44 L115 48" stroke="#EC1276" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

export function LightningBolt({ className = 'w-12 h-16' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 100" fill="none">
      <circle cx="45" cy="55" r="28" fill="#EC1276" opacity="0.22" />
      <path d="M46 8 L16 52 L42 52 L26 92 L66 42 L40 42 Z" stroke="#141313" strokeWidth="5" fill="#EC1276" strokeLinejoin="round" />
    </svg>
  );
}
