import { database } from '@/db/database';
import { pictures } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Image from 'next/image';
import { getCloudinaryImageUrl } from '@/lib/cloudinary-url';

interface Props {
  params: { locale: 'hu' | 'en'; pictureId: string };
}

const translations = {
  en: {
    notFound: 'Picture not found',
    type: 'Type',
    defaultAlt: 'Picture',
  },
  hu: {
    notFound: 'A kép nem található',
    type: 'Típus',
    defaultAlt: 'Kép',
  },
};

export default async function PicturePage({ params }: Props) {
  const { locale, pictureId } = params;
  const t = translations[locale];

  const picture = await database.query.pictures.findFirst({
    where: eq(pictures.id, Number(pictureId)),
    with: {
      translations: true,
    },
  });

  const translation = picture?.translations.find(
    (t) => t.languageCode === locale,
  );

  if (!picture) return <p className="text-center mt-8">{t.notFound}</p>;

  return (
    <main className="p-4 flex flex-col items-center space-y-4">
      <div className="w-full max-w-3xl">
        <Image
          src={getCloudinaryImageUrl(picture.fileKey)}
          alt={translation?.name ?? t.defaultAlt}
          width={800}
          height={800}
          className="object-contain w-full h-auto rounded shadow-lg"
        />
      </div>

      {translation?.name && (
        <h1 className="text-2xl font-semibold">{translation.name}</h1>
      )}

      <p className="text-gray-600">
        {t.type}: {picture.type}
      </p>
    </main>
  );
}