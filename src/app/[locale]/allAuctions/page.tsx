import { database } from '@/db/database';
import { auth } from '../../../../auth';
import ItemList from '@/components/item-list';
import { pageTitleStyles } from '@/styles';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: 'hu' | 'en' }>;
}) {
  const { locale } = await params;
  const session = await auth();
  const allitems = await database.query.items.findMany({
    with: {
      translations: true,
    },
  });

  const user = session?.user;

  const t = {
    title: locale === 'hu' ? 'Eladó tételek' : 'Items For Sale',
    signedIn:
      locale === 'hu'
        ? `Bejelentkezve: ${session?.user?.name ?? ''}`
        : `Signed in as ${session?.user?.name ?? ''}`,
    signInToBid:
      locale === 'hu'
        ? 'Jelentkezz be a licitáláshoz.'
        : 'Sign in to place a bid.',
  };

  const items = allitems.map((item) => {
    const translation =
      item.translations.find((t) => t.languageCode === locale) ||
      item.translations.find((t) => t.languageCode === 'en');

    return {
      ...item,
      name: translation?.name ?? 'Untitled',
    };
  });

  return (
    <main className="space-y-8 m-8">
      <div className="flex items-center justify-between">
        <h1 className={pageTitleStyles}>{t.title}</h1>

        {session?.user ? (
          <div className="text-right">
            <p className="text-gray-600">{t.signedIn}</p>
          </div>
        ) : (
          <div className="text-gray-500 italic text-center mt-6">
            {t.signInToBid}
          </div>
        )}

          {user && user.role === 'admin' && (
            <div className="space-x-4">
              <Link
                href={`/${locale}/items/create`}
                className="inline-block px-4 py-2 bg-black text-white rounded-md hover:bg-primary/90 dark:bg-gray-900 dark:hover:bg-gray-700 transition-colors"
              >
                {locale === 'hu' ? 'Új aukció létrehozása' : 'Create an Auction'}
              </Link>
            </div>
          )}

      </div>

      <ItemList items={items} />
    </main>
  );
}
