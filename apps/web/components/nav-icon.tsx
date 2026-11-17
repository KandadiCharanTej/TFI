import type { SVGProps } from "react";

export type NavIconKind = "play" | "join" | "me";

export function NavIcon({
  kind,
  ...props
}: { readonly kind: NavIconKind } & SVGProps<SVGSVGElement>) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 64 64" aria-hidden="true" {...props}>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {kind === "play" ? (
          <polygon points="18,12 52,32 18,52" fill="currentColor" fillOpacity="0.22" />
        ) : null}
        {kind === "join" ? (
          <>
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
          </>
        ) : null}
        {kind === "me" ? (
          <>
            <circle cx="32" cy="22" r="10" fill="currentColor" fillOpacity="0.22" />
            <path d="M14 54q0-16 18-16t18 16z" fill="currentColor" fillOpacity="0.22" />
          </>
        ) : null}
      </g>
    </svg>
  );
}
