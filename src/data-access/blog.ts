import { database } from '@/db/database';
import { blogPosts } from '@/db/schema';
import { desc, eq, sql } from 'drizzle-orm';

// export async function getBlogFeed() {
//   return database.query.blogPosts.findMany({
//     where: (post, { eq }) => eq(post.isPublished, true),
//     orderBy: (post, { desc }) => [desc(post.publishedAt)],
//     with: {
//       author: true,
//       images: {
//         with: {
//           picture: true,
//         },
//       },
//     },
//   });
// }

export async function getBlogFeed(limit: number, offset: number) {
  // 1️⃣ Отримуємо пости
  const posts = await database.query.blogPosts.findMany({
    where: (post, { eq }) => eq(post.isPublished, true),
    orderBy: (post, { desc }) => [desc(post.publishedAt)],
    limit,
    offset,
    with: {
      author: true,
      images: {
        with: {
          picture: true,
        },
      },
    },
  });

  // 2️⃣ Отримуємо загальну кількість
  const [{ count }] = await database
    .select({
      count: sql<number>`count(*)`,
    })
    .from(blogPosts)
    .where(eq(blogPosts.isPublished, true));

  return {
    posts,
    total: Number(count),
  };
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