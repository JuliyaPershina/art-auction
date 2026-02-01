'use server';

import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/db/database';
import { items } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { deleteImageFromCloudinary } from '@/lib/cloudinary';
import { auth } from '../../../../../auth';


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const itemId = parseInt(params.id);

    // Знаходимо айтем
    const item = await database.query.items.findFirst({
      where: eq(items.id, itemId),
    });

    if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

    // Перевіряємо, чи користувач — власник
    if (item.userId !== session.user.id)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // 🔹 Видаляємо фото з Cloudinary
    await deleteImageFromCloudinary(item.fileKey);

    // 🔹 Видаляємо айтем з бази (cascade видалить всі ставки)
    await database.delete(items).where(eq(items.id, itemId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete item error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
