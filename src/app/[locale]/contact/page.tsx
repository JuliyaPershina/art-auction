'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const ContactPage = () => {
  const { locale } = useParams() as { locale: 'hu' | 'en' };

  const email = 'your@email.com';
  const facebookUrl = 'https://facebook.com/yourprofile';

  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const t = {
    title: locale === 'hu' ? 'Dolgozzunk együtt' : 'Let’s Work Together',
    description:
      locale === 'hu'
        ? 'Ha egyedi műalkotás, együttműködés vagy vásárlás érdekel, szívesen fogadom az üzeneted.'
        : 'If you’re interested in a collaboration, commission, or purchase, feel free to reach out.',
    subtitle:
      locale === 'hu'
        ? 'Írj nekem közvetlenül emailben vagy keress Facebookon.'
        : 'You can contact me directly via email or reach out on Facebook.',
    emailLabel: locale === 'hu' ? 'Email cím' : 'Email address',
    copy: locale === 'hu' ? 'Email másolása' : 'Copy email',
    copied: locale === 'hu' ? 'Másolva!' : 'Copied!',
    facebook:
      locale === 'hu' ? 'Facebook profil megnyitása' : 'Open Facebook profile',
  };

  return (
    <section className="w-full bg-gray-100 text-gray-700">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        {/* Intro */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-12">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-stone-400 shadow-sm shrink-0">
            <Image
              src="/artist.jpg"
              alt="Artist portrait"
              fill
              sizes="160px"
              className="object-cover"
              priority
            />
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">
              {t.title}
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-gray-600 max-w-2xl">
              {t.description}
            </p>
            <p className="mt-3 text-sm text-gray-500 max-w-2xl">{t.subtitle}</p>
          </div>
        </div>

        {/* Contact Card */}
        <div className="max-w-3xl mx-auto bg-white border border-stone-300 rounded-xl shadow-sm p-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6">
            {t.emailLabel}
          </h2>

          {/* Email */}
          <a
            href={`mailto:${email}`}
            className="text-lg sm:text-xl font-medium text-stone-700 hover:underline break-all"
          >
            {email}
          </a>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <button
              onClick={copyEmail}
              className="px-5 py-2 border border-stone-500 rounded-lg text-stone-700 hover:bg-stone-700 hover:text-white transition"
            >
              {copied ? t.copied : t.copy}
            </button>

            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 border border-blue-500 rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white transition"
            >
              {t.facebook}
            </a>
          </div>
        </div>

        {/* Optional footer note */}
        <div className="text-center mt-10 text-sm text-gray-500">
          {locale === 'hu'
            ? 'Általában 1–2 munkanapon belül válaszolok.'
            : 'I usually reply within 1–2 business days.'}
        </div>
      </div>
    </section>
  );
};

export default ContactPage;