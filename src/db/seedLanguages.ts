import { database } from './database';
import { languages } from './schema';

async function seed() {
  await database
    .insert(languages)
    .values([
      { code: 'en', name: 'English' },
      { code: 'hu', name: 'Magyar' },
    ])
    .onConflictDoNothing();

  console.log('Languages seeded');
  process.exit(0);
}

seed();
