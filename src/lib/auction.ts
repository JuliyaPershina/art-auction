// import { database } from '@/db/database';
// import { items, bids } from '@/db/schema';
// import { knock } from './knock-server';
// import { eq } from 'drizzle-orm';
// import { env } from '@/env';

// export async function handleAuctionEnd(itemId: number) {
//   const item = await database.query.items.findFirst({
//     where: eq(items.id, itemId),
//     with: {
//       bids: { with: { user: true } },
//       translations: true,
//     },
//   });

//   if (!item) return;

//   const now = new Date();
//   if (now < item.endDate) {
//     // Аукціон ще триває — нічого не робимо
//     return;
//   }

//   const sortedBids = item.bids.sort((a, b) => b.amount - a.amount);
//   const winnerBid = sortedBids[0];

//   if (!winnerBid || !winnerBid.user?.email) return;

//   const itemName = item.translations.find(t => t.languageCode === 'en')?.name ?? 'Untitled';
//   const itemUrl = `${env.NEXT_PUBLIC_APP_URL}/items/${itemId}`;

//   // WINNER
//   await knock.workflows.trigger('auction-won', {
//     recipients: [{
//       id: winnerBid.userId.toString(),
//       email: winnerBid.user.email,
//       name: winnerBid.user.name ?? 'Anonymous',
//     }],
//     data: {
//       itemId,
//       itemName,
//       amount: winnerBid.amount,
//       url: itemUrl,
//     },
//   });

//   // LOSERS
//   const loserUsers = item.bids
//     .filter(b => b.userId !== winnerBid.userId && b.user?.email)
//     .map(b => ({
//       id: b.userId.toString(),
//       email: b.user!.email,
//       name: b.user!.name ?? 'Anonymous',
//     }));

//   if (loserUsers.length > 0) {
//     await knock.workflows.trigger('auction-lost', {
//       recipients: loserUsers,
//       data: {
//         itemId,
//         itemName,
//         url: itemUrl,
//       },
//     });
//   }
// }

import { database } from '@/db/database';
import { items } from '@/db/schema';
import { knock } from './knock-server';
import { eq } from 'drizzle-orm';
import { env } from '@/env';

export async function handleAuctionEnd(itemId: number) {
  const item = await database.query.items.findFirst({
    where: eq(items.id, itemId),
    with: {
      bids: { with: { user: true } },
      translations: true,
    },
  });

  // ❌ якщо нема або вже оброблений → вихід
  if (!item || item.isProcessed) return;

  // ❌ якщо ще не завершився
  const now = new Date();
  if (now < item.endDate) return;

  // 🔝 сортуємо ставки
  const sortedBids = item.bids.sort((a, b) => b.amount - a.amount);
  const winnerBid = sortedBids[0];

  // ❌ якщо нема ставок або email
  if (!winnerBid || !winnerBid.user?.email) {
    // навіть якщо ставок нема — позначаємо як оброблений
    await database
      .update(items)
      .set({ isProcessed: true })
      .where(eq(items.id, itemId));

    return;
  }

  const itemName =
    item.translations.find((t) => t.languageCode === 'en')?.name ?? 'Untitled';

  const itemUrl = `${env.NEXT_PUBLIC_APP_URL}/items/${itemId}`;

  // 🏆 WINNER
  await knock.workflows.trigger('auction-won', {
    recipients: [
      {
        id: winnerBid.userId.toString(),
        email: winnerBid.user.email,
        name: winnerBid.user.name ?? 'Anonymous',
      },
    ],
    data: {
      itemId,
      itemName,
      amount: winnerBid.amount,
      url: itemUrl,
    },
  });

  // 😐 LOSERS (унікальні)
  const loserUsers = Array.from(
    new Map(
      item.bids
        .filter((b) => b.userId !== winnerBid.userId && b.user?.email)
        .map((b) => [
          b.userId,
          {
            id: b.userId.toString(),
            email: b.user!.email,
            name: b.user!.name ?? 'Anonymous',
          },
        ]),
    ).values(),
  );

  if (loserUsers.length > 0) {
    await knock.workflows.trigger('auction-lost', {
      recipients: loserUsers,
      data: {
        itemId,
        itemName,
        url: itemUrl,
      },
    });
  }

  // ✅ ВАЖЛИВО: позначаємо як оброблений
  await database
    .update(items)
    .set({ isProcessed: true })
    .where(eq(items.id, itemId));
}