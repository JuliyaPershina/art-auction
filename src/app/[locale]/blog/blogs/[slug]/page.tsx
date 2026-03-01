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
  params: Promise<{
    locale: 'hu' | 'en';
    slug: string;
  }>;
}

/* =========================
   SEO
========================= */

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug, locale } = await params;

  const post = await getBlogPostBySlug(slug, true);

  if (!post) {
    return { title: 'Post not found' };
  }

  const translation =
    post.translations.find((t) => t.languageCode === locale) ||
    post.translations.find((t) => t.languageCode === 'en');

  const title = translation?.title ?? 'Post';
  const excerpt = translation?.excerpt ?? '';

  return {
    title,
    description: excerpt,
    openGraph: {
      title,
      description: excerpt,
      images: post.coverImageKey
        ? [getCloudinaryImageUrl(post.coverImageKey)]
        : [],
    },
  };
}

/* =========================
   PAGE
========================= */

export default async function BlogPostPage({
  params,
}: BlogPostPageProps) {
  const { locale, slug } = await params;

  const post = await getBlogPostBySlug(slug, true);
  const session = await auth();
  const isAdmin = session?.user?.role === 'admin';

  if (!post) {
    return (
      <main className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-semibold">Post not found</h1>
      </main>
    );
  }

  const translation =
    post.translations.find((t) => t.languageCode === locale) ||
    post.translations.find((t) => t.languageCode === 'en');

  const title = translation?.title ?? '';
  const content =
    typeof translation?.content === 'string'
      ? translation.content
      : '';
  const excerpt = translation?.excerpt ?? '';

  const imageUrls = [
    post.coverImageKey
      ? getCloudinaryImageUrl(post.coverImageKey)
      : null,
    ...post.images.map((img) =>
      img.picture?.fileKey
        ? getCloudinaryImageUrl(img.picture.fileKey)
        : null,
    ),
  ].filter(Boolean) as string[];

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* LEFT */}
        <div className="space-y-6 min-w-0">
          <div className="pb-6">
            <Button asChild variant="outline">
              <Link href={`/${locale}/blog`}>
                ← Back to blog
              </Link>
            </Button>
          </div>

          <h1 className={pageTitleStyles}>{title}</h1>

          <p className="text-sm text-gray-500">
            By {post.author?.name ?? 'Anonymous'} •{' '}
            {format(new Date(post.publishedAt), 'PPP')}
          </p>

          <article className="prose dark:prose-invert max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html: content,
              }}
            />
          </article>

          {isAdmin && (
            <div className="flex gap-4 pt-6">
              <Link
                href={`/${locale}/blog/blogs/${post.slug}/edit`}
              >
                <Button variant="outline">Edit</Button>
              </Link>

              <form
                action={deleteBlogPostAction.bind(
                  null,
                  post.id,
                  locale,
                )}
              >
                <Button variant="destructive">
                  Delete
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="space-y-6 min-w-0">
          <Gallery images={imageUrls} title={title} />
        </div>
      </div>
    </main>
  );
}