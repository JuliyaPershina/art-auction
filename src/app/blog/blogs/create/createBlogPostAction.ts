'use server';

import { cloudinary } from '@/lib/cloudinary';
import { database } from '@/db/database';
import {
  blogPosts,
  pictures,
  blogPostPictures,
} from '@/db/schema';
import { auth } from '../../../../../auth';
import { redirect } from 'next/navigation';
import type { UploadApiResponse } from 'cloudinary';
import slugify from 'slugify';
import { eq } from 'drizzle-orm';

async function uploadToCloudinary(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: 'art-auction/blog',
          resource_type: 'image',
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

export async function createBlogPostAction(formData: FormData) {
  const session = await auth();

  if (!session || session.user.role !== 'admin') {
    throw new Error('Forbidden');
  }

  const title = formData.get('title') as string;
  const excerpt = formData.get('excerpt') as string;
  const content = formData.get('content') as string;

  const coverImage = formData.get('coverImage') as File | null;
  const images = formData.getAll('images') as File[];

  if (!title || !content) {
    throw new Error('Title and content are required');
  }

  // 🔹 Генеруємо slug
  let slug = slugify(title, { lower: true, strict: true });

  // 🔹 Перевірка на унікальність slug
  const existing = await database.query.blogPosts.findFirst({
    where: (post, { eq }) => eq(post.slug, slug),
  });

  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  // 🔹 Завантаження cover
  let coverImageKey: string | undefined;

  if (coverImage && coverImage.size > 0) {
    const uploadResult = await uploadToCloudinary(coverImage);
    coverImageKey = uploadResult.public_id;
  }

  // 🔹 Створення поста
  const insertedPost = await database
    .insert(blogPosts)
    .values({
      title,
      excerpt,
      content,
      slug,
      coverImageKey,
      authorId: session.user.id,
    })
    .returning();

  const postId = insertedPost[0].id;

  // 🔹 Multi images
  if (images && images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      if (!file || file.size === 0) continue;

      const uploadResult = await uploadToCloudinary(file);

      // 1️⃣ запис в pictures
      const insertedPicture = await database
        .insert(pictures)
        .values({
          userId: session.user.id,
          fileKey: uploadResult.public_id,
          type: 'blog',
        })
        .returning();

      // 2️⃣ зв’язок з постом
      await database.insert(blogPostPictures).values({
        postId,
        pictureId: insertedPicture[0].id,
        order: i,
      });
    }
  }

  redirect(`/blog/blogs/${slug}`);
}
