import { database } from "@/db/database";
import { bids as bidsSchema } from '@/db/schema';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { revalidatePath } from "next/cache";

export default async function HomePage() {
const bids = await database.query.bids.findMany();

  return (
    <main className="container mx-auto py-12">
      <form action={async (formdata: FormData) => {
        'use server';
        // const bid = formdata.get('bid') as string;
        await database.insert(bidsSchema).values({});
        revalidatePath('/');
      }}>
        <Input name="bid" placeholder="Bid" />
        <Button type="submit">Place Bid</Button>
      </form>

      {bids.map((bid) => (
        <div key={bid.id}>{bid.id }</div>
      ))}
    </main>

    
  );
}