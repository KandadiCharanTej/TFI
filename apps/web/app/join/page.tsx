"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { isValidRoomCode, normalizeRoomCode, ROOM_CODE_ALPHABET } from "@tfi/game-core";
import { AppFrame } from "@/components/app-frame";
import { useFlags } from "@/components/flags-provider";
import { Tx, useLang } from "@/components/lang-provider";
import { Badge, Sticker, WallButton, WallLinkButton } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";
import { ROOMS_TRANSLATIONS as R } from "@/lib/i18n-rooms";
import { lookupRoomOnServer, savePendingRoomName } from "@/lib/room-client";
import { usePreferencesStore } from "@/lib/store";

export default function JoinRoomPage() {
  const router = useRouter();
  const { lang } = useLang();
  const { enableRooms, partykitHost } = useFlags();
  const { deviceName } = usePreferencesStore();

  const [chars, setChars] = useState<string[]>(["", "", "", ""]);
  const [name, setName] = useState(deviceName || "");
  const [checking, setChecking] = useState(false);
  const [errTitle, setErrTitle] = useState("");
  const [errNext, setErrNext] = useState("");
  const [canRetry, setCanRetry] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const code = chars.join("").toUpperCase();
  const validCode = isValidRoomCode(code);

  if (!enableRooms) {
    return (
      <AppFrame>
        <Sticker className="mx-auto max-w-[480px] space-y-5 p-6">
          <Badge tone="cyan" mono>
            <Tx v={TRANSLATIONS.pages.joinBadge} />
          </Badge>
          <div>
            <h1 className="h2-title m-0 text-ink">
              <Tx v={TRANSLATIONS.pages.joinTitle} />
            </h1>
            <p className="m-0 mt-1.5 text-[14px] font-medium text-ink/80">
              <Tx v={R.roomsOpeningSoonBody} />
            </p>
          </div>
          <WallLinkButton href="/play" variant="yellow" className="w-full">
            ← <Tx v={TRANSLATIONS.common.backToPlayHome} />
          </WallLinkButton>
        </Sticker>
      </AppFrame>
    );
  }

  function handleBoxChange(index: number, rawVal: string) {
    setErrTitle("");
    setErrNext("");
    const cleaned = normalizeRoomCode(rawVal);
    if (!cleaned) {
      const next = [...chars];
      next[index] = "";
      setChars(next);
      return;
    }
    const ch = cleaned.slice(-1);
    if (!ROOM_CODE_ALPHABET.includes(ch)) return;
    const next = [...chars];
    next[index] = ch;
    setChars(next);
    if (index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !chars[index] && index > 0) {
      e.preventDefault();
      const next = [...chars];
      next[index - 1] = "";
      setChars(next);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = normalizeRoomCode(e.clipboardData.getData("text"));
    if (!pasted) return;
    e.preventDefault();
    const filtered = pasted
      .split("")
      .filter((ch) => ROOM_CODE_ALPHABET.includes(ch))
      .slice(0, 4);
    const next = ["", "", "", ""];
    filtered.forEach((ch, idx) => {
      next[idx] = ch;
    });
    setChars(next);
    const focusIdx = Math.min(3, filtered.length);
    inputRefs.current[focusIdx]?.focus();
  }

  async function handleJoinSubmit() {
    if (!validCode) return;
    setChecking(true);
    setErrTitle("");
    setErrNext("");
    setCanRetry(false);
    savePendingRoomName(name);

    const lookup = await lookupRoomOnServer(partykitHost, code);
    if (!lookup.exists) {
      if (lookup.code === "NO_CONNECTION") {
        setErrTitle(R.errNoConnectionTitle[lang]);
        setErrNext(R.errNoConnectionNext[lang]);
        setCanRetry(true);
      } else if (lookup.code === "RATE_LIMITED") {
        setErrTitle(R.errNotFoundTitle[lang]);
        setErrNext(R.errRateLimitedNext[lang]);
      } else {
        setErrTitle(R.errNotFoundTitle[lang]);
        setErrNext(R.errNotFoundNext[lang]);
      }
      setChecking(false);
      return;
    }

    if (lookup.status === "in_game") {
      setErrTitle(R.errStartedTitle[lang]);
      setErrNext(R.errStartedNext[lang]);
      setChecking(false);
      return;
    }
    if (lookup.playerCount >= 10) {
      setErrTitle(R.errFullTitle[lang]);
      setErrNext(R.errFullNext[lang]);
      setChecking(false);
      return;
    }

    router.push(`/room/${lookup.code}`);
  }

  return (
    <AppFrame>
      <Sticker className="mx-auto max-w-[480px] space-y-5 p-6">
        <Badge tone="cyan">
          <Tx v={R.onlineBadge} />
        </Badge>
        <div>
          <h1 className="h1-title m-0 text-ink">
            <Tx v={R.joinTitle} />
          </h1>
          <p className="m-0 mt-1.5 text-[15px] font-medium text-ink/85">
            <Tx v={R.joinSub} />
          </p>
        </div>

        {/* 4 separate letter boxes */}
        <div>
          <p className="wall-label m-0 mb-2 text-ink">
            <Tx v={R.codeLabel} />
          </p>
          <div className="grid grid-cols-4 gap-3" role="group" aria-label={R.codeLabel[lang]}>
            {[0, 1, 2, 3].map((i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="text"
                inputMode="text"
                autoCapitalize="characters"
                autoComplete="off"
                maxLength={2}
                aria-label={`Code letter ${i + 1}`}
                data-testid={`join-code-${i}`}
                value={chars[i]}
                onChange={(e) => handleBoxChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                className="mono-num h-[68px] w-full rounded-[16px] border-[2.5px] border-ink bg-cyan/25 text-center text-[32px] font-bold text-ink focus:bg-cyan focus:outline-none"
                style={{ backgroundColor: chars[i] ? "#00E5FF" : "#F4F1EA" }}
              />
            ))}
          </div>
        </div>

        {/* Guest name */}
        <div>
          <label htmlFor="join-name-input" className="wall-label block text-ink">
            <Tx v={R.yourNameLabel} />
          </label>
          <input
            id="join-name-input"
            data-testid="join-name-input"
            type="text"
            maxLength={16}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={R.guestPlaceholder[lang]}
            className="mt-2 min-h-[48px] w-full rounded-[14px] border-[2.5px] border-ink bg-card px-4 py-2 text-[17px] font-bold text-ink focus:bg-white focus:outline-none"
          />
        </div>

        {errTitle ? (
          <div
            role="alert"
            data-testid="join-error-box"
            className="space-y-2 rounded-[16px] border-[2.5px] border-ink bg-card p-4"
          >
            <p className="m-0 flex items-center gap-2 text-[16px] font-bold text-ink">
              <span className="inline-block h-3 w-3 rounded-full bg-magenta" aria-hidden="true" />
              {errTitle}
            </p>
            <p className="m-0 text-[14px] font-medium text-ink/90">{errNext}</p>
            {canRetry ? (
              <WallButton variant="white" size="sm" onClick={() => void handleJoinSubmit()}>
                <Tx v={R.retryBtn} />
              </WallButton>
            ) : null}
          </div>
        ) : null}

        <WallButton
          variant="yellow"
          disabled={!validCode || checking}
          onClick={() => void handleJoinSubmit()}
          data-testid="join-submit-btn"
          className="w-full"
        >
          {checking ? <Tx v={R.joining} /> : <><Tx v={R.joinBtn} /> →</>}
        </WallButton>
      </Sticker>
    </AppFrame>
  );
}
