// import { Header } from '@/components/Header';
// import type { Metadata } from 'next';

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ locale: 'hu' | 'en' }>;
// }) {
//   const { locale } = await params;

//   return {
//     alternates: {
//       canonical: `/${locale}`,
//       languages: {
//         hu: '/hu',
//         en: '/en',
//       },
//     },
//     openGraph: {
//       locale: locale === 'hu' ? 'hu_HU' : 'en_US',
//     },
//     title:
//       locale === 'hu'
//         ? 'Anikó Kocsis – Kortárs magyar művészet'
//         : 'Anikó Kocsis – Contemporary Hungarian Art',
//   };
// }

// export default async function LocaleLayout({
//   children,
//   params,
// }: {
//   children: React.ReactNode;
//   params: Promise<{ locale: 'hu' | 'en' }>;
//   }) {
//   const { locale } = await params;
//   return (
//     <>
//       <Header locale={locale} />
//       <main className="min-h-screen">{children}</main>
//     </>
//   );
// }

// src/app/[locale]/layout.tsx
import { Header } from '@/components/Header';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

type Locale = 'hu' | 'en';

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ locale: Locale }>; // params приходить як Promise
}

// Гард для перевірки локалі
const isLocale = (l: string): l is Locale => l === 'hu' || l === 'en';

/**
 * Генерує metadata
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params; // розпаковуємо Promise

  if (!isLocale(locale)) throw new Error(`Invalid locale: ${locale}`);

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

/**
 * Layout для локалізованих сторінок
 */
export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params; // розпаковуємо Promise

  if (!isLocale(locale)) throw new Error(`Invalid locale: ${locale}`);

  return (
    <>
      <Header locale={locale} />
      <main className="min-h-screen">{children}</main>
    </>
  );
}