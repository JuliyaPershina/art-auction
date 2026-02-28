'use server';

import { database } from '@/db/database';
import { pictures } from '@/db/schema';
import { auth } from '../../../../../auth';
import { eq } from 'drizzle-orm';
import { deleteImageFromCloudinary } from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';

/**
 * Видаляє картину з Cloudinary та бази, а потім оновлює сторінку
 * Доступно тільки для адміна
 */
export async function deletePicture(pictureId: number, locale: 'hu' | 'en') {
  // Перевірка сесії та ролі
  const session = await auth();
  if (!session || session.user.role !== 'admin') {
    throw new Error('Forbidden');
  }

  // Знаходимо картину в базі
  const picture = await database.query.pictures.findFirst({
    where: eq(pictures.id, pictureId),
  });

  if (!picture) {
    throw new Error('Picture not found');
  }

  // Видаляємо картину з Cloudinary
  await deleteImageFromCloudinary(picture.fileKey);

  // Видаляємо картину з бази
  await database.delete(pictures).where(eq(pictures.id, pictureId));

  // Оновлюємо сторінку / галерею після видалення
  revalidatePath(`/${locale}/pictures`); 
}

