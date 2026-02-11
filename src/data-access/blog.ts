import { database } from '@/db/database';
import { blogPosts } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function getBlogFeed() {
  return database.query.blogPosts.findMany({
    where: (post, { eq }) => eq(post.isPublished, true),
    orderBy: (post, { desc }) => [desc(post.publishedAt)],
    with: {
      author: true,
      images: {
        with: {
          picture: true,
        },
      },
    },
  });
}

export async function getBlogPostBySlug(slug: string) {
  return database.query.blogPosts.findFirst({
    where: (post, { and, eq }) =>
      and(eq(post.slug, slug), eq(post.isPublished, true)),
    with: {
      author: true,
      images: {
        with: {
          picture: true,
        },
      },
    },
  });
}