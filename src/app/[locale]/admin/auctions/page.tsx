import { database } from '@/db/database';
import { auth } from '../../../../../auth';
import { bids, users } from '@/db/schema';
import { desc } from 'drizzle-orm';
import AdminAuctionsUI from '@/components/AdminAuctionsUI';

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: 'hu' | 'en' }>;
}) {
  const { locale } = await params;

  const session = await auth();

  if (!session || session.user.role !== 'admin') {
    throw new Error('Forbidden');
  }

  const allBids = await database.query.bids.findMany({
    with: {
      user: true,
      item: {
        with: {
          translations: true,
        },
      },
    },
    orderBy: (bids, { desc }) => [desc(bids.timestamp)],
  });

  return <AdminAuctionsUI bids={allBids} locale={locale} />;
}
