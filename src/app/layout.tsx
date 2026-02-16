// import type { Metadata } from 'next';
// import './globals.css';
// import { Inter as FontSans } from 'next/font/google';
// import { cn } from '@/lib/utils';
// import { Header } from './Header';
// import '@knocklabs/react/dist/index.css';
// import { AppKnockProviders } from './knock-provider';
// import { SessionProvider } from 'next-auth/react';

// const fontSans = FontSans({ subsets: ['latin'], variable: '--font-sans' });

// export const metadata: Metadata = {
//   title: 'Art Auction',
//   description:
//     'Buy and enjoy paintings by contemporary Hungarian artist Anikó Kocsis',
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={cn(
//           'min-h-screen bg-background font-sans antialiased',
//           fontSans.variable,
//         )}
//       >
//         <SessionProvider>
//           <AppKnockProviders>
//             <Header />
//             <main className="min-h-screen">{children}</main>
//           </AppKnockProviders>
//         </SessionProvider>
//       </body>
//     </html>
//   );
// }

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
    default: 'Art Auction',
    template: '%s | Art Auction',
  },
  description:
    'Buy and enjoy paintings by contemporary Hungarian artist Anikó Kocsis',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'Art Auction',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
