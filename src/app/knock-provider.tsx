'use client';

import { env } from '@/env';
import {
  KnockFeedProvider,
  KnockProvider,
} from '@knocklabs/react';
import { useSession } from 'next-auth/react';
// Required CSS import, unless you're overriding the styling

import { ReactNode, useRef, useState } from 'react';

export function AppKnockProviders ({children} : {children: ReactNode}){

    const session = useSession();

  return (
    <KnockProvider
      apiKey={env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY}
      user={{ id: session?.data?.user?.id ?? 'guest' }}
    >
      <KnockFeedProvider feedId={env.NEXT_PUBLIC_KNOCK_FEED_ID}>
          {children}
      </KnockFeedProvider>
    </KnockProvider>
  );
};
