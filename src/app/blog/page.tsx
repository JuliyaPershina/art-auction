import Link from 'next/link';
import { auth } from '../../../auth';
import { getBlogFeed } from '@/data-access/blog';
import { pageTitleStyles } from '@/styles';
import { Button } from '@/components/ui/button';
import { getCloudinaryImageUrl } from '@/lib/cloudinary-url';
import Image from 'next/image';
import { format } from 'date-fns';
import type { Metadata } from 'next';
import { Pagination } from '@/components/Pagination';

const LIMIT = 2;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
  }): Promise<Metadata> {
  const params = await searchParams; 
 const page = Math.max(1, Number(params.page) || 1);

  return {
    title: page > 1 ? `Blog – Page ${page}` : 'Blog',
    description:
      'Latest news and insights about contemporary art and auctions.',
    alternates: {
      canonical: page > 1 ? `/blog?page=${page}` : '/blog',
    },
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const session = await auth();

  const page = Math.max(1, Number(params.page) || 1);
  const offset = (page - 1) * LIMIT;

  const { posts, total } = await getBlogFeed(LIMIT, offset);
  const totalPages = Math.ceil(total / LIMIT);

  const isAdmin = session?.user?.role === 'admin';

  return (
    <main className="space-y-10 px-6 pb-16">
      {/* HEADER */}
      <div className="flex justify-between items-center pt-6">
        <h1 className={pageTitleStyles}>Blog</h1>

        {isAdmin && (
          <Button asChild>
            <Link href="/blog/blogs/create">Create Post</Link>
          </Button>
        )}
      </div>

      {/* POSTS */}
      {posts.length === 0 ? (
        <p className="text-muted-foreground">No blog posts yet.</p>
      ) : (
        <div className="grid gap-8">
          {posts.map((post) => {
            const coverImage =
              post.coverImageKey && getCloudinaryImageUrl(post.coverImageKey);

            return (
              <Link
                key={post.id}
                href={`/blog/blogs/${post.slug}`}
                className="group border rounded-2xl p-6 hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {coverImage && (
                    <Image
                      src={coverImage}
                      alt={post.title}
                      width={300}
                      height={200}
                      className="w-full object-cover rounded-xl md:w-[300px] h-[200px]"
                    />
                  )}

                  <div className="space-y-4 flex-1">
                    <h2 className="text-2xl font-semibold group-hover:underline">
                      {post.title}
                    </h2>

                    {post.excerpt && (
                      <p className="text-muted-foreground">{post.excerpt}</p>
                    )}

                    <div className="text-sm text-muted-foreground">
                      By {post.author?.name ?? 'Anonymous'} •{' '}
                      {format(post.publishedAt, 'PPP')}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* PAGINATION */}
      <Pagination currentPage={page} totalPages={totalPages} basePath="/blog" />
    </main>
  );
}
