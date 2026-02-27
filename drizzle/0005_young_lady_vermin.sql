CREATE TABLE "bb_account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "bb_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "bb_bids" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" integer NOT NULL,
	"itemId" integer NOT NULL,
	"userId" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bb_blog_post_translation" (
	"postId" integer NOT NULL,
	"languageCode" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	CONSTRAINT "bb_blog_post_translation_postId_languageCode_pk" PRIMARY KEY("postId","languageCode")
);
--> statement-breakpoint
CREATE TABLE "bb_blog_post" (
	"id" serial PRIMARY KEY NOT NULL,
	"authorId" text NOT NULL,
	"slug" text NOT NULL,
	"coverImageKey" text,
	"publishedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp,
	"isPublished" boolean DEFAULT true NOT NULL,
	CONSTRAINT "bb_blog_post_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "bb_item_translation" (
	"itemId" integer NOT NULL,
	"languageCode" text NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "bb_item_translation_itemId_languageCode_pk" PRIMARY KEY("itemId","languageCode")
);
--> statement-breakpoint
CREATE TABLE "bb_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"fileKey" text NOT NULL,
	"currentBid" integer DEFAULT 0 NOT NULL,
	"startingPrice" integer DEFAULT 0 NOT NULL,
	"bidInterval" integer DEFAULT 100 NOT NULL,
	"endDate" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bb_language" (
	"code" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bb_session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bb_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	"role" text DEFAULT 'user' NOT NULL,
	CONSTRAINT "bb_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "bb_verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "bb_verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "bb_account" ADD CONSTRAINT "bb_account_userId_bb_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."bb_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bb_bids" ADD CONSTRAINT "bb_bids_itemId_bb_item_id_fk" FOREIGN KEY ("itemId") REFERENCES "public"."bb_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bb_bids" ADD CONSTRAINT "bb_bids_userId_bb_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."bb_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bb_blog_post_translation" ADD CONSTRAINT "bb_blog_post_translation_postId_bb_blog_post_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."bb_blog_post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bb_blog_post_translation" ADD CONSTRAINT "bb_blog_post_translation_languageCode_bb_language_code_fk" FOREIGN KEY ("languageCode") REFERENCES "public"."bb_language"("code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bb_blog_post" ADD CONSTRAINT "bb_blog_post_authorId_bb_user_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."bb_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bb_item_translation" ADD CONSTRAINT "bb_item_translation_itemId_bb_item_id_fk" FOREIGN KEY ("itemId") REFERENCES "public"."bb_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bb_item_translation" ADD CONSTRAINT "bb_item_translation_languageCode_bb_language_code_fk" FOREIGN KEY ("languageCode") REFERENCES "public"."bb_language"("code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bb_item" ADD CONSTRAINT "bb_item_userId_bb_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."bb_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bb_session" ADD CONSTRAINT "bb_session_userId_bb_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."bb_user"("id") ON DELETE cascade ON UPDATE no action;