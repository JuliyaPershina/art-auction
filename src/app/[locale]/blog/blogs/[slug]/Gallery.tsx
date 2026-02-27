'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  images: string[];
  title: string;
}

export default function Gallery({ images, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  if (!images.length) return null;

  const activeImage = images[activeIndex];

  const paginate = (newDirection: number) => {
    setDirection(newDirection);

    setActiveIndex((prev) => {
      const next = prev + newDirection;
      if (next < 0) return images.length - 1;
      if (next >= images.length) return 0;
      return next;
    });
  };

  // SWIPE
  let touchStartX = 0;

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (delta > 50) paginate(-1);
    if (delta < -50) paginate(1);
  }

  return (
    <div className="w-full space-y-6 overflow-hidden">
      {/* MAIN IMAGE */}
      <div
        className="relative w-full aspect-4/3 bg-gray-100 rounded-2xl overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* ARROWS (desktop only) */}
        <button
          onClick={() => paginate(-1)}
          className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white w-10 h-10 items-center justify-center rounded-full"
        >
          ←
        </button>

        <button
          onClick={() => paginate(1)}
          className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white w-10 h-10 items-center justify-center rounded-full"
        >
          →
        </button>

        {/* ANIMATED IMAGE */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 cursor-zoom-in"
            onClick={() => setZoomed(true)}
          >
            <Image
              src={activeImage}
              alt={title}
              fill
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-contain"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* THUMBNAILS */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > activeIndex ? 1 : -1);
              setActiveIndex(index);
            }}
            className={`relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all
              ${
                index === activeIndex
                  ? 'border-black scale-105'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
          >
            <Image
              src={img}
              alt={`${title}-${index}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      {/* ZOOM MODAL */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-6xl aspect-4/3"
            >
              <Image
                src={activeImage}
                alt={title}
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

