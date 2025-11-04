'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  createItemActions,
  createUploadUrlAction,
  getImageUrlAction,
} from './actions';
import { pageTitleStyles } from '@/styles';

export default function CreatePage() {

  return (
    <main className="space-y-8">
      <h1 className={pageTitleStyles}>Post an Item</h1>

      <form
        className="flex flex-col border p-8 raunded-xl space-y-4 max-w-lg"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget as HTMLFormElement;
          const formData = new FormData(form);
          const file = formData.get('file') as File;
          const uploadUrl = await createUploadUrlAction(file.name, file.type);
          const uploadFormData = new FormData();
          uploadFormData.append('file', file);

          await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
            headers: { 'Content-Type': file.type },
          });

          const name = formData.get('name') as string;

          const startingPrice = parseFloat(
            formData.get('startingPrice') as string
          );
          const startingPriceInCents = Math.floor(startingPrice * 100);

          await createItemActions({
            fileKey: file.name,
            name,
            startingPrice: startingPriceInCents,
          });
        }}
      >
        <Input
          className="max-w-md"
          name="name"
          placeholder="Name your item"
          required
        />
        <Input
          className="max-w-md"
          name="startingPrice"
          type="number"
          step="0.01"
          required
          placeholder="What to start your auction at?"
        />
        <Input type="file" name="file" />
        <Button className="self-end" type="submit">
          Post item
        </Button>
      </form>
    </main>
  );
}
