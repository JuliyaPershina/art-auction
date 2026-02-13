'use client';

import Image from 'next/image';
import { useState } from 'react';

interface GalleryProps {
  images: string[];
  title: string;
}

export default function Gallery({ images, title }: GalleryProps) {
  const [selected, setSelected] = useState<string | null>(null);

  if (!images.length) return null;

  return (
    <>
      <div className="flex flex-col gap-4 lg:sticky lg:top-24 max-h-[80vh] overflow-y-auto pr-2">
        {/* Велике фото */}
        <div className="cursor-pointer" onClick={() => setSelected(images[0])}>
          <Image
            src={images[0]}
            alt={title}
            width={800}
            height={600}
            className="w-full rounded-2xl object-contain"
          />
        </div>

        {/* Маленькі фото */}
        {images.slice(1).map((img, i) => (
          <div
            key={i}
            className="cursor-pointer"
            onClick={() => setSelected(img)}
          >
            <Image
              src={img}
              alt={title}
              width={400}
              height={300}
              className="w-full rounded-xl object-contain"
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <Image
            src={selected}
            alt="Preview"
            width={1200}
            height={800}
            className="max-h-[90vh] w-auto object-contain"
          />
        </div>
      )}
    </>
  );
}
