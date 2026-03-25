'use client';

import { useState, useMemo } from 'react';
import { formatToDollar } from '@/util/currency';

export default function AdminAuctionsUI({ bids, locale }: any) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | 'won'>('all');

  const now = new Date();

  const t = {
    title: locale === 'hu' ? 'Admin aukciók' : 'Admin Auctions',
    search: locale === 'hu' ? 'Keresés...' : 'Search...',
    all: locale === 'hu' ? 'Összes' : 'All',
    won: locale === 'hu' ? 'Nyertesek' : 'Winners',
    email: locale === 'hu' ? 'Email küldése' : 'Send Email',
  };

  // 🔥 групування по юзеру
  const grouped = useMemo(() => {
    const map: any = {};

    bids.forEach((bid: any) => {
      if (!map[bid.user.id]) {
        map[bid.user.id] = {
          user: bid.user,
          bids: [],
        };
      }
      map[bid.user.id].bids.push(bid);
    });

    return Object.values(map);
  }, [bids]);

  // 🔍 ФІЛЬТР + ПОШУК
  const filtered = useMemo(() => {
    return grouped
      .map((group: any) => {
        const filteredBids = group.bids.filter((bid: any) => {
          const translation =
            bid.item.translations.find(
              (t: any) => t.languageCode === locale,
            ) || bid.item.translations[0];

          const name = translation?.name ?? '';

          const isOver = new Date(bid.item.endDate) < now;
          const isWinning = bid.amount === bid.item.currentBid;

          // 🏆 тільки переможці
          if (tab === 'won' && !(isOver && isWinning)) return false;

          // 🔍 пошук
          const query = search.toLowerCase();

          return (
            group.user.email.toLowerCase().includes(query) ||
            group.user.name?.toLowerCase().includes(query) ||
            name.toLowerCase().includes(query)
          );
        });

        return {
          ...group,
          bids: filteredBids,
        };
      })
      .filter((g: any) => g.bids.length > 0);
  }, [grouped, search, tab, locale]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{t.title}</h1>

      {/* 🔍 Search + Tabs */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <input
          type="text"
          placeholder={t.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-md w-full md:max-w-sm"
        />

        <div className="flex gap-2">
          {(['all', 'won'] as const).map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-full text-sm ${
                tab === key
                  ? 'bg-black text-white'
                  : 'bg-gray-100 dark:bg-zinc-800'
              }`}
            >
              {t[key]}
            </button>
          ))}
        </div>
      </div>

      {/* USERS */}
      {filtered.map((group: any) => (
        <div
          key={group.user.id}
          className="border rounded-xl p-4 bg-white dark:bg-zinc-900"
        >
          {/* USER HEADER */}
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{group.user.name}</p>
              <p className="text-sm text-gray-500">
                {group.user.email}
              </p>
            </div>

            <button
              className="text-sm underline cursor-pointer hover:text-blue-500 transition"
              onClick={() =>
                setSelectedUser(
                  selectedUser === group.user.id
                    ? null
                    : group.user.id,
                )
              }
            >
              {selectedUser === group.user.id ? 'Hide' : 'View'}
            </button>
          </div>

          {/* BIDS */}
          {selectedUser === group.user.id && (
            <div className="mt-4 space-y-2">
              {group.bids.map((bid: any) => {
                const translation =
                  bid.item.translations.find(
                    (t: any) => t.languageCode === locale,
                  ) || bid.item.translations[0];

                const isOver =
                  new Date(bid.item.endDate) < now;

                const isWinning =
                  bid.amount === bid.item.currentBid;

                return (
                  <div
                    key={bid.id}
                    className={`flex justify-between border-b pb-2 ${
                      isOver && isWinning
                        ? 'text-green-600 font-semibold'
                        : ''
                    }`}
                  >
                    <span>{translation?.name}</span>

                    <span>
                      ${formatToDollar(bid.amount)}
                      {isOver && isWinning && ' 🏆'}
                    </span>
                  </div>
                );
              })}

              {/* EMAIL */}
              <button
                className="mt-3 text-blue-500 underline"
                onClick={() =>
                  (window.location.href = `mailto:${group.user.email}`)
                }
              >
                {t.email}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}