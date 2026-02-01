'use client';

import ItemCard from './item-card';

interface Item {
  id: number;
  name: string;
  fileKey: string; // це public_id з Cloudinary
  startingPrice: number;
  endDate: Date;
}

export default function ItemList({ items }: { items: Item[] }) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const folder = 'art-auction'; // твоя папка для цього проекту

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
      {items.map((item, index) => {
        const imageUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${item.fileKey}`;

        return (
          <ItemCard
            key={item.id}
            item={item}
            imageUrl={imageUrl}
            index={index}
          />
        );
      })}
    </div>
  );
}

