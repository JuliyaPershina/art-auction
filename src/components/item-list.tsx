'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Item {
  id: number;
  name: string;
  fileKey: string;
  startingPrice: number;
}

export default function ItemList({ items }: { items: Item[] }) {
  const [urls, setUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchUrls() {
      const result: Record<string, string> = {};
      for (const item of items) {
        try {
          const res = await fetch(`/api/images/${item.fileKey}`);
          const data = await res.json();
          result[item.id] = data.url;
        } catch (err) {
          console.error(`Error fetching image for ${item.fileKey}:`, err);
        }
      }
      setUrls(result);
    }

    fetchUrls();
  }, [items]);

  return (
    <div
      className="
    grid 
    gap-6 
    grid-cols-1
    sm:grid-cols-2 
    md:grid-cols-3 
    lg:grid-cols-4 
    auto-rows-fr
  "
    >
      {items.map((item, index) => (
        <div
          key={item.id}
          className="
        border 
        rounded-xl 
        p-6 
        flex 
        flex-col 
        justify-between 
        transition-shadow 
        hover:shadow-lg 
        bg-white 
        dark:bg-gray-800
      "
        >
          {/* Фото з hover-зумом */}
          <div className="w-full aspect-square overflow-hidden rounded-lg mb-4">
            {urls[item.id] ? (
              <Image
                src={urls[item.id]}
                alt={item.name}
                width={400}
                height={400}
                className="
              object-cover 
              w-full 
              h-full 
              transition-transform 
              duration-300 
              hover:scale-110
            "
                unoptimized
                priority={index === 0}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                Loading image...
              </div>
            )}
          </div>

          {/* Інформація */}
          <div className="flex flex-col grow justify-between">
            <div className="font-semibold text-lg text-gray-900 dark:text-white">
              {item.name}
            </div>
            <div className="text-gray-600 dark:text-gray-400 mt-1">
              Starting price: ${(item.startingPrice / 100).toFixed(2)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
