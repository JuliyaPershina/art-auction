import { database } from '@/db/database';
import { items, bids } from '@/db/schema';
import { knock } from './knock-server';
import { eq } from 'drizzle-orm';

export async function handleAuctionEnd(itemId: number) {
  const item = await database.query.items.findFirst({
    where: eq(items.id, itemId),
    with: {
      bids: true,
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
    recipients: [winner.userId],
    data: {
      itemId,
      itemName,
      amount: winner.amount,
    },
  });

  // 😐 LOSERS
  const losers = participants.filter((id) => id !== winner.userId);

  await knock.workflows.trigger('auction-lost', {
    recipients: losers,
    data: {
      itemId,
      itemName,
    },
  });
}
