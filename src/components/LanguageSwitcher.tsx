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
    <div className=" flex gap-2 bg-transparent backdrop-blur px-3 pt-2 ">
      <button
        className="text-sm font-medium cursor-pointer text-stone-600 dark:text-gray-200 hover:text-stone-900 dark:hover:text-gray-400 transition"
        onClick={() => switchLanguage('hu')}
      >
        HU
      </button>
      <button
        className="text-sm font-medium cursor-pointer text-stone-600 dark:text-gray-200 hover:text-stone-900 dark:hover:text-gray-400 transition"
        onClick={() => switchLanguage('en')}
      >
        EN
      </button>
    </div>
  );
}
