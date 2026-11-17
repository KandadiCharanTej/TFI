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

/**
 * Monoline icon set (Section 4):
 * stroke = currentColor, 2.2px stroke with a 16% fill tint.
 */
export function WallIcon({ kind, label, ...props }: WallIconProps) {
  const isDecorative = !label;
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 64 64"
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
    case "head":
      return (
        <g stroke="#141313" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="32" cy="40" r="15" fill="#FFFFFF" />
          <rect x="11" y="9" width="42" height="20" rx="5" fill="#EC1276" />
          <path d="M19 19h18M19 24h10" stroke="#FFFFFF" />
          <circle cx="26" cy="39" r="2" fill="#141313" stroke="none" />
          <circle cx="38" cy="39" r="2" fill="#141313" stroke="none" />
          <path d="M26 46q6 5 12 0" fill="none" />
        </g>
      );
    case "trans":
      return (
        <g stroke="#141313" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M26 27h28a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4h-5v7l-9-7H26a4 4 0 0 1-4-4V31a4 4 0 0 1 4-4z"
            fill="#00E5FF"
          />
          <path
            d="M10 9h30a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H26l-8 7v-7h-8a4 4 0 0 1-4-4V13a4 4 0 0 1 4-4z"
            fill="#FFFFFF"
          />
          <path d="M14 17h20M14 23h11M31 38h18" fill="none" />
        </g>
      );
    case "charades":
      return (
        <g stroke="#141313" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <rect x="8" y="27" width="48" height="29" rx="4" fill="#FFFFFF" />
          <g transform="rotate(-8 8 27)">
            <rect x="8" y="13" width="48" height="12" rx="3" fill="#EC1276" />
            <path d="M19 13l-5 12M31 13l-5 12M43 13l-5 12" stroke="#FFFFFF" />
          </g>
          <path d="M18 39h28M18 47h16" fill="none" />
        </g>
      );
    case "emoji":
      return (
        <g stroke="#141313" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="32" cy="35" r="20" fill="#FFFFFF" />
          <circle cx="25" cy="31" r="2.5" fill="#141313" stroke="none" />
          <circle cx="39" cy="31" r="2.5" fill="#141313" stroke="none" />
          <path d="M22 41q10 10 20 0" fill="#EC1276" />
          <path d="M51 8l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#EC1276" />
        </g>
      );
    case "auction":
      return (
        <g stroke="#141313" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <rect x="8" y="51" width="32" height="7" rx="3" fill="#FFFFFF" />
          <g transform="rotate(-35 34 30)">
            <rect x="29" y="29" width="8" height="24" rx="3" fill="#FFFFFF" />
            <rect x="16" y="11" width="34" height="17" rx="4" fill="#F6BE18" />
          </g>
          <path d="M46 42l8-4M49 48h8" fill="none" />
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
    case "rapid":
      return (
        <g stroke="#141313" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M38 6L15 36h15l-4 22 23-32H34z" fill="#F6BE18" />
        </g>
      );
    case "most":
      return (
        <g stroke="#141313" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="44" cy="22" r="8" fill="#00E5FF" />
          <path d="M29 54q0-14 15-14t15 14z" fill="#00E5FF" />
          <circle cx="22" cy="24" r="8" fill="#FFFFFF" />
          <path d="M6 56q0-14 16-14t16 14z" fill="#FFFFFF" />
          <path d="M14 13l4-5 4 5 4-5v8H14z" fill="#EC1276" />
        </g>
      );
    case "play":
      return (
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon
            points="18,12 52,32 18,52"
            fill="currentColor"
            fillOpacity="0.16"
          />
        </g>
      );
    case "join":
      return (
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
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
            fillOpacity="0.16"
          />
          <path d="M22 32h20M34 24l8 8-8 8" />
        </g>
      );
    case "me":
      return (
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="32" cy="22" r="10" fill="currentColor" fillOpacity="0.16" />
          <path d="M14 54q0-16 18-16t18 16z" fill="currentColor" fillOpacity="0.16" />
        </g>
      );
    case "check":
      return (
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="32" cy="32" r="22" fill="currentColor" fillOpacity="0.16" />
          <path d="M21 33l8 8 15-16" />
        </g>
      );
    case "skip":
      return (
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="32" cy="32" r="22" fill="currentColor" fillOpacity="0.16" />
          <path d="M23 23l18 18M41 23L23 41" />
        </g>
      );
  }
}
