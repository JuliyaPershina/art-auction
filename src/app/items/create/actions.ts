'use server';

import { revalidatePath } from 'next/cache';
import { database } from '@/db/database';
import { items } from '@/db/schema';
import { auth } from '../../../../auth';
import { redirect } from 'next/navigation';

export async function createItemActions(formdata: FormData) {
  const session = await auth();

  if (!session) {
    throw new Error('Unauthorized');
  }

  const user = session.user;
  if (!user || !user.id) {
    throw new Error('Unauthorized');
  }

  const startingPrice = formdata.get('startingPrice') as string;

  const priceAsCents = Math.floor(parseFloat(startingPrice) * 100);

  await database?.insert(items).values({
    name: formdata.get('name') as string,
    startingPrice: priceAsCents,
    userId: user.id,
  });

  redirect('/');
}
