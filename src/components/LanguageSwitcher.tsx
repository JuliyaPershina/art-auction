'use client';
import { usePathname, useRouter } from 'next/navigation';


export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const switchLanguage = (locale: 'hu' | 'en') => {
    const segments = pathname.split('/').filter(Boolean);

    // якщо перший сегмент це мова → замінюємо
    if (segments[0] === 'hu' || segments[0] === 'en') {
      segments[0] = locale;
    } else {
      // якщо немає мови — додаємо її
      segments.unshift(locale);
    }

    router.push('/' + segments.join('/'));
  };


  return (
    <div className="flex justify-center gap-1 px-1 pt-1.5">
      
      <button
        onClick={() => switchLanguage('hu')}
        className="flex flex-col items-center gap-1 px-2 py-1 rounded-lg 
                   text-xs font-medium
                   text-stone-600 dark:text-gray-200
                   hover:bg-gray-200 dark:hover:bg-neutral-800
                   transition"
      >
        <img
          src="/assets/hu.svg"
          alt="Hungarian"
          className="w-4 h-3 object-cover rounded-sm"
        />
        HU
      </button>

      <button
        onClick={() => switchLanguage('en')}
        className="flex flex-col items-center gap-1 px-2 py-1 rounded-lg 
                   text-xs font-medium
                   text-stone-600 dark:text-gray-200
                   hover:bg-gray-200 dark:hover:bg-neutral-800
                   transition"
      >
        <img
          src="/assets/uk.svg"
          alt="English"
          className="w-4 h-3 object-cover rounded-sm"
        />
        EN
      </button>

    </div>
  );
}
