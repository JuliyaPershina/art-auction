import { pageTitleStyles } from '@/styles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createBlogPostAction } from './createBlogPostAction';

export default function CreateBlogPage() {
  return (
    <main className="space-y-8">
      <h1 className={pageTitleStyles}>Create Blog Post</h1>

      <form
        action={createBlogPostAction}
        className="space-y-6 max-w-2xl"
      >
        <Input name="title" placeholder="Post title" required />

        <Textarea name="excerpt" placeholder="Short description" rows={3} />

        <Textarea
          name="content"
          placeholder="Full article content"
          rows={10}
          required
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">Cover Image</label>
          <Input type="file" name="coverImage" accept="image/*" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Gallery Images</label>
          <Input type="file" name="images" accept="image/*" multiple />
        </div>

        <Button type="submit">Create Post</Button>
      </form>
    </main>
  );
}

