import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().refine(
      (val) => {
        try {
          new URL(val); // просто перевіряє, чи це валідний URL
          return true;
        } catch {
          return false;
        }
      },
      { message: 'DATABASE_URL має бути валідним URL' }
    ),
    NODE_ENV: z.string().min(1),
  },
  client: {},
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL,
  },
});
