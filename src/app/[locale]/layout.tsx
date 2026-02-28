import { Header } from '@/components/Header';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

type Locale = 'hu' | 'en';
const localeFallback: Locale = 'en';

const isLocale = (l: string): l is Locale => l === 'hu' || l === 'en';

/* -------------------- METADATA -------------------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  const locale = isLocale(rawLocale) ? rawLocale : localeFallback;

  return {
    alternates: {
      canonical: `/${locale}`,
      languages: {
        hu: '/hu',
        en: '/en',
      },
    },
    openGraph: {
      locale: locale === 'hu' ? 'hu_HU' : 'en_US',
    },
    title:
      locale === 'hu'
        ? 'Anikó Kocsis – Kortárs magyar művészet'
        : 'Anikó Kocsis – Contemporary Hungarian Art',
  };
}

/* -------------------- LAYOUT -------------------- */

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;

  const locale = isLocale(rawLocale) ? rawLocale : localeFallback;

  return (
    <>
      <Header locale={locale} />
      <main className="min-h-screen">{children}</main>
    </>
  );
}