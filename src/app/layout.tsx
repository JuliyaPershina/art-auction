import type { Metadata } from 'next';
import './globals.css';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import '@knocklabs/react/dist/index.css';
import { AppKnockProviders } from './knock-provider';
import { SessionProvider } from 'next-auth/react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        {/* <LanguageSwitcher /> */}
        <SessionProvider>
          <AppKnockProviders>{children}</AppKnockProviders>
        </SessionProvider>
      </body>
    </html>
  );
}