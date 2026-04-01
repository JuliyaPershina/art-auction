import { database } from '@/db/database';
import { auth } from '../../../../../auth';
import { bids, items } from '@/db/schema';
import { desc, asc, sql } from 'drizzle-orm';
import AdminAuctionsUI from '@/components/AdminAuctionsUI';

export default async function AdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: 'hu' | 'en' }>;
  searchParams: Promise<{
    bidsPage?: string;
    auctionsPage?: string;
    bidsSort?: 'latest' | 'highest';
    auctionsSort?: 'latest' | 'highest';
    status?: 'all' | 'active' | 'ended';
  }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;

  const session = await auth();

  if (!session || session.user.role !== 'admin') {
    throw new Error('Forbidden');
  }

  const bidsPage = Number(sp.bidsPage || 1);
  const auctionsPage = Number(sp.auctionsPage || 1);

  const limit = 10;

  const bidsSort = sp.bidsSort || 'latest';
  const auctionsSort = sp.auctionsSort || 'latest';
  const status = sp.status || 'all';

  // ======================
  // 🔥 BIDS QUERY
  // ======================
  const bidsOrder =
    bidsSort === 'highest' ? desc(bids.amount) : desc(bids.timestamp);

  const allBids = await database.query.bids.findMany({
    with: {
      user: true,
      item: {
        with: {
          translations: true,
        },
      },
    },
    orderBy: bidsOrder,
    limit,
    offset: (bidsPage - 1) * limit,
  });

  // ======================
  // 🔥 AUCTIONS QUERY
  // ======================
  let auctionsWhere = undefined;

  if (status === 'active') {
    auctionsWhere = sql`end_date > now()`;
  }

  if (status === 'ended') {
    auctionsWhere = sql`end_date <= now()`;
  }

  const auctionsOrder =
    auctionsSort === 'highest' ? desc(items.currentBid) : desc(items.id);

  const allItems = await database.query.items.findMany({
    where: auctionsWhere,
    with: {
      translations: true,
      bids: {
        with: {
          user: true,
        },
      },
    },
    orderBy: auctionsOrder,
    limit,
    offset: (auctionsPage - 1) * limit,
  });

  return (
    <AdminAuctionsUI
      bids={allBids}
      items={allItems}
      locale={locale}
      bidsPage={bidsPage}
      auctionsPage={auctionsPage}
      bidsSort={bidsSort}
      auctionsSort={auctionsSort}
      status={status}
    />
  );
}

