"use client";

/** Small tilted crown doodle with magenta burst dashes for headline plate corner. */
export function DoodleCrown({
  size = 44,
  className = "",
}: {
  readonly size?: number;
  readonly className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
      style={{ transform: "rotate(12deg)" }}
    >
      <path
        d="M8 34L6 16l10 8 8-12 8 12 10-8-2 18Z"
        fill="#FFFFFF"
        stroke="#141313"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M14 6l2 5M24 3v5M34 6l-2 5" stroke="#EC1276" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Hand-drawn magenta oval scribble around one inline phrase without covering letters. */
export function DoodleScribbleOval({ className = "" }: { readonly className?: string }) {
  return (
    <svg
      viewBox="0 0 200 64"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`doodle-oval-svg pointer-events-none select-none ${className}`}
    >
      <path
        d="M14 34c-4-17 44-28 96-26 54 2 84 14 78 28-6 15-52 24-100 22-48-2-78-11-74-24 2-6 18-13 42-16"
        fill="none"
        stroke="#EC1276"
        strokeWidth="4.5"
        strokeLinecap="round"
        className="doodle-oval-path"
      />
    </svg>
  );
}
