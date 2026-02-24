'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getCloudinaryImageUrl } from '@/lib/cloudinary-url';
import { Button } from '@/components/ui/button';
import { Picture } from '@/types/picture';

interface Props {
  pictures: Picture[];
  isAdmin?: boolean;
  onDelete?: (id: number) => void;
}

export default function PictureGallery({
  pictures,
  isAdmin,
  onDelete,
}: Props) {
  const [selected, setSelected] = useState<Picture | null>(null);

  return (
    <>
      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnimatePresence>
          {pictures.map((pic) => (
            <motion.div
              key={pic.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.25 }}
              className="relative cursor-pointer"
            >
              <Image
                src={getCloudinaryImageUrl(pic.fileKey)}
                alt={pic.name ?? 'Picture'}
                width={300}
                height={300}
                className="object-cover w-full h-64 rounded-xl shadow-md"
                onClick={() => setSelected(pic)}
              />

              {pic.name && (
                <p className="mt-2 text-center font-medium">{pic.name}</p>
              )}

              {isAdmin && (
                <Button
                  onClick={() => onDelete?.(pic.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </Button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] relative p-6 flex flex-col"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* CLOSE BUTTON */}
              <button
                onClick={() => setSelected(null)}
                className="absolute -top-4 -right-4 bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-xl hover:bg-red-700 transition"
              >
                ✕
              </button>

              {/* IMAGE CONTAINER (ФІКС ВИСОТИ!) */}
              <div className="relative w-full h-[80vh]">
                <Image
                  src={getCloudinaryImageUrl(selected.fileKey)}
                  alt={selected.name ?? 'Picture'}
                  fill
                  className="object-contain rounded-xl"
                />
              </div>

              {selected.name && (
                <h2 className="mt-4 text-center text-lg font-semibold">
                  {selected.name}
                </h2>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}