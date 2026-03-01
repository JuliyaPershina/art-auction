import { notFound } from 'next/navigation';
import { getBlogPostBySlug } from '@/data-access/blog';
import { updateBlogPostAction } from '../updateBlogPostAction';
import { pageTitleStyles } from '@/styles';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ slug: string; locale: 'en' | 'hu' }>;
}) {
  const { slug, locale } = await params;

  // IMPORTANT:
  // Має повертати post + translations[]
  const post = await getBlogPostBySlug(slug, true);

  if (!post) notFound();

  const translationEn = post.translations.find(
    (t: any) => t.languageCode === 'en',
  );

  const translationHu = post.translations.find(
    (t: any) => t.languageCode === 'hu',
  );

  if (!translationEn || !translationHu) {
    notFound();
  }

  return (
    <main className="space-y-8 px-6 pb-16 pt-6 max-w-3xl mx-auto">
      <h1 className={pageTitleStyles}>Edit Blog Post</h1>

      <form
        action={updateBlogPostAction}
        className="space-y-6 bg-white p-6 rounded-2xl shadow-md"
      >
        {/* Hidden */}
        <input type="hidden" name="postId" value={post.id} />
        <input type="hidden" name="slug" value={post.slug} />
        <input type="hidden" name="locale" value={locale} />

        {/* EN */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg">English</h2>

          <Input
            name="titleEn"
            defaultValue={translationEn.title}
            placeholder="Title (English)"
            required
          />

          <Textarea
            name="excerptEn"
            defaultValue={translationEn.excerpt ?? ''}
            placeholder="Excerpt (English)"
            rows={3}
          />

          <Textarea
            name="contentEn"
            defaultValue={translationEn.content}
            placeholder="Content (English)"
            rows={10}
            required
          />
        </div>

        {/* HU */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg">Hungarian</h2>

          <Input
            name="titleHu"
            defaultValue={translationHu.title}
            placeholder="Title (Hungarian)"
            required
          />

          <Textarea
            name="excerptHu"
            defaultValue={translationHu.excerpt ?? ''}
            placeholder="Excerpt (Hungarian)"
            rows={3}
          />

          <Textarea
            name="contentHu"
            defaultValue={translationHu.content}
            placeholder="Content (Hungarian)"
            rows={10}
            required
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">Update Post</Button>
        </div>
      </form>
    </main>
  );
}