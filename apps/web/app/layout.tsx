import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ConsentBanner } from "@/components/consent-banner";
import { FlagsProvider } from "@/components/flags-provider";
import { LangProvider } from "@/components/lang-provider";
import { PrefsBootstrap } from "@/components/prefs-bootstrap";
import { SwManager } from "@/components/sw-manager";
import { TRANSLATIONS } from "@/lib/i18n";
import { readShowMvpFlag } from "@/lib/games";
import { getServerLang } from "@/lib/lang-server";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getServerLang();
  const title = TRANSLATIONS.brand.pageTitle[lang];
  const description = TRANSLATIONS.brand.pageDescription[lang];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tfi-and-pitch.example";
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    manifest: "/manifest.webmanifest",
    icons: {
      icon: "/icons/icon-192.png",
      apple: "/icons/apple-touch-icon.png",
    },
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: "/og-share.png", width: 1200, height: 630, alt: "TFI & Pitch" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-share.png"],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#EAE6DF",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getServerLang();
  const showMvp = readShowMvpFlag(process.env.SHOW_MVP_GAMES);
  const feedbackUrl = process.env.FEEDBACK_URL ?? "";
  const posthogKey = process.env.POSTHOG_KEY ?? "";
  const sentryDsn = process.env.SENTRY_DSN ?? "";

  return (
    <html lang={lang}>
      <head>
        {/* Preload the single variable Latin font (30 KB) and tiny switch subset (2.0 KB). */}
        <link
          rel="preload"
          href="/fonts/bricolage-grotesque-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/anek-telugu-switch.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Only returning Telugu users (cookie lang=te) preload the Telugu font. */}
        {lang === "te" ? (
          <link
            rel="preload"
            href="/fonts/anek-telugu.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        ) : null}
      </head>
      <body>
        <LangProvider initialLang={lang}>
          <PrefsBootstrap />
          <FlagsProvider
            showMvp={showMvp}
            feedbackUrl={feedbackUrl}
            posthogKey={posthogKey}
            sentryDsn={sentryDsn}
          >
            {children}
            <SwManager />
            <ConsentBanner />
          </FlagsProvider>
        </LangProvider>
      </body>
    </html>
  );
}
