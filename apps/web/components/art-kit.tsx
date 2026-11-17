import type { HTMLAttributes, ReactNode } from "react";

const FILL_HEX = {
  yellow: "#F6BE18",
  magenta: "#EC1276",
  green: "#00C853",
  cyan: "#00E5FF",
  white: "#FFFFFF",
  ink: "#141313",
} as const;

type PaletteAccent = keyof typeof FILL_HEX;

/** Starburst: spiky decorative star badge (< 1 KB SVG). Always aria-hidden & pointer-events-none. */
export function Starburst({
  color = "white",
  size = 56,
  tilt = 0,
  className = "",
}: {
  readonly color?: PaletteAccent;
  readonly size?: number;
  readonly tilt?: number;
  readonly className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
      style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
    >
      <polygon
        points="32,2 39,18 56,10 47,26 62,34 45,40 53,57 37,48 30,62 24,47 8,55 16,39 2,31 18,24 10,8 26,17"
        fill={FILL_HEX[color]}
        stroke="#141313"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** XMark: chunky tilted decorative X shape. */
export function XMark({
  color = "magenta",
  size = 36,
  tilt = 12,
  className = "",
}: {
  readonly color?: PaletteAccent;
  readonly size?: number;
  readonly tilt?: number;
  readonly className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
      style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
    >
      <path
        d="M9 9l22 22M31 9L9 31"
        stroke="#141313"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M9 9l22 22M31 9L9 31"
        stroke={FILL_HEX[color]}
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Squiggle: bouncy cinema wave accent. */
export function Squiggle({
  color = "cyan",
  width = 84,
  className = "",
}: {
  readonly color?: PaletteAccent;
  readonly width?: number;
  readonly className?: string;
}) {
  return (
    <svg
      width={width}
      height={Math.round(width * 0.3)}
      viewBox="0 0 84 26"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    >
      <path
        d="M4 13c8-10 14-10 22 0s14 10 22 0 14-10 22 0 8 8 10 0"
        stroke="#141313"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M4 13c8-10 14-10 22 0s14 10 22 0 14-10 22 0 8 8 10 0"
        stroke={FILL_HEX[color]}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** HalftoneBlock: Full-bleed color section wrapper with optional halftone dots or diagonal stripes. */
export function HalftoneBlock({
  bg = "yellow",
  pattern = "halftone",
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLElement> & {
  readonly bg?: "yellow" | "magenta" | "green" | "cyan" | "concrete" | "card" | "ink";
  readonly pattern?: "halftone" | "stripes" | "none";
  readonly children: ReactNode;
}) {
  const bgMap = {
    yellow: "#F6BE18",
    magenta: "#EC1276",
    green: "#00C853",
    cyan: "#00E5FF",
    concrete: "#EAE6DF",
    card: "#F4F1EA",
    ink: "#141313",
  } as const;

  const patternCls =
    pattern === "halftone" ? "bg-halftone" : pattern === "stripes" ? "bg-stripes" : "";

  return (
    <section
      className={`${patternCls} ${className}`}
      style={{
        backgroundColor: bgMap[bg],
        color: bg === "ink" || bg === "magenta" ? "#FFFFFF" : "#141313",
      }}
      {...props}
    >
      {children}
    </section>
  );
}

/** FilmStripBorder: Perforated top/bottom film strip edge. */
export function FilmStripBorder({ className = "" }: { readonly className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none flex h-4 w-full items-center justify-around border-y-[3px] border-ink bg-ink px-2 ${className}`}
    >
      {Array.from({ length: 14 }, (_, i) => (
        <span key={i} className="h-1.5 w-3 rounded-[2px] bg-concrete" />
      ))}
    </div>
  );
}

/** SpotlightBeam: Soft 6% ink diagonal hero cone, purely decorative. */
export function SpotlightBeam({ className = "" }: { readonly className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div
        className="h-full w-full"
        style={{
          backgroundColor: "rgba(20, 19, 19, 0.06)",
          clipPath: "polygon(62% 0%, 100% 0%, 100% 100%, 24% 100%)",
        }}
      />
    </div>
  );
}

/** SpeechSticker: Chunky callout bubble ("Correct!", "Pass!", "FDFS vibes"). */
export function SpeechSticker({
  tone = "green",
  tilt = -2,
  decorative = true,
  className = "",
  children,
}: {
  readonly tone?: "green" | "magenta" | "yellow" | "white" | "cyan";
  readonly tilt?: number;
  readonly decorative?: boolean;
  readonly className?: string;
  readonly children: ReactNode;
}) {
  const isMagenta = tone === "magenta";
  return (
    <div
      aria-hidden={decorative ? "true" : undefined}
      className={`inline-flex items-center gap-1.5 rounded-[16px] border-[3px] border-ink px-3.5 py-1.5 font-extrabold shadow-[0_4px_0_#141313] ${
        decorative ? "pointer-events-none select-none" : ""
      } ${isMagenta ? "text-[19px] text-white" : "text-[15px] text-ink"} ${className}`}
      style={{
        backgroundColor: FILL_HEX[tone],
        transform: tilt ? `rotate(${tilt}deg)` : undefined,
      }}
    >
      {children}
    </div>
  );
}

/** PopBadge: Chunky pill badge for counts, modes, and highlights. */
export function PopBadge({
  tone = "white",
  className = "",
  children,
}: {
  readonly tone?: "white" | "yellow" | "magenta" | "green" | "cyan" | "ink";
  readonly className?: string;
  readonly children: ReactNode;
}) {
  const isDark = tone === "magenta" || tone === "ink";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border-[2.5px] border-ink px-3.5 py-1 font-extrabold leading-tight ${
        tone === "magenta" ? "text-[19px]" : "text-[13px]"
      } ${isDark ? "text-white" : "text-ink"} ${className}`}
      style={{ backgroundColor: FILL_HEX[tone] }}
    >
      {children}
    </span>
  );
}
