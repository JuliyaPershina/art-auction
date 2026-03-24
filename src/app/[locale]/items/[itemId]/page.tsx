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
    // <main className="space-y-8 p-8">
    //   <div className="flex flex-wrap gap-8">
    //     <div className="space-y-8">
    //       <h1 className={pageTitleStyles}>
    //         <span className="font-normal">{t.auctionFor} </span> <br />
    //         {name}
    //       </h1>
    //       {isBiddingOver && (
    //         <Badge className="w-fit" variant={'destructive'}>
    //           {t.biddingOver}
    //         </Badge>
    //       )}

    //       {/* 🖼 Фото айтема */}
    //       <div className="flex flex-col gap-4">
    //         <Image
    //           src={imageUrl}
    //           alt={name}
    //           width={200}
    //           height={200}
    //           className="w-75 h-75 rounded-xl shadow-lg object-cover"
    //           unoptimized
    //         />

    //         <div className=" space-y-4">
    //           <p className="text-lg text-gray-700 dark:text-gray-300">
    //             {t.currentBid}: ${formatToDollar(item.currentBid)}
    //           </p>
    //           <p className="text-lg text-gray-700 dark:text-gray-300">
    //             {t.startingPrice}: ${formatToDollar(item.startingPrice)}
    //           </p>
    //           <p>
    //             {t.bidInterval}:{' '}
    //             <span>${formatToDollar(item.bidInterval)}</span>
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //     {/* Current bids */}
    //     <div>
    //       <div className="pb-6">
    //         <Button asChild variant="outline">
    //           <Link href={`/${locale}/allAuctions`}>← Back to auctions</Link>
    //         </Button>
    //       </div>
    //       {hasBids ? (
    //         <div className="space-y-8 flex-1 min-w-75">
    //           <div className="flex justify-between">
    //             <h2 className="text-3xl font-semibold self-start text-left mb-20">
    //               {t.currentBids}:
    //             </h2>
    //             {canPlaceBid && (
    //               <form action={createBidAction.bind(null, locale, item.id)}>
    //                 <Button>{t.placeBid}</Button>
    //               </form>
    //             )}
    //           </div>
    //           <ul className="flex flex-col gap-3">
    //             {allBids.map((bid) => (
    //               <li key={bid.id} className="bg-gray-100 rounded-xl p-8">
    //                 <div className="space-x-4 flex flex-wrap">
    //                   <div className="gap-2 flex-1 flex flex-nowrap">
    //                     <span className="font-bold">
    //                       ${formatToDollar(bid.amount)}
    //                     </span>
    //                     {t.by}
    //                     {'  '}
    //                     <span className="font-bold">{bid.user.name}</span>
    //                   </div>
    //                   <span className="font-thin">
    //                     {formatTimestamp(bid.timestamp)}
    //                   </span>
    //                 </div>
    //               </li>
    //             ))}
    //           </ul>
    //         </div>
    //       ) : (
    //         <div className="flex-1 flex flex-col text-center gap-8 items-center">
    //           <div>
    //             <h2 className="text-3xl font-semibold self-start text-left mb-20">
    //               {t.currentBids}:
    //             </h2>

    //             {canPlaceBid && (
    //               <form action={createBidAction.bind(null, locale, item.id)}>
    //                 <Button>{t.placeBid}</Button>
    //               </form>
    //             )}
    //           </div>
    //           <Image src="/pacage.svg" width={200} height={200} alt="Pacage" />
    //           <h2 className="text-2xl font-semibold">{t.noBids}</h2>
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // </main>
    <main className="p-6 lg:p-10 max-w-7xl mx-auto">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
    
    {/* LEFT: ITEM */}
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 space-y-6">
        
        {/* Image */}
        <div className="w-full aspect-square overflow-hidden rounded-xl">
          <Image
            src={imageUrl}
            alt={name}
            width={500}
            height={500}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
            {name}
          </h1>

          {isBiddingOver && (
            <Badge variant="destructive">{t.biddingOver}</Badge>
          )}
        </div>

        {/* Price */}
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500 uppercase">
              {t.currentBid}
            </p>
            <p className="text-3xl font-bold">
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
        </div>
      </div>
    </div>

    {/* RIGHT: BIDS */}
    <div className="space-y-6 lg:sticky lg:top-10 h-fit">
      
      {/* Back */}
      <Button asChild variant="ghost" className="text-sm">
        <Link href={`/${locale}/allAuctions`}>
          ← Back to auctions
        </Link>
      </Button>

      {/* Action */}
      {canPlaceBid && (
        <form action={createBidAction.bind(null, locale, item.id)}>
          <Button className="w-full text-lg py-6 shadow-lg">
            {t.placeBid}
          </Button>
        </form>
      )}

      {/* Bids card */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 space-y-6">
        
        <h2 className="text-2xl font-semibold">
          {t.currentBids}
        </h2>

        {hasBids ? (
          <ul className="space-y-3">
            {allBids.map((bid) => (
              <li
                key={bid.id}
                className="p-4 rounded-xl border border-gray-100 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  
                  <div className="flex gap-2">
                    <span className="font-semibold">
                      ${formatToDollar(bid.amount)}
                    </span>
                    <span className="text-gray-500">{t.by}</span>
                    <span className="font-semibold">
                      {bid.user.name}
                    </span>
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
