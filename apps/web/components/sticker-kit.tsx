import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import Link from "next/link";

export interface StickerProps extends HTMLAttributes<HTMLDivElement> {
  readonly size?: "lg" | "sm";
  readonly bg?: "white" | "yellow" | "card";
  readonly tilt?: number;
  readonly children: ReactNode;
}

/**
 * Sticker (Card V2): white fill, 2.5px ink border, 20px radius, single 0 5px 0 #141313 shadow.
 * Motion rule: cards in grids, lists, and rounds never tilt.
 * At most one decorative element on the landing hero may pass a tilt.
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

  const clampedTilt = Math.max(-3, Math.min(3, tilt));

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

export interface TicketStubProps extends HTMLAttributes<HTMLDivElement> {
  readonly bg?: "white" | "yellow" | "card";
  readonly tilt?: number;
  readonly header?: ReactNode;
  readonly children: ReactNode;
  readonly footer?: ReactNode;
}

/**
 * TicketStub: Signature film ticket stub with two semi-circle side notches
 * and a dashed perforation line. Used for:
 * (1) Landing hero "Admit one gang" sticker (tilted -3deg)
 * (2) "Today's pick" card on /play
 * (3) Share / results card centerpiece
 */
export function TicketStub({
  bg = "white",
  tilt = 0,
  header,
  children,
  footer,
  className = "",
  style,
  ...props
}: TicketStubProps) {
  const bgMap = {
    white: "#FFFFFF",
    yellow: "#F6BE18",
    card: "#F4F1EA",
  } as const;

  return (
    <div
      className={`wall-ticket ${className}`}
      style={{
        backgroundColor: bgMap[bg],
        transform: tilt !== 0 ? `rotate(${tilt}deg)` : undefined,
        ...style,
      }}
      {...props}
    >
      {header ? <div className="px-5 pt-4 pb-2">{header}</div> : null}
      <div className="px-5 py-4">{children}</div>
      {footer ? (
        <>
          <hr className="wall-ticket-perf mx-4" aria-hidden="true" />
          <div className="px-5 pt-3 pb-4">{footer}</div>
        </>
      ) : null}
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
 * Button V2: 2.5px ink border, 14px radius, 0 4px 0 #141313 shadow; sentence case, weight 700, 17px.
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
        padding: size === "sm" ? "0 18px" : "0 24px",
        fontSize: variant === "magenta" ? "19px" : size === "sm" ? "15px" : "17px",
        borderColor: lightBorder ? "#EAE6DF" : "#141313",
        boxShadow: lightBorder ? "0 4px 0 #EAE6DF" : undefined,
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
        minHeight: size === "sm" ? "44px" : "52px",
        padding: size === "sm" ? "0 18px" : "0 24px",
        fontSize: size === "sm" ? "15px" : "17px",
        borderColor: lightBorder ? "#EAE6DF" : "#141313",
        boxShadow: lightBorder ? "0 4px 0 #EAE6DF" : undefined,
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
            width: "10px",
            height: "10px",
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

/**
 * Badge V2: Sentence case, 13px weight 700, rounded-full, 2px ink border.
 */
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
      className={`${mono ? "mono-num" : "font-bold"} inline-flex items-center justify-center rounded-full border-2 border-ink px-3 py-1 text-ink ${
        tone === "magenta" ? "text-[18.7px] leading-tight" : "text-[13px] leading-tight"
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

export interface SegmentedOption<T extends string> {
  readonly value: T;
  readonly label: ReactNode;
  readonly testId?: string;
}

export interface SegmentedControlProps<T extends string> {
  readonly label: string;
  readonly options: readonly SegmentedOption<T>[];
  readonly value: T;
  readonly onChange: (next: T) => void;
  readonly className?: string;
}

/**
 * SegmentedControl: Clean pill segmented filter (All / One phone / Online).
 */
export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  className = "",
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={`inline-flex flex-wrap items-center gap-1.5 rounded-full border-[2.5px] border-ink bg-card p-1 ${className}`}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            data-testid={opt.testId}
            onClick={() => onChange(opt.value)}
            className="min-h-[40px] rounded-full px-4 py-1.5 text-[14px] font-bold text-ink transition-colors"
            style={{
              backgroundColor: active ? "#F6BE18" : "transparent",
              border: active ? "2px solid #141313" : "2px solid transparent",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export interface TapeStripProps {
  readonly items: readonly string[];
  readonly label: string;
}

export function TapeStrip({ items, label }: TapeStripProps) {
  const renderPass = (keyPrefix: string) =>
    items.map((item, idx) => (
      <span key={`${keyPrefix}-${idx}`} className="inline-flex items-center gap-8">
        <span className="h3-title whitespace-nowrap text-ink">{item}</span>
        <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rotate-45 bg-ink" />
      </span>
    ));

  return (
    <div className="overflow-hidden py-2" aria-label={label}>
      <div
        style={{
          backgroundColor: "#F6BE18",
          borderTop: "2.5px solid #141313",
          borderBottom: "2.5px solid #141313",
          padding: "10px 0",
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
 * TimerBar: Thin top progress bar + Space Mono Bold timer readout.
 */
export function TimerBar({ secondsRemaining, totalSeconds, label }: TimerBarProps) {
  const pct = Math.max(0, Math.min(100, Math.round((secondsRemaining / totalSeconds) * 100)));
  const mins = Math.floor(secondsRemaining / 60);
  const secs = String(secondsRemaining % 60).padStart(2, "0");

  return (
    <div className="flex w-full items-center gap-3" role="timer" aria-label={label}>
      <div
        className="h-3 flex-1 overflow-hidden rounded-full border-2 border-ink bg-sticker"
        aria-hidden="true"
      >
        <div
          className="h-full bg-ink transition-all duration-200"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="mono-num rounded-full border-2 border-ink bg-yellow px-3 py-0.5 text-sm text-ink">
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
      <span className="wall-label block text-ink">
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
