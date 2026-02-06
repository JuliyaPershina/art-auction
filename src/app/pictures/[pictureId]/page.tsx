import { database } from '@/db/database';
import { pictures } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Image from 'next/image';
import { getCloudinaryImageUrl } from '@/lib/cloudinary-url';

interface Props {
  params: { pictureId: string };
}

export default async function PicturePage({ params }: Props) {
  const pictureId = Number(params.pictureId);

  const picture = await database.query.pictures.findFirst({
    where: eq(pictures.id, pictureId),
  });

  if (!picture) return <p className="text-center mt-8">Picture not found</p>;

  return (
    <main className="p-4 flex flex-col items-center space-y-4">
      <div className="w-full max-w-3xl">
        <Image
          src={getCloudinaryImageUrl(picture.fileKey)}
          alt={picture.name ?? 'Picture'}
          width={800}
          height={800}
          className="object-contain w-full h-auto rounded shadow-lg"
        />
      </div>

      {picture.name && (
        <h1 className="text-2xl font-semibold">{picture.name}</h1>
      )}
      <p className="text-gray-600">Type: {picture.type}</p>
    </main>
  );
}
