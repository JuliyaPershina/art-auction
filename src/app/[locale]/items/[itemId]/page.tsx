import { pageTitleStyles } from '@/styles';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistance } from 'date-fns';
import { formatToDollar } from '@/util/currency';
import { createBidAction } from './actions';
import { getBidsForItem } from '@/data-access/bids';
import { getItem } from '@/data-access/items';
import { auth } from '../../../../../auth';

import { Badge } from '@/components/ui/badge';
import { isBidOver } from '@/util/bids';
import { getCloudinaryImageUrl } from '@/lib/cloudinary-url';

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
        <p className="italic">
          {locale === 'hu'
            ? 'A keresett tétel nem létezik. Kérjük, lépjen vissza, és keressen egy másik aukciós tételt.'
            : 'The item you are loking for does not exist. Please go back and search for a different auction item'}
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
    auctionFor: locale === 'hu' ? 'Aukció:' : 'Auction for:',
    currentBid: locale === 'hu' ? 'Aktuális licit' : 'Current Bid',
    startingPrice: locale === 'hu' ? 'Kezdő ár' : 'Starting price',
    bidInterval: locale === 'hu' ? 'Licitlépcső' : 'Bid Interval',
    placeBid: locale === 'hu' ? 'Licitálás' : 'Place a Bid',
    biddingOver: locale === 'hu' ? 'Licit lezárva' : 'Bidding over',
    noBids: locale === 'hu' ? 'Még nincs licit' : 'No bids yet',
    currentBids: locale === 'hu' ? 'Aktuális licitkör' : 'Current Bids',
    by: locale === 'hu' ? 'által' : 'by',
  };

  const translation =
    item.translations.find((t) => t.languageCode === locale) ||
    item.translations.find((t) => t.languageCode === 'en');

  const name = translation?.name ?? 'Untitled';

  return (
    <main className="space-y-8 p-8">
      <div className="flex flex-wrap gap-8">
        <div className="space-y-8">
          <h1 className={pageTitleStyles}>
            <span className="font-normal">{t.auctionFor} </span> <br />
            {name}
          </h1>
          {isBiddingOver && (
            <Badge className="w-fit" variant={'destructive'}>
              {t.biddingOver}
            </Badge>
          )}

          {/* 🖼 Фото айтема */}
          <div className="flex flex-col gap-4">
            <Image
              src={imageUrl}
              alt={name}
              width={200}
              height={200}
              className="w-75 h-75 rounded-xl shadow-lg object-cover"
              unoptimized
            />

            <div className=" space-y-4">
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {t.currentBid}: ${formatToDollar(item.currentBid)}
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {t.startingPrice}: ${formatToDollar(item.startingPrice)}
              </p>
              <p>
                {t.bidInterval}:{' '}
                <span>${formatToDollar(item.bidInterval)}</span>
              </p>
            </div>
          </div>
        </div>
        {/* Current bids */}
        {hasBids ? (
          <div className="space-y-8 flex-1 min-w-75">
            <div className="flex justify-between">
              <h2 className="text-3xl font-semibold self-start text-left mb-20">
                {t.currentBids}:
              </h2>
              {canPlaceBid && (
                <form action={createBidAction.bind(null, locale, item.id)}>
                  <Button>{t.placeBid}</Button>
                </form>
              )}
            </div>
            <ul className="flex flex-col gap-3">
              {allBids.map((bid) => (
                <li key={bid.id} className="bg-gray-100 rounded-xl p-8">
                  <div className="space-x-4 flex flex-wrap">
                    <div className="gap-2 flex-1 flex flex-nowrap">
                      <span className="font-bold">
                        ${formatToDollar(bid.amount)}
                      </span>
                      {t.by}
                      {'  '}
                      <span className="font-bold">{bid.user.name}</span>
                    </div>
                    <span className="font-thin">
                      {formatTimestamp(bid.timestamp)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex-1 flex flex-col text-center gap-8 items-center">
            <div>
              <h2 className="text-3xl font-semibold self-start text-left mb-20">
                {t.currentBids}:
              </h2>

              {canPlaceBid && (
                <form action={createBidAction.bind(null, locale, item.id)}>
                  <Button>{t.placeBid}</Button>
                </form>
              )}
            </div>
            <Image src="/pacage.svg" width={200} height={200} alt="Pacage" />
            <h2 className="text-2xl font-semibold">{t.noBids}</h2>
          </div>
        )}
      </div>
    </main>
  );
}
