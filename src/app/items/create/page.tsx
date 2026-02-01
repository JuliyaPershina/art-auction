'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  createItemActions,
} from './actions';
import { pageTitleStyles } from '@/styles';
import { DatePickerDemo } from '@/components/ui/date-picker';
import { useState } from 'react';

export default function CreatePage() {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <main className="space-y-8">
      <h1 className={pageTitleStyles}>Post an Item</h1>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!date) return;

          const form = e.currentTarget;
          const formData = new FormData(form);

          await createItemActions({
            file: formData.get('file') as File,
            name: formData.get('name') as string,
            startingPrice: Math.floor(
              parseFloat(formData.get('startingPrice') as string) * 100,
            ),
            endDate: date,
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
        <DatePickerDemo date={date} setDate={setDate} />
        <Button className="self-end" type="submit">
          Post item
        </Button>
      </form>
    </main>
  );
}
