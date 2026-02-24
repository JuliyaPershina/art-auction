'use server';

import { database } from '@/db/database';
import { pictures } from '@/db/schema';
import { auth } from '../../../../auth';
import { cloudinary } from '@/lib/cloudinary';
import type { UploadApiResponse } from 'cloudinary';

export async function createHeroPictureActions({
  file,
  name,
  type = 'art',
}: {
  file: File;
  name?: string;
  type?: 'art' | 'blog' | 'other';
}) {
  const session = await auth();
  if (!session || session.user.role !== 'admin') {
    throw new Error('Forbidden');
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const uploadResult = await new Promise<UploadApiResponse>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: `art-auction/${type}`, resource_type: 'image' },
          (err, res) => {
            if (err) reject(err);
            else resolve(res as UploadApiResponse);
          },
        )
        .end(buffer);
    },
  );

  const [newPicture] = await database
    .insert(pictures)
    .values({
      name: name ?? null,
      fileKey: uploadResult.public_id,
      userId: session.user.id,
      type,
    })
    .returning();

  return newPicture; // 🔥 повертаємо нову картинку
}
