'use server';

import { revalidatePath } from 'next/cache';
import { database } from '@/db/database';
import { items } from '@/db/schema';
import { auth } from '../../../../auth';
import { redirect } from 'next/navigation';
import { getSignedUrlForS3Object, getSignedReadUrlForS3Object } from '@/lib/s3';

export async function getImageUrlAction(fileKey: string) {
  return await getSignedReadUrlForS3Object(fileKey);
}

export async function createUploadUrlAction(key: string, type: string) {
  return await getSignedUrlForS3Object(key, type);
}

export async function createItemActions({
  fileKey,
  name,
  startingPrice,
  endDate
}: {
  fileKey: string;
  name: string;
    startingPrice: number;
    endDate: Date;
}) {
  const session = await auth();

  if (!session) {
    throw new Error('Unauthorized');
  }

  const user = session.user;
  if (!user || !user.id) {
    throw new Error('Unauthorized');
  }

  await database?.insert(items).values({
    name,
    startingPrice,
    fileKey,
    userId: user.id,
    endDate,
  });

  redirect('/');
}
