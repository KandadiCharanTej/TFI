import Link from "next/link";
import { WALL_COLORS } from "@tfi/config/tokens";
import {
  Badge,
  BidDisplay,
  Chip,
  Sticker,
  TapeStrip,
  TimerBar,
  WallButton,
} from "@/components/sticker-kit";
import { WallIcon } from "@/components/icons";
import { TELUGU_CONJUNCT_SAMPLES, TRANSLATIONS } from "@/lib/i18n";

export const metadata = {
  title: "Health & Design Token Check | TFI & Pitch",
};

export default function HealthPage() {
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
              <h1 className="anton-title text-4xl leading-none text-ink">
                {TRANSLATIONS.brand.name} · SYSTEM HEALTH
              </h1>
              <p className="te-script mt-1 text-xl text-ink" lang="te">
                {TRANSLATIONS.brand.tagline.te}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge tone="green">STATUS: HEALTHY</Badge>
            <Link href="/" className="wall-btn bg-yellow text-ink">
              Back to Wall →
            </Link>
          </div>
        </div>
      </header>

      <main id="content" tabIndex={-1} className="mx-auto mt-8 max-w-[1100px] space-y-10">
        {/* 1. Color Tokens */}
        <section aria-labelledby="tokens-heading">
          <h2 id="tokens-heading" className="anton-title text-3xl text-ink">
            1. Locked Wall Color Tokens (8 Colors Only)
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {colorEntries.map(([name, hex]) => {
              const isDark = name === "ink";
              return (
                <Sticker
                  key={name}
                  size="sm"
                  className="p-4"
                  style={{
                    backgroundColor: hex,
                    color: isDark ? "#EAE6DF" : "#141313",
                  }}
                >
                  <p className="mono-num text-[19px] uppercase">--{name}</p>
                  <p className="mono-num mt-1 text-2xl">{hex}</p>
                </Sticker>
              );
            })}
          </div>
        </section>

        {/* 2. Self-Hosted Fonts & Telugu Conjunct Verification */}
        <section aria-labelledby="fonts-heading">
          <h2 id="fonts-heading" className="anton-title text-3xl text-ink">
            2. Self-Hosted Fonts &amp; Telugu Conjunct Stress Test
          </h2>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <Sticker className="space-y-4 p-6">
              <div>
                <p className="mono-num text-xs uppercase text-ink">Anton (Titles, English Only)</p>
                <p className="anton-title mt-1 text-4xl text-ink">MOVIES. CRICKET. THE GANG.</p>
              </div>
              <div>
                <p className="mono-num text-xs uppercase text-ink">
                  Permanent Marker (1-2 Accent Words, Magenta on White)
                </p>
                <p className="marker-accent mt-1 text-4xl text-magenta">Gang</p>
              </div>
              <div>
                <p className="mono-num text-xs uppercase text-ink">
                  Plus Jakarta Sans 700/800 (Cards, Buttons, Prompts)
                </p>
                <p className="mt-1 text-lg font-extrabold text-ink">
                  Party games for friends, on one phone or online.
                </p>
              </div>
              <div>
                <p className="mono-num text-xs uppercase text-ink">
                  Space Mono Bold (Timers, Room Codes, Bids, Scores)
                </p>
                <p className="mono-num mt-1 text-2xl text-ink">
                  ROOM K7QM · 0:42 · 20 Cr · SCORE 4/6
                </p>
              </div>
            </Sticker>

            <Sticker className="space-y-4 p-6" data-testid="telugu-conjunct-card">
              <Badge tone="yellow">RULE 1: TELUGU FIRST (శ్రీ, క్ష, స్త్ర, ప్రే)</Badge>
              {TELUGU_CONJUNCT_SAMPLES.map((sample, idx) => (
                <div
                  key={idx}
                  className="rounded-[14px] border-2 border-ink bg-card p-3.5"
                >
                  <p
                    className="te-script text-[22px] leading-[1.6] text-ink"
                    lang="te"
                    data-testid={`conjunct-te-${idx}`}
                  >
                    {sample.te}
                  </p>
                  <p className="mt-1 text-[16px] font-bold text-ink">{sample.en}</p>
                </div>
              ))}
            </Sticker>
          </div>
        </section>

        {/* 3. Sticker Kit Primitives */}
        <section aria-labelledby="kit-heading">
          <h2 id="kit-heading" className="anton-title text-3xl text-ink">
            3. Sticker Kit Primitives
          </h2>
          <Sticker className="mt-4 space-y-6 p-6">
            <div className="flex flex-wrap items-center gap-4">
              <WallButton variant="yellow">Play Now →</WallButton>
              <WallButton variant="white">See the games</WallButton>
              <WallButton variant="green">✓ Correct</WallButton>
              <WallButton variant="magenta">✕ Pass / Bid 25 Cr</WallButton>
              <Chip active dotColor="#F6BE18">
                Cinema
              </Chip>
              <Chip dotColor="#00C853">Cricket</Chip>
              <Badge tone="cyan" mono>
                K7QM
              </Badge>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <TimerBar secondsRemaining={42} totalSeconds={60} label="Round timer" />
              <BidDisplay currentBidCr={20} compact />
            </div>
          </Sticker>
        </section>

        <TapeStrip
          items={[
            "Head Set Go",
            "Transify",
            "Dumb Charades",
            "Emoji Cinema",
            "Box Office Auction",
            "Cricket IQ",
            "Dream XI",
            "Cricket Auction",
            "Rapid Fire",
            "Most Likely",
          ]}
        />
      </main>
    </div>
  );
}
