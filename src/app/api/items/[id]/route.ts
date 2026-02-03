// import { NextResponse } from 'next/server';
// import { database } from '@/db/database';
// import { items } from '@/db/schema';
// import { eq } from 'drizzle-orm';
// import { deleteImageFromCloudinary } from '@/lib/cloudinary';
// import { auth } from '../../../../../auth';

// export async function DELETE(
//   req: Request,
//   { params }: { params: { id: string } },
// ) {
//   const session = await auth();
//   if (!session) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   const itemId = Number(params.id);
//   if (Number.isNaN(itemId)) {
//     return NextResponse.json({ error: 'Invalid item id' }, { status: 400 });
//   }

//   const item = await database.query.items.findFirst({
//     where: eq(items.id, itemId),
//   });

//   if (!item) {
//     return NextResponse.json({ error: 'Item not found' }, { status: 404 });
//   }

//   if (item.userId !== session.user.id) {
//     return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
//   }

//   await deleteImageFromCloudinary(item.fileKey);
//   await database.delete(items).where(eq(items.id, itemId));

//   return NextResponse.json({ success: true });
// }

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
  const { id } = await params;

  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const itemId = Number(id);
  if (Number.isNaN(itemId)) {
    return NextResponse.json({ error: 'Invalid item id' }, { status: 400 });
  }

  const item = await database.query.items.findFirst({
    where: eq(items.id, itemId),
  });

  if (!item) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  if (item.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await deleteImageFromCloudinary(item.fileKey);
  await database.delete(items).where(eq(items.id, itemId));

  return NextResponse.json({ success: true });
}
