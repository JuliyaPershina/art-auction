'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createHeroPictureActions } from '@/app/pictures/create/createHeroPictureActions';
import { pageTitleStyles } from '@/styles';
import { Picture } from '@/types/picture';

const MAX_FILE_SIZE = 1 * 1024 * 1024;

export default function CreatePictureForm({
  onUpload,
}: {
  onUpload: (picture: Picture) => void;
}) {
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [fileSize, setFileSize] = useState<number | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    function formatSize(bytes: number) {
      return (bytes / 1024 / 1024).toFixed(2) + ' MB';
    }
    function handleFile(file: File) {
      if (file.size > MAX_FILE_SIZE) {
        setPreview(null);
        setFileSize(null);
        setMessage({ text: 'File must be smaller than 1MB', type: 'error' });
        return;
      }
      setFileSize(file.size);
      setPreview(URL.createObjectURL(file));
      setMessage(null);
    }
    // Автоматичне ховання повідомлення через 3 секунди
    useEffect(() => {
      if (message) {
        const timer = setTimeout(() => setMessage(null), 3000);
        return () => clearTimeout(timer);
      }
    }, [message]);
    return (
      <div className="w-full max-w-xl mx-auto bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-neutral-800">
        <h2 className={`${pageTitleStyles} text-center mb-6`}>Post a Picture</h2>
        {message && (
          <div
            className={`mb-4 px-4 py-2 rounded ${
              message.type === 'error'
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {message.text}
          </div>
        )}
        <form
          className="space-y-6"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const formData = new FormData(form);
            const file = formData.get('file') as File | null;
            if (!file) {
              setMessage({ text: 'Please select a file', type: 'error' });
              return;
            }
            if (file.size > MAX_FILE_SIZE) {
              setMessage({ text: 'File must be smaller than 1MB', type: 'error' });
              return;
            }
            const name = (formData.get('name') as string) || undefined;
            setLoading(true);
            try {
              const newPicture = await createHeroPictureActions({
                file,
                name,
                type: 'art',
              });

              onUpload(newPicture); // 🔥 передаємо в батька

              form.reset();
              setPreview(null);
              setFileSize(null);

              setMessage({
                text: 'Picture uploaded successfully 🎉',
                type: 'success',
              });
            } catch (err) {
              console.error(err);
              setMessage({ text: 'Upload failed', type: 'error' });
            } finally {
              setLoading(false);
            }
          }}
        >
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Picture Name</label>
            <Input name="name" placeholder="Enter picture name" />
          </div>
          {/* Drag & Drop */}
          <div
            className={`relative flex flex-col items-center justify-center w-full px-6 py-10 border-2 border-dashed rounded-xl transition
            ${
              dragActive
                ? 'border-black bg-gray-100 dark:bg-neutral-800'
                : 'border-gray-300 dark:border-neutral-700'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              const file = e.dataTransfer.files[0];
              if (file) {
                handleFile(file);
                if (fileInputRef.current) {
                  fileInputRef.current.files = e.dataTransfer.files;
                }
              }
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <p className="text-sm text-gray-500">
              Click or drag & drop image here
            </p>
            <input
              ref={fileInputRef}
              type="file"
              name="file"
              required
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </div>
          {/* File size */}
          {fileSize && (
            <p className="text-sm text-gray-500">File size: {formatSize(fileSize)}</p>
          )}
          {/* Preview */}
          {preview && (
            <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden border">
              <Image src={preview} alt="Preview" fill className="object-contain" />
            </div>
          )}
          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading || !preview || (fileSize ? fileSize > MAX_FILE_SIZE : true)}
            >
              {loading ? 'Uploading...' : 'Post Picture'}
            </Button>
          </div>
        </form>
      </div>
    );
  
}



