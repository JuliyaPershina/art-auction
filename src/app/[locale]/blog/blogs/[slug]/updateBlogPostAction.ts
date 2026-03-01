'use server';

import { database } from '@/db/database';
import { blogPostTranslations } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '../../../../../../auth';
import { redirect } from 'next/navigation';

export async function updateBlogPostAction(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== 'admin') {
    throw new Error('Forbidden');
  }

  const id = Number(formData.get('postId'));
  const locale = formData.get('locale') as 'en' | 'hu';

  const titleEn = formData.get('titleEn') as string;
  const excerptEn = formData.get('excerptEn') as string;
  const contentEn = formData.get('contentEn') as string;

  const titleHu = formData.get('titleHu') as string;
  const excerptHu = formData.get('excerptHu') as string;
  const contentHu = formData.get('contentHu') as string;

  if (!id || !locale || !titleEn || !contentEn || !titleHu || !contentHu) {
    throw new Error('Missing required fields');
  }

  // EN
  await database
    .update(blogPostTranslations)
    .set({
      title: titleEn,
      excerpt: excerptEn,
      content: contentEn,
    })
    .where(
      and(
        eq(blogPostTranslations.postId, id),
        eq(blogPostTranslations.languageCode, 'en'),
      ),
    );

  // HU
  await database
    .update(blogPostTranslations)
    .set({
      title: titleHu,
      excerpt: excerptHu,
      content: contentHu,
    })
    .where(
      and(
        eq(blogPostTranslations.postId, id),
        eq(blogPostTranslations.languageCode, 'hu'),
      ),
    );

  redirect(`/${locale}/blog`);
}