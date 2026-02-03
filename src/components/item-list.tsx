'use client';

import ItemCard from './item-card';

interface Item {
  id: number;
  name: string;
  fileKey: string;
  startingPrice: number;
  endDate: Date;
}

export default function ItemList({ items }: { items: Item[] }) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item, index) => (
        <ItemCard key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}
