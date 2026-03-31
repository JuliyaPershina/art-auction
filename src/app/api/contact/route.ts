// import { NextResponse } from 'next/server';
// import { z } from 'zod';

// const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xjgpblvo';

// /**
//  * ✅ Zod schema (server-side validation)
//  */
// const schema = z.object({
//   name: z.string().min(2).max(100),
//   email: z.email().max(150),
//   subject: z.string().min(3).max(200),
//   message: z.string().min(10).max(5000),

//   // anti-bot fields
//   _gotcha: z.string().optional(),
//   timestamp: z.number().optional(),
// });

// /**
//  * ✅ Simple text sanitization (no external libs)
//  */
// function sanitizeText(input: string) {
//   return input
//     .replace(/<[^>]*>/g, '') // remove HTML tags
//     .replace(/javascript:/gi, '') // remove JS links
//     .trim();
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     // ✅ Validate structure
//     const parsed = schema.safeParse(body);

//     if (!parsed.success) {
//       return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
//     }

//     const data = parsed.data;

//     // ✅ Honeypot check (bot detection)
//     if (data._gotcha && data._gotcha.length > 0) {
//       return NextResponse.json({ error: 'Bot detected' }, { status: 400 });
//     }

//     // ✅ Timing check (anti-bot)
//     if (data.timestamp) {
//       const now = Date.now();
//       const diff = now - data.timestamp;

//       // if form submitted too fast (< 2 seconds)
//       if (diff < 2000) {
//         return NextResponse.json(
//           { error: 'Too fast submission' },
//           { status: 400 },
//         );
//       }
//     }

//     // ✅ Extra validation (business rules)
//     const emailDomain = data.email.split('@')[1]?.toLowerCase();

//     // optional: block suspicious disposable domains (basic example)
//     const blockedDomains = ['tempmail.com', 'mailinator.com'];
//     if (emailDomain && blockedDomains.includes(emailDomain)) {
//       return NextResponse.json(
//         { error: 'Disposable email not allowed' },
//         { status: 400 },
//       );
//     }

//     // ✅ Sanitize inputs
//     const safeData = {
//       name: sanitizeText(data.name),
//       email: sanitizeText(data.email),
//       subject: sanitizeText(data.subject),
//       message: sanitizeText(data.message),
//     };

//     // ✅ Forward to Formspree
//     const formspreeRes = await fetch(FORMSPREE_ENDPOINT, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//       },
//       body: JSON.stringify(safeData),
//     });

//     if (!formspreeRes.ok) {
//       return NextResponse.json(
//         { error: 'Form submission failed' },
//         { status: 500 },
//       );
//     }

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import { z } from 'zod';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xjgpblvo';

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(150), // ✅ FIX HERE
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),

  _gotcha: z.string().optional(),
  timestamp: z.number().optional(),
});

function sanitizeText(input: string) {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .trim();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      console.log(parsed.error.issues); // 👈 важливо для дебагу
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const data = parsed.data;

    if (data._gotcha) {
      return NextResponse.json({ error: 'Bot detected' }, { status: 400 });
    }

    if (data.timestamp) {
      const diff = Date.now() - data.timestamp;
      if (diff < 2000) {
        return NextResponse.json(
          { error: 'Too fast submission' },
          { status: 400 },
        );
      }
    }

    const safeData = {
      name: sanitizeText(data.name),
      email: sanitizeText(data.email),
      subject: sanitizeText(data.subject),
      message: sanitizeText(data.message),
    };

    const formData = new FormData();
    formData.append('name', safeData.name);
    formData.append('email', safeData.email);
    formData.append('subject', safeData.subject);
    formData.append('message', safeData.message);

    const formspreeRes = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: formData,
    });

    const text = await formspreeRes.text();
    console.log('Formspree response:', text);

    if (!formspreeRes.ok) {
      return NextResponse.json({ error: text }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API ERROR:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
    
}