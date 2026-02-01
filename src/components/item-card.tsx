'use client';

import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';
import { formatToDollar } from '@/util/currency';
import { format } from 'date-fns';
import { isBidOver } from '@/util/bids';

interface Item {
  id: number;
  name: string;
  fileKey: string;
  startingPrice: number;
  endDate: Date;
}

interface ItemCardProps {
  item: Item;
  imageUrl?: string;
  index: number;
}

export default function ItemCard({ item, imageUrl, index }: ItemCardProps) {
  return (
    <div
      className="
        border 
        rounded-xl 
        p-6 
        flex 
        flex-col 
        justify-between 
        transition-shadow 
        hover:shadow-lg 
        bg-white 
        dark:bg-gray-800
      "
    >
      {/* Фото з hover-зумом */}
      <div className="w-full aspect-square overflow-hidden rounded-lg mb-4">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.name}
            width={400}
            height={400}
            className="
              object-cover 
              w-full 
              h-full 
              transition-transform 
              duration-300 
              hover:scale-110
            "
            unoptimized
            priority={index === 0}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            Loading image...
          </div>
        )}
      </div>

      {/* Інформація */}
      <div className="flex flex-col grow justify-between space-y-4">
        <div className="font-semibold text-lg text-gray-900 dark:text-white">
          {item.name}
        </div>
        <div className="text-gray-600 dark:text-gray-400 mt-1">
          Starting price: ${formatToDollar(item.startingPrice)}
        </div>
        {isBidOver(item) ? (
          <div className="text-gray-600 dark:text-gray-400 mt-1">
            Bidding is Over
          </div>
        ) : (
          <div className="text-gray-600 dark:text-gray-400 mt-1">
            Ends On:{' '}
            {item.endDate
              ? format(new Date(item.endDate), 'eeee, MMM d, yyyy')
              : 'Unknown'}
          </div>
        )}

        <Button
          variant="destructive"
          onClick={async () => {
            if (!confirm('Are you sure you want to delete this item?')) return;

            const res = await fetch(`/api/items/${item.id}`, {
              method: 'DELETE',
            });

            if (res.ok) {
              alert('Item deleted');
              window.location.href = '/'; // переходимо на головну
            } else {
              const data = await res.json();
              alert(`Error: ${data.error}`);
            }
          }}
        >
          Delete Item
        </Button>

        <Button asChild variant={isBidOver(item) ? 'outline' : 'default'}>
          <Link href={`/items/${item.id}`}>
            {isBidOver(item) ? 'View Bid' : 'Place a Bid'}
          </Link>
        </Button>
      </div>
    </div>
  );
}
