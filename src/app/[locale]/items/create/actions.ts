'use server';

import { cloudinary } from '@/lib/cloudinary';
import { database } from '@/db/database';
import { items, itemTranslations } from '@/db/schema';
import { auth } from '../../../../../auth';
import { redirect } from 'next/navigation';
import type { UploadApiResponse } from 'cloudinary';
import { z } from 'zod';

// =====================
// ✅ Validation schema
// =====================
const schema = z.object({
  nameEn: z.string().min(1).max(100),
  nameHu: z.string().min(1).max(100),
  startingPrice: z.number().int().positive(),
  endDate: z.date(),
});

// =====================
// ✅ Helpers
// =====================
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function sanitize(str: string) {
  return str.replace(/[<>]/g, '');
}

// =====================
// 🚀 Main action
// =====================
export async function createItemActions(
  locale: 'hu' | 'en',
  data: {
    file: File;
    nameEn: string;
    nameHu: string;
    startingPrice: number;
    endDate: Date;
  },
) {
  // =====================
  // 🔐 Auth check
  // =====================
  const session = await auth();

  if (!session || session.user.role !== 'admin') {
    throw new Error('Forbidden');
  }

  // =====================
  // 📦 Validate data
  // =====================
  const parsed = schema.safeParse({
    ...data,
  });

  if (!parsed.success) {
    throw new Error('Invalid form data');
  }

  const cleanData = {
    ...parsed.data,
    nameEn: sanitize(parsed.data.nameEn),
    nameHu: sanitize(parsed.data.nameHu),
  };

  // =====================
  // 📅 Validate date
  // =====================
  if (cleanData.endDate <= new Date()) {
    throw new Error('End date must be in the future');
  }

  // =====================
  // 🖼 File validation
  // =====================
  if (!data.file) {
    throw new Error('File is required');
  }

  if (!ALLOWED_TYPES.includes(data.file.type)) {
    throw new Error('Invalid file type');
  }

  if (data.file.size > MAX_FILE_SIZE) {
    throw new Error('File too large');
  }

  // =====================
  // 🔄 Convert to buffer
  // =====================
  const buffer = Buffer.from(await data.file.arrayBuffer());

  // =====================
  // ☁️ Upload to Cloudinary
  // =====================
  const uploadResult = await new Promise<UploadApiResponse>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'art-auction',
            resource_type: 'image',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
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

  // =====================
  // 💾 DB transaction
  // =====================
  const [newItem] = await database
    .insert(items)
    .values({
      startingPrice: cleanData.startingPrice,
      fileKey: uploadResult.public_id,
      userId: session.user.id,
      endDate: cleanData.endDate,
    })
    .returning();

  await database.insert(itemTranslations).values([
    {
      itemId: newItem.id,
      languageCode: 'en',
      name: cleanData.nameEn,
    },
    {
      itemId: newItem.id,
      languageCode: 'hu',
      name: cleanData.nameHu,
    },
  ]);

  // =====================
  // 🔁 Redirect
  // =====================
  redirect(`/${locale}/allAuctions`);
}