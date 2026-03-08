import { players } from "@/db/schema";
import { DbConnection } from "@/type/context";

export type InferInsertPlayers = typeof players.$inferInsert;

export const upsertPlayers = async (
  db: DbConnection,
  registerPlayers: InferInsertPlayers[],
) => {
  return db
    .insert(players)
    .values(registerPlayers)
    .onConflictDoUpdate({
      target: players.id,
      set: {
        name: players.name,
        position: players.position,
        birthDate: players.birthDate,
        height: players.height,
        weight: players.weight,
      },
    });
};
