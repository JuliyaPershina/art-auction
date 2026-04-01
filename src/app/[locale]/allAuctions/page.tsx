// import { database } from '@/db/database';
// import { auth } from '../../../../auth';
// import ItemList from '@/components/item-list';
// import { pageTitleStyles } from '@/styles';
// import { useSession } from 'next-auth/react';
// import Link from 'next/link';

// export default async function HomePage({
//   params,
// }: {
//   params: Promise<{ locale: 'hu' | 'en' }>;
// }) {
//   const { locale } = await params;
//   const session = await auth();
//   const allitems = await database.query.items.findMany({
//     with: {
//       translations: true,
//     },
//   });

//   const user = session?.user;

//   const t = {
//     title: locale === 'hu' ? 'Eladó tételek' : 'Items For Sale',
//     signedIn:
//       locale === 'hu'
//         ? `Bejelentkezve: ${session?.user?.name ?? ''}`
//         : `Signed in as ${session?.user?.name ?? ''}`,
//     signInToBid:
//       locale === 'hu'
//         ? 'Jelentkezz be a licitáláshoz.'
//         : 'Sign in to place a bid.',
//   };

//   const items = allitems.map((item) => {
//     const translation =
//       item.translations.find((t) => t.languageCode === locale) ||
//       item.translations.find((t) => t.languageCode === 'en');

//     return {
//       ...item,
//       name: translation?.name ?? 'Untitled',
//     };
//   });

//   return (
//     <main className="space-y-8 m-8">
//       <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//         <h1 className={pageTitleStyles}>{t.title}</h1>

//         {session?.user ? (
//           <div className="text-right">
//             <p className="text-gray-600">{t.signedIn}</p>
//           </div>
//         ) : (
//           <div className="text-gray-500 italic text-center mt-6">
//             {t.signInToBid}
//           </div>
//         )}

//         {user && user.role === 'admin' && (
//           <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//             <Link
//               href={`/${locale}/items/create`}
//               className="inline-block text-center px-4 py-2 bg-black text-white rounded-md hover:bg-primary/90 dark:bg-gray-900 dark:hover:bg-gray-700 transition-colors"
//             >
//               {locale === 'hu' ? 'Új aukció létrehozása' : 'Create an Auction'}
//             </Link>
//             <Link
//               href={`/${locale}/admin/auctions`}
//               className="px-4 py-2 text-center bg-gray-200 dark:bg-zinc-800 rounded-md hover:bg-gray-300 dark:hover:bg-zinc-700 transition"
//             >
//               {locale === 'hu' ? 'Admin panel' : 'Admin Panel'}
//             </Link>
//           </div>
//         )}
//       </div>

//       <ItemList items={items} />
//     </main>
//   );
// }

import { database } from '@/db/database';
import { auth } from '../../../../auth';
import ItemList from '@/components/item-list';
import { Pagination } from '@/components/Pagination';
import { pageTitleStyles } from '@/styles';
import Link from 'next/link';
import { gt, lte, desc, count } from 'drizzle-orm';
import { items as itemsTable } from '@/db/schema';

const PAGE_SIZE = 4;

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: 'hu' | 'en' }>;
  searchParams: Promise<{ page?: string; filter?: 'active' | 'ended' }>;
}) {
  const { locale } = await params;
  const { page = '1', filter } = await searchParams;

  const session = await auth();
  const user = session?.user;

  const now = new Date();

  // 🧠 FILTER
  let activeFilter: 'active' | 'ended' = filter || 'active';

  if (!filter) {
    const activeCount = await database
      .select({ count: count() })
      .from(itemsTable)
      .where(gt(itemsTable.endDate, now));

    if (activeCount[0].count === 0) {
      activeFilter = 'ended';
    }
  }

  const whereCondition =
    activeFilter === 'active'
      ? gt(itemsTable.endDate, now)
      : lte(itemsTable.endDate, now);

  // 📊 TOTAL
  const totalItemsResult = await database
    .select({ count: count() })
    .from(itemsTable)
    .where(whereCondition);

  const totalItems = totalItemsResult[0].count;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  // ✅ нормалізація сторінки
  const currentPage = Math.min(
    Math.max(1, Number(page) || 1),
    totalPages,
  );

  const offset = (currentPage - 1) * PAGE_SIZE;

  // 📥 ITEMS
  const allItems = await database.query.items.findMany({
    where: whereCondition,
    with: {
      translations: true,
    },
    orderBy: desc(itemsTable.id),
    limit: PAGE_SIZE,
    offset,
  });

  // 🌍 TRANSLATIONS
  const items = allItems.map((item) => {
    const translation =
      item.translations.find((t) => t.languageCode === locale) ||
      item.translations.find((t) => t.languageCode === 'en');

    return {
      ...item,
      name: translation?.name ?? 'Untitled',
    };
  });

  const t = {
    title: locale === 'hu' ? 'Eladó tételek' : 'Items For Sale',
    active: locale === 'hu' ? 'Aktív aukciók' : 'Active Auctions',
    ended: locale === 'hu' ? 'Lejárt aukciók' : 'Ended Auctions',
    signedIn:
      locale === 'hu'
        ? `Bejelentkezve: ${session?.user?.name ?? ''}`
        : `Signed in as ${session?.user?.name ?? ''}`,
    signInToBid:
      locale === 'hu'
        ? 'Jelentkezz be a licitáláshoz.'
        : 'Sign in to place a bid.',
    create:
      locale === 'hu' ? 'Új aukció létrehozása' : 'Create an Auction',
    admin:
      locale === 'hu' ? 'Admin panel' : 'Admin Panel',
  };

  const basePath = `/${locale}/allAuctions`;

  return (
    <main className="space-y-8 m-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className={pageTitleStyles}>{t.title}</h1>

        {/* 👤 USER INFO */}
        {session?.user ? (
          <p className="text-gray-600">{t.signedIn}</p>
        ) : (
          <p className="text-gray-500 italic">{t.signInToBid}</p>
        )}

        {/* 🔥 ADMIN BUTTONS */}
        {user?.role === 'admin' && (
          <div className="flex flex-col gap-2 md:flex-row">
            <Link
              href={`/${locale}/items/create`}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
            >
              {t.create}
            </Link>

            <Link
              href={`/${locale}/admin/auctions`}
              className="px-4 py-2 bg-gray-200 dark:bg-zinc-800 rounded-md hover:bg-gray-300 dark:hover:bg-zinc-700 transition"
            >
              {t.admin}
            </Link>
          </div>
        )}
      </div>

      {/* 🔘 FILTER */}
      <div className="flex gap-2">
        <Link
          href={`/${locale}/allAuctions?filter=active`}
          className={`px-4 py-2 rounded-lg border ${
            activeFilter === 'active'
              ? 'bg-black text-white'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          {t.active}
        </Link>

        <Link
          href={`/${locale}/allAuctions?filter=ended`}
          className={`px-4 py-2 rounded-lg border ${
            activeFilter === 'ended'
              ? 'bg-black text-white'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          {t.ended}
        </Link>
      </div>

      {/* ITEMS */}
      {items.length === 0 ? (
        <p className="text-muted-foreground">
          No auctions on this page.
        </p>
      ) : (
        <ItemList items={items} />
      )}

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={basePath}
        query={{
          filter: activeFilter,
        }}
      />
    </main>
  );
}