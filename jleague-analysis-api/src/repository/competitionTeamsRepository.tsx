import { eq, inArray } from "drizzle-orm";
import { competitions, competitionTeams, teams } from "@/db/schema";
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
      target: [competitionTeams.competitionId, competitionTeams.teamId],
    });
};

export const getTeamsByCompetitionIds = async (
  db: DbConnection,
  competitionIds: number[],
) => {
  return db
    .select()
    .from(competitionTeams)
    .innerJoin(teams, eq(teams.id, competitionTeams.teamId))
    .innerJoin(
      competitions,
      eq(competitions.id, competitionTeams.competitionId),
    )
    .where(inArray(competitions.id, competitionIds));
};
