"use client";

import { useEffect, useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import {
  computeCrownTitles,
  loadVoteRecent,
  pickSessionPrompts,
  saveVoteRecent,
  tallyPromptVotes,
  type GameCard,
  type PromptResult,
  type VotePlayer,
} from "@tfi/game-core";
import { Tx, useLang, useT } from "@/components/lang-provider";
import { Badge, Sticker, WallButton } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";

const V = TRANSLATIONS.vote;
const CONFIG_KEY = "tfi.vote.config";
const RESULTS_KEY = "tfi.vote.results";
const HIDE_HOWTO_KEY = "tfi.vote.hideHowTo";

interface VoteConfig {
  players: VotePlayer[];
  totalPrompts: number;
}

type Phase = "privacy" | "voting" | "reveal" | "results";

interface State {
  phase: Phase;
  players: VotePlayer[];
  selectedPrompts: GameCard[];
  recentIds: string[];
  currentPromptIndex: number;
  currentVoterIndex: number;
  votesForPrompt: Record<string, string>;
  promptResults: PromptResult[];
}

type Action =
  | { type: "READY_TO_VOTE" }
  | { type: "CAST_VOTE"; targetId: string }
  | { type: "NEXT_PROMPT" };

function buildInitialState(deck: GameCard[], cfg: VoteConfig): State {
  const recentIds = loadVoteRecent();
  const selectedPrompts = pickSessionPrompts(deck, cfg.totalPrompts, recentIds);
  return {
    phase: "privacy",
    players: cfg.players,
    selectedPrompts,
    recentIds,
    currentPromptIndex: 0,
    currentVoterIndex: 0,
    votesForPrompt: {},
    promptResults: [],
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "READY_TO_VOTE":
      return state.phase === "privacy" ? { ...state, phase: "voting" } : state;
    case "CAST_VOTE": {
      if (state.phase !== "voting") return state;
      const voter = state.players[state.currentVoterIndex];
      if (!voter || action.targetId === voter.id) return state;
      const nextVotes = { ...state.votesForPrompt, [voter.id]: action.targetId };
      if (state.currentVoterIndex + 1 < state.players.length) {
        return {
          ...state,
          phase: "privacy",
          votesForPrompt: nextVotes,
          currentVoterIndex: state.currentVoterIndex + 1,
        };
      }
      const card = state.selectedPrompts[state.currentPromptIndex];
      if (!card) return state;
      const result = tallyPromptVotes(card, state.players, nextVotes);
      saveVoteRecent([...state.recentIds, card.id]);
      return {
        ...state,
        phase: "reveal",
        votesForPrompt: nextVotes,
        promptResults: [...state.promptResults, result],
      };
    }
    case "NEXT_PROMPT": {
      if (state.currentPromptIndex + 1 >= state.selectedPrompts.length) {
        return { ...state, phase: "results" };
      }
      return {
        ...state,
        phase: "privacy",
        currentPromptIndex: state.currentPromptIndex + 1,
        currentVoterIndex: 0,
        votesForPrompt: {},
      };
    }
  }
}

export default function MostLikelyRoundPage() {
  const router = useRouter();
  const { lang } = useLang();
  const t = useT();

  const [deck, setDeck] = useState<GameCard[] | null>(null);
  const [config, setConfig] = useState<VoteConfig | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    document.title = `Most Likely | TFI & Pitch`;
    let cfg: VoteConfig = {
      players: [
        { id: "p1", name: "Anu" },
        { id: "p2", name: "Bala" },
        { id: "p3", name: "Charan" },
      ],
      totalPrompts: 5,
    };
    try {
      const raw = sessionStorage.getItem(CONFIG_KEY);
      if (raw) cfg = JSON.parse(raw) as VoteConfig;
    } catch {
      /* fallback */
    }
    setConfig(cfg);

    fetch("/cards/most-likely-party.json")
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json();
      })
      .then((cards: GameCard[]) => setDeck(cards))
      .catch(() => setLoadError(true));
  }, []);

  if (loadError) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-concrete p-4">
        <Sticker className="max-w-[400px] space-y-4 p-6 text-center">
          <p className="m-0 text-lg font-black text-ink">Could not load prompts deck.</p>
          <WallButton variant="yellow" onClick={() => router.push("/play/most-likely")}>
            ← <Tx v={TRANSLATIONS.common.back} />
          </WallButton>
        </Sticker>
      </main>
    );
  }

  if (!deck || !config) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-concrete p-4">
        <Sticker className="w-full max-w-[400px] animate-pulse space-y-4 p-6">
          <div className="h-6 w-1/2 rounded bg-card" />
          <div className="h-24 w-full rounded bg-card" />
          <div className="h-12 w-full rounded bg-card" />
        </Sticker>
      </main>
    );
  }

  return <VoteRoundRunner deck={deck} config={config} lang={lang} t={t} />;
}

function VoteRoundRunner({
  deck,
  config,
  lang,
  t,
}: {
  deck: GameCard[];
  config: VoteConfig;
  lang: "en" | "te";
  t: (v: { en: string; te: string }, values?: Record<string, string | number>) => string;
}) {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, { deck, cfg: config }, ({ deck: d, cfg }) =>
    buildInitialState(d, cfg),
  );
  const [showHowTo, setShowHowTo] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [confirmQuit, setConfirmQuit] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(HIDE_HOWTO_KEY) !== "1") {
        setShowHowTo(true);
      }
    } catch {
      setShowHowTo(true);
    }
  }, []);

  useEffect(() => {
    if (state.phase === "results") {
      const titles = computeCrownTitles(state.players, state.promptResults);
      try {
        sessionStorage.setItem(
          RESULTS_KEY,
          JSON.stringify({ titles, totalPrompts: state.selectedPrompts.length }),
        );
      } catch {
        /* ignore */
      }
      router.push("/play/most-likely/results");
    }
  }, [state.phase, state.players, state.promptResults, state.selectedPrompts.length, router]);

  const currentPrompt = state.selectedPrompts[state.currentPromptIndex];
  const currentVoter = state.players[state.currentVoterIndex] ?? state.players[0]!;
  const latestResult = state.promptResults[state.promptResults.length - 1];

  const dismissHowTo = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem(HIDE_HOWTO_KEY, "1");
      } catch {
        /* ignore */
      }
    }
    setShowHowTo(false);
  };

  return (
    <main
      className="wall-tap-safe flex min-h-[100dvh] flex-col justify-between bg-concrete px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-[max(16px,env(safe-area-inset-top))]"
      style={{ WebkitUserSelect: "none", userSelect: "none" }}
    >
      <header className="mx-auto flex w-full max-w-[520px] items-center justify-between gap-2">
        <Badge tone="white" mono>
          {t(V.promptOf, {
            n: state.currentPromptIndex + 1,
            total: state.selectedPrompts.length,
          })}
        </Badge>
        <button
          type="button"
          onClick={() => setConfirmQuit(true)}
          aria-label={t(TRANSLATIONS.judge.quit)}
          className="flex h-11 min-w-[44px] items-center justify-center rounded-full border-2 border-ink bg-white px-3 text-sm font-black text-ink"
        >
          ✕
        </button>
      </header>

      <section className="mx-auto my-auto w-full max-w-[520px] py-4">
        {state.phase === "privacy" ? (
          <Sticker className="space-y-5 p-6 text-center" data-testid="vote-privacy-screen">
            <Badge tone="cyan">
              {t(V.voterOf, { n: state.currentVoterIndex + 1, total: state.players.length })}
            </Badge>
            <h1 className="anton-title m-0 text-[34px] leading-tight text-ink">
              {t(V.passPhoneToVoter, { name: currentVoter.name })}
            </h1>
            <p className="m-0 rounded-[12px] border-2 border-dashed border-ink bg-card p-4 text-[14px] font-bold text-ink/80">
              🔒 <Tx v={V.privacyHint} />
            </p>
            <WallButton
              type="button"
              variant="yellow"
              onClick={() => dispatch({ type: "READY_TO_VOTE" })}
              data-testid="vote-ready-btn"
              className="w-full"
            >
              {t(V.imReadyVoter, { name: currentVoter.name })}
            </WallButton>
          </Sticker>
        ) : null}

        {state.phase === "voting" && currentPrompt ? (
          <Sticker className="space-y-5 p-6 text-center" data-testid="vote-voting-screen">
            <Badge tone="yellow">
              {t(V.voterOf, { n: state.currentVoterIndex + 1, total: state.players.length })}
            </Badge>

            <div className="rounded-[16px] border-[2.5px] border-ink bg-card p-4">
              <p className="m-0 text-[22px] font-black leading-snug text-ink">
                {lang === "te" ? currentPrompt.te : currentPrompt.en}
              </p>
            </div>

            <p className="m-0 text-[13px] font-extrabold text-ink/80">
              {t(V.tapToVote, { name: currentVoter.name })}
            </p>

            {/* Ring / Grid of player names (self-vote disabled) */}
            <div className="grid grid-cols-2 gap-3" role="group" aria-label="Players">
              {state.players.map((p) => {
                const isSelf = p.id === currentVoter.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    disabled={isSelf}
                    onClick={() => dispatch({ type: "CAST_VOTE", targetId: p.id })}
                    data-testid={`vote-target-${p.id}`}
                    style={{ touchAction: "manipulation" }}
                    className={`min-h-[56px] rounded-[14px] border-[2.5px] border-ink px-3 py-2 text-[16px] font-black transition-transform active:translate-y-0.5 ${
                      isSelf
                        ? "cursor-not-allowed border-dashed bg-card text-ink/40"
                        : "bg-white text-ink shadow-btn hover:bg-yellow"
                    }`}
                  >
                    {p.name}
                    {isSelf ? (
                      <span className="block text-[10px] font-bold uppercase tracking-wider">
                        (You)
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </Sticker>
        ) : null}

        {state.phase === "reveal" && latestResult ? (
          <Sticker className="space-y-5 p-6 text-center" data-testid="vote-reveal-screen">
            <Badge tone={latestResult.isTie ? "cyan" : "yellow"}>
              <Tx v={latestResult.isTie ? TRANSLATIONS.judge.tie : V.revealTitle} />
            </Badge>

            <p className="m-0 text-[16px] font-bold text-ink/80">
              {lang === "te" ? latestResult.card.te : latestResult.card.en}
            </p>

            <div className="rounded-[18px] border-[3px] border-ink bg-yellow p-5 shadow-btn">
              <p className="anton-title m-0 text-[34px] leading-none text-ink" data-testid="vote-prompt-winner">
                {latestResult.winnerIds
                  .map((id) => state.players.find((p) => p.id === id)?.name ?? id)
                  .join(" & ")}
              </p>
              <p className="mono-num m-0 mt-2 text-lg font-black text-ink">
                {t(V.votesCount, { n: latestResult.topVotes })}
              </p>
            </div>

            <div className="space-y-1.5 text-left">
              {state.players
                .filter((p) => (latestResult.counts[p.id] ?? 0) > 0)
                .sort((a, b) => (latestResult.counts[b.id] ?? 0) - (latestResult.counts[a.id] ?? 0))
                .map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-[10px] border-2 border-ink bg-card px-3 py-2 text-sm font-bold text-ink"
                  >
                    <span>{p.name}</span>
                    <span className="mono-num">{latestResult.counts[p.id] ?? 0}</span>
                  </div>
                ))}
            </div>

            <WallButton
              type="button"
              variant="yellow"
              onClick={() => dispatch({ type: "NEXT_PROMPT" })}
              data-testid="vote-next-prompt-btn"
              className="w-full"
            >
              <Tx
                v={
                  state.currentPromptIndex + 1 >= state.selectedPrompts.length
                    ? V.seeTitles
                    : V.nextPrompt
                }
              />
            </WallButton>
          </Sticker>
        ) : null}
      </section>

      <div className="h-4" />

      {showHowTo ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t(V.howToTitle)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4"
        >
          <Sticker className="w-full max-w-[420px] space-y-4 p-6">
            <h2 className="anton-title m-0 text-[26px] text-ink">
              <Tx v={V.howToTitle} />
            </h2>
            <div className="space-y-2.5">
              {[
                { title: V.step1Title, body: V.step1Body },
                { title: V.step2Title, body: V.step2Body },
                { title: V.step3Title, body: V.step3Body },
              ].map((s, idx) => (
                <div key={idx} className="rounded-[12px] border-2 border-ink bg-card p-3">
                  <p className="m-0 text-[14px] font-black text-ink"><Tx v={s.title} /></p>
                  <p className="m-0 mt-0.5 text-[13px] font-semibold text-ink/80"><Tx v={s.body} /></p>
                </div>
              ))}
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-ink">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="h-5 w-5 accent-ink"
              />
              <Tx v={TRANSLATIONS.charades.dontShowAgain} />
            </label>
            <WallButton
              type="button"
              variant="yellow"
              className="w-full"
              onClick={dismissHowTo}
              data-testid="vote-howto-ok"
            >
              <Tx v={TRANSLATIONS.charades.gotItStart} />
            </WallButton>
          </Sticker>
        </div>
      ) : null}

      {confirmQuit ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t(TRANSLATIONS.judge.paused)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4"
        >
          <Sticker className="w-full max-w-[360px] space-y-4 p-6 text-center">
            <h2 className="anton-title m-0 text-[28px] text-ink">
              <Tx v={TRANSLATIONS.judge.paused} />
            </h2>
            <div className="flex flex-col gap-3">
              <WallButton type="button" variant="yellow" onClick={() => setConfirmQuit(false)}>
                <Tx v={TRANSLATIONS.judge.resume} />
              </WallButton>
              <WallButton
                type="button"
                variant="white"
                onClick={() => router.push("/play/most-likely")}
              >
                <Tx v={TRANSLATIONS.judge.quit} />
              </WallButton>
            </div>
          </Sticker>
        </div>
      ) : null}
    </main>
  );
}
