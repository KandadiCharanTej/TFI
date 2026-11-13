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
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect
            x="11"
            y="8"
            width="42"
            height="21"
            rx="5"
            fill="currentColor"
            fillOpacity="0.16"
          />
          <path d="M19 18.5h16M19 23h8" />
          <path d="M22 29q-6 4-6 12a16 16 0 0 0 32 0q0-8-6-12" />
          <circle cx="26" cy="41" r="1.5" fill="currentColor" />
          <circle cx="38" cy="41" r="1.5" fill="currentColor" />
          <path d="M27 49q5 4 10 0" />
        </g>
      );
    case "trans":
      return (
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M26 28h28a4 4 0 0 1 4 4v13a4 4 0 0 1-4 4h-5v7l-9-7H26a4 4 0 0 1-4-4V32a4 4 0 0 1 4-4z"
            fill="currentColor"
            fillOpacity="0.16"
          />
          <path d="M10 9h30a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H26l-8 7v-7h-8a4 4 0 0 1-4-4V13a4 4 0 0 1 4-4z" />
          <path d="M14 17h22M14 23h12M32 39h18" />
        </g>
      );
    case "charades":
      return (
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect
            x="8"
            y="27"
            width="48"
            height="29"
            rx="3"
            fill="currentColor"
            fillOpacity="0.16"
          />
          <g transform="rotate(-9 8 27)">
            <rect x="8" y="13" width="48" height="12" rx="2" />
            <path d="M19 13l-5 12M31 13l-5 12M43 13l-5 12M55 13l-5 12" />
          </g>
          <path d="M18 40h28M18 48h14" />
        </g>
      );
    case "emoji":
      return (
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="32" cy="34" r="21" fill="currentColor" fillOpacity="0.16" />
          <circle cx="25" cy="30" r="2" fill="currentColor" />
          <circle cx="39" cy="30" r="2" fill="currentColor" />
          <path d="M22 40q10 11 20 0" />
          <path d="M52 8v10M47 13h10" />
        </g>
      );
    case "auction":
      return (
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 57h30" />
          <g transform="rotate(-35 34 30)">
            <rect x="29" y="30" width="7" height="26" rx="3" />
            <rect
              x="16"
              y="12"
              width="34"
              height="16"
              rx="4"
              fill="currentColor"
              fillOpacity="0.16"
            />
          </g>
          <path d="M44 46q6-2 12 4" />
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
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M37 5L15 36h15l-4 23 23-33H34z"
            fill="currentColor"
            fillOpacity="0.16"
          />
        </g>
      );
    case "most":
      return (
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="44" cy="22" r="8" fill="currentColor" fillOpacity="0.16" />
          <path d="M29 54q0-15 15-15t15 15z" fill="currentColor" fillOpacity="0.16" />
          <circle cx="22" cy="24" r="8" />
          <path d="M6 56q0-15 16-15t16 15z" />
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
