import type { Metadata } from "next";
import './globals.css';
import { Inter as FontSans } from 'next/font/google';
import { cn } from "@/lib/utils";

const fontSans = FontSans({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Art Auction',
  description:
    'Buy and enjoy paintings by contemporary Hungarian artist Anikó Kocsis',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}
      >
        {children}
      </body>
    </html>
  );
}
