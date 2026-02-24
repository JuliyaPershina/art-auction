import type { Metadata } from 'next';
import './globals.css';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Header } from './Header';
import '@knocklabs/react/dist/index.css';
import { AppKnockProviders } from './knock-provider';
import { SessionProvider } from 'next-auth/react';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  ),
  title: {
    default: 'Anikó Kocsis',
    template: '%s | Anikó Kocsis',
  },
  description:
    'Vásároljon és élvezze Anikó Kocsis kortárs magyar művész festményeit',
  alternates: {
    canonical: '/',
    languages: {
      'hu-HU': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'hu_HU',
    siteName: 'Anikó Kocsis Művészet',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <SessionProvider>
          <AppKnockProviders>
            <Header />
            <main className="min-h-screen">{children}</main>
          </AppKnockProviders>
        </SessionProvider>
      </body>
    </html>
  );
}
