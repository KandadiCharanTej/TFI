import Link from "next/link";
import { WALL_COLORS } from "@tfi/config/tokens";
import { LangSwitch } from "@/components/lang-switch";
import { Tx } from "@/components/lang-provider";
import { TeluguOnly } from "@/components/te-only";
import { BidDisplay, Badge, Chip, Sticker, TapeStrip, TimerBar, WallButton } from "@/components/sticker-kit";
import { WallIcon } from "@/components/icons";
import { getVisibleCatalog } from "@/lib/games";
import { BRAND_NAME, TELUGU_CONJUNCT_SAMPLES, TRANSLATIONS } from "@/lib/i18n";
import { getServerLang } from "@/lib/lang-server";

export const metadata = {
  title: "Health | TFI & Pitch",
};

const H = TRANSLATIONS.health;

export default async function HealthPage() {
  const lang = await getServerLang();
  const colorEntries = Object.entries(WALL_COLORS);

  return (
    <div className="min-h-screen px-4 py-8 text-ink md:px-10">
      <header className="mx-auto max-w-[1100px] border-b-[3px] border-ink pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-block h-10 w-10 rounded-[10px] border-[2.5px] border-ink bg-yellow p-1.5 text-ink">
              <WallIcon kind="mark" />
            </span>
            <div>
              <h1 className="h1-title m-0 text-ink">
                <span className="keep-case">{BRAND_NAME}</span> · <Tx v={H.title} />
              </h1>
              <p className="m-0 mt-1 text-xl font-extrabold text-ink">
                <Tx v={TRANSLATIONS.brand.tagline} />
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <LangSwitch />
            <Badge tone="green">
              ✓ <Tx v={H.status} />
            </Badge>
            <Link href="/" className="wall-btn bg-yellow text-ink">
              <Tx v={H.backToWall} /> →
            </Link>
          </div>
        </div>
      </header>

      <main id="content" tabIndex={-1} className="mx-auto mt-8 max-w-[1100px] space-y-10">
        <section aria-labelledby="tokens-heading">
          <h2 id="tokens-heading" className="h2-title m-0 text-ink">
            <Tx v={H.tokens} />
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {colorEntries.map(([name, hex]) => (
              <Sticker
                key={name}
                size="sm"
                className="p-4"
                style={{
                  backgroundColor: hex,
                  color: name === "ink" ? "#EAE6DF" : "#141313",
                }}
              >
                <p className="mono-num m-0 text-[19px] uppercase">--{name}</p>
                <p className="mono-num m-0 mt-1 text-2xl">{hex}</p>
              </Sticker>
            ))}
          </div>
        </section>

        <section aria-labelledby="fonts-heading">
          <h2 id="fonts-heading" className="h2-title m-0 text-ink">
            <Tx v={H.fonts} />
          </h2>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <Sticker className="space-y-4 p-6">
              <div>
                <p className="wall-label m-0 text-ink">Bricolage Grotesque (Display)</p>
                <p className="display-title m-0 mt-1 text-3xl text-ink">
                  <Tx v={TRANSLATIONS.landing.heroLine1} /> <Tx v={TRANSLATIONS.landing.heroLine2} />
                </p>
              </div>
              <div>
                <p className="wall-label m-0 text-ink">Bricolage Grotesque (Body)</p>
                <p className="body-lg m-0 mt-1 text-ink">
                  <Tx v={TRANSLATIONS.landing.heroSubline} />
                </p>
              </div>
              <div>
                <p className="wall-label m-0 text-ink">Space Mono Bold</p>
                <p className="mono-num m-0 mt-1 text-2xl text-ink">KXQM · 0:42 · 20 Cr · 4/6</p>
              </div>
            </Sticker>

            <Sticker className="space-y-4 p-6" data-testid="telugu-conjunct-card">
              <Badge tone="yellow">
                <Tx v={H.teluguTest} />
              </Badge>
              <TeluguOnly
                fallback={
                  <p className="m-0 text-base font-bold text-ink" data-testid="telugu-only-note">
                    <Tx v={H.teluguOnlyNote} />
                  </p>
                }
              >
                {TELUGU_CONJUNCT_SAMPLES.map((sample, idx) => (
                  <div key={sample.en} className="rounded-[14px] border-2 border-ink bg-card p-3.5">
                    <p
                      className="te-lead m-0 text-[22px] leading-[1.6] text-ink"
                      data-testid={`conjunct-te-${idx}`}
                    >
                      {sample.te}
                    </p>
                    <p className="m-0 mt-1 text-[14px] font-bold text-ink">{sample.en}</p>
                  </div>
                ))}
              </TeluguOnly>
            </Sticker>
          </div>
        </section>

        <section aria-labelledby="kit-heading">
          <h2 id="kit-heading" className="h2-title m-0 text-ink">
            <Tx v={H.kit} />
          </h2>
          <Sticker className="mt-4 space-y-6 p-6">
            <div className="flex flex-wrap items-center gap-4">
              <WallButton variant="yellow">
                <Tx v={H.playNow} /> →
              </WallButton>
              <WallButton variant="white">
                <Tx v={H.seeGames} />
              </WallButton>
              <WallButton variant="green">
                ✓ <Tx v={TRANSLATIONS.common.correct} />
              </WallButton>
              <WallButton variant="magenta">
                ✕ <Tx v={H.passBid} />
              </WallButton>
              <Chip active dotColor="#F6BE18">
                <Tx v={TRANSLATIONS.modeFilter.onePhone} />
              </Chip>
              <Chip dotColor="#00E5FF">
                <Tx v={TRANSLATIONS.modeFilter.online} />
              </Chip>
              <Badge tone="cyan" mono>
                KXQM
              </Badge>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <TimerBar secondsRemaining={42} totalSeconds={60} label={H.roundTimer[lang]} />
              <BidDisplay currentBidCr={20} compact label={TRANSLATIONS.pages.bidLabel[lang]} />
            </div>
          </Sticker>
        </section>

        <TapeStrip
          label={TRANSLATIONS.landing.pickYourGameHeading[lang]}
          items={getVisibleCatalog(false).map((g) => g.title[lang])}
        />
      </main>
    </div>
  );
}
