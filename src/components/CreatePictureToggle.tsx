'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from './ui/button';
import { Picture } from '@/types/picture';

const CreatePictureForm = dynamic(
  () => import('@/components/CreatePictureForm'),
  { ssr: false },
);

const translations = {
  en: {
    open: 'Upload Picture',
    close: 'Close Upload Form',
  },
  hu: {
    open: 'Kép feltöltése',
    close: 'Bezárás',
  },
};

export default function CreatePictureToggle({
  onUpload,
  locale,
}: {
  onUpload: (picture: Picture) => void;
  locale: 'en' | 'hu';
}) {
  const [open, setOpen] = useState(false);

  const handleUpload = (picture: Picture) => {
    onUpload(picture);
    setOpen(false); // 🔥 закриваємо форму після успішного аплоаду
  };
  const t = translations[locale];

  return (
    <div className="flex flex-col items-center space-y-2">
      <Button
        onClick={() => setOpen(!open)}
        className="bg-gray-900 self-start text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        {open ? t.close : t.open}
      </Button>

      {open && <CreatePictureForm onUpload={handleUpload} locale={locale} />}
    </div>
  );
}
