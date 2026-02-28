import { inArray } from "drizzle-orm";
import { competitions } from "@/db/schema";
import { DbConnection } from "@/type/context";

export const getCompetitionsByIds = async (db: DbConnection, ids: number[]) => {
  return db.select().from(competitions).where(inArray(competitions.id, ids));
};

export const addCompetition = async (
  db: DbConnection,
  id: number,
  category: string,
  name: string,
  year: number,
  frameId: number,
) => {
  return db.insert(competitions).values({
    id: id,
    category: category,
    name: name,
    year: year,
    frameId: frameId,
  });
};
