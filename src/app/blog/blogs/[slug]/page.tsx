
import { pageTitleStyles } from '@/styles';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { getBlogPostBySlug } from '@/data-access/blog';
import { getCloudinaryImageUrl } from '@/lib/cloudinary-url';

export default async function BlogPostPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return (
      <div className="space-y-8 flex flex-col items-center justify-center mt-20">
        <Image src="/pacage.svg" width={200} height={200} alt="Not found" />
        <h1 className={pageTitleStyles}>Post not found</h1>
        <p className="italic text-center max-w-md">
          The blog post you are looking for does not exist.
        </p>

        <Button asChild>
          <Link href="/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  const imageUrl = post.coverImageKey
    ? getCloudinaryImageUrl(post.coverImageKey)
    : null;

  return (
    <main className="space-y-10 max-w-3xl mx-auto">
      {/* HEADER */}
      <div className="space-y-4">
        <h1 className={pageTitleStyles}>{post.title}</h1>

        <p className="text-sm text-gray-500">
          Published {format(new Date(post.publishedAt), 'PPP')}
        </p>
      </div>

      {/* COVER IMAGE */}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={post.title}
          width={1200}
          height={600}
          className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
          unoptimized
        />
      )}

      {/* CONTENT */}
      <article className="prose dark:prose-invert max-w-none">
        {/* якщо зберігаєш HTML */}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      <div className="pt-10">
        <Button asChild variant="outline">
          <Link href="/blog">← Back to blog</Link>
        </Button>
      </div>
    </main>
  );
}
