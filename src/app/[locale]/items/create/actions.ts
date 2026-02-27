'use server';

import { cloudinary } from '@/lib/cloudinary';
import { database } from '@/db/database';
import { items } from '@/db/schema';
import { auth } from '../../../../../auth';
import { redirect } from 'next/navigation';
import type { UploadApiResponse } from 'cloudinary';

export async function createItemActions(
  locale: 'hu' | 'en',
  data: {
    file: File;
    name: string;
    startingPrice: number;
    endDate: Date;
  },
) {
  const session = await auth();

  if (!session || session.user.role !== 'admin') {
    throw new Error('Forbidden');
  }

  // Конвертуємо File у Buffer
  const buffer = Buffer.from(await data.file.arrayBuffer());

  const uploadResult = await new Promise<UploadApiResponse>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'art-auction',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) return reject(error);
            if (!result) return reject(new Error('Upload failed'));
            resolve(result);
          },
        )
        .end(buffer);
    },
  );

  await database.insert(items).values({
    name: data.name,
    startingPrice: data.startingPrice,
    fileKey: uploadResult.public_id,
    userId: session.user.id,
    endDate: data.endDate,
  });

  redirect(`/${locale}`);
}

