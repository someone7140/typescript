import { teams } from "@/db/schema";
import { DbConnection } from "@/type/context";

type InferInsertTeams = typeof teams.$inferInsert;

export const upsertTeams = async (
  db: DbConnection,
  registerTeams: InferInsertTeams[],
) => {
  return db
    .insert(teams)
    .values(registerTeams)
    .onConflictDoUpdate({
      target: teams.id,
      set: { name: teams.name },
    });
};
