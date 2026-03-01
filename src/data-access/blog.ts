import { database } from '@/db/database';
import {
  blogPosts,
  blogPostTranslations,
  blogPostPictures,
  pictures,
} from '@/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

export async function getAllBlogPosts(locale: 'en' | 'hu') {
  const posts = await database.query.blogPosts.findMany({
    where: (post, { eq }) => eq(post.isPublished, true),
    with: {
      translations: true,
      images: {
        with: {
          picture: true,
        },
      },
    },
    orderBy: (post, { desc }) => [desc(post.publishedAt)],
  });

  return posts.map((post) => {
    const translation = post.translations.find(
      (t) => t.languageCode === locale,
    );

    return {
      ...post,
      title: translation?.title ?? '',
      excerpt: translation?.excerpt ?? '',
      content: translation?.content ?? '',
    };
  });
}

export async function getBlogPostBySlug(
  slug: string,
  includeUnpublished = false,
) {
  if (!slug) return null;

  const post = await database.query.blogPosts.findFirst({
    where: (post, { and, eq }) =>
      includeUnpublished
        ? eq(post.slug, slug)
        : and(eq(post.slug, slug), eq(post.isPublished, true)),
    with: {
      author: true,
      translations: true,
      images: {
        with: {
          picture: true,
        },
      },
    },
  });

  if (!post) return null;

  return post; // 👈 ПОВЕРТАЄМО ВСЕ
}

export async function getBlogFeed(
  locale: 'en' | 'hu',
  limit: number,
  offset: number,
) {
  const posts = await database.query.blogPosts.findMany({
    where: (post, { eq }) => eq(post.isPublished, true),
    orderBy: (post, { desc }) => [desc(post.publishedAt)],
    limit,
    offset,
    with: {
      author: true,
      translations: true,
      images: {
        with: {
          picture: true,
        },
      },
    },
  });

  const [{ count }] = await database
    .select({ count: sql<number>`count(*)` })
    .from(blogPosts)
    .where(eq(blogPosts.isPublished, true));

  const mapped = posts.map((post) => {
    let translation =
      post.translations.find((t) => t.languageCode === locale) ||
      post.translations.find((t) => t.languageCode === 'en');

    return {
      ...post,
      title: translation?.title ?? '',
      excerpt: translation?.excerpt ?? '',
      content: translation?.content ?? '',
    };
  });

  return {
    posts: mapped,
    total: Number(count),
  };
}