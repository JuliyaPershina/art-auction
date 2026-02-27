'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';

import { Button } from './ui/button';
import { formatToDollar } from '@/util/currency';
import { isBidOver } from '@/util/bids';
import { getCloudinaryImageUrl } from '@/lib/cloudinary-url';

interface Item {
  id: number;
  name: string;
  fileKey: string;
  startingPrice: number;
  endDate: Date;
}

interface ItemCardProps {
  item: Item;
  index: number;
}

export default function ItemCard({ item, index }: ItemCardProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as 'hu' | 'en';

  const { data: session } = useSession();
  const user = session?.user;

  const imageUrl = getCloudinaryImageUrl(item.fileKey);

  const biddingOver = isBidOver({
    ...item,
    endDate: new Date(item.endDate),
  });

  const t = {
    starting: locale === 'hu' ? 'Kezdő ár' : 'Starting price',
    ends: locale === 'hu' ? 'Lejár' : 'Ends on',
    over: locale === 'hu' ? 'Licit lezárva' : 'Bidding is Over',
    place: locale === 'hu' ? 'Licitálás' : 'Place a Bid',
    view: locale === 'hu' ? 'Megtekintés' : 'View Bid',
    deleteConfirm:
      locale === 'hu'
        ? 'Biztosan törölni szeretnéd ezt a tételt?'
        : 'Are you sure you want to delete this item?',
    deleteError:
      locale === 'hu'
        ? 'Hiba történt törlés közben'
        : 'Something went wrong while deleting',
    deleteLabel: locale === 'hu' ? 'Törlés' : 'Delete Item',
  };

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
          {t.starting}: ${formatToDollar(item.startingPrice)}
        </div>

        <div className="text-gray-600">
          {biddingOver
            ? t.over
            : `${t.ends}: ${format(
                new Date(item.endDate),
                'eeee, MMM d, yyyy',
              )}`}
        </div>

        {user && user.role === 'admin' && (
          <Button
            variant="destructive"
            onClick={async () => {
              if (!confirm(t.deleteConfirm)) return;

              try {
                const res = await fetch(`/api/items/${item.id}`, {
                  method: 'DELETE',
                });

                if (!res.ok) {
                  const data = await res.json();
                  throw new Error(data.error);
                }

                router.refresh();
              } catch {
                alert(t.deleteError);
              }
            }}
          >
            {t.deleteLabel}
          </Button>
        )}

        <Button asChild variant={biddingOver ? 'outline' : 'default'}>
          <Link href={`/${locale}/items/${item.id}`}>
            {biddingOver ? t.view : t.place}
          </Link>
        </Button>
      </div>
    </div>
  );
}