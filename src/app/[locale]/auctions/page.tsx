import { database } from '@/db/database';
import { auth } from '../../../../auth';
import ItemList from '@/components/item-list';
import { items } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { EmptyState } from './empty-state';
import { pageTitleStyles } from '@/styles';

export default async function MyAuctionPage({
  params,
}: {
  params: Promise<{ locale: 'hu' | 'en' }>;
  }) {
    const { locale } = await params; // 🔥 ВАЖЛИВО
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    const allitems = await database.query.items.findMany({
      where: eq(items.userId, session.user.id),
    });

    const hasItems = allitems.length > 0;

    const t = {
      title:
        locale === 'hu' ? 'Aktuális aukcióim' : 'Your Current Auctions',
    };

    return (
      <main className="space-y-8">
        <h1 className={pageTitleStyles}>{t.title}</h1>
        {hasItems ? <ItemList items={allitems} /> : <EmptyState params={params} />}
      </main>
    );
  }
