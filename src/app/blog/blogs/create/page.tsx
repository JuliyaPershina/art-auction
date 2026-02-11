'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";
import { createBlogPostAction } from './createBlogPostAction';
import { pageTitleStyles } from '@/styles';

export default function CreateBlogPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <main className="space-y-8">
      <h1 className={pageTitleStyles}>Create Blog Post</h1>

      <form
        className="space-y-6 max-w-2xl"
        onSubmit={async (e) => {
          e.preventDefault();
          setIsLoading(true);

          const form = e.currentTarget;
          const formData = new FormData(form);

          await createBlogPostAction({
            title: formData.get('title') as string,
            excerpt: formData.get('excerpt') as string,
            content: formData.get('content') as string,
            coverImage: formData.get('coverImage') as File,
          });

          setIsLoading(false);
        }}
      >
        <Input name="title" placeholder="Post title" required />

        <Textarea
          name="excerpt"
          placeholder="Short description for blog feed"
          rows={3}
        />

        <Textarea
          name="content"
          placeholder="Full article content (HTML or Markdown)"
          rows={10}
          required
        />

        <Input type="file" name="coverImage" accept="image/*" />

        <Button type="submit" disabled={isLoading} className="self-end">
          {isLoading ? 'Creating...' : 'Create Post'}
        </Button>
      </form>
    </main>
  );
}

