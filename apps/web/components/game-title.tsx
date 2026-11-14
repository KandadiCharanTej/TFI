"use client";

import { useLang } from "./lang-provider";
import type { Bi } from "@/lib/lang";

/**
 * A game title that follows the V2 language & typography rule.
 * English mode: Bricolage Grotesque 700-800, sentence case, English letters only.
 * Telugu mode: Anek Telugu large and leading, English letters small beneath.
 */
export function GameTitle({
  title,
  teClassName = "text-[22px]",
  enClassName = "text-[22px]",
  as = "h3",
}: {
  readonly title: Bi;
  readonly teClassName?: string;
  readonly enClassName?: string;
  readonly as?: "h1" | "h2" | "h3" | "p";
}) {
  const { lang } = useLang();
  const Tag = as;
  if (lang === "te") {
    return (
      <Tag className={`te-lead m-0 text-ink ${teClassName}`}>
        {title.te}
        <span className="te-sub block text-[13px] text-ink/80">{title.en}</span>
      </Tag>
    );
  }
  return (
    <Tag className={`h3-title m-0 text-ink ${enClassName}`}>{title.en}</Tag>
  );
}
