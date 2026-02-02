import { pageTitleStyles } from '@/styles';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistance } from 'date-fns';
import { formatToDollar } from '@/util/currency';
import { createBidAction } from './actions';
import { getBidsForItem } from '@/data-access/bids';
import { getItem } from '@/data-access/items';
import { auth } from '../../../../auth';

import { Badge } from '@/components/ui/badge';
import { isBidOver } from '@/util/bids';
import { getCloudinaryImageUrl } from '@/lib/cloudinary-url';

function formatTimestamp(timestamp: Date) {
  return formatDistance(timestamp, new Date(), {
    addSuffix: true,
  });
}

export default async function ItemPage({
  params: { itemId },
}: {
  params: { itemId: string };
}) {
  const session = await auth();

  const id = Number(itemId);
  if (Number.isNaN(id)) {
    return <p>Invalid item id</p>;
  }

  const item = await getItem(id);

  if (!item) {
    return (
      <div className="space-y-8 flex flex-col items-center justify-center mt-20">
        <Image src="/pacage.svg" width={200} height={200} alt="Pacage" />
        <h1 className={pageTitleStyles}>Item not Found</h1>
        <p className="italic">
          The item you are loking for does not exist. Please go back and search
          for a different auction item
        </p>

        <Button asChild>
          <Link href="/">View Auctions</Link>
        </Button>
      </div>
    );
  }

  // const imageUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${item.fileKey}`;
  const imageUrl = getCloudinaryImageUrl(item.fileKey);

  interface Bid {
    id: number;
    amount: number;
    userName: string;
    tameStamp: Date;
  }

  const allBids = await getBidsForItem(item.id);

  const hasBids = allBids.length > 0;

  const isBiddingOver = isBidOver(item);
  console.log('IS BIDDING OVER:', isBiddingOver);

  const canPlaceBid =
    session && item.userId !== session.user.id && !isBiddingOver;

  return (
    <main className="space-y-8 ">
      <div className="flex flex-wrap gap-8">
        <div className="space-y-8">
          <h1 className={pageTitleStyles}>
            <span className="font-normal">Auction for:</span> <br />
            {item.name}
          </h1>
          {isBiddingOver && (
            <Badge className="w-fit" variant={'destructive'}>
              Bidding over
            </Badge>
          )}

          {/* 🖼 Фото айтема */}
          <div className="flex flex-col gap-4">
            <Image
              src={imageUrl}
              alt={item.name}
              width={200}
              height={200}
              className="w-[300px] h-[300px] rounded-xl shadow-lg object-cover"
              unoptimized
            />

            <div className=" space-y-4">
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Current Bid: ${formatToDollar(item.currentBid)}
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Starting price: ${formatToDollar(item.startingPrice)}
              </p>
              <p>
                Bid Interval: <span>${formatToDollar(item.bidInterval)}</span>
              </p>
            </div>
          </div>
        </div>
        {/* Current bids */}
        {hasBids ? (
          <div className="space-y-8 flex-1 min-w-[300px]">
            <div className="flex justify-between">
              <h2 className="text-3xl font-semibold self-start text-left mb-20">
                Current Bids:
              </h2>
              {canPlaceBid && (
                <form action={createBidAction.bind(null, item.id)}>
                  <Button>Place a Bid</Button>
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
                      by{'  '}
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
                Current Bids:
              </h2>

              {canPlaceBid && (
                <form action={createBidAction.bind(null, item.id)}>
                  <Button>Place a Bid</Button>
                </form>
              )}
            </div>
            <Image src="/pacage.svg" width={200} height={200} alt="Pacage" />
            <h2 className="text-2xl font-semibold">No Bids yet</h2>
          </div>
        )}
      </div>
    </main>
  );
}
