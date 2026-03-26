'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const ContactPage = () => {
  const { locale } = useParams() as { locale: 'hu' | 'en' };
  const [loading, setLoading] = useState(false);

  const t = {
    title: locale === 'hu' ? 'Dolgozzunk együtt' : 'Let’s Work Together',

    description:
      locale === 'hu'
        ? 'Ha együttműködés, egyedi műalkotás vagy vásárlás érdekli, írjon bátran. Szívesen egyeztetek ötletekről és lehetőségekről.'
        : 'If you’re interested in collaborating, commissioning a custom artwork, or acquiring one of my existing pieces, feel free to reach out.',

    getInTouch: locale === 'hu' ? 'Kapcsolat' : 'Get in Touch',

    welcome:
      locale === 'hu'
        ? 'Örömmel várom üzenetét.'
        : 'I welcome your message and look forward to hearing from you.',

    contact: locale === 'hu' ? 'Kapcsolat' : 'Contact me',

    name: locale === 'hu' ? 'Teljes név' : 'Your full name',
    email: locale === 'hu' ? 'Email cím' : 'Your email address',
    subject: locale === 'hu' ? 'Tárgy' : 'Subject',
    message: locale === 'hu' ? 'Üzenet' : 'Your message',

    send: locale === 'hu' ? 'Küldés' : 'Send message',
    sending: locale === 'hu' ? 'Küldés...' : 'Sending...',
  };

  return (
    <section className="w-full bg-gray-100 text-gray-700">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        {/* Intro */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-8">
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
          </div>
        </div>

        {/* Text */}
        <div className="max-w-3xl mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            {t.getInTouch}
          </h2>

          <p className="text-base sm:text-lg leading-relaxed text-gray-600">
            {t.welcome}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mb-6 mx-auto px-6 py-10 bg-white border border-stone-300 rounded-xl shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-10 text-center">
          {t.contact}
        </h2>

        <form
          method="POST"
          action="https://formspree.io/f/xjgpblvo"
          onSubmit={() => setLoading(true)}
          className="space-y-6"
        >
          {/* Honeypot */}
          <input type="text" name="_gotcha" className="hidden" />

          {/* Redirect після submit */}
          <input
            type="hidden"
            name="_redirect"
            value={`/${locale}/thank-you`}
          />

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t.name}
            </label>
            <input
              type="text"
              name="name"
              required
              minLength={2}
              className="w-full px-4 py-3 border border-stone-300 rounded-lg bg-gray-50 focus:ring-1 focus:ring-stone-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t.email}
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 border border-stone-300 rounded-lg bg-gray-50 focus:ring-1 focus:ring-stone-400"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t.subject}
            </label>
            <input
              type="text"
              name="subject"
              required
              minLength={3}
              className="w-full px-4 py-3 border border-stone-300 rounded-lg bg-gray-50 focus:ring-1 focus:ring-stone-400"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t.message}
            </label>
            <textarea
              name="message"
              required
              minLength={10}
              rows={5}
              className="w-full px-4 py-3 border border-stone-300 rounded-lg bg-gray-50 focus:ring-1 focus:ring-stone-400 resize-none"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full border border-stone-500 py-3 rounded-lg font-medium transition
              text-stone-700
              hover:bg-stone-700 hover:text-white
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t.sending : t.send}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactPage;