/* eslint-disable @next/next/no-page-custom-font */
"use client";

import { useState } from "react";

interface Candidate {
  id: string;
  code: string;
  name: string;
  winner?: boolean;
  tagline: string;
  latinFont: string;
  teluguFont: string;
  monoFont: string;
  enKb: string;
  teKb: string;
  notes: string;
}

const CANDIDATES: Candidate[] = [
  {
    id: "p1",
    code: "P1",
    name: "Anek Latin (subset) + Anek Telugu + Space Mono",
    tagline: "Ek Type's multi-script Anek family (bundled Latin subset) + Space Mono",
    latinFont: "'Anek Latin Lab', sans-serif",
    teluguFont: "'Anek Telugu', sans-serif",
    monoFont: "'Space Mono', monospace",
    enKb: "51.7 KB (42.4 KB Latin + 9.3 KB Mono)",
    teKb: "188.1 KB (+ 136.4 KB Telugu)",
    notes:
      "Note: Standalone 'Anek Latin' is not published as a separate Google Fonts family; it ships bundled inside regional Anek subsets. Per the brief, we therefore select P2 as production winner.",
  },
  {
    id: "p2",
    code: "P2",
    name: "Bricolage Grotesque + Anek Telugu + Space Mono",
    winner: true,
    tagline: "Optical-size humanist grotesque (12..96 opsz, 500..800) + Anek Telugu + Space Mono",
    latinFont: "'Bricolage Grotesque', sans-serif",
    teluguFont: "'Anek Telugu', sans-serif",
    monoFont: "'Space Mono', monospace",
    enKb: "39.3 KB (30.0 KB Latin + 9.3 KB Mono)",
    teKb: "175.7 KB (+ 136.4 KB Telugu)",
    notes:
      "WINNER: Optical-size variable axis keeps 14-19px body open and legible while tightening curves at 40-72px display sizes; matches Anek Telugu's warm stroke modulation at 39.3 KB total in EN mode.",
  },
  {
    id: "p3",
    code: "P3",
    name: "Archivo Expanded (700–800) + Anek Telugu + Space Mono",
    tagline: "Expanded grotesque display (125% width, 700..800) + Anek Telugu + Space Mono",
    latinFont: "'Archivo Expanded Lab', sans-serif",
    teluguFont: "'Anek Telugu', sans-serif",
    monoFont: "'Space Mono', monospace",
    enKb: "40.3 KB (31.0 KB Latin + 9.3 KB Mono)",
    teKb: "176.7 KB (+ 136.4 KB Telugu)",
    notes:
      "Wide 125% stance feels assertive at 44-64px, but takes ~22% more horizontal room per word on 390px phone screens and feels stiffer at 14-16px body sizes.",
  },
];

const SAMPLE_WORDS = ["పోకిరి", "మగధీర", "బొమ్మరిల్లు", "అతడు", "ఈగ"];
const CONJUNCTS = ["శ్రీ", "క్ష", "స్త్ర", "ప్రే"];

export default function ClientFontLab() {
  const [lang, setLang] = useState<"en" | "te">("en");

  return (
    <div className="min-h-screen bg-[#EAE6DF] p-4 text-[#141313] md:p-8" data-testid="font-lab-page">
      <style>{`
        @font-face {
          font-family: 'Anek Latin Lab';
          font-style: normal;
          font-weight: 500 800;
          font-display: swap;
          src: url('/fonts/anek-telugu-latin.woff2') format('woff2');
        }
        @font-face {
          font-family: 'Archivo Expanded Lab';
          font-style: normal;
          font-weight: 700 800;
          font-stretch: 125%;
          font-display: swap;
          src: url('/fonts/archivo-expanded-latin.woff2') format('woff2');
        }
      `}</style>

      <header className="mx-auto max-w-[1160px] rounded-[20px] border-[2.5px] border-[#141313] bg-white p-6 shadow-[0_5px_0_#141313]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="wall-label m-0 text-[#141313]">Font Lab · Round 2 (Sentence Case, 3 Families Max)</p>
            <h1 className="h1-title m-0 mt-1 text-[#141313]">
              One voice, two scripts, zero shouting
            </h1>
            <p className="m-0 mt-2 max-w-[62ch] text-[16px] font-medium">
              Comparing P1 (Anek Latin + Anek Telugu), P2 (Bricolage Grotesque + Anek Telugu), and P3 (Archivo Expanded + Anek Telugu) with Space Mono for tabular numbers.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLang("en")}
              data-testid="lab-lang-en"
              className={`wall-btn min-h-[44px] px-4 text-[15px] ${
                lang === "en" ? "bg-[#F6BE18]" : "bg-white"
              }`}
            >
              English (EN)
            </button>
            <button
              type="button"
              onClick={() => setLang("te")}
              data-testid="lab-lang-te"
              className={`wall-btn min-h-[44px] px-4 text-[15px] ${
                lang === "te" ? "bg-[#F6BE18]" : "bg-white"
              }`}
            >
              తెలుగు (TE)
            </button>
          </div>
        </div>

        <div className="mt-5 rounded-[14px] border-[2px] border-[#141313] bg-[#F4F1EA] p-4">
          <p className="wall-label m-0">Winner Selected: P2 (Bricolage Grotesque + Anek Telugu + Space Mono)</p>
          <ol className="m-0 mt-2 space-y-1 pl-5 text-[14px] font-medium leading-[1.5]">
            <li>Standalone &ldquo;Anek Latin&rdquo; is not a separate Google Fonts family (bundled only inside regional Anek subsets), so per the brief we select P2.</li>
            <li>Bricolage Grotesque&apos;s 12..96 optical-size axis keeps 14–19 px body text open and clear while tightening proportions at 40–72 px display sizes.</li>
            <li>Its warm humanist stroke modulation and rounded ink traps harmonize naturally with Ek Type&apos;s Anek Telugu at weights 700–800.</li>
            <li>Gives a confident, studio-grade editorial personality in sentence case without needing all-caps or tilted marker text.</li>
            <li>Weighs only 39.3 KB total in English mode (30 KB Latin + 9.3 KB Space Mono) and 175.7 KB in Telugu mode (+136.4 KB Anek Telugu), well under the 120 KB / 250 KB budgets.</li>
          </ol>
        </div>
      </header>

      <div className="mx-auto mt-8 grid max-w-[1160px] gap-6 lg:grid-cols-3">
        {CANDIDATES.map((c) => {
          const activeHeadingFont = lang === "te" ? `${c.teluguFont}, ${c.latinFont}` : c.latinFont;
          const activeBodyFont = lang === "te" ? `${c.teluguFont}, ${c.latinFont}` : c.latinFont;
          return (
            <section
              key={c.id}
              data-testid={`font-card-${c.id}`}
              className="flex flex-col justify-between space-y-5 rounded-[20px] border-[2.5px] border-[#141313] bg-white p-6 shadow-[0_5px_0_#141313]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="mono-num rounded-full border-[2px] border-[#141313] bg-[#EAE6DF] px-3 py-1 text-[12px]">
                    {c.code}
                  </span>
                  {c.winner ? (
                    <span className="rounded-full border-[2px] border-[#141313] bg-[#F6BE18] px-3 py-1 text-[12px] font-bold">
                      Production winner
                    </span>
                  ) : null}
                </div>

                <div>
                  <h2 className="m-0 text-[20px] font-bold" style={{ fontFamily: c.latinFont }}>
                    {c.name}
                  </h2>
                  <p className="m-0 mt-1 text-[13px] text-[#141313]/80">{c.tagline}</p>
                  <p className="mono-num m-0 mt-1.5 text-[12px]">
                    EN: {c.enKb} · TE: {c.teKb}
                  </p>
                </div>

                {/* Display Hero sample (sentence case) */}
                <div className="rounded-[16px] border-[2px] border-[#141313] bg-[#F4F1EA] p-4">
                  <p className="wall-label m-0">Display Hero (800, sentence case)</p>
                  <p
                    className="m-0 mt-2 text-[32px] font-extrabold leading-[1.08] tracking-[-0.02em]"
                    style={{
                      fontFamily: activeHeadingFont,
                      lineHeight: lang === "te" ? 1.45 : 1.08,
                    }}
                  >
                    {lang === "te"
                      ? "తెలుగు సినిమా అభిమానుల కోసం గేమ్ నైట్."
                      : "Game night for Telugu movie fans."}
                  </p>
                </div>

                {/* Real Card & Ticket Stub Sample */}
                <div className="wall-ticket p-4">
                  <div className="flex items-center justify-between">
                    <span className="wall-label">Judge card · Round 1</span>
                    <span className="mono-num rounded-[8px] border-[2px] border-[#141313] bg-[#F6BE18] px-2 py-0.5 text-[14px]">
                      00:45
                    </span>
                  </div>
                  <div className="wall-ticket-perf my-3 pt-3">
                    <p
                      className="m-0 text-[28px] font-extrabold leading-[1.45]"
                      style={{ fontFamily: c.teluguFont }}
                    >
                      పోకిరి
                    </p>
                    <p
                      className="m-0 text-[15px] font-bold"
                      style={{ fontFamily: c.latinFont }}
                    >
                      Pokiri (2006)
                    </p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      className="wall-btn min-h-[42px] flex-1 bg-white px-3 text-[15px]"
                      style={{ fontFamily: activeBodyFont }}
                    >
                      {lang === "te" ? "పాస్" : "Pass"}
                    </button>
                    <button
                      type="button"
                      className="wall-btn min-h-[42px] flex-1 bg-[#F6BE18] px-3 text-[15px]"
                      style={{ fontFamily: activeBodyFont }}
                    >
                      {lang === "te" ? "సరైనది!" : "Correct!"}
                    </button>
                  </div>
                </div>

                {/* Body scale 19 / 16 / 14 */}
                <div className="space-y-1.5" style={{ fontFamily: activeBodyFont }}>
                  <p className="m-0 text-[19px] font-medium leading-[1.55]">
                    19px: Guess, act and bid on your favourite films.
                  </p>
                  <p className="m-0 text-[16px] font-medium leading-[1.55]">
                    16px: Play on one phone with friends, or online with a room code.
                  </p>
                  <p className="m-0 text-[14px] font-medium leading-[1.45]">
                    14px: 2 to 8 players · 5 min · Works offline
                  </p>
                </div>

                {/* Telugu Conjuncts & Sample Words at 24px and 48px */}
                <div className="rounded-[14px] border-[2px] border-[#141313] bg-[#F4F1EA] p-3">
                  <p className="wall-label m-0">Telugu conjuncts &amp; titles (Anek Telugu 800)</p>
                  <p
                    className="m-0 mt-1 text-[24px] font-extrabold leading-[1.55]"
                    style={{ fontFamily: c.teluguFont }}
                  >
                    {CONJUNCTS.join(" · ")}
                  </p>
                  <p
                    className="m-0 mt-1 text-[24px] font-extrabold leading-[1.55]"
                    style={{ fontFamily: c.teluguFont }}
                  >
                    {SAMPLE_WORDS.join(" · ")}
                  </p>
                  <p
                    className="m-0 mt-1 text-[44px] font-extrabold leading-[1.45]"
                    style={{ fontFamily: c.teluguFont }}
                  >
                    మగధీర · ఈగ
                  </p>
                </div>
              </div>

              <p className="m-0 rounded-[12px] bg-[#EAE6DF] p-3 text-[13px] font-medium leading-[1.45]">
                {c.notes}
              </p>
            </section>
          );
        })}
      </div>
    </div>
  );
}
