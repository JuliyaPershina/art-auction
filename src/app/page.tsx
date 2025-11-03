import { database } from '@/db/database';
import { auth } from '../../auth';
import ItemList from '@/components/item-list';

function getImageUrl(fileKey: string) {
  return;
}

export default async function HomePage() {
  const session = await auth();
  if (!session) return null;

  const allitems = await database.query.items.findMany();

  const user = session.user;
  if (!user) return null;

  return (
    <main className="container mx-auto py-12 space-y-8">
      <h1 className="text-4xl font-bold">Items For Sale</h1>

      <ItemList items={allitems} />
    </main>
  );
}
