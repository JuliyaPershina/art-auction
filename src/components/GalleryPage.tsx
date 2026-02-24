'use client';

import { useState } from 'react';
import { deletePicture } from '@/app/pictures/[pictureId]/actions';
import CreatePictureForm from './CreatePictureForm';
import PictureGallery from './PictureGallery';
import { Picture } from '@/types/picture';
import CreatePictureToggle from './CreatePictureToggle';

interface Props {
  initialPictures: Picture[];
  isAdmin?: boolean;
}

export default function GalleryPage({ initialPictures, isAdmin }: Props) {
  const [pictures, setPictures] = useState<Picture[]>(initialPictures);

  // ➕ ДОДАВАННЯ (в початок)
  const handleAdd = (newPicture: Picture) => {
    setPictures((prev) => [newPicture, ...prev]);
  };

  // ❌ OPTIMISTIC DELETE
  const handleDelete = async (id: number) => {
    const previous = pictures;

    // одразу видаляємо з UI
    setPictures((prev) => prev.filter((p) => p.id !== id));

    try {
      await deletePicture(id);
    } catch (error) {
      // якщо сервер впав — повертаємо назад
      setPictures(previous);
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-10">
      {isAdmin && <CreatePictureToggle onUpload={handleAdd} />}

      <PictureGallery
        pictures={pictures}
        isAdmin={isAdmin}
        onDelete={handleDelete}
      />
    </div>
  );
}
