import { Header } from '@/components/Header';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

type Locale = 'hu' | 'en';

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: Locale }>; // асинхронний params
};

// Гард для перевірки допустимих локалей
const isLocale = (l: string): l is Locale => l === 'hu' || l === 'en';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

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

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) throw new Error(`Invalid locale: ${locale}`);

  return (
    <>
      <Header locale={locale} />
      <main className="min-h-screen">{children}</main>
    </>
  );
}