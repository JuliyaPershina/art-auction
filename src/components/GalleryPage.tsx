'use client';

import { useState } from 'react';
import { deletePicture } from '@/app/[locale]/pictures/[pictureId]/actions';
import CreatePictureToggle from './CreatePictureToggle';
import PictureGallery from './PictureGallery';
import { Button } from '@/components/ui/button';

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

const PAGE_SIZE = 4;

const translations = {
  en: {
    deleteFailed: 'Delete failed',
    prev: 'Prev',
    next: 'Next',
  },
  hu: {
    deleteFailed: 'Törlés sikertelen',
    prev: 'Előző',
    next: 'Következő',
  },
};

export default function GalleryPage({
  initialPictures,
  isAdmin,
  locale,
}: Props) {
  const [pictures, setPictures] = useState<Picture[]>(initialPictures);
  const [page, setPage] = useState(1);

  const t = translations[locale];

  const totalPages = Math.max(1, Math.ceil(pictures.length / PAGE_SIZE));

  // ✅ нормалізація сторінки (важливо після delete)
  const currentPage = Math.min(page, totalPages);

  const paginatedPictures = pictures.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // ➕ ADD
  const handleAdd = (newPicture: Picture) => {
    setPictures((prev) => [newPicture, ...prev]);
    setPage(1); // 🔥 повертаємо на першу сторінку
  };

  // ❌ DELETE
  const handleDelete = async (id: number) => {
    const previous = pictures;

    const updated = pictures.filter((p) => p.id !== id);
    setPictures(updated);

    try {
      await deletePicture(id, locale);
    } catch {
      setPictures(previous);
      alert(t.deleteFailed);
      return;
    }

    // 🔥 якщо сторінка стала пустою → назад
    const newTotalPages = Math.max(
      1,
      Math.ceil(updated.length / PAGE_SIZE),
    );

    if (page > newTotalPages) {
      setPage(newTotalPages);
    }
  };

  return (
    <div className="space-y-10">
      {/* CREATE */}
      {isAdmin && (
        <CreatePictureToggle onUpload={handleAdd} locale={locale} />
      )}

      {/* GALLERY */}
      <PictureGallery
        pictures={paginatedPictures}
        isAdmin={isAdmin}
        onDelete={handleDelete}
        locale={locale}
      />

      {/* 🔥 PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <Button
            disabled={currentPage === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            {t.prev}
          </Button>

          <span className="text-sm">
            {currentPage} / {totalPages}
          </span>

          <Button
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            {t.next}
          </Button>
        </div>
      )}
    </div>
  );
}