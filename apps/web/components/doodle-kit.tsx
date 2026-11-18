import type { CSSProperties } from "react";

type PaletteFill = "yellow" | "magenta" | "green" | "cyan" | "white" | "ink";

const HEX: Record<PaletteFill, string> = {
  yellow: "#F6BE18",
  magenta: "#EC1276",
  green: "#00C853",
  cyan: "#00E5FF",
  white: "#FFFFFF",
  ink: "#141313",
};

/** Bold rounded X doodle in ink, magenta, or white-with-ink-outline. */
export function DoodleX({
  tone = "magenta",
  size = 56,
  tilt = 12,
  className = "",
  style,
}: {
  readonly tone?: "ink" | "magenta" | "white";
  readonly size?: number;
  readonly tilt?: number;
  readonly className?: string;
  readonly style?: CSSProperties;
}) {
  const isInk = tone === "ink";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
      style={{ ...(tilt ? { transform: `rotate(${tilt}deg)` } : {}), ...style }}
    >
      {!isInk ? (
        <path
          d="M14 14l36 36M50 14L14 50"
          stroke="#141313"
          strokeWidth="16"
          strokeLinecap="round"
        />
      ) : null}
      <path
        d="M14 14l36 36M50 14L14 50"
        stroke={HEX[tone]}
        strokeWidth={isInk ? "12" : "9"}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Outlined or solid 5-point party star doodle. */
export function DoodleStar({
  solid = false,
  size = 44,
  tilt = -8,
  className = "",
}: {
  readonly solid?: boolean;
  readonly size?: number;
  readonly tilt?: number;
  readonly className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
      style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
    >
      <polygon
        points="24,3 29,17 44,17 32,26 36,41 24,32 12,41 16,26 4,17 19,17"
        fill={solid ? "#141313" : "#FFFFFF"}
        stroke="#141313"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Chunky magenta lightning bolt with 3 px ink outline. */
export function DoodleBolt({
  size = 48,
  tilt = 8,
  className = "",
}: {
  readonly size?: number;
  readonly tilt?: number;
  readonly className?: string;
}) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.2)}
      viewBox="0 0 40 48"
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
      style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
    >
      <polygon
        points="23,3 6,27 19,27 15,45 34,20 21,20"
        fill="#EC1276"
        stroke="#141313"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Original ink line-art smiley with X eyes and playful tongue (winks when activated). */
export function DoodleSmiley({
  size = 56,
  wink = false,
  className = "",
}: {
  readonly size?: number;
  readonly wink?: boolean;
  readonly className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    >
      <circle cx="32" cy="32" r="27" fill="#FFFFFF" stroke="#141313" strokeWidth="3.5" />
      <path d="M18 20l8 8M26 20l-8 8" stroke="#141313" strokeWidth="3.5" strokeLinecap="round" />
      {wink ? (
        <path d="M38 24h9" stroke="#141313" strokeWidth="3.5" strokeLinecap="round" />
      ) : (
        <path d="M38 20l8 8M46 20l-8 8" stroke="#141313" strokeWidth="3.5" strokeLinecap="round" />
      )}
      <path d="M19 37c4 9 22 9 26 0" fill="none" stroke="#141313" strokeWidth="3.5" strokeLinecap="round" />
      <path
        d="M27 42c0 8 10 8 10 0Z"
        fill="#EC1276"
        stroke="#141313"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export { DoodleCrown, DoodleScribbleOval } from "./hero-inline-doodles";

/** 4 rows x 2 columns of ink dots. */
export function DoodleDotColumn({ className = "" }: { readonly className?: string }) {
  const dots: Array<[number, number]> = [];
  for (let r = 0; r < 4; r++) {
    dots.push([6, 6 + r * 12], [18, 6 + r * 12]);
  }
  return (
    <svg
      width="24"
      height="48"
      viewBox="0 0 24 48"
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    >
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="#141313" />
      ))}
    </svg>
  );
}

/** Cinema clapperboard doodle (simple 3 px ink style). */
export function DoodleClapper({ size = 44, className = "" }: { readonly size?: number; readonly className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
      style={{ transform: "rotate(-10deg)" }}
    >
      <rect x="7" y="18" width="34" height="22" rx="4" fill="#FFFFFF" stroke="#141313" strokeWidth="3" />
      <path d="M7 18l30-8 3 8H7Z" fill="#00E5FF" stroke="#141313" strokeWidth="3" strokeLinejoin="round" />
      <path d="M16 16l4-6M27 13l4-6" stroke="#141313" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/** Cinema film-strip corner doodle. */
export function DoodleFilmStrip({ size = 48, className = "" }: { readonly size?: number; readonly className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
      style={{ transform: "rotate(8deg)" }}
    >
      <rect x="8" y="6" width="32" height="36" rx="4" fill="#FFFFFF" stroke="#141313" strokeWidth="3" />
      <path d="M16 6v36M32 6v36M16 24h16" stroke="#141313" strokeWidth="2.5" />
      <rect x="10.5" y="11" width="3" height="4" fill="#141313" />
      <rect x="10.5" y="21" width="3" height="4" fill="#141313" />
      <rect x="10.5" y="31" width="3" height="4" fill="#141313" />
      <rect x="34.5" y="11" width="3" height="4" fill="#141313" />
      <rect x="34.5" y="21" width="3" height="4" fill="#141313" />
      <rect x="34.5" y="31" width="3" height="4" fill="#141313" />
    </svg>
  );
}

/** Small ticket stub outline doodle. */
export function DoodleTicket({ size = 44, className = "" }: { readonly size?: number; readonly className?: string }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 0.68)}
      viewBox="0 0 56 38"
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
      style={{ transform: "rotate(-12deg)" }}
    >
      <path
        d="M5 6h46v8a5 5 0 0 0 0 10v8H5v-8a5 5 0 0 0 0-10V6Z"
        fill="#00C853"
        stroke="#141313"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M36 9v20" stroke="#141313" strokeWidth="2.5" strokeDasharray="3 3" />
    </svg>
  );
}

/** Simple megaphone doodle. */
export function DoodleMegaphone({ size = 44, className = "" }: { readonly size?: number; readonly className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
      style={{ transform: "rotate(-12deg)" }}
    >
      <path
        d="M8 22l24-10v24L8 26v-4Z"
        fill="#FFFFFF"
        stroke="#141313"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M14 28l4 10h5l-4-10" fill="#EC1276" stroke="#141313" strokeWidth="3" strokeLinejoin="round" />
      <path d="M37 18l5-3M37 24h6M37 30l5 3" stroke="#141313" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
