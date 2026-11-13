"use client";

import { useFlags } from "@/components/flags-provider";
import { Tx } from "@/components/lang-provider";
import { TRANSLATIONS } from "@/lib/i18n";

export function FeedbackSticker({ className = "" }: { readonly className?: string }) {
  const { feedbackUrl } = useFlags();
  if (!feedbackUrl) return null;

  return (
    <a
      href={feedbackUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="feedback-sticker"
      className={`wall-btn inline-flex min-h-[44px] items-center justify-center bg-concrete px-4 text-[13px] text-ink ${className}`}
    >
      <Tx v={TRANSLATIONS.pages.sendFeedback} /> →
    </a>
  );
}
