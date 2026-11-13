"use client";

import { useLang } from "./lang-provider";
import type { Bi } from "@/lib/lang";

/**
 * A game title that follows the language rule.
 * English mode: Anton, uppercase, English letters only.
 * Telugu mode: Telugu large and leading, English letters small beneath.
 */
export function GameTitle({
  title,
  teClassName = "text-[24px]",
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
        <span className="te-sub block text-[13px] text-ink">{title.en}</span>
      </Tag>
    );
  }
  return (
    <Tag className={`anton-title m-0 leading-[1.05] text-ink ${enClassName}`}>{title.en}</Tag>
  );
}
