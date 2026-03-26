// app/api/auction-end/route.ts
import { NextResponse } from 'next/server';
import { handleAuctionEnd } from '@/lib/auction';
import { database } from '@/db/database';
import { items } from '@/db/schema';
import { lte, eq } from 'drizzle-orm';

export async function GET(req: Request) {
  // 🔐 Перевірка секретного ключа
  if (
    req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();

  // 🔎 Знаходимо всі аукціони, що ще не оброблені та вже завершились
  const finishedItems = await database.query.items.findMany({
    where: (item) => lte(item.endDate, now) && eq(item.isProcessed, false),
  });

  for (const item of finishedItems) {
    try {
      // 🏁 Визначаємо переможця та програвших
      await handleAuctionEnd(item.id);

      // ✅ Позначаємо аукціон як оброблений, щоб він не повторювався
      await database
        .update(items)
        .set({ isProcessed: true })
        .where(eq(items.id, item.id));
    } catch (err) {
      console.error(`Failed to process auction ${item.id}:`, err);
    }
  }

  return NextResponse.json({ success: true, processed: finishedItems.length });
}
