// const BlogPage = () => {

  
//   return (
//     <section>
//       <h2 >📝 Блог</h2>
      
//     </section>
//   );
// };

// export default BlogPage;

import Link from 'next/link';
import { auth } from '../../../auth';
import { getBlogFeed } from '@/data-access/blog';
import { pageTitleStyles } from '@/styles';
import { Button } from '@/components/ui/button';
import { getCloudinaryImageUrl } from '@/lib/cloudinary-url';
import Image from 'next/image';
import { format } from 'date-fns';

export default async function BlogPage() {
  const session = await auth();
  const posts = await getBlogFeed();

  const isAdmin = session?.user?.role === 'admin';

  return (
    <main className="space-y-10">
      <div className="flex justify-between items-center">
        <h1 className={pageTitleStyles}>Blog</h1>

        {isAdmin && (
          <Button asChild>
            <Link href="/blog/blogs/create">Create Post</Link>
          </Button>
        )}
      </div>

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
                      className="rounded-xl object-cover w-full md:w-[300px] h-[200px]"
                      unoptimized
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
    </main>
  );
}

