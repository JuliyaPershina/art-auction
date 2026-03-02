import { pgTable, foreignKey, serial, text, integer, timestamp, unique, boolean, real, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const bbItem = pgTable("bb_item", {
	id: serial().primaryKey().notNull(),
	userId: text().notNull(),
	fileKey: text().notNull(),
	currentBid: integer().default(0).notNull(),
	startingPrice: integer().default(0).notNull(),
	bidInterval: integer().default(100).notNull(),
	endDate: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [bbUser.id],
			name: "bb_item_userId_bb_user_id_fk"
		}).onDelete("cascade"),
]);

export const bbBids = pgTable("bb_bids", {
	id: serial().primaryKey().notNull(),
	amount: integer().notNull(),
	itemId: integer().notNull(),
	userId: text().notNull(),
	timestamp: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.itemId],
			foreignColumns: [bbItem.id],
			name: "bb_bids_itemId_bb_item_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [bbUser.id],
			name: "bb_bids_userId_bb_user_id_fk"
		}).onDelete("cascade"),
]);

export const bbVerificationToken = pgTable("bb_verificationToken", {
	identifier: text().notNull(),
	token: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
});

export const bbUser = pgTable("bb_user", {
	id: text().primaryKey().notNull(),
	name: text(),
	email: text(),
	emailVerified: timestamp({ mode: 'string' }),
	image: text(),
	role: text().default('user').notNull(),
}, (table) => [
	unique("bb_user_email_unique").on(table.email),
]);

export const bbAccount = pgTable("bb_account", {
	userId: text().notNull(),
	type: text().notNull(),
	provider: text().notNull(),
	providerAccountId: text().notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text(),
	idToken: text("id_token"),
	sessionState: text("session_state"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [bbUser.id],
			name: "bb_account_userId_bb_user_id_fk"
		}).onDelete("cascade"),
]);

export const bbAuthenticator = pgTable("bb_authenticator", {
	credentialId: text().notNull(),
	userId: text().notNull(),
	providerAccountId: text().notNull(),
	credentialPublicKey: text().notNull(),
	counter: integer().notNull(),
	credentialDeviceType: text().notNull(),
	credentialBackedUp: boolean().notNull(),
	transports: text(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [bbUser.id],
			name: "bb_authenticator_userId_bb_user_id_fk"
		}).onDelete("cascade"),
	unique("bb_authenticator_credentialID_unique").on(table.credentialId),
]);

export const bbSession = pgTable("bb_session", {
	sessionToken: text().primaryKey().notNull(),
	userId: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [bbUser.id],
			name: "bb_session_userId_bb_user_id_fk"
		}).onDelete("cascade"),
]);

export const playingWithNeon = pgTable("playing_with_neon", {
	id: serial().primaryKey().notNull(),
	name: text(),
	value: real(),
});

export const bbPicture = pgTable("bb_picture", {
	id: serial().primaryKey().notNull(),
	userId: text().notNull(),
	fileKey: text().notNull(),
	name: text(),
	type: text().default('art').notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [bbUser.id],
			name: "bb_picture_userId_bb_user_id_fk"
		}).onDelete("cascade"),
]);

export const bbBlogPostPicture = pgTable("bb_blog_post_picture", {
	id: serial().primaryKey().notNull(),
	postId: integer().notNull(),
	pictureId: integer().notNull(),
	order: integer().default(0).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.postId],
			foreignColumns: [bbBlogPost.id],
			name: "bb_blog_post_picture_postId_bb_blog_post_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.pictureId],
			foreignColumns: [bbPicture.id],
			name: "bb_blog_post_picture_pictureId_bb_picture_id_fk"
		}).onDelete("cascade"),
]);

export const bbBlogPost = pgTable("bb_blog_post", {
	id: serial().primaryKey().notNull(),
	authorId: text().notNull(),
	slug: text().notNull(),
	coverImageKey: text(),
	publishedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }),
	isPublished: boolean().default(true).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [bbUser.id],
			name: "bb_blog_post_authorId_bb_user_id_fk"
		}).onDelete("cascade"),
	unique("bb_blog_post_slug_unique").on(table.slug),
]);

export const bbLanguage = pgTable("bb_language", {
	code: text().primaryKey().notNull(),
	name: text().notNull(),
});

export const bbItemTranslation = pgTable("bb_item_translation", {
	itemId: integer().notNull(),
	languageCode: text().notNull(),
	name: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.itemId],
			foreignColumns: [bbItem.id],
			name: "bb_item_translation_itemId_bb_item_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.languageCode],
			foreignColumns: [bbLanguage.code],
			name: "bb_item_translation_languageCode_bb_language_code_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.itemId, table.languageCode], name: "bb_item_translation_itemId_languageCode_pk"}),
]);

export const bbPictureTranslation = pgTable("bb_picture_translation", {
	pictureId: integer().notNull(),
	languageCode: text().notNull(),
	name: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.pictureId],
			foreignColumns: [bbPicture.id],
			name: "bb_picture_translation_pictureId_bb_picture_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.languageCode],
			foreignColumns: [bbLanguage.code],
			name: "bb_picture_translation_languageCode_bb_language_code_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.pictureId, table.languageCode], name: "bb_picture_translation_pictureId_languageCode_pk"}),
]);

export const bbBlogPostTranslation = pgTable("bb_blog_post_translation", {
	postId: integer().notNull(),
	languageCode: text().notNull(),
	title: text().notNull(),
	excerpt: text(),
	content: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.postId],
			foreignColumns: [bbBlogPost.id],
			name: "bb_blog_post_translation_postId_bb_blog_post_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.languageCode],
			foreignColumns: [bbLanguage.code],
			name: "bb_blog_post_translation_languageCode_bb_language_code_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.postId, table.languageCode], name: "bb_blog_post_translation_postId_languageCode_pk"}),
]);
