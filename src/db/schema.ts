// import {
//   boolean,
//   integer,
//   pgTable,
//   primaryKey,
//   serial,
//   text,
//   timestamp,
//   real,
// } from 'drizzle-orm/pg-core';
// import type { AdapterAccountType } from '@auth/core/adapters';
// import { relations } from 'drizzle-orm';

// export const playingWithNeon = pgTable('playing_with_neon', {
//   id: serial('id').primaryKey(),
//   name: text('name'),
//   value: real('value'),
// });

// export const users = pgTable('bb_user', {
//   id: text('id')
//     .primaryKey()
//     .$defaultFn(() => crypto.randomUUID()),
//   name: text('name'),
//   email: text('email').unique(),
//   emailVerified: timestamp('emailVerified', { mode: 'date' }),
//   image: text('image'),
//   role: text('role').notNull().default('user'),
// });

// export const accounts = pgTable(
//   'bb_account',
//   {
//     userId: text('userId')
//       .notNull()
//       .references(() => users.id, { onDelete: 'cascade' }),
//     type: text('type').$type<AdapterAccountType>().notNull(),
//     provider: text('provider').notNull(),
//     providerAccountId: text('providerAccountId').notNull(),
//     refresh_token: text('refresh_token'),
//     access_token: text('access_token'),
//     expires_at: integer('expires_at'),
//     token_type: text('token_type'),
//     scope: text('scope'),
//     id_token: text('id_token'),
//     session_state: text('session_state'),
//   },
//   (account) => [
//     {
//       compoundKey: primaryKey({
//         columns: [account.provider, account.providerAccountId],
//       }),
//     },
//   ],
// );

// export const sessions = pgTable('bb_session', {
//   sessionToken: text('sessionToken').primaryKey(),
//   userId: text('userId')
//     .notNull()
//     .references(() => users.id, { onDelete: 'cascade' }),
//   expires: timestamp('expires', { mode: 'date' }).notNull(),
// });

// export const verificationTokens = pgTable(
//   'bb_verificationToken',
//   {
//     identifier: text('identifier').notNull(),
//     token: text('token').notNull(),
//     expires: timestamp('expires', { mode: 'date' }).notNull(),
//   },
//   (verificationToken) => [
//     {
//       compositePk: primaryKey({
//         columns: [verificationToken.identifier, verificationToken.token],
//       }),
//     },
//   ],
// );

// export const authenticators = pgTable(
//   'bb_authenticator',
//   {
//     credentialID: text('credentialID').notNull().unique(),
//     userId: text('userId')
//       .notNull()
//       .references(() => users.id, { onDelete: 'cascade' }),
//     providerAccountId: text('providerAccountId').notNull(),
//     credentialPublicKey: text('credentialPublicKey').notNull(),
//     counter: integer('counter').notNull(),
//     credentialDeviceType: text('credentialDeviceType').notNull(),
//     credentialBackedUp: boolean('credentialBackedUp').notNull(),
//     transports: text('transports'),
//   },
//   (authenticator) => [
//     {
//       compositePK: primaryKey({
//         columns: [authenticator.userId, authenticator.credentialID],
//       }),
//     },
//   ],
// );

// export const items = pgTable('bb_item', {
//   id: serial('id').primaryKey(),
//   userId: text('userId')
//     .notNull()
//     .references(() => users.id, { onDelete: 'cascade' }),
//   name: text('name').notNull(),
//   fileKey: text('fileKey').notNull(),
//   currentBid: integer('currentBid').notNull().default(0),
//   startingPrice: integer('startingPrice').notNull().default(0),
//   bidInterval: integer('bidInterval').notNull().default(100),
//   endDate: timestamp('endDate', { mode: 'date' }).notNull(),
// });

//   export const pictures = pgTable('bb_picture', {
//     id: serial('id').primaryKey(),

//     userId: text('userId')
//       .notNull()
//       .references(() => users.id, { onDelete: 'cascade' }),

//     fileKey: text('fileKey').notNull(), // Cloudinary public_id
//     name: text('name'), // необовʼязково

//     type: text('type').notNull().default('art'),
//     // 'art' | 'blog' | 'other'

//     createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
//   });

// export const bids = pgTable('bb_bids', {
//   id: serial('id').primaryKey(),
//   amount: integer('amount').notNull(),
//   itemId: integer('itemId')
//     .notNull()
//     .references(() => items.id, { onDelete: 'cascade' }),
//   userId: text('userId')
//     .notNull()
//     .references(() => users.id, { onDelete: 'cascade' }),
//   timestamp: timestamp('timestamp', { mode: 'date' }).notNull().defaultNow(),
// });

// export const usersRelations = relations(bids, ({ one }) => ({
//   user: one(users, {
//     fields: [bids.userId],
//     references: [users.id],
//   }),
// }));

// // Таблиця постів блогу
// export const blogPosts = pgTable('bb_blog_post', {
//   id: serial('id').primaryKey(),

//   authorId: text('authorId')
//     .notNull()
//     .references(() => users.id, { onDelete: 'cascade' }),

//   title: text('title').notNull(),

//   excerpt: text('excerpt'), // короткий опис для лєнти

//   content: text('content').notNull(),
//   // довгий текст (markdown або HTML)

//   slug: text('slug').notNull().unique(),

//   coverImageKey: text('coverImageKey'),
//   // Cloudinary public_id (опційно)

//   publishedAt: timestamp('publishedAt', { mode: 'date' })
//     .notNull()
//     .defaultNow(),

//   createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),

//   updatedAt: timestamp('updatedAt', { mode: 'date' }),

//   isPublished: boolean('isPublished').notNull().default(true),
// });

// // Фото в статтях
// export const blogPostPictures = pgTable('bb_blog_post_picture', {
//   id: serial('id').primaryKey(),

//   postId: integer('postId')
//     .notNull()
//     .references(() => blogPosts.id, { onDelete: 'cascade' }),

//   pictureId: integer('pictureId')
//     .notNull()
//     .references(() => pictures.id, { onDelete: 'cascade' }),

//   order: integer('order').notNull().default(0),
// });

// // Relations
// export const blogPostsRelations = relations(blogPosts, ({ one, many }) => ({
//   author: one(users, {
//     fields: [blogPosts.authorId],
//     references: [users.id],
//   }),
//   images: many(blogPostPictures),
// }));

// export const blogPostPicturesRelations = relations(
//   blogPostPictures,
//   ({ one }) => ({
//     post: one(blogPosts, {
//       fields: [blogPostPictures.postId],
//       references: [blogPosts.id],
//     }),
//     picture: one(pictures, {
//       fields: [blogPostPictures.pictureId],
//       references: [pictures.id],
//     }),
//   }),
// );

// export type Item = typeof items.$inferSelect;
// export type BlogPost = typeof blogPosts.$inferSelect;
// export type NewBlogPost = typeof blogPosts.$inferInsert;

// import {
//   boolean,
//   integer,
//   pgTable,
//   primaryKey,
//   serial,
//   text,
//   timestamp,
//   real,
// } from 'drizzle-orm/pg-core';
// import type { AdapterAccountType } from '@auth/core/adapters';
// import { relations } from 'drizzle-orm';

// /* =========================
//    USERS + AUTH
// ========================= */

// export const users = pgTable('bb_user', {
//   id: text('id')
//     .primaryKey()
//     .$defaultFn(() => crypto.randomUUID()),
//   name: text('name'),
//   email: text('email').unique(),
//   emailVerified: timestamp('emailVerified', { mode: 'date' }),
//   image: text('image'),
//   role: text('role').notNull().default('user'),
// });

// export const accounts = pgTable(
//   'bb_account',
//   {
//     userId: text('userId')
//       .notNull()
//       .references(() => users.id, { onDelete: 'cascade' }),
//     type: text('type').$type<AdapterAccountType>().notNull(),
//     provider: text('provider').notNull(),
//     providerAccountId: text('providerAccountId').notNull(),
//     refresh_token: text('refresh_token'),
//     access_token: text('access_token'),
//     expires_at: integer('expires_at'),
//     token_type: text('token_type'),
//     scope: text('scope'),
//     id_token: text('id_token'),
//     session_state: text('session_state'),
//   },
//   (account) => ({
//     compoundKey: primaryKey({
//       columns: [account.provider, account.providerAccountId],
//     }),
//   }),
// );

// export const sessions = pgTable('bb_session', {
//   sessionToken: text('sessionToken').primaryKey(),
//   userId: text('userId')
//     .notNull()
//     .references(() => users.id, { onDelete: 'cascade' }),
//   expires: timestamp('expires', { mode: 'date' }).notNull(),
// });

// export const verificationTokens = pgTable(
//   'bb_verificationToken',
//   {
//     identifier: text('identifier').notNull(),
//     token: text('token').notNull(),
//     expires: timestamp('expires', { mode: 'date' }).notNull(),
//   },
//   (t) => ({
//     compositePk: primaryKey({ columns: [t.identifier, t.token] }),
//   }),
// );

// /* =========================
//    LANGUAGES
// ========================= */

// export const languages = pgTable('bb_language', {
//   code: text('code').primaryKey(), // 'en', 'hu'
//   name: text('name').notNull(),
// });

// /* =========================
//    ITEMS
// ========================= */

// export const items = pgTable('bb_item', {
//   id: serial('id').primaryKey(),

//   userId: text('userId')
//     .notNull()
//     .references(() => users.id, { onDelete: 'cascade' }),

//   fileKey: text('fileKey').notNull(),

//   currentBid: integer('currentBid').notNull().default(0),
//   startingPrice: integer('startingPrice').notNull().default(0),
//   bidInterval: integer('bidInterval').notNull().default(100),
//   endDate: timestamp('endDate', { mode: 'date' }).notNull(),
// });

// /* ===== ITEM TRANSLATIONS ===== */

// export const itemTranslations = pgTable(
//   'bb_item_translation',
//   {
//     itemId: integer('itemId')
//       .notNull()
//       .references(() => items.id, { onDelete: 'cascade' }),

//     languageCode: text('languageCode')
//       .notNull()
//       .references(() => languages.code, { onDelete: 'cascade' }),

//     name: text('name').notNull(),
//   },
//   (t) => ({
//     pk: primaryKey({ columns: [t.itemId, t.languageCode] }),
//   }),
// );

// /* =========================
//    BIDS
// ========================= */

// export const bids = pgTable('bb_bids', {
//   id: serial('id').primaryKey(),
//   amount: integer('amount').notNull(),

//   itemId: integer('itemId')
//     .notNull()
//     .references(() => items.id, { onDelete: 'cascade' }),

//   userId: text('userId')
//     .notNull()
//     .references(() => users.id, { onDelete: 'cascade' }),

//   timestamp: timestamp('timestamp', { mode: 'date' }).notNull().defaultNow(),
// });

// export const bidRelations = relations(bids, ({ one }) => ({
//   item: one(items, {
//     fields: [bids.itemId],
//     references: [items.id],
//   }),
//   user: one(users, {
//     fields: [bids.userId],
//     references: [users.id],
//   }),
// }));

// /* =========================
//    BLOG
// ========================= */

// export const blogPosts = pgTable('bb_blog_post', {
//   id: serial('id').primaryKey(),

//   authorId: text('authorId')
//     .notNull()
//     .references(() => users.id, { onDelete: 'cascade' }),

//   slug: text('slug').notNull().unique(),
//   coverImageKey: text('coverImageKey'),

//   publishedAt: timestamp('publishedAt', { mode: 'date' })
//     .notNull()
//     .defaultNow(),

//   createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
//   updatedAt: timestamp('updatedAt', { mode: 'date' }),
//   isPublished: boolean('isPublished').notNull().default(true),
// });

// /* ===== BLOG TRANSLATIONS ===== */

// export const blogPostTranslations = pgTable(
//   'bb_blog_post_translation',
//   {
//     postId: integer('postId')
//       .notNull()
//       .references(() => blogPosts.id, { onDelete: 'cascade' }),

//     languageCode: text('languageCode')
//       .notNull()
//       .references(() => languages.code, { onDelete: 'cascade' }),

//     title: text('title').notNull(),
//     excerpt: text('excerpt'),
//     content: text('content').notNull(),
//   },
//   (t) => ({
//     pk: primaryKey({ columns: [t.postId, t.languageCode] }),
//   }),
// );

// /* =========================
//    RELATIONS
// ========================= */

// export const itemRelations = relations(items, ({ many }) => ({
//   translations: many(itemTranslations),
//   bids: many(bids),
// }));

// export const itemTranslationRelations = relations(
//   itemTranslations,
//   ({ one }) => ({
//     item: one(items, {
//       fields: [itemTranslations.itemId],
//       references: [items.id],
//     }),
//   }),
// );

// export const blogPostRelations = relations(blogPosts, ({ many, one }) => ({
//   translations: many(blogPostTranslations),
//   author: one(users, {
//     fields: [blogPosts.authorId],
//     references: [users.id],
//   }),
// }));

// export const blogPostTranslationRelations = relations(
//   blogPostTranslations,
//   ({ one }) => ({
//     post: one(blogPosts, {
//       fields: [blogPostTranslations.postId],
//       references: [blogPosts.id],
//     }),
//   }),
// );

// /* =========================
//    TYPES
// ========================= */

// export type Item = typeof items.$inferSelect;
// export type ItemTranslation = typeof itemTranslations.$inferSelect;
// export type BlogPost = typeof blogPosts.$inferSelect;
// export type BlogPostTranslation = typeof blogPostTranslations.$inferSelect;

import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  real,
} from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from '@auth/core/adapters';
import { relations } from 'drizzle-orm';

export const playingWithNeon = pgTable('playing_with_neon', {
  id: serial('id').primaryKey(),
  name: text('name'),
  value: real('value'),
});

export const users = pgTable('bb_user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  role: text('role').notNull().default('user'),
});

export const accounts = pgTable(
  'bb_account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ],
);

export const sessions = pgTable('bb_session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'bb_verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ],
);

export const authenticators = pgTable(
  'bb_authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: boolean('credentialBackedUp').notNull(),
    transports: text('transports'),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ],
);

/* =========================
   LANGUAGES
========================= */

export const languages = pgTable('bb_language', {
  code: text('code').primaryKey(), // 'en', 'hu'
  name: text('name').notNull(),
});

export const items = pgTable('bb_item', {
  id: serial('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  fileKey: text('fileKey').notNull(),
  currentBid: integer('currentBid').notNull().default(0),
  startingPrice: integer('startingPrice').notNull().default(0),
  bidInterval: integer('bidInterval').notNull().default(100),
  endDate: timestamp('endDate', { mode: 'date' }).notNull(),
});

/* ===== ITEM TRANSLATIONS ===== */

export const itemTranslations = pgTable(
  'bb_item_translation',
  {
    itemId: integer('itemId')
      .notNull()
      .references(() => items.id, { onDelete: 'cascade' }),

    languageCode: text('languageCode')
      .notNull()
      .references(() => languages.code, { onDelete: 'cascade' }),

    name: text('name').notNull(),
  },
  (t) => [
     primaryKey({ columns: [t.itemId, t.languageCode] })
],
);

export const pictures = pgTable('bb_picture', {
  id: serial('id').primaryKey(),

  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  fileKey: text('fileKey').notNull(), // Cloudinary public_id
  name: text('name'), // необовʼязково

  type: text('type').notNull().default('art'),
  // 'art' | 'blog' | 'other'

  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
});

export const bids = pgTable('bb_bids', {
  id: serial('id').primaryKey(),
  amount: integer('amount').notNull(),
  itemId: integer('itemId')
    .notNull()
    .references(() => items.id, { onDelete: 'cascade' }),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  timestamp: timestamp('timestamp', { mode: 'date' }).notNull().defaultNow(),
});

export const bidRelations = relations(bids, ({ one }) => ({
  item: one(items, {
    fields: [bids.itemId],
    references: [items.id],
  }),
  user: one(users, {
    fields: [bids.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(bids, ({ one }) => ({
  user: one(users, {
    fields: [bids.userId],
    references: [users.id],
  }),
}));

// Таблиця постів блогу
export const blogPosts = pgTable('bb_blog_post', {
  id: serial('id').primaryKey(),

  authorId: text('authorId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  title: text('title').notNull(),

  excerpt: text('excerpt'), // короткий опис для лєнти

  content: text('content').notNull(),
  // довгий текст (markdown або HTML)

  slug: text('slug').notNull().unique(),

  coverImageKey: text('coverImageKey'),
  // Cloudinary public_id (опційно)

  publishedAt: timestamp('publishedAt', { mode: 'date' })
    .notNull()
    .defaultNow(),

  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),

  updatedAt: timestamp('updatedAt', { mode: 'date' }),

  isPublished: boolean('isPublished').notNull().default(true),
});

/* ===== BLOG TRANSLATIONS ===== */

export const blogPostTranslations = pgTable(
  'bb_blog_post_translation',
  {
    postId: integer('postId')
      .notNull()
      .references(() => blogPosts.id, { onDelete: 'cascade' }),

    languageCode: text('languageCode')
      .notNull()
      .references(() => languages.code, { onDelete: 'cascade' }),

    title: text('title').notNull(),
    excerpt: text('excerpt'),
    content: text('content').notNull(),
  },
  (t) => [primaryKey({ columns: [t.postId, t.languageCode] })],
);

// Фото в статтях
export const blogPostPictures = pgTable('bb_blog_post_picture', {
  id: serial('id').primaryKey(),

  postId: integer('postId')
    .notNull()
    .references(() => blogPosts.id, { onDelete: 'cascade' }),

  pictureId: integer('pictureId')
    .notNull()
    .references(() => pictures.id, { onDelete: 'cascade' }),

  order: integer('order').notNull().default(0),
});

// Relations

export const itemRelations = relations(items, ({ many }) => ({
  translations: many(itemTranslations),
  bids: many(bids),
}));

export const itemTranslationRelations = relations(
  itemTranslations,
  ({ one }) => ({
    item: one(items, {
      fields: [itemTranslations.itemId],
      references: [items.id],
    }),
  }),
);

export const blogPostsRelations = relations(blogPosts, ({ one, many }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
  images: many(blogPostPictures),
}));

export const blogPostPicturesRelations = relations(
  blogPostPictures,
  ({ one }) => ({
    post: one(blogPosts, {
      fields: [blogPostPictures.postId],
      references: [blogPosts.id],
    }),
    picture: one(pictures, {
      fields: [blogPostPictures.pictureId],
      references: [pictures.id],
    }),
  }),
);

export const blogPostTranslationRelations = relations(
  blogPostTranslations,
  ({ one }) => ({
    post: one(blogPosts, {
      fields: [blogPostTranslations.postId],
      references: [blogPosts.id],
    }),
  }),
);

export type Item = typeof items.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
export type ItemTranslation = typeof itemTranslations.$inferSelect;
export type BlogPostTranslation = typeof blogPostTranslations.$inferSelect;