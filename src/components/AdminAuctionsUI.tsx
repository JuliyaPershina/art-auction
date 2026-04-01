'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { formatToDollar } from '@/util/currency';

export default function AdminAuctionsUI({
  bids,
  items,
  locale,
  bidsPage,
  auctionsPage,
  bidsSort,
  auctionsSort,
  status,
}: any) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tab, setTab] = useState<'bids' | 'winners' | 'auctions'>('bids');
  const [selectedAuction, setSelectedAuction] = useState<number | null>(null);

  const now = new Date();

  // ======================
  // 🔁 UPDATE QUERY PARAMS
  // ======================
  const updateParams = (params: Record<string, any>) => {
    const sp = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      sp.set(key, String(value));
    });

    router.push(`?${sp.toString()}`);
  };

  // ======================
  // TRANSLATIONS
  // ======================
  const t = {
    bids: locale === 'hu' ? 'Licit' : 'Bids',
    auctions: locale === 'hu' ? 'Aukciók' : 'Auctions',
    winners: locale === 'hu' ? 'Nyertesek' : 'Winners',
  };

  return (
    <div className="p-6 space-y-6">
      {/* ======================
          TABS
      ====================== */}
      <div className="flex gap-2">
        {(['bids', 'winners', 'auctions'] as const).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded ${
              tab === key
                ? 'bg-black text-white'
                : 'bg-gray-100 dark:bg-zinc-800'
            }`}
          >
            {t[key]}
          </button>
        ))}
      </div>

      {/* ======================
          SORT + FILTERS
      ====================== */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* SORT BIDS */}
        {(tab === 'bids' || tab === 'winners') && (
          <select
            value={bidsSort}
            onChange={(e) =>
              updateParams({ bidsSort: e.target.value, bidsPage: 1 })
            }
            className="border px-3 py-2 rounded"
          >
            <option value="latest">Latest</option>
            <option value="highest">Highest bid</option>
          </select>
        )}

        {/* SORT AUCTIONS */}
        {tab === 'auctions' && (
          <>
            <select
              value={auctionsSort}
              onChange={(e) =>
                updateParams({
                  auctionsSort: e.target.value,
                  auctionsPage: 1,
                })
              }
              className="border px-3 py-2 rounded"
            >
              <option value="latest">Latest</option>
              <option value="highest">Highest bid</option>
            </select>

            <select
              value={status}
              onChange={(e) =>
                updateParams({
                  status: e.target.value,
                  auctionsPage: 1,
                })
              }
              className="border px-3 py-2 rounded"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="ended">Ended</option>
            </select>
          </>
        )}
      </div>

      {/* ======================
          BIDS LIST
      ====================== */}
      {tab === 'bids' &&
        bids.map((bid: any) => {
          const translation =
            bid.item.translations.find((t: any) => t.languageCode === locale) ||
            bid.item.translations[0];

          return (
            <div key={bid.id} className="border p-3 rounded">
              <div className="flex justify-between">
                <span>{translation?.name}</span>
                <span>${formatToDollar(bid.amount)}</span>
              </div>
            </div>
          );
        })}

      {/* ======================
          AUCTIONS LIST
      ====================== */}
      {tab === 'auctions' &&
        items.map((item: any) => {
          const translation =
            item.translations.find((t: any) => t.languageCode === locale) ||
            item.translations[0];

          const isEnded = new Date(item.endDate) < now;

          return (
            <div key={item.id} className="border p-4 rounded">
              <div className="flex justify-between">
                <span>{translation?.name}</span>
                <span>{isEnded ? 'Ended' : 'Active'}</span>
              </div>

              <button
                className="text-sm underline mt-2"
                onClick={() =>
                  setSelectedAuction(
                    selectedAuction === item.id ? null : item.id,
                  )
                }
              >
                View bids
              </button>

              {selectedAuction === item.id && (
                <div className="mt-3 space-y-2">
                  {item.bids.map((bid: any) => (
                    <div key={bid.id} className="flex justify-between">
                      <span>{bid.user.email}</span>
                      <span>${formatToDollar(bid.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

      {/* ======================
          PAGINATION
      ====================== */}
      <div className="flex gap-2 pt-4">
        {(tab === 'bids' || tab === 'winners') && (
          <>
            <button
              onClick={() =>
                updateParams({ bidsPage: Math.max(1, bidsPage - 1) })
              }
            >
              Prev
            </button>

            <span>Page {bidsPage}</span>

            <button onClick={() => updateParams({ bidsPage: bidsPage + 1 })}>
              Next
            </button>
          </>
        )}

        {tab === 'auctions' && (
          <>
            <button
              onClick={() =>
                updateParams({
                  auctionsPage: Math.max(1, auctionsPage - 1),
                })
              }
            >
              Prev
            </button>

            <span>Page {auctionsPage}</span>

            <button
              onClick={() => updateParams({ auctionsPage: auctionsPage + 1 })}
            >
              Next
            </button>
          </>
        )}
      </div>
    </div>
  );
}

