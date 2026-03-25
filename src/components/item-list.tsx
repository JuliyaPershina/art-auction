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
      {[...items]
        .sort((a, b) => {
          const now = new Date();

          const aActive = new Date(a.endDate) > now;
          const bActive = new Date(b.endDate) > now;

          // 1️⃣ активні вище
          if (aActive !== bActive) {
            return aActive ? -1 : 1;
          }

          // 2️⃣ новіші вище (по id або даті)
          return b.id - a.id;
        })
        .map((item, index) => (
          <ItemCard key={item.id} item={item} index={index} />
        ))}
    </div>
  );
}
