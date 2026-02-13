
// import { getBlogPostBySlug } from '@/data-access/blog';
// import { pageTitleStyles } from '@/styles';
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';
// import Image from 'next/image';
// import { format } from 'date-fns';
// import { auth } from '../../../../../auth';
// import { deleteBlogPostAction } from './deleteBlogPostAction';
// import { getCloudinaryImageUrl } from '@/lib/cloudinary-url';

// interface BlogPostPageProps {
//   params: { slug: string };
// }

// export default async function BlogPostPage(props: BlogPostPageProps) {
//   // 🔹 асинхронно отримуємо params
//   const { slug } = await props.params;

//   // 🔹 отримуємо пост
//   const post = await getBlogPostBySlug(slug);
//   const session = await auth();
//   const isAdmin = session?.user?.role === 'admin';

//   if (!post) {
//     return (
//       <div className="space-y-8 flex flex-col items-center justify-center mt-20">
//         <Image src="/pacage.svg" width={200} height={200} alt="Not found" />
//         <h1 className={pageTitleStyles}>Post not found</h1>
//         <p className="italic text-center max-w-md">
//           The blog post you are looking for does not exist.
//         </p>
//         <Button asChild>
//           <Link href="/blog">Back to Blog</Link>
//         </Button>
//       </div>
//     );
//   }

//   const coverImageUrl = post.coverImageKey
//     ? getCloudinaryImageUrl(post.coverImageKey)
//     : null;

//   return (
//     <main className="space-y-10 max-w-3xl mx-auto">
//       {/* HEADER */}
//       <div className="space-y-4">
//         <h1 className={pageTitleStyles}>{post.title}</h1>
//         <p className="text-sm text-gray-500">
//           Published {format(new Date(post.publishedAt), 'PPP')}
//         </p>
//       </div>

//       {/* COVER IMAGE */}
//       {coverImageUrl && (
//         <Image
//           src={coverImageUrl}
//           alt={post.title}
//           width={1200}
//           height={600}
//           className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
//           unoptimized
//         />
//       )}

//       {/* CONTENT */}
//       <article className="prose dark:prose-invert max-w-none">
//         <div dangerouslySetInnerHTML={{ __html: post.content }} />
//       </article>

//       {/* GALLERY IMAGES */}
//       {post.images && post.images.length > 0 && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {post.images.map((imgRelation) => {
//             const imgUrl = imgRelation.picture?.fileKey
//               ? getCloudinaryImageUrl(imgRelation.picture.fileKey)
//               : null;
//             if (!imgUrl) return null;
//             return (
//               <Image
//                 key={imgRelation.id}
//                 src={imgUrl}
//                 alt={post.title}
//                 width={400}
//                 height={300}
//                 className="w-full h-[200px] object-cover rounded-lg shadow-sm"
//                 unoptimized
//               />
//             );
//           })}
//         </div>
//       )}

//       {/* ADMIN CONTROLS */}
//       {isAdmin && (
//         <div className="flex gap-4 pt-6">
//           <Link href={`/blog/blogs/${post.slug}/edit`}>
//             <Button variant="outline">Edit Post</Button>
//           </Link>

//           <form action={deleteBlogPostAction.bind(null, post.id)}>
//             <Button variant="destructive" type="submit">
//               Delete Post
//             </Button>
//           </form>
//         </div>
//       )}

//       {/* BACK BUTTON */}
//       <div className="pt-10">
//         <Button asChild variant="outline">
//           <Link href="/blog">← Back to blog</Link>
//         </Button>
//       </div>
//     </main>
//   );
// }


import { getBlogPostBySlug } from '@/data-access/blog';
import { pageTitleStyles } from '@/styles';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import { auth } from '../../../../../auth';
import { deleteBlogPostAction } from './deleteBlogPostAction';
import { getCloudinaryImageUrl } from '@/lib/cloudinary-url';
import Gallery from './Gallery';
import { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
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
  const { slug } = await params;

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
        <div className="space-y-6">
          <div className="pb-6">
            <Button asChild variant="outline">
              <Link href="/blog">← Back to blog</Link>
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
        <div>
          <Gallery images={imageUrls} title={post.title} />
        </div>
      </div>

    </main>
  );
}

