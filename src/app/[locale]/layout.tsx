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

import { Header } from '@/components/Header';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

type Locale = 'hu' | 'en';
const localeFallback: Locale = 'en';

// Гард для перевірки допустимих локалей
const isLocale = (l: string): l is Locale => l === 'hu' || l === 'en';

type LayoutProps = {
  children: ReactNode;
  params: { locale: string }; // Next.js надає params як object, не Promise
};

// Генерація метаданих
export function generateMetadata({ params }: LayoutProps): Metadata {
  const locale = isLocale(params.locale) ? params.locale : localeFallback;

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

// Основний layout
export default function LocaleLayout({ children, params }: LayoutProps) {
  const locale = isLocale(params.locale) ? params.locale : localeFallback;

  return (
    <>
      <Header locale={locale} />
      <main className="min-h-screen">{children}</main>
    </>
  );
}