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

async function uploadToCloudinary(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: 'art-auction/blog', resource_type: 'image' },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Upload failed'));
          resolve(result);
        }
      )
      .end(buffer);
  });
}

export async function createBlogPostAction(formData: FormData) {
  const locale = formData.get('locale') as 'en' | 'hu';

  const session = await auth();
  if (!session || session.user.role !== 'admin') {
    throw new Error('Forbidden');
  }

  const titleEn = formData.get('titleEn') as string;
  const titleHu = formData.get('titleHu') as string;
  const contentEn = formData.get('contentEn') as string;
  const contentHu = formData.get('contentHu') as string;
  const excerptEn = formData.get('excerptEn') as string;
  const excerptHu = formData.get('excerptHu') as string;

  if (!titleEn || !titleHu || !contentEn || !contentHu) {
    throw new Error('Both languages are required');
  }

  let slug = slugify(titleEn, { lower: true, strict: true });

  const existing = await database.query.blogPosts.findFirst({
    where: (post, { eq }) => eq(post.slug, slug),
  });

  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  let coverImageKey: string | undefined;

  const coverImage = formData.get('coverImage') as File | null;
  if (coverImage && coverImage.size > 0) {
    const uploadResult = await uploadToCloudinary(coverImage);
    coverImageKey = uploadResult.public_id;
  }

  const insertedPost = await database
    .insert(blogPosts)
    .values({
      slug,
      coverImageKey,
      authorId: session.user.id,
    })
    .returning();

  const postId = insertedPost[0].id;

  await database.insert(blogPostTranslations).values([
    {
      postId,
      languageCode: 'en',
      title: titleEn,
      excerpt: excerptEn,
      content: contentEn,
    },
    {
      postId,
      languageCode: 'hu',
      title: titleHu,
      excerpt: excerptHu,
      content: contentHu,
    },
  ]);

  const images = formData.getAll('images') as File[];

  for (let i = 0; i < images.length; i++) {
    const file = images[i];
    if (!file || file.size === 0) continue;

    const uploadResult = await uploadToCloudinary(file);

    const insertedPicture = await database
      .insert(pictures)
      .values({
        userId: session.user.id,
        fileKey: uploadResult.public_id,
        type: 'blog',
      })
      .returning();

    await database.insert(blogPostPictures).values({
      postId,
      pictureId: insertedPicture[0].id,
      order: i,
    });
  }

  redirect(`/${locale}/blog/blogs/${slug}`);
}