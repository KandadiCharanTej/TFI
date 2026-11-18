"use client";

import Link from "next/link";
import { useFlags } from "@/components/flags-provider";
import { Tx, useT } from "@/components/lang-provider";
import { TRANSLATIONS } from "@/lib/i18n";

export function PublicFooter({ className = "" }: { readonly className?: string }) {
  const { feedbackUrl } = useFlags();
  const t = useT();

  return (
    <footer
      className={`border-t-[3px] border-ink bg-concrete px-4 py-6 text-ink min-[430px]:px-5 md:px-8 ${className}`}
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="m-0 text-[16px] font-bold text-ink">
          <Tx v={TRANSLATIONS.brand.unofficialDisclaimer} />
        </p>
        <nav aria-label={t(TRANSLATIONS.nav.footerNav)} className="flex flex-wrap gap-2 text-[14px] font-extrabold">
          <Link href="/about" prefetch={false} className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-2 underline">
            <Tx v={TRANSLATIONS.nav.about} />
          </Link>
          <Link href="/privacy" prefetch={false} className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-2 underline">
            <Tx v={TRANSLATIONS.nav.privacy} />
          </Link>
          <Link href="/terms" prefetch={false} className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-2 underline">
            <Tx v={TRANSLATIONS.nav.terms} />
          </Link>
          {feedbackUrl ? (
            <a
              href={feedbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-2 underline"
            >
              <Tx v={TRANSLATIONS.nav.feedback} />
            </a>
          ) : null}
        </nav>
      </div>
    </footer>
  );
}
