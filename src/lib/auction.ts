import { database } from '@/db/database';
import { items } from '@/db/schema';
import { knock } from './knock-server';
import { eq } from 'drizzle-orm';
import { env } from '@/env';
import { formatToDollar } from '@/util/currency';

export async function handleAuctionEnd(itemId: number) {
  const item = await database.query.items.findFirst({
    where: eq(items.id, itemId),
    with: {
      bids: { with: { user: true } },
      translations: true,
    },
  });

  if (!item || item.isProcessed) return;

  const now = new Date();
  if (now < item.endDate) return;

  const sortedBids = item.bids.sort((a, b) => b.amount - a.amount);
  const winnerBid = sortedBids[0];

  if (!winnerBid || !winnerBid.user?.email) {
    await database
      .update(items)
      .set({ isProcessed: true })
      .where(eq(items.id, itemId));
    return;
  }

  const itemName =
    item.translations.find((t) => t.languageCode === 'en')?.name ?? 'Untitled';

  const itemUrl = `${env.NEXT_PUBLIC_APP_URL}/en/items/${itemId}`;

  const admins = await database.query.users.findMany({
    where: (u, { eq }) => eq(u.role, 'admin'),
  });

  // 🏆 WINNER
  await knock.workflows.trigger('auction-won', {
    actor: {
      id: item.userId.toString(),
      name: 'Auction system',
      collection: 'users', // ✅ FIX
    },
    recipients: [
      {
        id: winnerBid.userId.toString(),
        email: winnerBid.user.email,
        name: winnerBid.user.name ?? 'Anonymous',
      },
    ],
    data: {
      type: 'auction-won', // ✅ NEW
      itemId,
      itemName,
      amount: formatToDollar(winnerBid.amount), // ✅ FIX (без форматування)
      url: itemUrl,
    },
  });

  // 👨‍💼 ADMINS
  if (admins.length > 0) {
    await knock.workflows.trigger('auction-won-admin', {
      recipients: admins.map((admin) => ({
        id: admin.id.toString(),
        email: admin.email!,
        name: admin.name ?? 'Admin',
      })),
      data: {
        type: 'auction-won-admin', // ✅ NEW
        itemId,
        itemName,
        amount: formatToDollar(winnerBid.amount),
        winnerName: winnerBid.user.name ?? 'Anonymous',
        url: itemUrl,
      },
    });
  }

  // 😐 LOSERS
  const loserUsers = Array.from(
    new Map(
      item.bids
        .filter((b) => b.userId !== winnerBid.userId && b.user?.email)
        .map((b) => [
          b.userId,
          {
            id: b.userId.toString(), // ✅ FIX
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
        type: 'auction-lost', // ✅ NEW
        itemId,
        itemName,
        url: itemUrl,
      },
    });
  }

  await database
    .update(items)
    .set({ isProcessed: true })
    .where(eq(items.id, itemId));
}