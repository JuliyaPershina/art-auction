'use client';
import { pageTitleStyles } from '@/styles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createBlogPostAction } from './createBlogPostAction';
import { useState } from 'react';
import Image from 'next/image';

const MAX_SIZE = 1 * 1024 * 1024; // 1MB

function formatSize(bytes: number) {
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

export default function CreateBlogPage() {
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryPreview, setGalleryPreview] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validateFile(file: File) {
    if (file.size > MAX_SIZE) {
      return `File ${file.name} is too large (${formatSize(file.size)}). Max 1MB`;
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
      setCoverPreview(null);
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
        setGalleryPreview([]);
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
      setError(err.message || 'Upload failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  const isDisabled = !!error || isSubmitting;
  return (
    <main className="space-y-8 px-6 pb-16 pt-6">
      <h1 className={pageTitleStyles}>Create Blog Post</h1>

      <form action={handleSubmit} className="space-y-6 max-w-2xl">
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Input name="title" placeholder="Post title" required />

        <Textarea name="excerpt" placeholder="Short description" rows={3} />

        <Textarea
          name="content"
          placeholder="Full article content"
          rows={10}
          required
        />

        {error && (
          <div className="text-red-500 text-sm bg-red-100 p-3 rounded">
            {error}
          </div>
        )}

        {/* Cover */}

        <div className="space-y-2">
          <label className="text-sm font-medium ">Cover Image</label>
          <input
            type="file"
            name="coverImage"
            accept="image/*"
            onChange={handleCoverChange}
            className="w-full px-3 mt-2 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-stone-300 focus:border-stone-300"
          />
          {coverPreview && (
            <div className="mt-3">
              <Image
                src={coverPreview}
                alt="Cover preview"
                width={300}
                height={200}
                className="rounded-lg object-cover"
                unoptimized
              />
            </div>
          )}
        </div>

        {/* Gallery */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Gallery Images</label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleGalleryChange}
            className="w-full px-3 mt-2 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-stone-300 focus:border-stone-300"
          />
          {galleryPreview.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              {galleryPreview.map((src, index) => (
                <Image
                  key={index}
                  src={src}
                  alt="Preview"
                  width={150}
                  height={100}
                  className="rounded object-cover"
                  unoptimized
                />
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className={`px-6 py-2 rounded-md text-white ${
            isDisabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-black hover:bg-gray-800'
          }`}
        >
          {isSubmitting ? 'Uploading...' : 'Create Post'}
        </button>
      </form>
    </main>
  );
}
