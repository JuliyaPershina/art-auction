import Link from 'next/link';
import { auth } from '../../../../auth';
import { getBlogFeed } from '@/data-access/blog';
import { getAllBlogPosts } from '@/data-access/blog';
import { pageTitleStyles } from '@/styles';
import { Button } from '@/components/ui/button';
import { getCloudinaryImageUrl } from '@/lib/cloudinary-url';
import Image from 'next/image';
import { format } from 'date-fns';
import type { Metadata } from 'next';
import { Pagination } from '@/components/Pagination';
import { deleteBlogPostAction } from './blogs/[slug]/deleteBlogPostAction';


const LIMIT = 2;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: 'hu' | 'en' }>;
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const sp = await searchParams;

  const page = Math.max(1, Number(sp.page) || 1);

  return {
    title: page > 1 ? `Blog – Page ${page}` : 'Blog',
    description:
      'Latest news and insights about contemporary art and auctions.',
    alternates: {
      canonical: page > 1 ? `/${locale}/blog?page=${page}` : `/${locale}/blog`,
    },
  };
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: 'hu' | 'en' }>;
  searchParams: Promise<{ page?: string }>;
  }) {
 
  const { locale } = await params;
  const sp = await searchParams;
  const session = await auth();

  const page = Math.max(1, Number(sp.page) || 1);
  const offset = (page - 1) * LIMIT;

  const { posts, total } = await getBlogFeed(locale, LIMIT, offset);
  const totalPages = Math.ceil(total / LIMIT);

  const isAdmin = session?.user?.role === 'admin';

  return (
    <main className="space-y-10 px-6 pb-16">
      {/* HEADER */}
      <div className="flex justify-between items-center pt-6">
        <h1 className={pageTitleStyles}>Blog</h1>

        {isAdmin && (
          <Button asChild>
            <Link href={`/${locale}/blog/blogs/create`}>Create Post</Link>
          </Button>
        )}
      </div>

      {/* POSTS */}
      {posts.length === 0 ? (
        <p className="text-muted-foreground">No blog posts yet.</p>
      ) : (
        <div className="grid gap-8">

          <div className="grid gap-8">
            {posts.map((post) => {
              const coverImage =
                post.coverImageKey && getCloudinaryImageUrl(post.coverImageKey);

              return (
                <div
                  key={post.id}
                  className="relative border rounded-2xl p-6 hover:shadow-lg transition group"
                >
                  {/* ADMIN DELETE BUTTON */}
                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                      <Link href={`/${locale}/blog/blogs/${post.slug}/edit`}>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </Link>

                      <form action={deleteBlogPostAction.bind(null, post.id, locale)}>
                        <Button size="sm" variant="destructive">
                          Delete
                        </Button>
                      </form>
                    </div>
                  )}

                  {/* CLICKABLE CONTENT */}
                  <Link
                    href={`/${locale}/blog/blogs/${post.slug}`}
                    className="block"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {coverImage && (
                        <Image
                          src={coverImage}
                          alt={post.title}
                          width={300}
                          height={200}
                          className="w-full object-cover rounded-xl md:w-75 h-50"
                        />
                      )}

                      <div className="space-y-4 flex-1">
                        <h2 className="text-2xl font-semibold group-hover:underline">
                          {post.title}
                        </h2>

                        {post.excerpt && (
                          <p className="text-muted-foreground">
                            {post.excerpt}
                          </p>
                        )}

                        <div className="text-sm text-muted-foreground">
                          By {post.author?.name ?? 'Anonymous'} •{' '}
                          {format(post.publishedAt, 'PPP')}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PAGINATION */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath={`/${locale}/blog`}
      />
    </main>
  );
}
