// import { getBlogPostBySlug } from '@/data-access/blog';
// import { updateBlogPostAction } from '../updateBlogPostAction';
// import { notFound } from 'next/navigation';

// export default async function EditBlogPage({
//   params: { slug },
// }: {
//   params: { slug: string };
// }) {
//   const post = await getBlogPostBySlug(slug);

//   if (!post) return notFound();

//   return (
//     <form action={updateBlogPostAction} className="space-y-6 max-w-2xl">
//       <input type="hidden" name="id" value={post.id} />

//       <input name="title" defaultValue={post.title} />
//       <textarea name="excerpt" defaultValue={post.excerpt ?? ''} />
//       <textarea name="content" defaultValue={post.content} />

//       <button type="submit">Update</button>
//     </form>
//   );
// }

import { getBlogPostBySlug } from '@/data-access/blog';
import { updateBlogPostAction } from '../updateBlogPostAction';
import { notFound } from 'next/navigation';
import { pageTitleStyles } from '@/styles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default async function EditBlogPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const post = await getBlogPostBySlug(slug);

  if (!post) return notFound();

  return (
    <main className="max-w-3xl mx-auto py-10">
      <h1 className={pageTitleStyles}>Edit Blog Post</h1>

      <p className="text-gray-500 mb-6">
        Update the content, title, or excerpt of your blog post. Changes will be
        applied immediately.
      </p>

      <form
        action={updateBlogPostAction}
        className="space-y-6 bg-white p-6 rounded-2xl shadow-md"
      >
        <Input type="hidden" name="id" value={post.id} />

        {/* Title */}
        <div className="flex flex-col">
          <label htmlFor="title" className="mb-1 font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <Input
            id="title"
            name="title"
            placeholder="Post title"
            defaultValue={post.title}
            required
            className="border border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
          />
        </div>

        {/* Excerpt */}
        <div className="flex flex-col">
          <label htmlFor="excerpt" className="mb-1 font-medium text-gray-700">
            Excerpt
          </label>
          <Textarea
            id="excerpt"
            name="excerpt"
            placeholder="Short description for blog feed"
            defaultValue={post.excerpt ?? ''}
            rows={3}
            className="border border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <label htmlFor="content" className="mb-1 font-medium text-gray-700">
            Content <span className="text-red-500">*</span>
          </label>
          <Textarea
            id="content"
            name="content"
            placeholder="Full article content (HTML or Markdown)"
            defaultValue={post.content}
            rows={10}
            required
            className="border border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
          />
        </div>
        

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Update Post
          </Button>
        </div>
      </form>
    </main>
  );
}

