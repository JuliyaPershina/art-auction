import {  items } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { database } from '@/db/database';

export async function getItem(itemId: number) {
  const item = await database?.query.items.findFirst({
    where: eq(items.id, itemId),
  });
  return item;
}
