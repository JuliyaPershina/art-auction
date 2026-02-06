import { database } from '@/db/database';
import { auth } from '../../../auth';
import ItemList from '@/components/item-list';
import { pageTitleStyles } from '@/styles';

export default async function HomePage() {
  const session = await auth(); // може бути null
  const allitems = await database.query.items.findMany();

  return (
    <main className="space-y-8">
      <h1 className={pageTitleStyles}>Items For Sale</h1>

      {/* показуємо список усім */}
      <ItemList items={allitems} />

      {/* додаткові функції — лише для авторизованих */}
      {session?.user ? (
        <div className="text-right">
          <p className="text-gray-600">Signed in as {session.user.name}</p>
        </div>
      ) : (
        <div className="text-gray-500 italic text-center mt-6">
          Sign in to place a bid.
        </div>
      )}
    </main>
  );
}