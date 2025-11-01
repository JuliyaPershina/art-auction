CREATE TABLE "bb_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"startingPrice" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bb_item" ADD CONSTRAINT "bb_item_userId_bb_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."bb_user"("id") ON DELETE cascade ON UPDATE no action;