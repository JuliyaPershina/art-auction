'use server';

import { bids, items } from '@/db/schema';
import { auth } from '../../../../../auth';
import { database } from '@/db/database';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { Knock } from '@knocklabs/node';
import { env } from '@/env';
import { isBidOver } from '@/util/bids';

const knock = new Knock({ apiKey: env.KNOCK_SECRET_KEY });

export async function createBidAction(locale: 'hu' | 'en', itemId: number) {
  const session = await auth();
  if (!session) {
    throw new Error('User must be authenticated to place a bid.');
  }

  const userId = session.user?.id;
  if (!userId) {
    throw new Error('You must be logged in to place a bid.');
  }

  // const item = await database.query.items.findFirst({
  //   where: eq(items.id, itemId),
  // });

  const item = await database.query.items.findFirst({
    where: eq(items.id, itemId),
    with: {
      translations: true,
    },
  });

  if (!item) {
    throw new Error('Item not found.');
  }

  if (isBidOver(item)) {
    throw new Error('Bidding period is over for this item.');
  }
  
  const translation =
    item.translations.find((t) => t.languageCode === locale) ||
    item.translations.find((t) => t.languageCode === 'en');

  const itemName = translation?.name ?? 'Untitled';


  // 💰 Обчислюємо нову ставку

  const latestBidValue = item.currentBid
    ? item.currentBid + item.bidInterval // існуюча ставка + крок
    : item.startingPrice;

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

  // 🧠 Знаходимо всіх користувачів, які робили ставки на цей товар
  const currentbids = await database.query.bids.findMany({
    where: eq(bids.itemId, itemId),
    with: {
      user: true, // додає дані користувача
    },
  });

  // 🧹 Унікальні отримувачі, крім поточного користувача
  const recipients = Array.from(
    new Map(
      currentbids
        .filter((b) => b.userId !== userId)
        .map((b) => [
          b.userId,
          {
            id: b.userId, // Knock очікує string, але ID може бути number
            name: b.user.name ?? 'Anonymous',
            email: b.user.email ?? 'unknown@example.com',
          },
        ]),
    ).values(),
  );

  console.log('Recipients:', recipients);

  // 🔔 Виклик Knock Workflow
  if (recipients.length > 0) {
    await knock.workflows.trigger('user-placed-bid', {
      actor: {
        id: userId,
        name: session.user?.name ?? 'Anonimus',
        email: session.user?.email,
        collection: 'users',
      },
      recipients,
      data: {
        itemId,
        itemName,
        amount: latestBidValue,
      },
    });
  }

  // 🔁 Оновлення сторінки товару
  revalidatePath(`/${locale}/items/${itemId}`);
}
