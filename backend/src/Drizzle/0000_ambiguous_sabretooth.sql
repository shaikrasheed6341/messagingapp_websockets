CREATE TABLE "message" (
	"roomid" uuid NOT NULL,
	"senderid" uuid NOT NULL,
	"constext" text NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "roomparticipants" (
	"roomid" uuid NOT NULL,
	"userid" uuid NOT NULL,
	CONSTRAINT "roomparticipants_roomid_userid_pk" PRIMARY KEY("roomid","userid")
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"roomowner" uuid NOT NULL,
	"roomcode" varchar(4) NOT NULL,
	"roompassword" varchar NOT NULL,
	"createAt" timestamp DEFAULT now(),
	CONSTRAINT "rooms_roomcode_unique" UNIQUE("roomcode")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"createAt" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_roomid_rooms_id_fk" FOREIGN KEY ("roomid") REFERENCES "public"."rooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_senderid_users_id_fk" FOREIGN KEY ("senderid") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roomparticipants" ADD CONSTRAINT "roomparticipants_roomid_rooms_id_fk" FOREIGN KEY ("roomid") REFERENCES "public"."rooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roomparticipants" ADD CONSTRAINT "roomparticipants_userid_users_id_fk" FOREIGN KEY ("userid") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_roomowner_users_id_fk" FOREIGN KEY ("roomowner") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;