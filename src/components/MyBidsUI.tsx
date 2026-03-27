'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistance } from 'date-fns';
import { formatToDollar } from '@/util/currency';
import { getCloudinaryImageUrl } from '@/lib/cloudinary-url';

type BidItem = {
  id: number;
  amount: number;
  timestamp: Date;
  item: {
    id: number;
    fileKey: string;
    currentBid: number;
    endDate: Date;
    isProcessed: boolean; // ✅ FIX
    translations: {
      languageCode: string;
      name: string;
    }[];
  };
};

export default function MyBidsUI({
  bids,
  locale,
}: {
  bids: BidItem[];
  locale: 'hu' | 'en';
}) {
  const [tab, setTab] = useState<'active' | 'won' | 'lost'>('active');

  const t = {
    active: locale === 'hu' ? 'Aktív' : 'Active',
    won: locale === 'hu' ? 'Megnyert' : 'Won',
    lost: locale === 'hu' ? 'Elvesztett' : 'Lost',
    view: locale === 'hu' ? 'Megtekintés' : 'View',
    noBids: locale === 'hu' ? 'Nincs találat' : 'No items',
    wonLabel: locale === 'hu' ? 'Megnyerted 🎉' : 'You won 🎉',
    lostLabel: locale === 'hu' ? 'Elvesztetted' : 'You lost',
  };

  const now = new Date();

  // ✅ FIX: групуємо ставки і беремо ОСТАННЮ ставку по кожному аукціону
  const latestBidsPerItem = useMemo(() => {
    const map = new Map<number, BidItem>();

    for (const bid of bids) {
      const existing = map.get(bid.item.id);

      if (!existing) {
        map.set(bid.item.id, bid);
      } else {
        // беремо новішу ставку
        if (new Date(bid.timestamp) > new Date(existing.timestamp)) {
          map.set(bid.item.id, bid);
        }
      }
    }

    return Array.from(map.values());
  }, [bids]);

  const filtered = latestBidsPerItem.filter((bid) => {
    const isOver = new Date(bid.item.endDate) < now;
    const isProcessed = bid.item.isProcessed;
    const isWinning = bid.amount === bid.item.currentBid;

    if (tab === 'active') return !isOver || !isProcessed;

    if (tab === 'won') return isOver && isProcessed && isWinning;

    // ✅ FIX: тут тепер кожен item лише один раз
    if (tab === 'lost') return isOver && isProcessed && !isWinning;

    return false;
  });

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 border-b pb-2 sm:gap-2">
        {(['active', 'won', 'lost'] as const).map((tKey) => (
          <button
            key={tKey}
            onClick={() => setTab(tKey)}
            className={`px-3 sm:px-4 py-2 whitespace-nowrap rounded-full text-sm font-medium transition
              ${
                tab === tKey
                  ? 'bg-black text-white'
                  : 'bg-gray-100 dark:bg-zinc-800'
              }`}
          >
            {t[tKey]}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <div className="grid gap-5">
          {filtered.map((bid) => {
            const translation =
              bid.item.translations.find((t) => t.languageCode === locale) ||
              bid.item.translations.find((t) => t.languageCode === 'en');

            const name = translation?.name ?? 'Untitled';
            const imageUrl = getCloudinaryImageUrl(bid.item.fileKey);

            const isOver = new Date(bid.item.endDate) < now;
            const isProcessed = bid.item.isProcessed;
            const isWinning = bid.amount === bid.item.currentBid;

            return (
              <div
                key={bid.id}
                className={`flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl shadow transition hover:shadow-md
                  bg-white dark:bg-zinc-900
                  ${
                    isOver && isProcessed && isWinning
                      ? 'ring-2 ring-green-500'
                      : ''
                  }`}
              >
                {/* Image */}
                <div className="w-full sm:w-28 aspect-square rounded-xl overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={name}
                    width={120}
                    height={120}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between flex-1">
                  <div className="space-y-1">
                    <h2 className="font-semibold text-lg">{name}</h2>

                    <p className="text-xl font-bold">
                      ${formatToDollar(bid.amount)}
                    </p>

                    {isOver && isProcessed && (
                      <span
                        className={`text-sm font-medium ${
                          isWinning ? 'text-green-600' : 'text-gray-500'
                        }`}
                      >
                        {isWinning ? t.wonLabel : t.lostLabel}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      {formatDistance(new Date(bid.timestamp), now, {
                        addSuffix: true,
                      })}
                    </span>

                    <Link
                      href={`/${locale}/items/${bid.item.id}`}
                      className="text-sm font-medium hover:underline cursor-pointer"
                    >
                      {t.view}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-20">{t.noBids}</div>
      )}
    </div>
  );
}
