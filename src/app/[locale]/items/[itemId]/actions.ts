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

  // 🔔 Knock
  if (previousTopBid && previousTopBid.user?.email) {
    const previousUserId = String(previousTopBid.userId);

    if (previousUserId !== userId) {
      await knock.workflows.trigger('user-outbid-in-app', {
        actor: {
          id: userId,
          name: session.user.name ?? 'Anonymous',
          email: session.user.email ?? undefined,
          collection: 'users',
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
          amount: formattedNewPrice,
          url: `${env.NEXT_PUBLIC_APP_URL}/${locale}/items/${itemId}`,
        },
      });
    }
  }
  revalidatePath(`/${locale}/items/${itemId}`);
}
