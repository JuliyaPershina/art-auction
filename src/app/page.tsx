import { database } from '@/db/database';
import { auth } from '../../auth';
import PictureGallery from '@/components/PictureGallery';
import CreatePictureToggle from '@/components/CreatePictureToggle';
import Hero from '@/components/Hero';
import { eq } from 'drizzle-orm';
import GalleryPage from '@/components/GalleryPage';


export default async function HomePage() {
  const session = await auth(); // може бути null
  // const allPictures = await database.query.pictures.findMany();
  const allPictures = await database.query.pictures.findMany({
    where: (pic, { eq }) => eq(pic.type, 'art'),
  });

  const isAdmin = session?.user.role === 'admin';

  return (
    <main className="space-y-8 p-4">
      <Hero />

      {/* {isAdmin && <CreatePictureToggle />} */}

      {/* <PictureGallery pictures={allPictures} isAdmin={isAdmin} /> */}
      <GalleryPage initialPictures={allPictures} isAdmin={isAdmin} />
    </main>
  );
}
