/* eslint-disable @next/next/no-page-custom-font */
"use client";

import { useState } from "react";

interface Candidate {
  id: string;
  code: string;
  name: string;
  winner?: boolean;
  license: string;
  weights: string;
  tagline: string;
  displayFont: string;
  displayStretch?: string;
  displayWeight: number;
  bodyFont: string;
  teluguDisplayFont: string;
  teluguBodyFont: string;
  monoFont: string;
  enKb: string;
  teKb: string;
  notes: string;
}

const CANDIDATES: Candidate[] = [
  {
    id: "l1",
    code: "L1",
    winner: true,
    name: "Bricolage Grotesque Condensed (75%) + Bricolage + Anek Telugu 800",
    license: "SIL OFL 1.1",
    weights: "Display: 800 Condensed (wdth 75%); Body: 500..800; Telugu: 700..800; Mono: 700",
    tagline: "Single multi-axis optical family with punchy 75% condensed ExtraBold posters",
    displayFont: "'Bricolage Grotesque', sans-serif",
    displayStretch: "75%",
    displayWeight: 800,
    bodyFont: "'Bricolage Grotesque', sans-serif",
    teluguDisplayFont: "'Anek Telugu', 'Bricolage Grotesque', sans-serif",
    teluguBodyFont: "'Anek Telugu', 'Bricolage Grotesque', sans-serif",
    monoFont: "'Space Mono', monospace",
    enKb: "62.3 KB (21 KB Cond + 30 KB Body + 9.3 KB Mono + 2 KB తె)",
    teKb: "198.7 KB (+ 136.4 KB Anek Telugu)",
    notes:
      "WINNER: Condensed 75% width gives loud 120px poster height without breaking 390px or 1280px lines; opsz axis keeps 14px labels crisp; pairs naturally with Anek Telugu 800 well under 140/280 KB budgets.",
  },
  {
    id: "l2",
    code: "L2",
    name: "Unbounded 800/900 (display) + Bricolage Grotesque + Anek Telugu 800",
    license: "SIL OFL 1.1",
    weights: "Display: 800..900; Body: 500..800; Telugu: 700..800; Mono: 700",
    tagline: "Ultra-wide geometric display paired with Bricolage body",
    displayFont: "'Unbounded Lab', sans-serif",
    displayWeight: 900,
    bodyFont: "'Bricolage Grotesque', sans-serif",
    teluguDisplayFont: "'Anek Telugu', sans-serif",
    teluguBodyFont: "'Anek Telugu', sans-serif",
    monoFont: "'Space Mono', monospace",
    enKb: "91.3 KB (50 KB Unbounded + 30 KB Body + 9.3 KB Mono + 2 KB తె)",
    teKb: "227.7 KB (+ 136.4 KB Anek Telugu)",
    notes:
      "Loud geometric swagger, but Unbounded's extra-wide stance forces multi-word headlines onto 4+ lines at 120px and risks orphan words on narrow phones.",
  },
  {
    id: "l3",
    code: "L3",
    name: "Lilita One (display) + Figtree + Baloo Tammudu 2 800 + Anek Telugu",
    license: "SIL OFL 1.1",
    weights: "Lilita One: 400 only; Figtree: 500..800; Baloo Tammudu 2: 700..800; Anek: 700..800",
    tagline: "Chunky rounded toy display with friendly sans and rounded Telugu",
    displayFont: "'Lilita One Lab', sans-serif",
    displayWeight: 400,
    bodyFont: "'Figtree Lab', sans-serif",
    teluguDisplayFont: "'Baloo Tammudu 2 Lab', 'Anek Telugu', sans-serif",
    teluguBodyFont: "'Anek Telugu', sans-serif",
    monoFont: "'Space Mono', monospace",
    enKb: "41.3 KB (10 KB Lilita + 20 KB Figtree + 9.3 KB Mono + 2 KB తె)",
    teKb: "262.7 KB (+ 85 KB Baloo + 136.4 KB Anek Telugu)",
    notes:
      "Note: Lilita One ships in weight 400 only (no 800 weight); Baloo Tammudu 2 adds 85 KB in Telugu mode and tall rounded vowels risk tighter clipping at 96px.",
  },
];

export default function ClientFontLab() {
  const [lang, setLang] = useState<"en" | "te">("en");
  const [heroAccent, setHeroAccent] = useState<"none" | "shrikhand">("none");

  return (
    <div className="min-h-screen bg-[#EAE6DF] p-4 text-[#141313] md:p-8" data-testid="font-lab-page">
      <style>{`
        @font-face {
          font-family: 'Unbounded Lab';
          font-style: normal;
          font-weight: 800 900;
          font-display: swap;
          src: url('/fonts/unbounded-800-900-latin.woff2') format('woff2');
        }
        @font-face {
          font-family: 'Lilita One Lab';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: url('/fonts/lilita-one-latin.woff2') format('woff2');
        }
        @font-face {
          font-family: 'Figtree Lab';
          font-style: normal;
          font-weight: 500 800;
          font-display: swap;
          src: url('/fonts/figtree-latin.woff2') format('woff2');
        }
        @font-face {
          font-family: 'Baloo Tammudu 2 Lab';
          font-style: normal;
          font-weight: 700 800;
          font-display: swap;
          src: url('/fonts/baloo-tammudu-2-telugu.woff2') format('woff2');
        }
        @font-face {
          font-family: 'Shrikhand Lab';
          font-style: italic;
          font-weight: 400;
          font-display: swap;
          src: url('/fonts/shrikhand-latin.woff2') format('woff2');
        }
      `}</style>

      <header className="mx-auto max-w-[1280px] rounded-[20px] border-[3px] border-[#141313] bg-white p-6 shadow-[0_6px_0_#141313]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="wall-label m-0 text-[#141313]">Font Lab · Round 3 (Party Mode Loud Display)</p>
            <h1 className="h2-title m-0 mt-1 text-[#141313]">
              Loud enough to throw a party, tight enough to read in 5 seconds
            </h1>
            <p className="m-0 mt-2 max-w-[66ch] text-[16px] font-medium">
              Comparing L1 (Bricolage Condensed 800), L2 (Unbounded 800/900), and L3 (Lilita One + Figtree + Baloo Tammudu 2 800) with Space Mono + Anek Telugu 800, at 120 px Display and 14 px Labels.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setLang("en")}
              data-testid="lab-toggle-en"
              className={`wall-btn min-h-[44px] px-4 text-[15px] ${
                lang === "en" ? "bg-[#F6BE18]" : "bg-white"
              }`}
            >
              English (EN)
            </button>
            <button
              type="button"
              onClick={() => setLang("te")}
              data-testid="lab-toggle-te"
              className={`wall-btn min-h-[44px] px-4 text-[15px] ${
                lang === "te" ? "bg-[#F6BE18]" : "bg-white"
              }`}
            >
              తెలుగు (TE)
            </button>
            <button
              type="button"
              onClick={() => setHeroAccent(heroAccent === "none" ? "shrikhand" : "none")}
              data-testid="lab-toggle-accent"
              className={`wall-btn min-h-[44px] px-4 text-[15px] ${
                heroAccent === "shrikhand" ? "bg-[#00E5FF]" : "bg-[#F4F1EA]"
              }`}
            >
              Hero 1-word accent: {heroAccent === "shrikhand" ? "Shrikhand Italic Serif (15 KB)" : "None (Winner)"}
            </button>
          </div>
        </div>

        <div className="mt-5 rounded-[14px] border-[2px] border-[#141313] bg-[#F4F1EA] p-4">
          <p className="wall-label m-0">Winner Selected: L1 (Bricolage Grotesque Condensed 800 + Bricolage + Anek Telugu + Space Mono)</p>
          <ol className="m-0 mt-2 space-y-1 pl-5 text-[14px] font-medium leading-[1.5]">
            <li>Condensed 75% ExtraBold packs 120 px poster loudness without wrapping short party lines onto 4+ rows on 390 px phones or 1280 px laptops.</li>
            <li>Sharing one optical-size family across display and UI keeps 14 px labels ultra-crisp without visual clash.</li>
            <li>Harmonizes optically with Anek Telugu 800 without Baloo Tammudu 2&apos;s tall glyph clipping on 96 px round cards or its +85 KB font weight.</li>
            <li>Skipped Latin-only italic Shrikhand on production hero pills so Telugu mode has the exact same optical weight, energy, and polish as English mode.</li>
            <li>Weighs only 62.3 KB total in English mode (&lt;140 KB budget) and 198.7 KB in Telugu mode (&lt;280 KB budget), all self-hosted under SIL OFL 1.1.</li>
          </ol>
        </div>
      </header>

      <div className="mx-auto mt-8 space-y-8 max-w-[1280px]">
        {CANDIDATES.map((c) => {
          const headingFamily = lang === "te" ? c.teluguDisplayFont : c.displayFont;
          const bodyFamily = lang === "te" ? c.teluguBodyFont : c.bodyFont;
          const isCondensed = lang === "en" && c.displayStretch === "75%";
          return (
            <section
              key={c.id}
              data-testid={`font-card-${c.id}`}
              className="rounded-[20px] border-[3px] border-[#141313] bg-white p-6 shadow-[0_6px_0_#141313]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#141313] pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="mono-num rounded-full border-[2px] border-[#141313] bg-[#EAE6DF] px-3 py-1 text-[13px]">
                    {c.code}
                  </span>
                  {c.winner ? (
                    <span className="rounded-full border-[2px] border-[#141313] bg-[#F6BE18] px-3 py-1 text-[13px] font-extrabold">
                      Party Mode Winner
                    </span>
                  ) : null}
                  <h2 className="m-0 text-[20px] font-bold" style={{ fontFamily: c.bodyFont }}>
                    {c.name}
                  </h2>
                </div>
                <span className="mono-num text-[12px]">{c.license}</span>
              </div>

              <div className="mt-4 grid gap-2 text-[13px] font-semibold md:grid-cols-3">
                <p className="m-0 rounded-[12px] border-2 border-[#141313] bg-[#F4F1EA] p-3">
                  <span className="block text-[11px] font-bold uppercase text-[#141313]/75">Weights &amp; Axes</span>
                  {c.weights}
                </p>
                <p className="m-0 rounded-[12px] border-2 border-[#141313] bg-[#F4F1EA] p-3">
                  <span className="block text-[11px] font-bold uppercase text-[#141313]/75">EN Transfer</span>
                  <span style={{ fontFamily: c.monoFont }}>{c.enKb}</span>
                </p>
                <p className="m-0 rounded-[12px] border-2 border-[#141313] bg-[#F4F1EA] p-3">
                  <span className="block text-[11px] font-bold uppercase text-[#141313]/75">TE Transfer</span>
                  <span style={{ fontFamily: c.monoFont }}>{c.teKb}</span>
                </p>
              </div>

              {/* 120px Hero Display Preview */}
              <div className="mt-5 rounded-[18px] border-[3px] border-[#141313] bg-[#F6BE18] p-6">
                <span className="mono-num inline-block rounded-full border-2 border-[#141313] bg-white px-3 py-0.5 text-[12px]">
                  120px Display · {lang.toUpperCase()}
                </span>
                <p
                  className="m-0 mt-3 break-words"
                  style={{
                    fontFamily: headingFamily,
                    fontWeight: lang === "te" ? 800 : c.displayWeight,
                    fontStretch: isCondensed ? "75%" : "100%",
                    fontSize: "clamp(48px, 8vw, 120px)",
                    lineHeight: lang === "te" ? 1.2 : 0.96,
                    letterSpacing: lang === "te" ? "0" : "-0.02em",
                    textTransform: lang === "en" ? "uppercase" : "none",
                  }}
                >
                  {lang === "en" ? (
                    <>
                      Game night for{" "}
                      <span
                        className="inline-block rounded-[14px] border-[3px] border-[#141313] bg-[#EC1276] px-4 py-1 text-white"
                        style={
                          heroAccent === "shrikhand"
                            ? {
                                fontFamily: "'Shrikhand Lab', serif",
                                fontStyle: "italic",
                                fontWeight: 400,
                                textTransform: "none",
                                letterSpacing: "0",
                              }
                            : undefined
                        }
                      >
                        Telugu
                      </span>{" "}
                      movie fans
                    </>
                  ) : (
                    <>
                      <span className="inline-block rounded-[14px] border-[3px] border-[#141313] bg-[#EC1276] px-4 py-1 text-white">
                        తెలుగు
                      </span>{" "}
                      సినిమా ఫ్యాన్స్‌కు గేమ్ నైట్
                    </>
                  )}
                </p>
              </div>

              {/* Real Small Labels + Button + Tabular Numbers Check */}
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-[16px] border-[3px] border-[#141313] bg-white p-4">
                  <p
                    className="m-0 text-[14px] font-bold uppercase tracking-[0.06em]"
                    style={{
                      fontFamily: bodyFamily,
                      textTransform: lang === "en" ? "uppercase" : "none",
                      letterSpacing: lang === "en" ? "0.06em" : "0",
                    }}
                  >
                    {lang === "en" ? "14px Small Label · 60 sec · 3–12 players" : "14px చిన్న లేబుల్ · 60 సెకన్లు · 3–12 ఆటగాళ్లు"}
                  </p>
                  <p className="m-0 mt-2 text-[17px] font-medium leading-[1.5]" style={{ fontFamily: bodyFamily }}>
                    {lang === "en"
                      ? "Guess, act and bid on your favourite films. One phone or online. No sign-up."
                      : "మీ ఫేవరెట్ సినిమాలను గెస్ చేయండి, యాక్ట్ చేయండి, బిడ్ వేయండి. సైన్-అప్ లేదు."}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 rounded-[16px] border-[3px] border-[#141313] bg-[#00E5FF] p-4">
                  <div>
                    <p className="m-0 text-[12px] font-bold uppercase" style={{ fontFamily: bodyFamily }}>
                      {lang === "en" ? "Room stub preview" : "రూమ్ కోడ్"}
                    </p>
                    <p className="m-0 text-[36px] font-bold leading-none" style={{ fontFamily: c.monoFont }}>
                      KXQM · 01:45
                    </p>
                  </div>
                  <span
                    className="inline-flex min-h-[48px] items-center rounded-[16px] border-[3px] border-[#141313] bg-white px-5 text-[18px] font-extrabold shadow-[0_5px_0_#141313]"
                    style={{ fontFamily: bodyFamily }}
                  >
                    {lang === "en" ? "Play now →" : "ఆడండి →"}
                  </span>
                </div>
              </div>

              <p className="m-0 mt-4 text-[14px] font-semibold text-[#141313]/85">{c.notes}</p>
            </section>
          );
        })}
      </div>
    </div>
  );
}
