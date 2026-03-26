import { Knock } from '@knocklabs/node';
import { env } from '@/env';

export const knock = new Knock({
  apiKey: env.KNOCK_SECRET_KEY,
});
