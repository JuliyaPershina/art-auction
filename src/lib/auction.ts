import { database } from '@/db/database';
import { items, bids } from '@/db/schema';
import { knock } from './knock-server';
import { eq } from 'drizzle-orm';
import { env } from '@/env';

export async function handleAuctionEnd(itemId: number) {
  const item = await database.query.items.findFirst({
    where: eq(items.id, itemId),
    with: {
      bids: {
        with: {
          user: true, // 🔥 ОБОВʼЯЗКОВО
        },
      },
      translations: true,
    },
  });

  if (!item) return;

  const sorted = item.bids.sort((a, b) => b.amount - a.amount);
  const winner = sorted[0];

  if (!winner) return;

  const itemName =
    item.translations.find((t) => t.languageCode === 'en')?.name ?? 'Untitled';

  const participants = [...new Set(item.bids.map((b) => b.userId))];

  // 🏆 WINNER
  await knock.workflows.trigger('auction-won', {
    recipients: [
      {
        id: winner.userId,
        email: winner.user?.email,
        name: winner.user?.name ?? 'Anonymous',
      },
    ],
    data: {
      itemId,
      itemName,
      amount: winner.amount,
      url: `${env.NEXT_PUBLIC_APP_URL}/items/${itemId}`,
    },
  });

  // 😐 LOSERS
  const loserUsers = item.bids
    .filter((b) => b.userId !== winner.userId)
    .map((b) => b.user);

  await knock.workflows.trigger('auction-lost', {
    recipients: loserUsers.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name ?? 'Anonymous',
    })),
    data: {
      itemId,
      itemName,
      url: `${env.NEXT_PUBLIC_APP_URL}/items`,
    },
  });
}
