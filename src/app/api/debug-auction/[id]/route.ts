import { NextResponse } from 'next/server';
import { handleAuctionEnd } from '@/lib/auction';

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }, // 👈 ВАЖЛИВО
) {
  const params = await context.params; // 👈 ВАЖЛИВО

  console.log('PARAMS:', params);

  const itemId = Number(params.id);

  console.log('PARSED ID:', itemId);

  if (isNaN(itemId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  await handleAuctionEnd(itemId);

  return NextResponse.json({
    success: true,
    itemId,
  });
}

// http://localhost:3000/api/debug-auction/18
