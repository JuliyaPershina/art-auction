
import { getBlogPostBySlug } from '@/data-access/blog';
import { pageTitleStyles } from '@/styles';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import { auth } from '../../../../../../auth';
import { deleteBlogPostAction } from './deleteBlogPostAction';
import { getCloudinaryImageUrl } from '@/lib/cloudinary-url';
import Gallery from './Gallery';
import { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{ locale: 'hu' | 'en'; slug: string }>;
}

// 🔥 SEO metadata
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post not found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt ?? '',
    openGraph: {
      title: post.title,
      description: post.excerpt ?? '',
      images: post.coverImageKey
        ? [getCloudinaryImageUrl(post.coverImageKey)]
        : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;

  const post = await getBlogPostBySlug(slug);
  const session = await auth();
  const isAdmin = session?.user?.role === 'admin';

  if (!post) return <div>Post not found</div>;

  const imageUrls = [
    post.coverImageKey ? getCloudinaryImageUrl(post.coverImageKey) : null,
    ...(post.images?.map((img) =>
      img.picture?.fileKey ? getCloudinaryImageUrl(img.picture.fileKey) : null,
    ) || []),
  ].filter(Boolean) as string[];

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* LEFT – CONTENT */}
        <div className="space-y-6 min-w-0">
          <div className="pb-6">
            <Button asChild variant="outline">
              <Link href={`/${locale}/blog`}>← Back to blog</Link>
            </Button>
          </div>
          <h1 className={pageTitleStyles}>{post.title}</h1>

          <p className="text-sm text-gray-500">
            Published {format(new Date(post.publishedAt), 'PPP')}
          </p>

          <article className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>

          {isAdmin && (
            <div className="flex gap-4 pt-6">
              <Link href={`/blog/blogs/${post.slug}/edit`}>
                <Button variant="outline">Edit</Button>
              </Link>

              <form action={deleteBlogPostAction.bind(null, post.id)}>
                <Button variant="destructive">Delete</Button>
              </form>
            </div>
          )}
        </div>

        {/* RIGHT – GALLERY */}
        <div className="space-y-6 min-w-0">
          <Gallery images={imageUrls} title={post.title} />
        </div>
      </div>
    </main>
  );
}

