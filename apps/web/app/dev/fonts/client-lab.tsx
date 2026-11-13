/* eslint-disable @next/next/no-page-custom-font */
"use client";

import { useState } from "react";

interface Direction {
  id: string;
  name: string;
  tagline: string;
  display: string;
  accent: string;
  body: string;
  mono: string;
  telugu: string;
  teluguWeight: string;
}

const DIRECTIONS: Direction[] = [
  {
    id: "baseline",
    name: "Baseline (Current)",
    tagline: "Anton + Permanent Marker + Jakarta + Space Mono + Noto Sans Telugu",
    display: "'Anton', sans-serif",
    accent: "'Permanent Marker', cursive",
    body: "'Plus Jakarta Sans', sans-serif",
    mono: "'Space Mono', monospace",
    telugu: "'Noto Sans Telugu', sans-serif",
    teluguWeight: "800",
  },
  {
    id: "poster",
    name: "A · Poster",
    tagline: "Anton + Permanent Marker + Jakarta + Space Mono + Anek Telugu",
    display: "'Anton', sans-serif",
    accent: "'Permanent Marker', cursive",
    body: "'Plus Jakarta Sans', sans-serif",
    mono: "'Space Mono', monospace",
    telugu: "'Anek Telugu', sans-serif",
    teluguWeight: "800",
  },
  {
    id: "friendly",
    name: "B · Friendly Party",
    tagline: "Lilita One + Caveat Brush + Figtree + DM Mono + Baloo Tammudu 2",
    display: "'Lilita One', cursive",
    accent: "'Caveat Brush', cursive",
    body: "'Figtree', sans-serif",
    mono: "'DM Mono', monospace",
    telugu: "'Baloo Tammudu 2', cursive",
    teluguWeight: "800",
  },
  {
    id: "sharp",
    name: "C · Sharp",
    tagline: "Archivo (Black 900) + Rock Salt + Jakarta + JetBrains Mono + Hind Guntur",
    display: "'Archivo Black', sans-serif",
    accent: "'Rock Salt', cursive",
    body: "'Plus Jakarta Sans', sans-serif",
    mono: "'JetBrains Mono', monospace",
    telugu: "'Hind Guntur', sans-serif",
    teluguWeight: "700",
  },
];

const KB_SIZES = [
  { font: "Anton (latin)", file: "anton-latin.woff2", size: "11.7 KB", license: "OFL 1.1" },
  { font: "Permanent Marker (latin)", file: "permanent-marker-latin.woff2", size: "28.6 KB", license: "Apache 2.0" },
  { font: "Plus Jakarta Sans (latin)", file: "plus-jakarta-sans-latin.woff2", size: "26.6 KB", license: "OFL 1.1" },
  { font: "Plus Jakarta Sans (ext)", file: "plus-jakarta-sans-latin-ext.woff2", size: "21.2 KB", license: "OFL 1.1" },
  { font: "Space Mono Bold (latin)", file: "space-mono-bold-latin.woff2", size: "9.3 KB", license: "OFL 1.1" },
  { font: "Space Mono Bold (ext)", file: "space-mono-bold-latin-ext.woff2", size: "9.5 KB", license: "OFL 1.1" },
  { font: "Noto Sans Telugu (subset)", file: "noto-sans-telugu.woff2", size: "120.9 KB", license: "OFL 1.1" },
  { font: "Noto Sans Telugu Latin", file: "noto-sans-telugu-latin.woff2", size: "31.1 KB", license: "OFL 1.1" },
  { font: "Anek Telugu (candidate A)", file: "Google CDN woff2", size: "~38 KB (subset)", license: "OFL 1.1" },
  { font: "Baloo Tammudu 2 (candidate B)", file: "Google CDN woff2", size: "~45 KB (subset)", license: "OFL 1.1" },
  { font: "Hind Guntur (candidate C)", file: "Google CDN woff2", size: "~42 KB (subset)", license: "OFL 1.1" },
  { font: "Lilita One (candidate B)", file: "Google CDN woff2", size: "~24 KB", license: "OFL 1.1" },
  { font: "Caveat Brush (candidate B)", file: "Google CDN woff2", size: "~32 KB", license: "OFL 1.1" },
  { font: "Figtree (candidate B)", file: "Google CDN woff2", size: "~25 KB", license: "OFL 1.1" },
  { font: "DM Mono (candidate B)", file: "Google CDN woff2", size: "~18 KB", license: "OFL 1.1" },
  { font: "Archivo Black (candidate C)", file: "Google CDN woff2", size: "~24 KB", license: "OFL 1.1" },
  { font: "Rock Salt (candidate C)", file: "Google CDN woff2", size: "~36 KB", license: "Apache 2.0" },
  { font: "JetBrains Mono (candidate C)", file: "Google CDN woff2", size: "~22 KB", license: "OFL 1.1" },
];

export default function ClientFontLab() {
  const [lang, setLang] = useState<"en" | "te">("en");

  return (
    <div className="min-h-screen bg-[#EAE6DF] p-4 text-[#141313] md:p-8" data-testid="font-lab-page">
      {/* External font stylesheet injection for dev testing */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Anek+Telugu:wght@700;800&family=Archivo+Black&family=Baloo+Tammudu+2:wght@700;800&family=Caveat+Brush&family=DM+Mono:wght@500&family=Figtree:wght@400;700&family=Hind+Guntur:wght@600;700&family=JetBrains+Mono:wght@500;700&family=Lilita+One&family=Rock+Salt&display=swap"
      />

      <header className="mb-8 rounded-[20px] border-[3px] border-[#141313] bg-white p-6 shadow-[5px_5px_0_#141313]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-block rounded-full border-2 border-[#141313] bg-[#F6BE18] px-3 py-0.5 text-xs font-black uppercase">
              Dev Only · Lab
            </div>
            <h1 className="anton-title mt-2 text-3xl font-black uppercase tracking-tight md:text-4xl">
              Typography Comparison Lab
            </h1>
            <p className="mt-1 text-sm font-bold text-[#141313]/80">
              Side-by-side evaluation of 3 font directions against current baseline.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold uppercase">Mode:</span>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`rounded-[10px] border-2 border-[#141313] px-4 py-2 font-black transition-all ${
                lang === "en" ? "bg-[#F6BE18] shadow-[3px_3px_0_#141313]" : "bg-white"
              }`}
              data-testid="lab-toggle-en"
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang("te")}
              className={`rounded-[10px] border-2 border-[#141313] px-4 py-2 font-black transition-all ${
                lang === "te" ? "bg-[#F6BE18] shadow-[3px_3px_0_#141313]" : "bg-white"
              }`}
              data-testid="lab-toggle-te"
            >
              తెలుగు (Telugu)
            </button>
          </div>
        </div>
      </header>

      {/* Grid of 4 Directions */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {DIRECTIONS.map((dir) => (
          <section
            key={dir.id}
            className="flex flex-col rounded-[24px] border-[3px] border-[#141313] bg-white p-6 shadow-[6px_6px_0_#141313]"
            style={{
              fontFamily: lang === "te" ? dir.telugu : dir.body,
            }}
          >
            {/* Header */}
            <div className="border-b-[2.5px] border-[#141313] pb-4">
              <span className="rounded-full border-2 border-[#141313] bg-[#00E5FF] px-3 py-1 text-xs font-black uppercase">
                {dir.name}
              </span>
              <p className="mt-2 text-xs font-bold text-[#141313]/70">{dir.tagline}</p>
            </div>

            {/* 1. Landing Headline */}
            <div className="mt-6">
              <div className="text-[11px] font-black uppercase tracking-wider text-[#141313]/60">
                1. Landing Headline
              </div>
              <div
                className="mt-2 leading-[1.0]"
                style={{
                  fontFamily: lang === "te" ? dir.telugu : dir.display,
                  fontWeight: lang === "te" ? (dir.teluguWeight as "700" | "800") : 900,
                  fontSize: lang === "te" ? "38px" : "44px",
                  lineHeight: lang === "te" ? "1.5" : "1.0",
                }}
              >
                {lang === "en" ? (
                  <>
                    Movies.
                    <br />
                    Cricket.
                    <br />
                    The{" "}
                    <span
                      className="inline-block rounded-[12px] border-[3px] border-[#141313] bg-white px-3 py-0.5 text-[#EC1276]"
                      style={{
                        fontFamily: dir.accent,
                        transform: "rotate(-2deg)",
                        boxShadow: "4px 4px 0 #141313",
                        fontSize: "0.85em",
                      }}
                    >
                      Gang
                    </span>
                  </>
                ) : (
                  <>
                    సినిమా.
                    <br />
                    క్రికెట్.
                    <br />
                    మన{" "}
                    <span
                      className="inline-block rounded-[12px] border-[3px] border-[#141313] bg-white px-3 py-0.5 text-[#EC1276]"
                      style={{
                        fontFamily: dir.telugu,
                        fontWeight: 800,
                        transform: "rotate(-2deg)",
                        boxShadow: "4px 4px 0 #141313",
                        fontSize: "0.85em",
                      }}
                    >
                      గ్యాంగ్
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* 2. Sticker Judge Card */}
            <div className="mt-6">
              <div className="text-[11px] font-black uppercase tracking-wider text-[#141313]/60">
                2. Judge Card Mock
              </div>
              <div className="mt-2 rounded-[20px] border-[3px] border-[#141313] bg-[#FFFFFF] p-5 shadow-[4px_4px_0_#141313]">
                {/* Top row */}
                <div className="flex items-center justify-between border-b-2 border-dashed border-[#141313] pb-3">
                  <span
                    className="rounded-full border-2 border-[#141313] bg-[#EAE6DF] px-3 py-0.5 text-xs font-black"
                    style={{ fontFamily: dir.mono }}
                  >
                    {lang === "en" ? "SCORE 4/6" : "స్కోర్ 4/6"}
                  </span>
                  <span
                    className="rounded-full border-2 border-[#141313] bg-[#F6BE18] px-3 py-0.5 text-sm font-black"
                    style={{ fontFamily: dir.mono }}
                  >
                    0:42
                  </span>
                </div>

                {/* Judge clue */}
                <div className="py-4 text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#141313]/60">
                    {lang === "en" ? "THE JUDGE READS" : "జడ్జ్ చదువుతారు"}
                  </span>
                  <div
                    className="mt-1 text-3xl font-black"
                    style={{
                      fontFamily: lang === "te" ? dir.telugu : dir.display,
                      lineHeight: lang === "te" ? "1.5" : "1.1",
                    }}
                  >
                    {lang === "en" ? "Rogue" : "రోగ్"}
                  </div>
                </div>

                {/* Answer strip */}
                <div className="rounded-[12px] border-[2px] border-[#141313] bg-[#F6BE18] p-3 text-center">
                  <div className="text-[10px] font-black uppercase tracking-wider">
                    {lang === "en" ? "ANSWER" : "జవాబు"}
                  </div>
                  <div className="mt-0.5 flex flex-col items-center justify-center">
                    <span
                      className="text-xl font-extrabold text-[#141313]"
                      style={{
                        fontFamily: dir.telugu,
                        lineHeight: "1.5",
                      }}
                    >
                      పోకిరి
                    </span>
                    <span className="text-xs font-bold text-[#141313]/80">Pokiri</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    className="flex-1 rounded-[12px] border-[2.5px] border-[#141313] bg-[#FFFFFF] py-2.5 text-sm font-extrabold uppercase shadow-[3px_3px_0_#141313]"
                  >
                    {lang === "en" ? "Skip" : "వదిలేయి"}
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-[12px] border-[2.5px] border-[#141313] bg-[#00C853] py-2.5 text-sm font-extrabold uppercase shadow-[3px_3px_0_#141313]"
                  >
                    {lang === "en" ? "Correct" : "సరైనది"}
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Timer & Button */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex-1">
                <div className="text-[11px] font-black uppercase tracking-wider text-[#141313]/60">
                  3. Timer (Mono)
                </div>
                <div
                  className="mt-1 text-4xl font-black text-[#141313]"
                  style={{ fontFamily: dir.mono }}
                >
                  1:30
                </div>
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-black uppercase tracking-wider text-[#141313]/60">
                  4. Button Label
                </div>
                <button
                  type="button"
                  className="mt-1 w-full rounded-[14px] border-[2.5px] border-[#141313] bg-[#F6BE18] py-3 text-base font-black uppercase shadow-[4px_4px_0_#141313]"
                >
                  {lang === "en" ? "Play now →" : "ఇప్పుడే ఆడండి →"}
                </button>
              </div>
            </div>

            {/* 5. Body text at 12px, 14px, 16px */}
            <div className="mt-6 border-t-2 border-dashed border-[#141313] pt-4">
              <div className="text-[11px] font-black uppercase tracking-wider text-[#141313]/60">
                5. Body text (16px / 14px / 12px)
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-[16px] leading-[1.5]">
                  {lang === "en"
                    ? "16px: Pick a game, set the timer, and pass the phone around."
                    : "16px: గేమ్ ఎంచుకోండి, టైమర్ సెట్ చేయండి, ఫోన్ పాస్ చేయండి."}
                </p>
                <p className="text-[14px] leading-[1.5]">
                  {lang === "en"
                    ? "14px: Fast party games built around Telugu cinema and cricket banter."
                    : "14px: తెలుగు సినిమా, క్రికెట్ కబుర్లపై సరదా పార్టీ గేమ్స్."}
                </p>
                <p className="text-[12px] leading-[1.5] text-[#141313]/70">
                  {lang === "en"
                    ? "12px: Unofficial fan-made game. Not affiliated with any studio or team."
                    : "12px: అనధికారిక అభిమానుల ఆట. ఏ సినిమా లేదా జట్టుతో సంబంధం లేదు."}
                </p>
              </div>
            </div>

            {/* 6. Telugu Conjuncts & Sample Words */}
            <div className="mt-6 border-t-2 border-dashed border-[#141313] pt-4">
              <div className="text-[11px] font-black uppercase tracking-wider text-[#141313]/60">
                6. Telugu Conjuncts & Words (Clipping & Line-height check)
              </div>

              {/* Conjuncts */}
              <div className="mt-3">
                <span className="text-xs font-bold text-[#141313]/70">
                  Conjuncts: శ్రీ, క్ష, స్త్ర, ప్రే
                </span>
                <div
                  className="mt-1 space-y-2 rounded-[14px] border-2 border-[#141313] bg-[#F4F1EA] p-3 overflow-x-auto"
                  style={{ fontFamily: dir.telugu, fontWeight: 800 }}
                >
                  <div className="text-[24px] leading-[1.6]">24px: శ్రీ, క్ష, స్త్ర, ప్రే</div>
                  <div className="text-[48px] leading-[1.6]">48px: శ్రీ, క్ష, స్త్ర, ప్రే</div>
                  <div className="text-[88px] leading-[1.6]">88px: శ్రీ, క్ష, స్త్ర, ప్రే</div>
                </div>
              </div>

              {/* Sample Words */}
              <div className="mt-4">
                <span className="text-xs font-bold text-[#141313]/70">
                  Words: పోకిరి, మగధీర, బొమ్మరిల్లు, అతడు, ఈగ
                </span>
                <div
                  className="mt-1 space-y-2 rounded-[14px] border-2 border-[#141313] bg-[#F4F1EA] p-3 overflow-x-auto"
                  style={{ fontFamily: dir.telugu, fontWeight: 800 }}
                >
                  <div className="text-[24px] leading-[1.6]">24px: పోకిరి, మగధీర, బొమ్మరిల్లు, అతడు, ఈగ</div>
                  <div className="text-[48px] leading-[1.6]">48px: పోకిరి, మగధీర, బొమ్మరిల్లు, అతడు, ఈగ</div>
                  <div className="text-[88px] leading-[1.6]">88px: పోకిరి, మగధీర, బొమ్మరిల్లు, అతడు, ఈగ</div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Font Size & License Tables */}
      <footer className="mt-12 space-y-8 rounded-[24px] border-[3px] border-[#141313] bg-white p-6 shadow-[6px_6px_0_#141313]">
        <div>
          <h2 className="anton-title text-2xl font-black uppercase">
            Font Weights, Compressed Sizes & Budget Table
          </h2>
          <p className="mt-1 text-sm font-bold text-[#141313]/70">
            Budget for Telugu mode font payload: <strong>250 KB total</strong>. Current self-hosted Noto Sans Telugu is 120.9 KB (Telugu) + 31.1 KB (Latin) = 152 KB.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse border border-[#141313]">
              <thead>
                <tr className="bg-[#F6BE18] text-[#141313]">
                  <th className="border border-[#141313] p-2.5 font-black uppercase">Font Family</th>
                  <th className="border border-[#141313] p-2.5 font-black uppercase">File / Delivery</th>
                  <th className="border border-[#141313] p-2.5 font-black uppercase">Size (KB)</th>
                  <th className="border border-[#141313] p-2.5 font-black uppercase">License</th>
                </tr>
              </thead>
              <tbody>
                {KB_SIZES.map((row) => (
                  <tr key={row.font} className="odd:bg-white even:bg-[#F4F1EA]">
                    <td className="border border-[#141313] p-2 font-bold">{row.font}</td>
                    <td className="border border-[#141313] p-2 font-mono text-xs">{row.file}</td>
                    <td className="border border-[#141313] p-2 font-black">{row.size}</td>
                    <td className="border border-[#141313] p-2 font-bold">{row.license}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </footer>
    </div>
  );
}
