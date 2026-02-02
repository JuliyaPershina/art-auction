'use server';

import { cloudinary } from '@/lib/cloudinary';
import { database } from '@/db/database';
import { items } from '@/db/schema';
import { auth } from '../../../../auth';
import { redirect } from 'next/navigation';
import type { UploadApiResponse } from 'cloudinary';

export async function createItemActions({
  file,
  name,
  startingPrice,
  endDate,
}: {
  file: File;
  name: string;
  startingPrice: number;
  endDate: Date;
}) {
  const session = await auth();

  if (!session || session.user.role !== 'admin') {
    throw new Error('Forbidden');
  }

  // Конвертуємо File у Buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // Завантажуємо у Cloudinary в папку 'art-auction'
  // const uploadResult = await new Promise<any>((resolve, reject) => {
  //   cloudinary.uploader
  //     .upload_stream(
  //       {
  //         folder: 'art-auction', // 👈 нова папка для цього проекту
  //         resource_type: 'image', // обмежуємо тільки картинками
  //       },
  //       (error, result) => {
  //         if (error) return reject(error);
  //         resolve(result);
  //       },
  //     )
  //     .end(buffer);
  // });

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

  // Зберігаємо public_id у базу
  await database.insert(items).values({
    name,
    startingPrice,
    fileKey: uploadResult.public_id, // 👈 це буде ключ для відображення
    userId: session.user.id,
    endDate,
  });

  redirect('/');
}

