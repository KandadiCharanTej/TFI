"use client";

export type TelemetryEventName =
  | "game_opened"
  | "round_started"
  | "round_finished"
  | "share_clicked"
  | "install_clicked"
  | "language_changed"
  | "room_created"
  | "room_joined"
  | "room_started";

const CONSENT_KEY = "tfi.analytics.consent";

export type ConsentChoice = "yes" | "no" | null;

export function readAnalyticsConsent(): ConsentChoice {
  if (typeof window === "undefined") return null;
  try {
    const val = window.localStorage.getItem(CONSENT_KEY);
    if (val === "yes" || val === "no") return val;
  } catch {
    // Storage blocked
  }
  return null;
}

export function writeAnalyticsConsent(choice: "yes" | "no"): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    // Ignore
  }
}

export function trackEvent(
  posthogKey: string,
  event: TelemetryEventName,
  properties?: Record<string, string | number | boolean>,
): void {
  if (!posthogKey || readAnalyticsConsent() !== "yes") return;
  try {
    const payload = {
      api_key: posthogKey,
      event,
      properties: {
        ...properties,
        distinct_id: "anonymous",
      },
      timestamp: new Date().toISOString(),
    };
    void fetch("https://us.i.posthog.com/capture/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // Ignore telemetry failures
  }
}

export function reportClientError(sentryDsn: string, message: string, source?: string): void {
  if (!sentryDsn) return;
  try {
    const parsed = new URL(sentryDsn);
    const projectId = parsed.pathname.replace(/^\//, "");
    const publicKey = parsed.username;
    if (!projectId || !publicKey) return;
    const endpoint = `${parsed.protocol}//${parsed.host}/api/${projectId}/store/?sentry_key=${publicKey}&sentry_version=7`;
    void fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        level: "error",
        platform: "javascript",
        tags: source ? { source } : undefined,
      }),
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // Ignore error-reporting failures
  }
}
