import { integer, pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";

export const competitions = pgTable("competitions", {
  id: integer("id").primaryKey(),
  category: varchar("category").notNull(),
  name: varchar("name").notNull(),
  year: integer("year").notNull(),
  frameId: integer("frameId").notNull(),
});

export const teams = pgTable("teams", {
  id: integer("id").primaryKey(),
  name: varchar("name").notNull(),
});

export const competitionTeams = pgTable(
  "competition_teams",
  {
    competition_id: integer("competition_id").notNull(),
    team_id: integer("team_id").notNull(),
  },
  (table) => [primaryKey({ columns: [table.competition_id, table.team_id] })],
);
