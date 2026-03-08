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
    competitionId: integer("competition_id").notNull(),
    teamId: integer("team_id").notNull(),
  },
  (table) => [primaryKey({ columns: [table.competitionId, table.teamId] })],
);

export const players = pgTable("players", {
  id: integer("id").primaryKey(),
  name: varchar("name").notNull(),
  position: varchar("position").notNull(),
  birthDate: varchar("birthDate").notNull(),
  height: integer("height"),
  weight: integer("weight"),
});
