ALTER TABLE "account" RENAME TO "bb_account";--> statement-breakpoint
ALTER TABLE "authenticator" RENAME TO "bb_authenticator";--> statement-breakpoint
ALTER TABLE "session" RENAME TO "bb_session";--> statement-breakpoint
ALTER TABLE "user" RENAME TO "bb_user";--> statement-breakpoint
ALTER TABLE "verificationToken" RENAME TO "bb_verificationToken";--> statement-breakpoint
ALTER TABLE "bb_authenticator" DROP CONSTRAINT "authenticator_credentialID_unique";--> statement-breakpoint
ALTER TABLE "bb_user" DROP CONSTRAINT "user_email_unique";--> statement-breakpoint
ALTER TABLE "bb_account" DROP CONSTRAINT "account_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "bb_authenticator" DROP CONSTRAINT "authenticator_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "bb_session" DROP CONSTRAINT "session_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "bb_account" ADD CONSTRAINT "bb_account_userId_bb_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."bb_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bb_authenticator" ADD CONSTRAINT "bb_authenticator_userId_bb_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."bb_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bb_session" ADD CONSTRAINT "bb_session_userId_bb_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."bb_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bb_authenticator" ADD CONSTRAINT "bb_authenticator_credentialID_unique" UNIQUE("credentialID");--> statement-breakpoint
ALTER TABLE "bb_user" ADD CONSTRAINT "bb_user_email_unique" UNIQUE("email");