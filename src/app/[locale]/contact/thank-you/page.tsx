'use client';

import { useParams } from 'next/navigation';

export default function ThankYouPage() {
  const { locale } = useParams() as { locale: 'hu' | 'en' };

  const t = {
    en: {
      title: 'Thank you!',
      message: 'Your message has been sent successfully.',
      back: 'Go back to contact',
    },
    hu: {
      title: 'Köszönöm!',
      message: 'Üzenetét sikeresen elküldtük.',
      back: 'Vissza a kapcsolati oldalra',
    },
  };

  const text = locale === 'hu' ? t.hu : t.en;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center bg-white p-10 rounded-xl shadow-sm border border-stone-300 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">{text.title}</h1>

        <p className="text-gray-600 mb-8">{text.message}</p>

        <a
          href={`/${locale}/contact`}
          className="inline-block px-6 py-3 border border-stone-500 rounded-lg text-stone-700 hover:bg-stone-700 hover:text-white transition"
        >
          {text.back}
        </a>
      </div>
    </div>
  );
}
