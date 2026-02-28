CREATE TABLE "competition_teams" (
	"competition_id" integer NOT NULL,
	"team_id" integer NOT NULL,
	CONSTRAINT "competition_teams_competition_id_team_id_pk" PRIMARY KEY("competition_id","team_id")
);
--> statement-breakpoint
CREATE TABLE "competitions" (
	"id" integer PRIMARY KEY NOT NULL,
	"category" varchar NOT NULL,
	"name" varchar NOT NULL,
	"year" integer NOT NULL,
	"frameId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL
);
