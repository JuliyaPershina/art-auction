'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getCloudinaryImageUrl } from '@/lib/cloudinary-url';
import { deletePicture } from '@/app/pictures/[pictureId]/actions';

export interface Picture {
  id: number;
  fileKey: string;
  name?: string | null;
  type: string;
}

interface Props {
  pictures: Picture[];
  isAdmin?: boolean;
}

export default function PictureGallery({ pictures, isAdmin }: Props) {
  const [allPictures, setAllPictures] = useState(pictures);
  const [selected, setSelected] = useState<Picture | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this picture?')) return;

    try {
      await deletePicture(id); // виклик server action
      setAllPictures(allPictures.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete picture');
    }
  };

  return (
    <div>
      {/* Галерея */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {allPictures.map((pic) => (
          <div key={pic.id} className="relative cursor-pointer">
            <Image
              src={getCloudinaryImageUrl(pic.fileKey)}
              alt={pic.name ?? 'Picture'}
              width={300}
              height={300}
              className="object-cover w-full h-64 rounded shadow-md hover:scale-105 transition-transform"
              onClick={() => setSelected(pic)}
            />
            {pic.name && <p className="mt-1 text-center">{pic.name}</p>}

            {isAdmin && (
              <button
                onClick={() => handleDelete(pic.id)}
                className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Модалка для перегляду */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg max-w-lg w-full relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 text-xl font-bold"
            >
              ×
            </button>
            <Image
              src={getCloudinaryImageUrl(selected.fileKey)}
              alt={selected.name ?? 'Picture'}
              width={600}
              height={600}
              className="object-contain w-full h-auto"
            />
            {selected.name && (
              <h2 className="mt-2 text-center font-semibold">
                {selected.name}
              </h2>
            )}
            <p className="text-sm text-gray-600 mt-1">Type: {selected.type}</p>
          </div>
        </div>
      )}
    </div>
  );
}
