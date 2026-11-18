"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  buildLangCookie,
  fmt,
  readLangFromCookieString,
  type Bi,
  type Lang,
} from "@/lib/lang";

interface LangContextValue {
  readonly lang: Lang;
  readonly setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextValue>({ lang: "en", setLang: () => undefined });

export interface LangProviderProps {
  /** The language the server read from the cookie. */
  readonly initialLang: Lang;
  readonly children: ReactNode;
}

export function LangProvider({ initialLang, children }: LangProviderProps) {
  const router = useRouter();
  const [lang, setLangState] = useState<Lang>(initialLang);

  // The server value wins on navigation; a cached offline page may be stale,
  // so on mount we trust the real cookie.
  useEffect(() => {
    const fromCookie = readLangFromCookieString(document.cookie);
    if (fromCookie !== lang) {
      setLangState(fromCookie);
      document.documentElement.lang = fromCookie;
    }
    // Only on first mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLang = useCallback(
    (next: Lang) => {
      document.cookie = buildLangCookie(next);
      document.documentElement.lang = next;
      setLangState(next);
      // Re-render server parts (html lang, font preload) with the new cookie.
      router.refresh();
    },
    [router],
  );

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  return useContext(LangContext);
}

/** Renders one translated string in the current language. */
export function Tx({ v, values }: { readonly v?: Bi | null; readonly values?: Record<string, string | number> }) {
  const { lang } = useLang();
  if (!v) return null;
  const text = v[lang] ?? v.en ?? "";
  return <>{values ? fmt(text, values) : text}</>;
}

/** Returns a translate function for use in attributes and logic. */
export function useT(): (v?: Bi | null, values?: Record<string, string | number>) => string {
  const { lang } = useLang();
  return useCallback(
    (v?: Bi | null, values?: Record<string, string | number>) => {
      if (!v) return "";
      const text = v[lang] ?? v.en ?? "";
      return values ? fmt(text, values) : text;
    },
    [lang],
  );
}

/**
 * A game, film or person name: English mode shows English letters only.
 * Telugu mode shows Telugu large and leading with the English letters small beneath.
 */
export function BiWord({
  word,
  leadClassName = "",
  subClassName = "",
  as: Tag = "span",
}: {
  readonly word: Bi;
  readonly leadClassName?: string;
  readonly subClassName?: string;
  readonly as?: "span" | "p" | "h1" | "h2" | "h3";
}) {
  const { lang } = useLang();
  if (lang === "en") {
    return <Tag className={leadClassName}>{word.en}</Tag>;
  }
  return (
    <>
      <Tag className={`te-lead ${leadClassName}`}>{word.te}</Tag>
      <span className={`te-sub block ${subClassName}`}>{word.en}</span>
    </>
  );
}
