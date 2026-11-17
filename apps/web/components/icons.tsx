import type { SVGProps } from "react";

export type WallIconKind =
  | "mark"
  | "head"
  | "trans"
  | "charades"
  | "emoji"
  | "auction"
  | "cricketiq"
  | "cricketauction"
  | "dream"
  | "rapid"
  | "most"
  | "play"
  | "join"
  | "me"
  | "check"
  | "skip";

export interface WallIconProps extends SVGProps<SVGSVGElement> {
  readonly kind: WallIconKind;
  readonly label?: string;
}

const GAME_KINDS = new Set<WallIconKind>([
  "head",
  "trans",
  "charades",
  "emoji",
  "rapid",
  "most",
  "auction",
]);

/**
 * Party Art Kit illustrations:
 * - 7 beta game icons drawn natively at 120x120 with 3px ink stroke, flat palette fills, and offset ink backing shadow.
 * - Nav & control icons use 64x64 monoline.
 */
export function WallIcon({ kind, label, ...props }: WallIconProps) {
  const isDecorative = !label;
  const viewBox = GAME_KINDS.has(kind) ? "0 0 120 120" : "0 0 64 64";
  return (
    <svg
      width="100%"
      height="100%"
      viewBox={viewBox}
      aria-hidden={isDecorative ? "true" : undefined}
      role={isDecorative ? undefined : "img"}
      {...props}
    >
      {label ? <title>{label}</title> : null}
      {renderIconPath(kind)}
    </svg>
  );
}

function renderIconPath(kind: WallIconKind) {
  switch (kind) {
    case "head":
      return (
        <g stroke="#141313" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          {/* Offset shadow */}
          <rect x="26" y="18" width="76" height="36" rx="10" fill="#141313" stroke="none" />
          <circle cx="64" cy="78" r="28" fill="#141313" stroke="none" />
          {/* Main flat art */}
          <circle cx="60" cy="74" r="28" fill="#FFFFFF" />
          <circle cx="48" cy="71" r="4" fill="#141313" stroke="none" />
          <circle cx="72" cy="71" r="4" fill="#141313" stroke="none" />
          <path d="M48 84q12 10 24 0" fill="none" strokeWidth="3.5" />
          <rect x="22" y="14" width="76" height="36" rx="10" fill="#EC1276" />
          <path d="M35 28h36M35 38h22" stroke="#FFFFFF" strokeWidth="3.5" />
          <circle cx="85" cy="32" r="5" fill="#F6BE18" />
        </g>
      );
    case "trans":
      return (
        <g stroke="#141313" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          {/* Offset shadows */}
          <path
            d="M48 52h54a8 8 0 0 1 8 8v28a8 8 0 0 1-8 8H92v14l-18-14H48a8 8 0 0 1-8-8V60a8 8 0 0 1 8-8z"
            fill="#141313"
            stroke="none"
          />
          <path
            d="M22 20h54a8 8 0 0 1 8 8v28a8 8 0 0 1-8 8H48L32 78V64H22a8 8 0 0 1-8-8V28a8 8 0 0 1 8-8z"
            fill="#141313"
            stroke="none"
          />
          {/* Main flat bubbles */}
          <path
            d="M44 48h54a8 8 0 0 1 8 8v28a8 8 0 0 1-8 8H88v14L70 92H44a8 8 0 0 1-8-8V56a8 8 0 0 1 8-8z"
            fill="#00E5FF"
          />
          <path
            d="M18 16h54a8 8 0 0 1 8 8v28a8 8 0 0 1-8 8H44L28 74V60H18a8 8 0 0 1-8-8V24a8 8 0 0 1 8-8z"
            fill="#FFFFFF"
          />
          <path d="M26 32h34M26 44h20" fill="none" strokeWidth="3.5" />
          <path d="M54 66h34M54 78h18" fill="none" strokeWidth="3.5" />
          <circle cx="88" cy="24" r="6" fill="#F6BE18" />
        </g>
      );
    case "charades":
      return (
        <g stroke="#141313" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <rect x="20" y="54" width="88" height="52" rx="8" fill="#141313" stroke="none" />
          <rect x="16" y="50" width="88" height="52" rx="8" fill="#FFFFFF" />
          <g transform="rotate(-10 16 50)">
            <rect x="20" y="26" width="88" height="22" rx="6" fill="#141313" stroke="none" />
            <rect x="16" y="22" width="88" height="22" rx="6" fill="#EC1276" />
            <path d="M36 22l-8 22M58 22l-8 22M80 22l-8 22" stroke="#FFFFFF" strokeWidth="4" />
          </g>
          <path d="M32 68h56M32 82h34" fill="none" strokeWidth="3.5" />
          <circle cx="88" cy="84" r="7" fill="#F6BE18" />
        </g>
      );
    case "emoji":
      return (
        <g stroke="#141313" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="64" cy="68" r="40" fill="#141313" stroke="none" />
          <circle cx="60" cy="64" r="40" fill="#FFFFFF" />
          <circle cx="46" cy="54" r="5" fill="#141313" stroke="none" />
          <circle cx="74" cy="54" r="5" fill="#141313" stroke="none" />
          <path d="M38 72q22 22 44 0z" fill="#EC1276" />
          <path d="M96 16l5 10 10 5-10 5-5 10-5-10-10-5 10-5z" fill="#00E5FF" />
          <circle cx="20" cy="28" r="6" fill="#EC1276" />
        </g>
      );
    case "rapid":
      return (
        <g stroke="#141313" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M74 14L32 70h26l-8 40 44-58H68z" fill="#141313" stroke="none" />
          <path d="M70 10L28 66h26l-8 40 44-58H64z" fill="#F6BE18" />
          <circle cx="96" cy="24" r="8" fill="#00E5FF" />
          <circle cx="26" cy="96" r="6" fill="#FFFFFF" />
        </g>
      );
    case "most":
      return (
        <g stroke="#141313" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="84" cy="48" r="15" fill="#141313" stroke="none" />
          <path d="M56 106q0-26 28-26t28 26z" fill="#141313" stroke="none" />
          <circle cx="42" cy="50" r="16" fill="#141313" stroke="none" />
          <path d="M14 108q0-28 28-28t28 28z" fill="#141313" stroke="none" />
          {/* Main flat people + crown */}
          <circle cx="80" cy="44" r="15" fill="#00E5FF" />
          <path d="M52 102q0-26 28-26t28 26z" fill="#00E5FF" />
          <circle cx="38" cy="46" r="16" fill="#FFFFFF" />
          <path d="M10 104q0-28 28-28t28 28z" fill="#FFFFFF" />
          <path d="M22 25l8-11 8 10 8-10 8 11v10H22z" fill="#EC1276" />
          <circle cx="94" cy="20" r="6" fill="#F6BE18" />
        </g>
      );
    case "auction":
      return (
        <g stroke="#141313" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <rect x="18" y="96" width="60" height="14" rx="5" fill="#141313" stroke="none" />
          <rect x="14" y="92" width="60" height="14" rx="5" fill="#FFFFFF" />
          <g transform="rotate(-35 66 54)">
            <rect x="61" y="54" width="14" height="44" rx="5" fill="#141313" stroke="none" />
            <rect x="38" y="22" width="60" height="32" rx="7" fill="#141313" stroke="none" />
            <rect x="57" y="50" width="14" height="44" rx="5" fill="#FFFFFF" />
            <rect x="34" y="18" width="60" height="32" rx="7" fill="#F6BE18" />
          </g>
          <path d="M88 78l16-8M92 90h16" strokeWidth="4" />
          <circle cx="24" cy="30" r="7" fill="#EC1276" />
        </g>
      );
    case "mark":
      return (
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M32 4l28 28-28 28L4 32z" />
          <path d="M32 18l14 14-14 14-14-14z" fill="currentColor" fillOpacity="0.25" />
          <circle cx="32" cy="32" r="3.5" fill="currentColor" />
        </g>
      );
    case "cricketiq":
      return (
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="28" cy="37" r="20" fill="currentColor" fillOpacity="0.16" />
          <path d="M13 25q14 12 0 24M43 25q-14 12 0 24" />
          <circle cx="50" cy="14" r="9" />
          <path d="M47 12q0-3 3-3t3 3q0 2-3 3.5v1.5" />
          <circle cx="50" cy="19.8" r="0.7" fill="currentColor" />
        </g>
      );
    case "cricketauction":
      return (
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <g transform="rotate(38 32 30)">
            <rect
              x="23"
              y="4"
              width="17"
              height="34"
              rx="6"
              fill="currentColor"
              fillOpacity="0.16"
            />
            <rect x="29" y="38" width="5" height="17" rx="2.5" />
          </g>
          <circle cx="49" cy="50" r="7" />
          <path d="M45 47q4 3 0 6" />
        </g>
      );
    case "dream":
      return (
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M22 8l-15 9 6 11 7-3v29h24V25l7 3 6-11-15-9a10 8 0 0 1-20 0z"
            fill="currentColor"
            fillOpacity="0.16"
          />
          <text
            x="32"
            y="46"
            textAnchor="middle"
            fontFamily="sans-serif"
            fontSize="16"
            fontWeight="700"
            fill="currentColor"
            stroke="none"
          >
            11
          </text>
        </g>
      );
    case "play":
      return (
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon
            points="18,12 52,32 18,52"
            fill="currentColor"
            fillOpacity="0.22"
          />
        </g>
      );
    case "join":
      return (
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect
            x="10"
            y="14"
            width="44"
            height="36"
            rx="6"
            fill="currentColor"
            fillOpacity="0.22"
          />
          <path d="M22 32h20M34 24l8 8-8 8" />
        </g>
      );
    case "me":
      return (
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="32" cy="22" r="10" fill="currentColor" fillOpacity="0.22" />
          <path d="M14 54q0-16 18-16t18 16z" fill="currentColor" fillOpacity="0.22" />
        </g>
      );
    case "check":
      return (
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="32" cy="32" r="22" fill="currentColor" fillOpacity="0.22" />
          <path d="M21 33l8 8 15-16" />
        </g>
      );
    case "skip":
      return (
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="32" cy="32" r="22" fill="currentColor" fillOpacity="0.22" />
          <path d="M23 23l18 18M41 23L23 41" />
        </g>
      );
  }
}
