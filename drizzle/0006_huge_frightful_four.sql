CREATE TABLE "bb_authenticator" (
	"credentialID" text NOT NULL,
	"userId" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "bb_authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE "bb_blog_post_picture" (
	"id" serial PRIMARY KEY NOT NULL,
	"postId" integer NOT NULL,
	"pictureId" integer NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bb_picture_translation" (
	"pictureId" integer NOT NULL,
	"languageCode" text NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "bb_picture_translation_pictureId_languageCode_pk" PRIMARY KEY("pictureId","languageCode")
);
--> statement-breakpoint
CREATE TABLE "bb_picture" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"fileKey" text NOT NULL,
	"name" text,
	"type" text DEFAULT 'art' NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "playing_with_neon" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"value" real
);
--> statement-breakpoint
ALTER TABLE "bb_account" DROP CONSTRAINT "bb_account_provider_providerAccountId_pk";--> statement-breakpoint
ALTER TABLE "bb_verificationToken" DROP CONSTRAINT "bb_verificationToken_identifier_token_pk";--> statement-breakpoint
ALTER TABLE "bb_blog_post" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "bb_blog_post" ADD COLUMN "excerpt" text;--> statement-breakpoint
ALTER TABLE "bb_blog_post" ADD COLUMN "content" text NOT NULL;--> statement-breakpoint
ALTER TABLE "bb_item" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "bb_authenticator" ADD CONSTRAINT "bb_authenticator_userId_bb_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."bb_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bb_blog_post_picture" ADD CONSTRAINT "bb_blog_post_picture_postId_bb_blog_post_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."bb_blog_post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bb_blog_post_picture" ADD CONSTRAINT "bb_blog_post_picture_pictureId_bb_picture_id_fk" FOREIGN KEY ("pictureId") REFERENCES "public"."bb_picture"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bb_picture_translation" ADD CONSTRAINT "bb_picture_translation_pictureId_bb_picture_id_fk" FOREIGN KEY ("pictureId") REFERENCES "public"."bb_picture"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bb_picture_translation" ADD CONSTRAINT "bb_picture_translation_languageCode_bb_language_code_fk" FOREIGN KEY ("languageCode") REFERENCES "public"."bb_language"("code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bb_picture" ADD CONSTRAINT "bb_picture_userId_bb_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."bb_user"("id") ON DELETE cascade ON UPDATE no action;