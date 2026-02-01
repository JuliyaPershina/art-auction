// import { NextResponse } from 'next/server';
// import { getSignedReadUrlForR2Object } from '@/lib/r2';

// export async function GET(
//   req: Request,
//   context: { params: Promise<{ key: string }> }
// ) {
//   const { key } = await context.params; // 👈 треба await

//   try {
//     const url = await getSignedReadUrlForR2Object(key);
//     if (!url) {
//       return NextResponse.json({ error: 'Not found' }, { status: 404 });
//     }

//     return NextResponse.json({ url });
//   } catch (err) {
//     console.error('Error fetching signed URL:', err);
//     return NextResponse.json(
//       { error: 'Failed to get signed URL' },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from 'next/server';
import { getSignedReadUrlForR2Object } from '@/lib/r2';

export async function GET(req: Request, context: { params: { key: string } }) {
  const { key } = context.params; // 👈 без await

  try {
    const url = await getSignedReadUrlForR2Object(key);

    if (!url) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ url });
  } catch (err) {
    console.error('Error fetching signed URL:', err);
    return NextResponse.json(
      { error: 'Failed to get signed URL' },
      { status: 500 },
    );
  }
}

