'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ImagePreviewModal({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Thumbnail */}
      <div
        onClick={() => setOpen(true)}
        className="cursor-pointer w-full aspect-square m-4 items-center mx-auto overflow-hidden rounded-lg"
      >
        <Image
          src={src}
          alt={alt}
          width={400}
          height={400}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
          unoptimized
        />
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6"
          onClick={() => setOpen(false)}
        >
          <div className="w-full max-w-4xl h-[90vh] flex items-center justify-center">
            <Image
              src={src}
              alt={alt}
              width={1000}
              height={1000}
              className="w-auto max-h-[90vh] rounded-xl object-contain" // ✅ FIX
              unoptimized
            />
          </div>
        </div>
      )}
    </>
  );
}
