'use client';

import { useEffect, useState } from 'react';
import ItemCard from './item-card';

interface Item {
  id: number;
  name: string;
  fileKey: string;
  startingPrice: number;
  endDate: Date;
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
        <ItemCard
          key={item.id}
          item={item}
          imageUrl={urls[item.id]}
          index={index}
        />
      ))}
    </div>
  );
}
