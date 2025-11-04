import { database } from '@/db/database';
import { auth } from '../../../auth';
import ItemList from '@/components/item-list';
import { items } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { EmptyState } from './empty-state';
import { pageTitleStyles } from '@/styles';

function getImageUrl(fileKey: string) {
  return;
}

export default async function MyAuctionPage() {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error('Unautorized');
  }

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const allitems = await database.query.items.findMany({
    where: eq(items.userId, session.user.id),
  });

  const user = session.user;
  if (!user) return null;

  const hasItems = allitems.length > 0;

  return (
    <>
      <main className="space-y-8">
        <h1 className={pageTitleStyles}>Your Current Auctions</h1>
        {hasItems ? <ItemList items={allitems} /> : <EmptyState />};
      </main>
    </>
  );
}
