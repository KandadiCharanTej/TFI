import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LangProvider } from "@/components/lang-provider";
import { PrefsBootstrap } from "@/components/prefs-bootstrap";
import { TRANSLATIONS } from "@/lib/i18n";
import { getServerLang } from "@/lib/lang-server";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getServerLang();
  return {
    title: TRANSLATIONS.brand.pageTitle[lang],
    description: TRANSLATIONS.brand.pageDescription[lang],
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
            href="/fonts/noto-sans-telugu.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        ) : null}
      </head>
      <body>
        <LangProvider initialLang={lang}>
          <PrefsBootstrap />
          {children}
        </LangProvider>
      </body>
    </html>
  );
}
