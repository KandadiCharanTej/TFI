import type { Metadata, Viewport } from 'next';
import { Anton, Permanent_Marker, Plus_Jakarta_Sans, Space_Mono, Noto_Sans_Telugu } from 'next/font/google';
import './globals.css';
import { UserProvider } from '@/utils/userContext';
import { AcampNavbar } from '@/components/AcampNavbar';
import { AcampBottomNav } from '@/components/AcampBottomNav';
import { AcampBackgroundDecorations } from '@/components/StreetDecorations';

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
});

const permanentMarker = Permanent_Marker({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-marker',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const notoSansTelugu = Noto_Sans_Telugu({
  subsets: ['telugu'],
  variable: '--font-telugu',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TFI & Pitch — Telugu Cinema Social Gaming Platform',
  description: 'Cinema. Friends. Fun. The ultimate Telugu cinema party gaming platform with 5 authentic games.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#F6BE18',
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
    <html
      lang="te"
      className={`${anton.variable} ${permanentMarker.variable} ${plusJakartaSans.variable} ${spaceMono.variable} ${notoSansTelugu.variable}`}
    >
      <body className="antialiased selection:bg-[#F6BE18] selection:text-[#141313] pb-24 md:pb-12">
        <UserProvider>
          <AcampBackgroundDecorations />
          <AcampNavbar />
          <main className="relative z-10 w-full min-h-[calc(100vh-4rem)]">
            {children}
          </main>
          <AcampBottomNav />
        </UserProvider>
      </body>
    </html>
  );
}

