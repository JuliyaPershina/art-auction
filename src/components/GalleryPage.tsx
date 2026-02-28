'use client';

import { useState } from 'react';
import { deletePicture } from '@/app/[locale]/pictures/[pictureId]/actions';
import CreatePictureToggle from './CreatePictureToggle';
import PictureGallery from './PictureGallery';

interface PictureTranslation {
  languageCode: 'en' | 'hu';
  name: string;
}

export interface Picture {
  id: number;
  fileKey: string;
  type: string;
  translations: PictureTranslation[];
}

interface Props {
  initialPictures: Picture[];
  isAdmin?: boolean;
  locale: 'en' | 'hu';
}

const translations = {
  en: { deleteFailed: 'Delete failed' },
  hu: { deleteFailed: 'Törlés sikertelen' },
};

export default function GalleryPage({
  initialPictures,
  isAdmin,
  locale,
}: Props) {
  const [pictures, setPictures] = useState<Picture[]>(initialPictures);
  const t = translations[locale];

  const handleAdd = (newPicture: Picture) => {
    setPictures((prev) => [newPicture, ...prev]);
  };

  const handleDelete = async (id: number) => {
    const previous = pictures;
    setPictures((prev) => prev.filter((p) => p.id !== id));

    try {
      await deletePicture(id, locale);
    } catch {
      setPictures(previous);
      alert(t.deleteFailed);
    }
  };

  return (
    <div className="space-y-10">
      {isAdmin && <CreatePictureToggle onUpload={handleAdd} locale={locale} />}

      <PictureGallery
        pictures={pictures}
        isAdmin={isAdmin}
        onDelete={handleDelete}
        locale={locale}
      />
    </div>
  );
}