'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createPictureActions } from '@/app/pictures/create/createPicture';
import { pageTitleStyles } from '@/styles';

export default function CreatePictureForm({ onUpload }: { onUpload: () => void }) {
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
          const type = (formData.get('type') as 'art' | 'blog' | 'other') || 'art';

          setLoading(true);
          try {
            await createPictureActions({ file, name, type });
            form.reset();
            onUpload(); // Повідомляємо батька
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
}

// 'use client';
// import { useState } from 'react';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { createPictureActions } from '@/app/pictures/create/createPicture';
// import { pageTitleStyles } from '@/styles';

// interface Props {
//   onUpload: () => void; // повідомляємо батька про нову картинку
//   setOpen: (open: boolean) => void; // закриття форми після успіху
// }

// export default function CreatePictureForm({ onUpload, setOpen }: Props) {
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const form = e.currentTarget;
//     const formData = new FormData(form);

//     const file = formData.get('file') as File | null;
//     if (!file) return alert('Please select a file');

//     const name = (formData.get('name') as string) || undefined;
//     const type = (formData.get('type') as 'art' | 'blog' | 'other') || 'art';

//     setLoading(true);

//     try {
//       await createPictureActions({ file, name, type });

//       // Очистити форму
//       form.reset();

//       // Закрити форму
//       setOpen(false);

//       // Оновити галерею
//       onUpload();
//     } catch (err) {
//       console.error(err);
//       alert('Upload failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="space-y-2 border p-4 rounded shadow-md max-w-md mx-auto"
//     >
//       <h1 className={pageTitleStyles}>Post a Picture</h1>
//       <Input className="w-full" name="name" placeholder="Name of picture" />
//       <Input type="file" name="file" required className="w-full" />
//       <select name="type" className="border rounded px-2 py-1 w-full">
//         <option value="art">Art</option>
//         <option value="blog">Blog</option>
//         <option value="other">Other</option>
//       </select>
//       <Button type="submit" disabled={loading} className="w-full">
//         {loading ? 'Uploading...' : 'Upload'}
//       </Button>
//     </form>
//   );
// }



