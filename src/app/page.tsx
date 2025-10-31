import { database } from '@/db/database';
import { bids as bidsSchema, items } from '@/db/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { revalidatePath } from 'next/cache';
import SignIn from '@/components/sign-in';
import { SignOut } from '@/components/signout-button';
import { auth } from '../../auth';

export default async function HomePage() {
  const session = await auth();
  if (!session) return null;

  const allitems = await database.query.items.findMany();

  const user = session.user;
  if (!user) return null;

  return (
    <main className="container mx-auto py-12">

      {session ? <SignOut /> : <SignIn />}

      {session?.user?.name}

      <form
        action={async (formdata: FormData) => {
          'use server';

          await database.insert(items).values({
            name: formdata.get('name') as string,
            userId: session?.user?.id!,
          });
          revalidatePath('/');
        }}
      >
        <Input name="name" placeholder="Name your item" />
        <Button type="submit">Post item</Button>
      </form>

      {allitems.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </main>
  );
}
