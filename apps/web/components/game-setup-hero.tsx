"use client";

import type { ReactNode } from "react";
import { getGameColor } from "@tfi/config/tokens";
import { GameTitle } from "./game-title";
import { WallIcon, type WallIconKind } from "./icons";
import { Tx } from "./lang-provider";
import { Badge } from "./sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";
import type { Bi } from "@/lib/lang";

export interface GameSetupHeroProps {
  readonly slug: string;
  readonly gameNumber: string;
  readonly iconKind: WallIconKind;
  readonly title: Bi;
  readonly description: Bi;
  readonly modeLabel?: Bi;
  readonly isComingSoon?: boolean;
  readonly onOpenHowTo?: () => void;
  readonly howToTestId?: string;
  readonly extraBadge?: ReactNode;
}

/**
 * GameSetupHero: Color-banded setup header in the game's identity color
 * with oversized illustration + crisp white title card (WCAG AA on all colors).
 */
export function GameSetupHero({
  slug,
  gameNumber,
  iconKind,
  title,
  description,
  modeLabel = TRANSLATIONS.modes.onePhone,
  isComingSoon = false,
  onOpenHowTo,
  howToTestId,
  extraBadge,
}: GameSetupHeroProps) {
  const bg = getGameColor(slug);

  return (
    <section
      className="bg-halftone rounded-[20px] border-[3px] border-ink p-4 shadow-[0_6px_0_#141313] sm:p-5"
      style={{ backgroundColor: bg }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="white" mono>
            Game #{gameNumber}
          </Badge>
          <Badge tone={isComingSoon ? "card" : "white"}>
            <Tx v={modeLabel} />
          </Badge>
          {extraBadge}
        </div>
        {onOpenHowTo ? (
          <button
            type="button"
            onClick={onOpenHowTo}
            data-testid={howToTestId}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border-[2.5px] border-ink bg-white px-3.5 text-[13px] font-extrabold text-ink shadow-[0_3px_0_#141313]"
          >
            <span aria-hidden="true">?</span>
            <Tx v={TRANSLATIONS.nav.howItPlays} />
          </button>
        ) : null}
      </div>

      <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row">
        <div className="flex h-[108px] w-[108px] shrink-0 items-center justify-center rounded-[18px] border-[3px] border-ink bg-white p-1.5 shadow-[0_4px_0_#141313]">
          <WallIcon kind={iconKind} />
        </div>

        <div className="w-full rounded-[16px] border-[2.5px] border-ink bg-white p-4">
          <GameTitle
            as="h1"
            title={title}
            enClassName="text-[28px] sm:text-[32px]"
            teClassName="text-[28px] sm:text-[32px]"
          />
          <p className="m-0 mt-1 text-[15px] font-medium leading-[1.45] text-ink/90">
            <Tx v={description} />
          </p>
        </div>
      </div>
    </section>
  );
}
