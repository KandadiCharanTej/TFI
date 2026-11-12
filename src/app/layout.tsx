import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppHeader, BottomNav } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'TFI & Pitch | Cinema. Friends. Fun.',
  description: 'Telugu-first social gaming platform. Guess movies, funny translations, act charades, and bid in box office auctions with friends.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#FFCB45',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#FFF8E9] text-[#171717] min-h-screen flex flex-col antialiased selection:bg-[#FFCB45] selection:text-[#171717]">
        <AppHeader />
        <main className="flex-1 pb-20 sm:pb-10 max-w-4xl w-full mx-auto px-4 py-4 md:py-6">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
