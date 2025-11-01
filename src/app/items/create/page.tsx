import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createItemActions } from './actions';

export default async function CreatePage() {
  return (
    <main className="container mx-auto py-12 space-y-8">
      <h1 className="text-4xl font-bold">Post an Item</h1>

      <form
        className="flex flex-col border p-8 raunded-xl space-y-4 max-w-lg"
        action={createItemActions}
      >
        <Input className="max-w-md" name="name" placeholder="Name your item" required />
        <Input
          className="max-w-md"
          name="startingPrice"
          type='string'
          required
          placeholder="What to start your auction at?"
        />
        <Button className="self-end" type="submit">
          Post item
        </Button>
      </form>
    </main>
  );
}
