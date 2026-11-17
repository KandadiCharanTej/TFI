"use client";

import { Tx, useLang } from "./lang-provider";
import { TRANSLATIONS } from "@/lib/i18n";

/**
 * The తె / EN switch. The label stays "తె / EN" in both modes
 * (language names are the one allowed exception for Telugu script in English mode).
 * "తె" uses the 2.0 KB Anek Telugu Switch subset at weight 700, matched visually to "EN".
 */
export function LangSwitch({ className = "" }: { readonly className?: string }) {
  const { lang, setLang } = useLang();
  const next = lang === "te" ? "en" : "te";

  return (
    <button
      type="button"
      data-testid="lang-switch"
      onClick={() => {
        setLang(next);
        window.dispatchEvent(new CustomEvent("tfi:language_changed", { detail: { lang: next } }));
      }}
      className={`inline-flex min-h-[44px] min-w-[44px] items-center gap-1.5 rounded-full border-[2.5px] border-ink bg-sticker px-3 py-1 text-[15px] font-bold text-ink shadow-logo ${className}`}
    >
      <span className="visually-hidden">
        <Tx v={TRANSLATIONS.lang.switchHidden} />:{" "}
      </span>
      <span
        data-testid="lang-switch-te"
        lang="te"
        className={`lang-switch-te inline-flex h-[30px] min-w-[36px] items-center justify-center rounded-full px-2 text-[16px] font-bold leading-none ${
          lang === "te" ? "border-2 border-ink bg-yellow" : ""
        }`}
      >
        {TRANSLATIONS.lang.switchVisibleTe.te}
      </span>
      <span aria-hidden="true">/</span>
      <span
        data-testid="lang-switch-en"
        className={`inline-flex h-[30px] min-w-[36px] items-center justify-center rounded-full px-2 text-[15px] font-bold leading-none ${
          lang === "en" ? "border-2 border-ink bg-yellow" : ""
        }`}
      >
        {TRANSLATIONS.lang.switchVisibleEn.en}
      </span>
    </button>
  );
}
