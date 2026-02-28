'use server';

import { database } from '@/db/database';
import { pictures } from '@/db/schema';
import { auth } from '../../../../../auth';
import { cloudinary } from '@/lib/cloudinary';
import type { UploadApiResponse } from 'cloudinary';
import { pictureTranslations } from '@/db/schema';

export async function createHeroPictureActions({
  file,
  nameEn,
  nameHu,
  type = 'art',
}: {
  file: File;
  nameEn: string;
  nameHu: string;
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
      fileKey: uploadResult.public_id,
      userId: session.user.id,
      type,
    })
    .returning();

  // 🔥 Додаємо переклади
  await database.insert(pictureTranslations).values([
    {
      pictureId: newPicture.id,
      languageCode: 'en',
      name: nameEn,
    },
    {
      pictureId: newPicture.id,
      languageCode: 'hu',
      name: nameHu,
    },
  ]);

  return newPicture;
}