'use client';

import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';
import { formatToDollar } from '@/util/currency';
import { format } from 'date-fns';
import { isBidOver } from '@/util/bids';
import { useRouter } from 'next/navigation';
import { getCloudinaryImageUrl } from '@/lib/cloudinary-url';
import { useSession } from 'next-auth/react';



interface Item {
  id: number;
  name: string;
  fileKey: string;
  startingPrice: number;
  endDate: Date // ✅
}

interface ItemCardProps {
  item: Item;
  index: number;
}

export default function ItemCard({ item, index }: ItemCardProps) {
  const router = useRouter();

  const imageUrl = getCloudinaryImageUrl(item.fileKey);

  const biddingOver = isBidOver({
    ...item,
    endDate: new Date(item.endDate),
  });
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="border rounded-xl p-6 flex flex-col justify-between bg-white dark:bg-gray-800">
      <div className="w-full aspect-square overflow-hidden rounded-lg mb-4">
        <Image
          src={imageUrl}
          alt={item.name}
          width={400}
          height={400}
          className="object-cover w-full h-full transition-transform hover:scale-110"
          unoptimized
          priority={index === 0}
        />
      </div>

      <div className="flex flex-col grow space-y-4">
        <div className="font-semibold text-lg">{item.name}</div>

        <div className="text-gray-600">
          Starting price: ${formatToDollar(item.startingPrice)}
        </div>

        <div className="text-gray-600">
          {biddingOver
            ? 'Bidding is Over'
            : `Ends on: ${format(new Date(item.endDate), 'eeee, MMM d, yyyy')}`}
        </div>

        {user && user.role === 'admin' && (
          <Button
            variant="destructive"
            onClick={async () => {
              if (!confirm('Are you sure you want to delete this item?'))
                return;

              const res = await fetch(`/api/items/${item.id}`, {
                method: 'DELETE',
              });

              if (res.ok) {
                router.refresh();
                router.push('/');
              } else {
                const data = await res.json();
                alert(data.error);
              }
            }}
          >
            Delete Item
          </Button>
        )}

        <Button asChild variant={biddingOver ? 'outline' : 'default'}>
          <Link href={`/items/${item.id}`}>
            {biddingOver ? 'View Bid' : 'Place a Bid'}
          </Link>
        </Button>
      </div>
    </div>
  );
}

