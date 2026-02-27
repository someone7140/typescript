import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const competitions = pgTable("competitions", {
  id: integer("id").primaryKey(),
  category: varchar("category").notNull(),
  name: varchar("name").notNull(),
  year: integer("year").notNull(),
  frameId: integer("frameId").notNull(),
});
