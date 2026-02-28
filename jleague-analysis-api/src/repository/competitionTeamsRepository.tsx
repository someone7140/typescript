import { competitionTeams } from "@/db/schema";
import { DbConnection } from "@/type/context";

type InferInsertCompetitionTeams = typeof competitionTeams.$inferInsert;

export const upsertCompetitionTeams = async (
  db: DbConnection,
  registerCompetitionTeams: InferInsertCompetitionTeams[],
) => {
  return db
    .insert(competitionTeams)
    .values(registerCompetitionTeams)
    .onConflictDoNothing({
      target: [competitionTeams.competition_id, competitionTeams.team_id],
    });
};
