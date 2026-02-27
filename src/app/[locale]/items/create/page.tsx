'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  createItemActions,
} from './actions';
import { pageTitleStyles } from '@/styles';
import { DatePickerDemo } from '@/components/ui/date-picker';
import { useState } from 'react';

export default function CreatePage({ params }: { params: { locale: 'hu' | 'en' } }) {

  const { locale } = params;
  const t = {
    title: locale === 'hu' ? 'Új tétel feltöltése' : 'Post an Item',
    name: locale === 'hu' ? 'Tétel neve' : 'Name your item',
    price: locale === 'hu' ? 'Kezdő ár' : 'What to start your auction at?',
    post: locale === 'hu' ? 'Feltöltés' : 'Post item',
  };

  const [date, setDate] = useState<Date | undefined>();

  return (
    <main className="space-y-8">
      <h1 className={pageTitleStyles}>{t.title}</h1>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!date) return;

          const form = e.currentTarget;
          const formData = new FormData(form);

          await createItemActions(locale, {
            file: formData.get('file') as File,
            name: formData.get('name') as string,
            startingPrice: Math.floor(
              parseFloat(formData.get('startingPrice') as string) * 100,
            ),
            endDate: new Date(),
          });
        }}
      >
        <Input className="max-w-md" name="name" placeholder={t.name} required />
        <Input
          className="max-w-md"
          name="startingPrice"
          type="number"
          step="0.01"
          required
          placeholder={t.price}
        />
        <Input type="file" name="file" />
        <DatePickerDemo date={date} setDate={setDate} />
        <Button className="self-end" type="submit">
          {t.post}
        </Button>
      </form>
    </main>
  );
}
