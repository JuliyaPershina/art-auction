import { relations } from "drizzle-orm/relations";
import { bbUser, bbItem, bbBids, bbAccount, bbAuthenticator, bbSession, bbPicture, bbBlogPost, bbBlogPostPicture, bbItemTranslation, bbLanguage, bbPictureTranslation, bbBlogPostTranslation } from "./schema";

export const bbItemRelations = relations(bbItem, ({one, many}) => ({
	bbUser: one(bbUser, {
		fields: [bbItem.userId],
		references: [bbUser.id]
	}),
	bbBids: many(bbBids),
	bbItemTranslations: many(bbItemTranslation),
}));

export const bbUserRelations = relations(bbUser, ({many}) => ({
	bbItems: many(bbItem),
	bbBids: many(bbBids),
	bbAccounts: many(bbAccount),
	bbAuthenticators: many(bbAuthenticator),
	bbSessions: many(bbSession),
	bbPictures: many(bbPicture),
	bbBlogPosts: many(bbBlogPost),
}));

export const bbBidsRelations = relations(bbBids, ({one}) => ({
	bbItem: one(bbItem, {
		fields: [bbBids.itemId],
		references: [bbItem.id]
	}),
	bbUser: one(bbUser, {
		fields: [bbBids.userId],
		references: [bbUser.id]
	}),
}));

export const bbAccountRelations = relations(bbAccount, ({one}) => ({
	bbUser: one(bbUser, {
		fields: [bbAccount.userId],
		references: [bbUser.id]
	}),
}));

export const bbAuthenticatorRelations = relations(bbAuthenticator, ({one}) => ({
	bbUser: one(bbUser, {
		fields: [bbAuthenticator.userId],
		references: [bbUser.id]
	}),
}));

export const bbSessionRelations = relations(bbSession, ({one}) => ({
	bbUser: one(bbUser, {
		fields: [bbSession.userId],
		references: [bbUser.id]
	}),
}));

export const bbPictureRelations = relations(bbPicture, ({one, many}) => ({
	bbUser: one(bbUser, {
		fields: [bbPicture.userId],
		references: [bbUser.id]
	}),
	bbBlogPostPictures: many(bbBlogPostPicture),
	bbPictureTranslations: many(bbPictureTranslation),
}));

export const bbBlogPostPictureRelations = relations(bbBlogPostPicture, ({one}) => ({
	bbBlogPost: one(bbBlogPost, {
		fields: [bbBlogPostPicture.postId],
		references: [bbBlogPost.id]
	}),
	bbPicture: one(bbPicture, {
		fields: [bbBlogPostPicture.pictureId],
		references: [bbPicture.id]
	}),
}));

export const bbBlogPostRelations = relations(bbBlogPost, ({one, many}) => ({
	bbBlogPostPictures: many(bbBlogPostPicture),
	bbUser: one(bbUser, {
		fields: [bbBlogPost.authorId],
		references: [bbUser.id]
	}),
	bbBlogPostTranslations: many(bbBlogPostTranslation),
}));

export const bbItemTranslationRelations = relations(bbItemTranslation, ({one}) => ({
	bbItem: one(bbItem, {
		fields: [bbItemTranslation.itemId],
		references: [bbItem.id]
	}),
	bbLanguage: one(bbLanguage, {
		fields: [bbItemTranslation.languageCode],
		references: [bbLanguage.code]
	}),
}));

export const bbLanguageRelations = relations(bbLanguage, ({many}) => ({
	bbItemTranslations: many(bbItemTranslation),
	bbPictureTranslations: many(bbPictureTranslation),
	bbBlogPostTranslations: many(bbBlogPostTranslation),
}));

export const bbPictureTranslationRelations = relations(bbPictureTranslation, ({one}) => ({
	bbPicture: one(bbPicture, {
		fields: [bbPictureTranslation.pictureId],
		references: [bbPicture.id]
	}),
	bbLanguage: one(bbLanguage, {
		fields: [bbPictureTranslation.languageCode],
		references: [bbLanguage.code]
	}),
}));

export const bbBlogPostTranslationRelations = relations(bbBlogPostTranslation, ({one}) => ({
	bbBlogPost: one(bbBlogPost, {
		fields: [bbBlogPostTranslation.postId],
		references: [bbBlogPost.id]
	}),
	bbLanguage: one(bbLanguage, {
		fields: [bbBlogPostTranslation.languageCode],
		references: [bbLanguage.code]
	}),
}));