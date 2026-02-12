'use server';

import { database } from '@/db/database';
import { blogPosts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '../../../../../auth';
import { redirect } from 'next/navigation';

export async function updateBlogPostAction(formData: FormData) {
  const session = await auth();

  if (!session || session.user.role !== 'admin') {
    throw new Error('Forbidden');
  }

  const id = Number(formData.get('id'));
  const title = formData.get('title') as string;
  const excerpt = formData.get('excerpt') as string;
  const content = formData.get('content') as string;

  await database
    .update(blogPosts)
    .set({
      title,
      excerpt,
      content,
      updatedAt: new Date(),
    })
    .where(eq(blogPosts.id, id));

  redirect('/blog');
}
