import type { Metadata, Viewport } from "next";
import "./globals.css";
import { FlagsProvider } from "@/components/flags-provider";
import { LangProvider } from "@/components/lang-provider";
import { PrefsBootstrap } from "@/components/prefs-bootstrap";
import { SwManager } from "@/components/sw-manager";
import { TRANSLATIONS } from "@/lib/i18n";
import { readShowMvpFlag } from "@/lib/games";
import { getServerLang } from "@/lib/lang-server";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getServerLang();
  return {
    title: TRANSLATIONS.brand.pageTitle[lang],
    description: TRANSLATIONS.brand.pageDescription[lang],
    manifest: "/manifest.webmanifest",
    icons: {
      icon: "/icons/icon-192.png",
      apple: "/icons/apple-touch-icon.png",
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

  return (
    <html lang={lang}>
      <head>
        {/* Always: the two fonts the first screen needs in any language. */}
        <link
          rel="preload"
          href="/fonts/anton-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/plus-jakarta-sans-latin.woff2"
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
          <FlagsProvider showMvp={showMvp}>
            {children}
            <SwManager />
          </FlagsProvider>
        </LangProvider>
      </body>
    </html>
  );
}
