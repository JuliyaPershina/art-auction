import { database } from '@/db/database';
import { auth } from '../../../auth';
import Hero from '@/components/Hero';
import GalleryPage from '@/components/GalleryPage';
import { desc } from 'drizzle-orm';
import type { Picture } from '@/types/picture';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: 'hu' | 'en' }>;
}) {
  const { locale } = await params;
  const session = await auth();

  const allPictures = await database.query.pictures.findMany({
    with: {
      translations: true, // 🔥 це обов'язково
    },
    where: (pic, { eq }) => eq(pic.type, 'art'),
    orderBy: (pic, { desc }) => [desc(pic.createdAt)],
  });

  // 🔥 Приводимо типи до Picture[]
  const pictures: Picture[] = allPictures.map((pic) => ({
    ...pic,
    translations: pic.translations
      .filter((tr) => tr.languageCode === 'en' || tr.languageCode === 'hu')
      .map((tr) => ({
        name: tr.name,
        languageCode: tr.languageCode as 'en' | 'hu',
      })),
  }));

  const isAdmin = session?.user.role === 'admin';

  return (
    <main className="space-y-8 p-4">
      <Hero locale={locale} />
      <GalleryPage
        initialPictures={pictures}
        isAdmin={isAdmin}
        locale={locale}
      />
    </main>
  );
}