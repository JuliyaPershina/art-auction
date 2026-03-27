import { database } from '@/db/database';
import { auth } from '../../../../auth';
import { bids } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { pageTitleStyles } from '@/styles';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistance } from 'date-fns';
import { formatToDollar } from '@/util/currency';
import { getCloudinaryImageUrl } from '@/lib/cloudinary-url';
import MyBidsUI from '@/components/MyBidsUI';

export default async function MyBidsPage({
  params,
}: {
  params: Promise<{ locale: 'hu' | 'en' }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const userBids = await database.query.bids.findMany({
    where: eq(bids.userId, session.user.id),
    with: {
      item: {
        with: {
          translations: true,
        },
      },
    },
    orderBy: (bids, { desc }) => [desc(bids.timestamp)],
  });

  const hasBids = userBids.length > 0;

  const t = {
    title: locale === 'hu' ? 'Licitjeim' : 'My Bids',
    noBids: locale === 'hu' ? 'Még nincs licit' : 'No bids yet',
    back: locale === 'hu' ? 'Vissza az aukciókhoz' : 'Back to auctions',
    by: locale === 'hu' ? 'Tétel' : 'Item',
  };

  return (
    <main className="p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <h1 className={pageTitleStyles}>{t.title}</h1>

        <Link
          href={`/${locale}/auctions`}
          className="text-sm text-gray-500 hover:underline"
        >
          ← {t.back}
        </Link>
      </div>

      {/* Content */}
      {hasBids ? (
        <MyBidsUI bids={userBids} locale={locale} />
      ) : (
        <div className="flex flex-col items-center text-center gap-6 mt-20">
          <Image src="/pacage.svg" width={150} height={150} alt="Empty" />
          <p className="text-gray-500">{t.noBids}</p>
        </div>
      )}
    </main>
  );
}