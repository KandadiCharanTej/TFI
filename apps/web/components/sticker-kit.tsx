import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import Link from "next/link";

export interface StickerProps extends HTMLAttributes<HTMLDivElement> {
  readonly size?: "lg" | "sm";
  readonly bg?: "white" | "yellow" | "card";
  readonly tilt?: number;
  readonly children: ReactNode;
}

/**
 * Sticker: white fill, 3px ink border, 5px white ring, 2px ink ring, soft offset shadow.
 * 20px radius on large stickers, 16px on small.
 * Motion rule: decoration may tilt up to 1.5 degrees; anything read during play never tilts.
 */
export function Sticker({
  size = "lg",
  bg = "white",
  tilt = 0,
  className = "",
  style,
  children,
  ...props
}: StickerProps) {
  const bgMap = {
    white: "#FFFFFF",
    yellow: "#F6BE18",
    card: "#F4F1EA",
  } as const;

  const clampedTilt = Math.max(-1.5, Math.min(1.5, tilt));

  return (
    <div
      className={`${size === "lg" ? "wall-sticker" : "wall-sticker-sm"} ${className}`}
      style={{
        backgroundColor: bgMap[bg],
        transform: clampedTilt !== 0 ? `rotate(${clampedTilt}deg)` : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export interface WallButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: "yellow" | "white" | "magenta" | "green" | "cyan";
  readonly size?: "md" | "sm";
  readonly lightBorder?: boolean;
  readonly children: ReactNode;
}

/**
 * Button: 2.5px ink border, 14px radius, 4px hard ink shadow; on press moves 4px and shadow disappears.
 * Contrast rule: Use ink (#141313) text on yellow, green, cyan, and magenta buttons so contrast is >= 4.5:1.
 */
export function WallButton({
  variant = "yellow",
  size = "md",
  lightBorder = false,
  className = "",
  style,
  children,
  type = "button",
  ...props
}: WallButtonProps) {
  const bgMap = {
    yellow: "#F6BE18",
    white: "#FFFFFF",
    magenta: "#EC1276",
    green: "#00C853",
    cyan: "#00E5FF",
  } as const;

  return (
    <button
      type={type}
      className={`wall-btn ${className}`}
      style={{
        backgroundColor: bgMap[variant],
        color: "#141313",
        minHeight: size === "sm" ? "44px" : "52px",
        padding: size === "sm" ? "0 18px" : "0 26px",
        fontSize: variant === "magenta" ? "19px" : size === "sm" ? "14px" : "16px",
        borderColor: lightBorder ? "#EAE6DF" : "#141313",
        boxShadow: lightBorder ? "4px 4px 0 #EAE6DF" : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export interface WallLinkButtonProps {
  readonly href: string;
  readonly variant?: "yellow" | "white" | "magenta" | "green" | "cyan";
  readonly size?: "md" | "sm";
  readonly lightBorder?: boolean;
  readonly className?: string;
  readonly children: ReactNode;
}

export function WallLinkButton({
  href,
  variant = "yellow",
  size = "md",
  lightBorder = false,
  className = "",
  children,
}: WallLinkButtonProps) {
  const bgMap = {
    yellow: "#F6BE18",
    white: "#FFFFFF",
    magenta: "#EC1276",
    green: "#00C853",
    cyan: "#00E5FF",
  } as const;

  return (
    <Link
      href={href}
      className={`wall-btn ${className}`}
      style={{
        backgroundColor: bgMap[variant],
        color: "#141313",
        minHeight: size === "sm" ? "46px" : "52px",
        padding: size === "sm" ? "0 20px" : "0 26px",
        fontSize: size === "sm" ? "15px" : "16px",
        borderColor: lightBorder ? "#EAE6DF" : "#141313",
        boxShadow: lightBorder ? "4px 4px 0 #EAE6DF" : undefined,
      }}
    >
      {children}
    </Link>
  );
}

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly active?: boolean;
  readonly dotColor?: string;
  readonly children: ReactNode;
}

export function Chip({
  active = false,
  dotColor,
  className = "",
  style,
  children,
  type = "button",
  ...props
}: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={active}
      className={`wall-chip ${className}`}
      style={{
        backgroundColor: active ? "#F6BE18" : "#FFFFFF",
        color: "#141313",
        ...style,
      }}
      {...props}
    >
      {dotColor ? (
        <span
          aria-hidden="true"
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            border: "2px solid #141313",
            backgroundColor: dotColor,
            flexShrink: 0,
          }}
        />
      ) : null}
      {children}
    </button>
  );
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  readonly tone?: "white" | "cyan" | "yellow" | "magenta" | "green" | "card";
  readonly mono?: boolean;
  readonly children: ReactNode;
}

export function Badge({
  tone = "white",
  mono = false,
  className = "",
  style,
  children,
  ...props
}: BadgeProps) {
  const bgMap = {
    white: "#FFFFFF",
    cyan: "#00E5FF",
    yellow: "#F6BE18",
    magenta: "#EC1276",
    green: "#00C853",
    card: "#F4F1EA",
  } as const;

  return (
    <span
      className={`${mono ? "mono-num" : "font-extrabold uppercase tracking-wider"} inline-flex items-center justify-center rounded-full border-2 border-ink px-3 py-1 text-ink ${
        tone === "magenta" ? "text-[18.7px] leading-tight" : "text-xs"
      } ${className}`}
      style={{
        backgroundColor: bgMap[tone],
        color: "#141313",
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
}

export interface TapeStripProps {
  readonly items: readonly string[];
  readonly label: string;
}

export function TapeStrip({ items, label }: TapeStripProps) {
  const renderPass = (keyPrefix: string) =>
    items.map((item, idx) => (
      <span key={`${keyPrefix}-${idx}`} className="inline-flex items-center gap-9">
        <span className="anton-title whitespace-nowrap text-[28px] text-ink">{item}</span>
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20">
          <path
            d="M3 3L17 17M17 3L3 17"
            stroke="#141313"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </span>
    ));

  return (
    <div className="-mt-1.5 overflow-hidden py-2.5" aria-label={label}>
      <div
        style={{
          transform: "rotate(-1.2deg)",
          width: "104%",
          marginLeft: "-2%",
          backgroundColor: "#F6BE18",
          borderTop: "3px solid #141313",
          borderBottom: "3px solid #141313",
          padding: "12px 0",
          overflow: "hidden",
        }}
      >
        <div className="wall-tape-track">
          {renderPass("pass-a")}
          {renderPass("pass-b")}
        </div>
      </div>
    </div>
  );
}

export interface TimerBarProps {
  readonly secondsRemaining: number;
  readonly totalSeconds: number;
  readonly label: string;
}

/**
 * TimerBar: Space Mono Bold timer pill + high-contrast ink progress bar.
 */
export function TimerBar({ secondsRemaining, totalSeconds, label }: TimerBarProps) {
  const pct = Math.max(0, Math.min(100, Math.round((secondsRemaining / totalSeconds) * 100)));
  const mins = Math.floor(secondsRemaining / 60);
  const secs = String(secondsRemaining % 60).padStart(2, "0");

  return (
    <div className="flex w-full items-center gap-3" role="timer" aria-label={label}>
      <div
        className="h-4 flex-1 overflow-hidden rounded-full border-[2.5px] border-ink bg-sticker"
        aria-hidden="true"
      >
        <div
          className="h-full bg-ink transition-all duration-200"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="mono-num rounded-full border-[2.5px] border-ink bg-yellow px-3 py-0.5 text-sm text-ink">
        {mins}:{secs}
      </span>
    </div>
  );
}

export interface BidDisplayProps {
  readonly currentBidCr: number;
  readonly label: string;
  readonly compact?: boolean;
}

/**
 * BidDisplay: Yellow panel with ink border and Space Mono Bold pretend coin value.
 */
export function BidDisplay({
  currentBidCr,
  label,
  compact = false,
}: BidDisplayProps) {
  return (
    <div
      className="rounded-[14px] border-[2.5px] border-ink bg-yellow px-4 py-2 text-ink"
      aria-label={`${label}: ${currentBidCr} Cr`}
    >
      <span className="block text-[11px] font-extrabold uppercase tracking-[0.12em]">
        {label}
      </span>
      <span
        className={`mono-num block leading-tight text-ink ${
          compact ? "text-[30px]" : "text-[42px]"
        }`}
      >
        {currentBidCr} Cr
      </span>
    </div>
  );
}
