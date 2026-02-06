'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createPictureActions } from './createPicture';
import { pageTitleStyles } from '@/styles';
// import dynamic from 'next/dynamic';

const CreatePage = ({ onUpload }: { onUpload: () => void }) => {
  const [loading, setLoading] = useState(false);

  return (
    <main className="space-y-8">
      <h1 className={pageTitleStyles}>Post an Item</h1>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const formData = new FormData(form);

          const file = formData.get('file') as File | null;
          if (!file) return alert('Please select a file');

          const name = (formData.get('name') as string) || undefined;
          const type =
            (formData.get('type') as 'art' | 'blog' | 'other') || 'art';

          setLoading(true);

          try {
            await createPictureActions({ file, name, type });

            // Після успішного завантаження
            form.reset(); // Очистити форму
            onUpload(); // Повідомити батька про оновлення галереї
          } catch (err) {
            console.error(err);
            alert('Upload failed');
          } finally {
            setLoading(false);
          }
        }}
      >
        <Input className="max-w-md" name="name" placeholder="Name of picture" />
        <Input type="file" name="file" required />
        <select name="type" className="border rounded px-2 py-1 mt-2">
          <option value="art">Art</option>
          <option value="blog">Blog</option>
          <option value="other">Other</option>
        </select>
        <Button className="self-end mt-2" type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Post picture'}
        </Button>
      </form>
    </main>
  );
};

export default CreatePage;
