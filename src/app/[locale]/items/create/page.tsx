'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createItemActions } from './actions';
import { pageTitleStyles } from '@/styles';
import { DatePickerDemo } from '@/components/ui/date-picker';
import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function CreatePage() {
  const { locale } = useParams() as { locale: 'hu' | 'en' };

  const [date, setDate] = useState<Date | undefined>();

  return (
    <main className="space-y-10 p-10 max-w-3xl mx-auto">
      <h1 className={pageTitleStyles}>
        {locale === 'hu' ? 'Új aukció létrehozása' : 'Create Auction Item'}
      </h1>

      <form
        className="space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!date) return;

          const formData = new FormData(e.currentTarget);

          await createItemActions(locale, {
            file: formData.get('file') as File,
            nameEn: formData.get('nameEn') as string,
            nameHu: formData.get('nameHu') as string,
            startingPrice: Math.floor(
              parseFloat(formData.get('startingPrice') as string) * 100,
            ),
            endDate: date,
          });
        }}
      >
        {/* EN */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg">English</h2>
          <Input name="nameEn" placeholder="Item name (English)" required />
        </div>

        {/* HU */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg">Hungarian</h2>
          <Input name="nameHu" placeholder="Tétel neve (magyar)" required />
        </div>

        <div className="space-y-3">
          <Input
            name="startingPrice"
            type="number"
            step="0.01"
            placeholder="Starting price"
            required
          />

          <Input type="file" name="file" required />
          <DatePickerDemo date={date} setDate={setDate} />
        </div>

        <div className="flex justify-end">
          <Button type="submit">
            {locale === 'hu' ? 'Létrehozás' : 'Create Item'}
          </Button>
        </div>
      </form>
    </main>
  );
}