import Link from 'next/link';

interface HeroProps {
  locale: 'hu' | 'en';
}

const Hero = ({ locale }: HeroProps) => {
  
  return (
    <header className=" bg-white text-gray-800 transition-colors duration-300 pt-16 pb-8 px-4">
      <div className=" max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Text */}
        <div className=" flex-1 text-center lg:text-left">
          <h2 className=" text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            {locale === 'hu'
              ? 'Üdvözlöm! Kocsis Anikó vagyok 👋'
              : 'Hello! I am Anikó Kocsis 👋'}
          </h2>

          <p className=" text-base sm:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
            {locale === 'hu'
              ? 'Budapesti művész vagyok. Egyedi és magával ragadó műalkotásokat alkotok, amelyek a hagyományos technikákat ötvözik a modern esztétikával. A művészet iránti szenvedélyem minden egyes alkotásában tükröződik, és mindig új módszereket keresek a kreativitásom kifejezésére. Arra törekszem, hogy érzelmeket váltsak ki és másokat is inspiráljak a munkáimmal.'
              : 'I am an artist from Budapest. I create unique and captivating artworks that blend traditional techniques with modern aesthetics. My passion for art is reflected in every piece I create, and I am always exploring new ways to express my creativity. I strive to evoke emotions and inspire others with my work.'}
          </p>
        </div>

        {/* Buttons */}
        <div className=" flex flex-col gap-4 w-full sm:w-auto lg:items-end">
          {[
            {
              href: `/${locale}/allAuctions`,
              label: locale === 'hu' ? 'Aukciók' : 'Go to auction',
            },
            {
              href: `/${locale}/blog`,
              label: locale === 'hu' ? 'Blog' : 'Visit the blog',
            },
            {
              href: `/${locale}/contact`,
              label: locale === 'hu' ? 'Kapcsolat' : 'Contact me',
            },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="
                border border-stone-500
                text-stone-700
                px-8 py-3
                rounded-lg
                text-sm sm:text-base
                font-medium
                tracking-wide
                hover:bg-stone-700 hover:text-white
                transition
                w-full sm:w-56
                text-center
              "
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Hero;


