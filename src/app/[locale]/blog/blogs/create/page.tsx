'use client';

import { pageTitleStyles } from '@/styles';
import { createBlogPostAction } from './createBlogPostAction';
import { useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

const MAX_SIZE = 1 * 1024 * 1024;

export default function CreateBlogPage() {
  const { locale } = useParams() as { locale: 'en' | 'hu' };

  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryPreview, setGalleryPreview] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validateFile(file: File) {
    if (file.size > MAX_SIZE) {
      return `File ${file.name} is too large (max 1MB)`;
    }
    return null;
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError('');
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setCoverPreview(URL.createObjectURL(file));
  }

  function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError('');
    const files = Array.from(e.target.files || []);

    const previews: string[] = [];

    for (const file of files) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      previews.push(URL.createObjectURL(file));
    }

    setGalleryPreview(previews);
  }

  async function handleSubmit(formData: FormData) {
    if (error) return;

    try {
      setIsSubmitting(true);
      await createBlogPostAction(formData);
    } catch (err: any) {
      setError(err.message ?? 'Upload failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="space-y-8 px-6 pb-16 pt-6">
      <h1 className={pageTitleStyles}>Create Blog Post</h1>

      <form action={handleSubmit} className="space-y-6 max-w-2xl">
        <input type="hidden" name="locale" value={locale} />

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <input name="titleEn" placeholder="Title (English)" required />
        <input name="titleHu" placeholder="Title (Hungarian)" required />

        <textarea name="excerptEn" placeholder="Excerpt (English)" rows={3} />
        <textarea name="excerptHu" placeholder="Excerpt (Hungarian)" rows={3} />

        <textarea
          name="contentEn"
          placeholder="Content (English)"
          required
          rows={10}
        />
        <textarea
          name="contentHu"
          placeholder="Content (Hungarian)"
          required
          rows={10}
        />

        <div>
          <label>Cover Image</label>
          <input
            type="file"
            name="coverImage"
            accept="image/*"
            onChange={handleCoverChange}
          />

          {coverPreview && (
            <Image
              src={coverPreview}
              alt="Preview"
              width={300}
              height={200}
              unoptimized
            />
          )}
        </div>

        <div>
          <label>Gallery Images</label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleGalleryChange}
          />

          {galleryPreview.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              {galleryPreview.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt="Preview"
                  width={150}
                  height={100}
                  unoptimized
                />
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-black text-white rounded"
        >
          {isSubmitting ? 'Uploading...' : 'Create Post'}
        </button>
      </form>
    </main>
  );
}
