'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createPictureActions } from './createPicture';
import { pageTitleStyles } from '@/styles';

interface Props {
  params: { locale: 'hu' | 'en' };
}

const translations = {
  en: {
    title: 'Post an Item',
    selectFile: 'Please select a file',
    namePlaceholder: 'Name of picture',
    uploadFailed: 'Upload failed',
    uploading: 'Uploading...',
    submit: 'Post picture',
    typeArt: 'Art',
    typeBlog: 'Blog',
    typeOther: 'Other',
  },
  hu: {
    title: 'Kép feltöltése',
    selectFile: 'Kérjük válasszon fájlt',
    namePlaceholder: 'Kép neve',
    uploadFailed: 'Feltöltés sikertelen',
    uploading: 'Feltöltés...',
    submit: 'Kép feltöltése',
    typeArt: 'Művészet',
    typeBlog: 'Blog',
    typeOther: 'Egyéb',
  },
};

export default function CreatePage({ params }: Props) {
  const { locale } = params;
  const t = translations[locale];

  const [loading, setLoading] = useState(false);

  return (
    <main className="space-y-8">
      <h1 className={pageTitleStyles}>{t.title}</h1>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const formData = new FormData(form);

          const file = formData.get('file') as File | null;
          if (!file) return alert(t.selectFile);

          const name = (formData.get('name') as string) || undefined;
          const type =
            (formData.get('type') as 'art' | 'blog' | 'other') || 'art';

          setLoading(true);

          try {
            await createPictureActions({ file, name, type });
            form.reset();
          } catch (err) {
            console.error(err);
            alert(t.uploadFailed);
          } finally {
            setLoading(false);
          }
        }}
      >
        <Input
          className="max-w-md"
          name="name"
          placeholder={t.namePlaceholder}
        />
        <Input type="file" name="file" required />

        <select name="type" className="border rounded px-2 py-1 mt-2">
          <option value="art">{t.typeArt}</option>
          <option value="blog">{t.typeBlog}</option>
          <option value="other">{t.typeOther}</option>
        </select>

        <Button className="self-end mt-2" type="submit" disabled={loading}>
          {loading ? t.uploading : t.submit}
        </Button>
      </form>
    </main>
  );
}