// 'use server';

// import { database } from '@/db/database';
// import { pictures } from '@/db/schema';
// import { auth } from '../../../../../auth';
// import { cloudinary } from '@/lib/cloudinary';
// import type { UploadApiResponse } from 'cloudinary';
// import { pictureTranslations } from '@/db/schema';

// export async function createHeroPictureActions({
//   file,
//   nameEn,
//   nameHu,
//   type = 'art',
// }: {
//   file: File;
//   nameEn: string;
//   nameHu: string;
//   type?: 'art' | 'blog' | 'other';
// }) {
//   const session = await auth();
//   if (!session || session.user.role !== 'admin') {
//     throw new Error('Forbidden');
//   }

//   const buffer = Buffer.from(await file.arrayBuffer());

//   const uploadResult = await new Promise<UploadApiResponse>(
//     (resolve, reject) => {
//       cloudinary.uploader
//         .upload_stream(
//           { folder: `art-auction/${type}`, resource_type: 'image' },
//           (err, res) => {
//             if (err) reject(err);
//             else resolve(res as UploadApiResponse);
//           },
//         )
//         .end(buffer);
//     },
//   );

//   const [newPicture] = await database
//     .insert(pictures)
//     .values({
//       fileKey: uploadResult.public_id,
//       userId: session.user.id,
//       type,
//     })
//     .returning();

//   // 🔥 Додаємо переклади
//   await database.insert(pictureTranslations).values([
//     {
//       pictureId: newPicture.id,
//       languageCode: 'en',
//       name: nameEn,
//     },
//     {
//       pictureId: newPicture.id,
//       languageCode: 'hu',
//       name: nameHu,
//     },
//   ]);

//   return newPicture;
// }

'use server';

import { database } from '@/db/database';
import { pictures, pictureTranslations } from '@/db/schema';
import { auth } from '../../../../../auth';
import { cloudinary } from '@/lib/cloudinary';
import type { UploadApiResponse } from 'cloudinary';
import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const schema = z.object({
  nameEn: z.string().max(200).trim(),
  nameHu: z.string().max(200).trim(),
  type: z.enum(['art', 'blog', 'other']),
});

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
  // 🔐 Auth check
  const session = await auth();
  if (!session || session.user.role !== 'admin') {
    throw new Error('Forbidden');
  }

  // ✅ Validate input fields
  const parsed = schema.safeParse({ nameEn, nameHu, type });
  if (!parsed.success) {
    throw new Error('Invalid input data');
  }

  // 📦 Validate file
  if (!file) {
    throw new Error('File is required');
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File is too large');
  }

  // Convert file to buffer (acceptable for small files)
  const buffer = Buffer.from(await file.arrayBuffer());

  // ☁️ Upload to Cloudinary
  const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `art-auction/${type}`,
        resource_type: 'image',
      },
      (err, res) => {
        if (err) return reject(err);
        if (!res) return reject(new Error('Upload failed'));
        resolve(res);
      }
    );

    stream.end(buffer);
  });

  // 💾 Save picture
  const [newPicture] = await database
    .insert(pictures)
    .values({
      fileKey: uploadResult.public_id,
      userId: session.user.id,
      type,
    })
    .returning();

  if (!newPicture) {
    throw new Error('Failed to create picture record');
  }

  // 🌍 Save translations
  await database.insert(pictureTranslations).values([
    {
      pictureId: newPicture.id,
      languageCode: 'en',
      name: parsed.data.nameEn,
    },
    {
      pictureId: newPicture.id,
      languageCode: 'hu',
      name: parsed.data.nameHu,
    },
  ]);

  return newPicture;
}