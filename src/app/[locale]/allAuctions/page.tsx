import { database } from '@/db/database';
import { auth } from '../../../../auth';
import ItemList from '@/components/item-list';
import { pageTitleStyles } from '@/styles';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: 'hu' | 'en' }>;
}) {
  const { locale } = await params; // 🔥 ВАЖЛИВО
  const session = await auth();
  const allitems = await database.query.items.findMany();

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

  return (
    <main className="space-y-8">
      <h1 className={pageTitleStyles}>{t.title}</h1>

      <ItemList items={allitems} />

      {session?.user ? (
        <div className="text-right">
          <p className="text-gray-600">{t.signedIn}</p>
        </div>
      ) : (
        <div className="text-gray-500 italic text-center mt-6">
          {t.signInToBid}
        </div>
      )}
    </main>
  );
}