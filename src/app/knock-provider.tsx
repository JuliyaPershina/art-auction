'use client';

import { env } from '@/env';
import { KnockFeedProvider, KnockProvider } from '@knocklabs/react';
import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';

export function AppKnockProviders({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  // 🛑 Поки сесія вантажиться — нічого не рендеримо
  if (status === 'loading') {
    return <>{children}</>;
  }

  // 🛑 Якщо користувач НЕ залогінений — не підключаємо Knock
  if (!session?.user?.id) {
    return <>{children}</>;
  }

  // ✅ Підключаємо Knock тільки для реального користувача
  return (
    <KnockProvider
      apiKey={env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY}
      user={{
        id: String(session.user.id), // 👈 важливо як string
      }}
    >
      <KnockFeedProvider feedId={env.NEXT_PUBLIC_KNOCK_FEED_ID}>
        {children}
      </KnockFeedProvider>
    </KnockProvider>
  );
}
