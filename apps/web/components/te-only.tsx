"use client";

import type { ReactNode } from "react";
import { useLang } from "./lang-provider";

/** Renders `children` only in Telugu mode, otherwise `fallback`. */
export function TeluguOnly({
  children,
  fallback = null,
}: {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
}) {
  const { lang } = useLang();
  return <>{lang === "te" ? children : fallback}</>;
}
