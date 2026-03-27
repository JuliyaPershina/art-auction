import { pageTitleStyles } from '@/styles';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistance, format } from 'date-fns';
import { formatToDollar } from '@/util/currency';
import { getBidsForItem } from '@/data-access/bids';
import { getItem } from '@/data-access/items';
import { auth } from '../../../../../auth';
import { Badge } from '@/components/ui/badge';
import { isBidOver } from '@/util/bids';
import { getCloudinaryImageUrl } from '@/lib/cloudinary-url';
import PlaceBidButton from '@/components/PlaceBidButton';
import ImagePreviewModal from '@/components/ImagePreviewModal';

function formatTimestamp(timestamp: Date) {
  return formatDistance(timestamp, new Date(), {
    addSuffix: true,
  });
}

export default async function ItemPage({
  params,
}: {
  params: Promise<{ locale: 'hu' | 'en'; itemId: string }>;
}) {
  const { locale, itemId } = await params;
  const session = await auth();

  const id = Number(itemId);
  if (Number.isNaN(id)) {
    return (
      <p>{locale === 'hu' ? 'Érvénytelen azonosító' : 'Invalid item id'}</p>
    );
  }

  const item = await getItem(id);

  if (!item) {
    return (
      <div className="space-y-8 flex flex-col items-center justify-center mt-20">
        <Image src="/pacage.svg" width={200} height={200} alt="Pacage" />
        <h1 className={pageTitleStyles}>
          {locale === 'hu' ? 'Tétel nem található' : 'Item not found'}
        </h1>
        <p className="italic text-center max-w-md">
          {locale === 'hu'
            ? 'A keresett tétel nem létezik. Kérjük, lépjen vissza, és keressen egy másik aukciós tételt.'
            : 'The item you are looking for does not exist. Please go back and search for a different auction item.'}
        </p>

        <Button asChild>
          <Link href={`/${locale}`}>
            {locale === 'hu' ? 'Vissza az aukciókhoz' : 'View Auctions'}
          </Link>
        </Button>
      </div>
    );
  }

  const imageUrl = getCloudinaryImageUrl(item.fileKey);
  const allBids = await getBidsForItem(item.id);

  const hasBids = allBids.length > 0;

  const isBiddingOver = isBidOver(item);

  const canPlaceBid =
    session && item.userId !== session.user.id && !isBiddingOver;

  const t = {
    currentBid: locale === 'hu' ? 'Aktuális licit' : 'Current Bid',
    startingPrice: locale === 'hu' ? 'Kezdő ár' : 'Starting price',
    bidInterval: locale === 'hu' ? 'Licitlépcső' : 'Bid Interval',
    biddingOver: locale === 'hu' ? 'Licit lezárva' : 'Bidding over',
    noBids: locale === 'hu' ? 'Még nincs licit' : 'No bids yet',
    currentBids: locale === 'hu' ? 'Aktuális licitkör' : 'Current Bids',
    by: locale === 'hu' ? 'által' : 'by',
    ends: locale === 'hu' ? 'Lejár' : 'Ends on',
    over: locale === 'hu' ? 'Licit lezárva' : 'Bidding is Over',
  };

  const translation =
    item.translations.find((t) => t.languageCode === locale) ||
    item.translations.find((t) => t.languageCode === 'en');

  const name = translation?.name ?? 'Untitled';

  return (
    <main className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
        {/* LEFT: ITEM */}
        <div className="px-0 sm:px-4 lg:px-12">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/*  компактна + клікабельна картинка */}
            <div className="w-full max-w-sm sm:max-w-md mx-auto aspect-square">
              <ImagePreviewModal src={imageUrl} alt={name} />
            </div>

            {/* Title */}
            <div className="space-y-1 text-center">
              <h1 className="text-3xl font-bold tracking-tight">{name}</h1>

              {isBiddingOver && (
                <Badge variant="destructive">{t.biddingOver}</Badge>
              )}
            </div>

            {/* Price */}
            <div className="space-y-4 px-6">
              <div className="text-center space-y-3">
                <p className="text-sm text-gray-500 uppercase">
                  {t.currentBid}
                </p>
                <p className="text-2xl sm:text-3xl font-bold">
                  ${formatToDollar(item.currentBid)}
                </p>
              </div>

              <div className="flex justify-between text-sm text-gray-500">
                <span>{t.startingPrice}</span>
                <span>${formatToDollar(item.startingPrice)}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-500">
                <span>{t.bidInterval}</span>
                <span>${formatToDollar(item.bidInterval)}</span>
              </div>

              <div className="text-sm text-gray-500 text-center">
                {isBiddingOver
                  ? t.over
                  : `${t.ends}: ${format(
                      new Date(item.endDate),
                      'eeee, MMM d, yyyy',
                    )}`}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: BIDS */}
        <div className="space-y-6 lg:sticky lg:top-10 h-fit">
          {/* Back */}
          <Button asChild variant="ghost" className="text-sm"> 
            <Link href={`/${locale}/allAuctions`}>
              ← {locale === 'hu' ? 'Vissza az aukciókhoz' : 'Back to auctions'}
            </Link>
          </Button>

          {/* Action */}
          {canPlaceBid && (
            <PlaceBidButton
              locale={locale}
              itemId={item.id}
              currentBid={item.currentBid}
            />
          )}

          {/* Bids */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 space-y-6">
            <h2 className="text-2xl font-semibold">{t.currentBids}</h2>

            {hasBids ? (
              <ul className="space-y-3">
                {allBids.map((bid) => (
                  <li
                    key={bid.id}
                    className="p-3 sm:p-4 rounded-xl border border-gray-100 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 hover:shadow-md transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div className="flex gap-2 flex-wrap">
                        <span className="font-semibold">
                          ${formatToDollar(bid.amount)} {/* ✅ FIX */}
                        </span>
                        <span className="text-gray-500">{t.by}</span>
                        <span className="font-semibold">{bid.user.name}</span>
                      </div>

                      <span className="text-xs text-gray-400">
                        {formatTimestamp(bid.timestamp)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center text-center gap-6 py-10">
                <Image
                  src="/pacage.svg"
                  width={120}
                  height={120}
                  alt="No bids"
                />
                <p className="text-gray-500">{t.noBids}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
