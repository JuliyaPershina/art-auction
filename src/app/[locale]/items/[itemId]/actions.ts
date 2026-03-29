// 'use server';

// import { bids, items } from '@/db/schema';
// import { auth } from '../../../../../auth';
// import { database } from '@/db/database';
// import { eq } from 'drizzle-orm';
// import { revalidatePath } from 'next/cache';
// import { Knock } from '@knocklabs/node';
// import { env } from '@/env';
// import { isBidOver } from '@/util/bids';
// import { desc } from 'drizzle-orm';
// import { formatToDollar } from '@/util/currency';

// const knock = new Knock({ apiKey: env.KNOCK_SECRET_KEY });

// export async function createBidAction(locale: 'hu' | 'en', itemId: number) {
//   const session = await auth();
//   if (!session) {
//     throw new Error('User must be authenticated to place a bid.');
//   }

//   const userId = session.user?.id;
//   if (!userId) {
//     throw new Error('You must be logged in to place a bid.');
//   }

//   const item = await database.query.items.findFirst({
//     where: eq(items.id, itemId),
//     with: {
//       translations: true,
//     },
//   });

//   if (!item) {
//     throw new Error('Item not found.');
//   }

//   if (isBidOver(item)) {
//     throw new Error('Bidding period is over for this item.');
//   }

//   const translation =
//     item.translations.find((t) => t.languageCode === locale) ||
//     item.translations.find((t) => t.languageCode === 'en');

//   const itemName = translation?.name ?? 'Untitled';

//   // 💰 Обчислюємо нову ставку

//   const latestBidValue = item.currentBid
//     ? item.currentBid + item.bidInterval // існуюча ставка + крок
//     : item.startingPrice;

//   // 5️⃣ Знайти попереднього лідера
//   const previousTopBid = await database.query.bids.findFirst({
//     where: eq(bids.itemId, itemId),
//     orderBy: (b) => desc(b.amount), // 👈 ось так правильно
//     with: { user: true },
//   });

//   const formattedOldPrice = previousTopBid
//     ? formatToDollar(previousTopBid.amount)
//     : null; // ✅ FIX
//   const formattedNewPrice = formatToDollar(latestBidValue);

//   await database.insert(bids).values({
//     amount: latestBidValue,
//     itemId,
//     userId,
//     timestamp: new Date(),
//   });

//   await database
//     .update(items)
//     .set({ currentBid: latestBidValue })
//     .where(eq(items.id, itemId));

//   // 🧠 Знаходимо всіх користувачів, які робили ставки на цей товар
//   const currentbids = await database.query.bids.findMany({
//     where: eq(bids.itemId, itemId),
//     with: {
//       user: true, // додає дані користувача
//     },
//   });

//   // 🔧 тільки змінені місця

//   const recipients = Array.from(
//     new Map(
//       currentbids
//         .filter((b) => b.userId !== userId)
//         .map((b) => [
//           b.userId,
//           {
//             id: b.userId.toString(), // ✅ FIX
//             name: b.user.name ?? 'Anonymous',
//             email: b.user.email ?? 'unknown@example.com',
//           },
//         ]),
//     ).values(),
//   );

//   if (
//     previousTopBid &&
//     previousTopBid.userId !== userId &&
//     previousTopBid.user?.email
//   ) {
//     // await knock.workflows.trigger('user-outbid-in-app', {
//     //   recipients: [
//     //     {
//     //       id: previousTopBid.userId,
//     //       name: previousTopBid.user.name ?? 'Anonymous',
//     //       email: previousTopBid.user.email,
//     //     },
//     //   ],
//     //   data: {
//     //     item: {
//     //       title: itemName,
//     //       url: `${env.NEXT_PUBLIC_APP_URL}/${locale}/items/${itemId}`,
//     //     },
//     //     bid: {
//     //       amount: formattedOldPrice, // стара ставка
//     //     },
//     //     new_bid: {
//     //       amount: formattedNewPrice, // нова ставка
//     //     },
//     //   },
//     // });
//     await knock.workflows.trigger('user-outbid-in-app', {
//       recipients: [
//         {
//           id: previousTopBid.userId.toString(),
//           name: previousTopBid.user.name ?? 'Anonymous',
//           email: previousTopBid.user.email,
//         },
//       ],
//       data: {
//         type: 'outbid-in-app',
//         itemId,
//         itemName,
//         amount: formattedNewPrice,
//         url: `${env.NEXT_PUBLIC_APP_URL}/${locale}/items/${itemId}`,
//       },
//     });
//   }
//   console.log('SESSION USER ID:', userId);
//   console.log('RECIPIENT ID:', previousTopBid?.userId.toString());

//   // 🔁 Оновлення сторінки товару
//   revalidatePath(`/${locale}/items/${itemId}`);
// }

// // if (recipients.length > 0) {
// //   await knock.workflows.trigger('user-placed-bid', {
// //     actor: {
// //       id: userId,
// //       name: session.user?.name ?? 'Anonimus',
// //       email: session.user?.email,
// //       collection: 'users',
// //     },
// //     recipients,
// //     data: {
// //       type: 'outbid', // ✅ NEW
// //       itemId,
// //       itemName,
// //       amount: latestBidValue,
// //       url: `${env.NEXT_PUBLIC_APP_URL}/${locale}/items/${itemId}`,
// //     },
// //   });
// // }
// // if (recipients.length > 0) {
// //   await knock.workflows.trigger('user-outbid-in-app', {
// //     actor: {
// //       id: userId,
// //       name: session.user?.name ?? 'Anonimus',
// //       email: session.user?.email,
// //       collection: 'users',
// //     },
// //     recipients,
// //     data: {
// //       type: 'outbid', // ✅ NEW
// //       itemId,
// //       itemName,
// //       amount: latestBidValue,
// //       url: `${env.NEXT_PUBLIC_APP_URL}/${locale}/items/${itemId}`,
// //     },
// //   });
// // }

// // ❗ якщо є попередній лідер і це не той самий користувач

// // if (
// //   previousTopBid &&
// //   previousTopBid.userId !== userId &&
// //   previousTopBid.user?.email
// // ) {
// //   await knock.workflows.trigger('user-outbid', {
// //     recipients: [
// //       {
// //         id: previousTopBid.userId,
// //         name: previousTopBid.user.name ?? 'Anonymous',
// //         email: previousTopBid.user.email,
// //       },
// //     ],
// //     data: {
// //       item: {
// //         title: itemName,
// //         url: `${env.NEXT_PUBLIC_APP_URL}/${locale}/items/${itemId}`,
// //       },
// //       bid: {
// //         amount: formattedOldPrice, // стара ставка
// //       },
// //       new_bid: {
// //         amount: formattedNewPrice, // нова ставка
// //       },
// //     },
// //   });
// // }
// // 🧹 Унікальні отримувачі, крім поточного користувача
// // const recipients = Array.from(
// //   new Map(
// //     currentbids
// //       .filter((b) => b.userId !== userId)
// //       .map((b) => [
// //         b.userId,
// //         {
// //           id: b.userId, // Knock очікує string, але ID може бути number
// //           name: b.user.name ?? 'Anonymous',
// //           email: b.user.email ?? 'unknown@example.com',
// //         },
// //       ]),
// //   ).values(),
// // );

// // // 🔔 Виклик Knock Workflow
// // if (recipients.length > 0) {
// //   await knock.workflows.trigger('user-placed-bid', {
// //     actor: {
// //       id: userId.toString(),
// //       name: session.user?.name ?? 'Anonimus',
// //       email: session.user?.email,
// //       collection: 'users',
// //     },
// //     recipients,
// //     data: {
// //       itemId,
// //       itemName,
// //       amount: formattedNewPrice,
// //     },
// //   });
// // }

'use server';

import { bids, items } from '@/db/schema';
import { auth } from '../../../../../auth';
import { database } from '@/db/database';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { Knock } from '@knocklabs/node';
import { env } from '@/env';
import { isBidOver } from '@/util/bids';
import { formatToDollar } from '@/util/currency';

const knock = new Knock({ apiKey: env.KNOCK_SECRET_KEY });

export async function createBidAction(locale: 'hu' | 'en', itemId: number) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('User must be authenticated.');
  }

  const userId = String(session.user.id);

  const item = await database.query.items.findFirst({
    where: eq(items.id, itemId),
    with: { translations: true },
  });

  if (!item) throw new Error('Item not found.');
  if (isBidOver(item)) throw new Error('Bidding is over.');

  const translation =
    item.translations.find((t) => t.languageCode === locale) ||
    item.translations.find((t) => t.languageCode === 'en');

  const itemName = translation?.name ?? 'Untitled';

  const latestBidValue = item.currentBid
    ? item.currentBid + item.bidInterval
    : item.startingPrice;

  const previousTopBid = await database.query.bids.findFirst({
    where: eq(bids.itemId, itemId),
    orderBy: (b) => desc(b.amount),
    with: { user: true },
  });

  const formattedNewPrice = formatToDollar(latestBidValue);

  await database.insert(bids).values({
    amount: latestBidValue,
    itemId,
    userId,
    timestamp: new Date(),
  });

  await database
    .update(items)
    .set({ currentBid: latestBidValue })
    .where(eq(items.id, itemId));

  // 🔥 НОРМАЛІЗАЦІЯ ID
  const previousUserId = previousTopBid ? String(previousTopBid.userId) : null;

  // console.log('SESSION:', userId);
  // console.log('PREVIOUS BID USER:', previousUserId);

  // 🔔 Knock
  if (previousTopBid && previousTopBid.user?.email) {
    const previousUserId = String(previousTopBid.userId);

    if (previousUserId !== userId) {
      await knock.workflows.trigger('user-outbid-in-app', {
        actor: {
          id: userId,
          name: session.user.name ?? 'Anonymous',
          email: session.user.email ?? undefined,
        },
        recipients: [
          {
            id: previousUserId, // ✅ тепер точно string
            name: previousTopBid.user.name ?? 'Anonymous',
            email: previousTopBid.user.email,
          },
        ],
        data: {
          type: 'outbid-in-app',
          itemId,
          itemName,
          amount: latestBidValue,
          url: `${env.NEXT_PUBLIC_APP_URL}/${locale}/items/${itemId}`,
        },
      });
    }
  }
  revalidatePath(`/${locale}/items/${itemId}`);
}
