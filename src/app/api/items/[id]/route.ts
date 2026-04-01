import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/db/database';
import { items } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { deleteImageFromCloudinary } from '@/lib/cloudinary';
import { auth } from '../../../../../auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
     const { id } = await params; 
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const itemId = Number(id);

    if (Number.isNaN(itemId)) {
      return NextResponse.json({ error: 'Invalid item id' }, { status: 400 });
    }

    // 🔹 1. знайти item
    const item = await database.query.items.findFirst({
      where: eq(items.id, itemId),
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // 🔹 2. перевірка прав
    if (item.userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 🔹 3. видалити картинку (НЕ блокує delete)
    if (item.fileKey) {
      try {
        await deleteImageFromCloudinary(item.fileKey);
      } catch (err) {
        console.error('Cloudinary delete failed:', err);
        // ❗ не зупиняємо процес
      }
    }

    // 🔹 4. видалити item (cascade зробить інше)
    await database.delete(items).where(eq(items.id, itemId));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE ITEM ERROR:', err);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}