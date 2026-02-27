import { database } from '@/db/database';
import { auth } from '../../../auth';
import Hero from '@/components/Hero';
import GalleryPage from '@/components/GalleryPage';


export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: 'hu' | 'en' }>;
}) {
  const { locale } = await params;
  const session = await auth();

  const allPictures = await database.query.pictures.findMany({
    where: (pic, { eq }) => eq(pic.type, 'art'),
    orderBy: (pic, { desc }) => [desc(pic.createdAt)],
  });

  const isAdmin = session?.user.role === 'admin';

  return (
    <main className="space-y-8 p-4">
      <Hero locale={locale} />
      <GalleryPage initialPictures={allPictures} isAdmin={isAdmin} />
    </main>
  );
}