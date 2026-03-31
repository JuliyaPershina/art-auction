'use server';

import { cloudinary } from '@/lib/cloudinary';
import { database } from '@/db/database';
import {
  blogPosts,
  blogPostTranslations,
  pictures,
  blogPostPictures,
} from '@/db/schema';
import { auth } from '../../../../../../auth';
import { redirect } from 'next/navigation';
import slugify from 'slugify';
import type { UploadApiResponse } from 'cloudinary';
import { z } from 'zod';

// =====================
// ✅ CONFIG
// =====================
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const MAX_IMAGES = 10;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// =====================
// ✅ VALIDATION SCHEMA
// =====================
const schema = z.object({
  titleEn: z.string().min(1).max(150),
  titleHu: z.string().min(1).max(150),
  excerptEn: z.string().max(500).optional().or(z.literal('')),
  excerptHu: z.string().max(500).optional().or(z.literal('')),
  contentEn: z.string().min(1).max(50000),
  contentHu: z.string().min(1).max(50000),
});

// =====================
// ✅ HELPERS
// =====================
function sanitize(str: string) {
  return str.replace(/[<>]/g, '');
}

function validateFile(file: File) {
  if (!file) throw new Error('File missing');

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large: ${file.name}`);
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type: ${file.name}`);
  }
}

async function uploadToCloudinary(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: 'art-auction/blog',
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
  });
}

// =====================
// 🚀 MAIN ACTION
// =====================
export async function createBlogPostAction(formData: FormData) {
  const locale = formData.get('locale') as 'en' | 'hu';

  // =====================
  // 🔐 AUTH
  // =====================
  const session = await auth();
  if (!session || session.user.role !== 'admin') {
    throw new Error('Forbidden');
  }

  // =====================
  // 📦 EXTRACT DATA
  // =====================
  const rawData = {
    titleEn: formData.get('titleEn'),
    titleHu: formData.get('titleHu'),
    excerptEn: formData.get('excerptEn'),
    excerptHu: formData.get('excerptHu'),
    contentEn: formData.get('contentEn'),
    contentHu: formData.get('contentHu'),
  };

  // =====================
  // ✅ VALIDATE
  // =====================
  const parsed = schema.safeParse(rawData);

  if (!parsed.success) {
    throw new Error('Invalid form data');
  }

  const data = {
    titleEn: sanitize(parsed.data.titleEn),
    titleHu: sanitize(parsed.data.titleHu),
    excerptEn: sanitize(parsed.data.excerptEn || ''),
    excerptHu: sanitize(parsed.data.excerptHu || ''),
    contentEn: sanitize(parsed.data.contentEn),
    contentHu: sanitize(parsed.data.contentHu),
  };

  // =====================
  // 🖼 FILES
  // =====================
  const coverImage = formData.get('coverImage') as File | null;
  const images = formData.getAll('images') as File[];

  if (images.length > MAX_IMAGES) {
    throw new Error('Too many images');
  }

  if (coverImage && coverImage.size > 0) {
    validateFile(coverImage);
  }

  for (const file of images) {
    if (file && file.size > 0) {
      validateFile(file);
    }
  }

  // =====================
  // 🔗 SLUG
  // =====================
  let slug = slugify(data.titleEn, {
    lower: true,
    strict: true,
    trim: true,
  });

  // fallback якщо раптом дубль
  slug = `${slug}-${Date.now()}`;

  // =====================
  // ☁️ UPLOAD FILES
  // =====================
  let coverImageKey: string | undefined;

  if (coverImage && coverImage.size > 0) {
    const upload = await uploadToCloudinary(coverImage);
    coverImageKey = upload.public_id;
  }

  const uploadedImages: { key: string; order: number }[] = [];

  for (let i = 0; i < images.length; i++) {
    const file = images[i];
    if (!file || file.size === 0) continue;

    const upload = await uploadToCloudinary(file);

    uploadedImages.push({
      key: upload.public_id,
      order: i,
    });
  }

  // =====================
  // 💾 TRANSACTION
  // =====================
  await database.transaction(async (tx) => {
    const [post] = await tx
      .insert(blogPosts)
      .values({
        slug,
        coverImageKey,
        authorId: session.user.id,
      })
      .returning();

    const postId = post.id;

    await tx.insert(blogPostTranslations).values([
      {
        postId,
        languageCode: 'en',
        title: data.titleEn,
        excerpt: data.excerptEn,
        content: data.contentEn,
      },
      {
        postId,
        languageCode: 'hu',
        title: data.titleHu,
        excerpt: data.excerptHu,
        content: data.contentHu,
      },
    ]);

    for (const img of uploadedImages) {
      const [picture] = await tx
        .insert(pictures)
        .values({
          userId: session.user.id,
          fileKey: img.key,
          type: 'blog',
        })
        .returning();

      await tx.insert(blogPostPictures).values({
        postId,
        pictureId: picture.id,
        order: img.order,
      });
    }
  });

  // =====================
  // 🔁 REDIRECT
  // =====================
  redirect(`/${locale}/blog/blogs/${slug}`);
}