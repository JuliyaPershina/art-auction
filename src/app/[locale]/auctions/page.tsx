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
    <main className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
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
        // <div className="grid gap-6">
        //   {userBids.map((bid) => {
        //     const translation =
        //       bid.item.translations.find((t) => t.languageCode === locale) ||
        //       bid.item.translations.find((t) => t.languageCode === 'en');

        //     const name = translation?.name ?? 'Untitled';
        //     const imageUrl = getCloudinaryImageUrl(bid.item.fileKey);

        //     return (
        //       <div
        //         key={bid.id}
        //         className="flex flex-col sm:flex-row gap-6 bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow hover:shadow-md transition"
        //       >
        //         {/* Image */}
        //         <div className="w-full sm:w-32 aspect-square overflow-hidden rounded-xl">
        //           <Image
        //             src={imageUrl}
        //             alt={name}
        //             width={150}
        //             height={150}
        //             className="w-full h-full object-cover"
        //             unoptimized
        //           />
        //         </div>

        //         {/* Info */}
        //         <div className="flex flex-col justify-between flex-1">
        //           <div className="space-y-2">
        //             <h2 className="text-lg font-semibold">{name}</h2>

        //             <p className="text-sm text-gray-500">{t.by}</p>

        //             <p className="text-xl font-bold">
        //               ${formatToDollar(bid.amount)}
        //             </p>
        //           </div>

        //           <div className="flex justify-between items-center">
        //             <span className="text-xs text-gray-400">
        //               {formatDistance(new Date(bid.timestamp), new Date(), {
        //                 addSuffix: true,
        //               })}
        //             </span>

        //             <Link
        //               href={`/${locale}/items/${bid.item.id}`}
        //               className="text-sm font-medium hover:underline"
        //             >
        //               {locale === 'hu' ? 'Megtekintés' : 'View'}
        //             </Link>
        //           </div>
        //         </div>
        //       </div>
        //     );
        //   })}
        // </div>
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