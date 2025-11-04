import { eq } from 'drizzle-orm';
import { database } from '@/db/database';
import { items } from '@/db/schema';
import { pageTitleStyles } from '@/styles';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistance } from 'date-fns';
import { formatToDollar } from '@/util/currency';

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
  const item = await database?.query.items.findFirst({
    where: eq(items.id, parseInt(itemId)),
  });

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

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/images/${item.fileKey}`, {
    cache: 'no-store',
  });
  const data = await res.json();
  const imageUrl = data.url;

  //   const bids = [
  //     { id: 1, amount: 5000, userName: 'Alice', tameStamp: new Date() },
  //     { id: 2, amount: 6000, userName: 'Peter', tameStamp: new Date() },
  //     { id: 3, amount: 7000, userName: 'Jack', tameStamp: new Date() },
  //   ];

  interface Bid {
    id: number;
    amount: number;
    userName: string;
    tameStamp: Date;
  }

  const bids: Bid[] = [];

  const hasBids = bids.length > 0;

  return (
    <main className="space-y-8 ">
      <div className="flex flex-wrap gap-8">
        <div className="space-y-8">
          <h1 className={pageTitleStyles}>
            <span className="font-normal">Auction for:</span> <br />
            {item.name}
          </h1>

          {/* 🖼 Фото айтема */}
          <div className="flex flex-col gap-4">
            <Image
              src={imageUrl}
              alt={item.name}
              width={200}
              height={200}
              className="w-[300] h-[300] rounded-xl shadow-lg object-cover"
              unoptimized
            />

            <div className=" space-y-4">
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
            <h2 className="text-3xl font-semibold self-start text-left mb-20">
              Current Bids:
            </h2>
            <ul className="flex flex-col gap-3">
              {bids.map((bid) => (
                <li key={bid.id} className="bg-gray-100 rounded-xl p-8">
                  <div className="space-x-4 flex flex-wrap">
                    <div className="gap-2 flex-1 flex flex-nowrap">
                      <span className="font-bold">${bid.amount}</span>by{'  '}
                      <span className="font-bold">{bid.userName}</span>
                    </div>
                    <span className="font-thin">
                      {formatTimestamp(bid.tameStamp)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex-1 flex flex-col text-center gap-8 items-center">
            <h2 className="text-3xl font-semibold self-start text-left mb-20">
              Current Bids:
            </h2>
            <Image src="/pacage.svg" width={200} height={200} alt="Pacage" />
            <h2 className="text-2xl font-semibold">No Bids yet</h2>
            <Button asChild>
              <Link href={`/bid/${item.id}`}>Place a Bid</Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
