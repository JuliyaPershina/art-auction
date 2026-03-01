'use server';

import { database } from '@/db/database';
import { blogPosts, blogPostPictures, pictures } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '../../../../../../auth';
import { redirect } from 'next/navigation';
import { deleteImageFromCloudinary } from '@/lib/cloudinary';

export async function deleteBlogPostAction(id: number, locale: 'en' | 'hu') {
  const session = await auth();

  if (!session || session.user.role !== 'admin') {
    throw new Error('Forbidden');
  }

  // 🔹 1. Знайти пост
  const post = await database.query.blogPosts.findFirst({
    where: (post, { eq }) => eq(post.id, id),
  });

  if (!post) return;

  // 🔹 2. Видалити cover з Cloudinary
  if (post.coverImageKey) {
    await deleteImageFromCloudinary(post.coverImageKey);
  }

  // 🔹 3. Отримати всі gallery картинки
  const gallery = await database
    .select()
    .from(blogPostPictures)
    .where(eq(blogPostPictures.postId, id));

  for (const item of gallery) {
    const pic = await database.query.pictures.findFirst({
      where: (p, { eq }) => eq(p.id, item.pictureId),
    });

    if (pic) {
      await deleteImageFromCloudinary(pic.fileKey);
      await database.delete(pictures).where(eq(pictures.id, pic.id));
    }
  }

  // 🔹 4. Видалити зв’язки
  await database
    .delete(blogPostPictures)
    .where(eq(blogPostPictures.postId, id));

  // 🔹 5. Видалити пост
  await database.delete(blogPosts).where(eq(blogPosts.id, id));

  redirect(`/${locale}/blog`);
}

