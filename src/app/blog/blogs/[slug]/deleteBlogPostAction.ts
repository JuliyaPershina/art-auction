'use server';

import { database } from '@/db/database';
import { blogPosts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '../../../../../auth';
import { redirect } from 'next/navigation';

export async function deleteBlogPostAction(id: number) {
  const session = await auth();

  if (!session || session.user.role !== 'admin') {
    throw new Error('Forbidden');
  }

  await database.delete(blogPosts).where(eq(blogPosts.id, id));

  redirect('/blog');
}
