// 'use server';

// import { cloudinary } from '@/lib/cloudinary';
// import { database } from '@/db/database';
// import { items, blogPosts, blogPostPictures} from '@/db/schema';
// import { auth } from '../../../../../auth';
// import { redirect } from 'next/navigation';
// import type { UploadApiResponse } from 'cloudinary';

// export async function createBlogActions({
//   file,
//   name,
//   startingPrice,
//   endDate,
// }: {
//   file: File;
//   name: string;
//   startingPrice: number;
//   endDate: Date;
// }) {
//   const session = await auth();

//   if (!session || session.user.role !== 'admin') {
//     throw new Error('Forbidden');
//   }

//   // Конвертуємо File у Buffer
//   const buffer = Buffer.from(await file.arrayBuffer());

//   const uploadResult = await new Promise<UploadApiResponse>(
//     (resolve, reject) => {
//       cloudinary.uploader
//         .upload_stream(
//           {
//             folder: 'art-auction',
//             resource_type: 'image',
//           },
//           (error, result) => {
//             if (error) return reject(error);
//             if (!result) return reject(new Error('Upload failed'));
//             resolve(result);
//           },
//         )
//         .end(buffer);
//     },
//   );

//   // Зберігаємо public_id у базу
//   await database.insert(items).values({
//     name,
//     startingPrice,
//     fileKey: uploadResult.public_id, // 👈 це буде ключ для відображення
//     userId: session.user.id,
//     endDate,
//   });

//   redirect('/');
// }

'use server';

import { cloudinary } from '@/lib/cloudinary';
import { database } from '@/db/database';
import { blogPosts } from '@/db/schema';
import { auth } from '../../../../../auth';
import { redirect } from 'next/navigation';
import type { UploadApiResponse } from 'cloudinary';
import slugify from 'slugify';

export async function createBlogPostAction({
  title,
  excerpt,
  content,
  coverImage,
}: {
  title: string;
  excerpt: string;
  content: string;
  coverImage?: File;
}) {
  const session = await auth();

  if (!session || session.user.role !== 'admin') {
    throw new Error('Forbidden');
  }

  let coverImageKey: string | undefined;

  // 🔹 Якщо є обкладинка — завантажуємо її
  if (coverImage && coverImage.size > 0) {
    const buffer = Buffer.from(await coverImage.arrayBuffer());

    const uploadResult = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: 'art-auction/blog',
              resource_type: 'image',
            },
            (error, result) => {
              if (error) return reject(error);
              if (!result) return reject(new Error('Upload failed'));
              resolve(result);
            },
          )
          .end(buffer);
      },
    );

    coverImageKey = uploadResult.public_id;
  }

  // 🔹 Генеруємо slug
  const slug = slugify(title, {
    lower: true,
    strict: true,
  });

  // 🔹 Запис у базу
  await database.insert(blogPosts).values({
    title,
    excerpt,
    content,
    slug,
    coverImageKey,
    authorId: session.user.id,
  });

  redirect('/blog');
}

