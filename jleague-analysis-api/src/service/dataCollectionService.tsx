import { getCompetitions, getTeams } from "@/externalApi/jLeagueData";
import {
  addCompetition,
  getCompetitionsByIds,
} from "@/repository/competitionsRepository";
import { upsertCompetitionTeams } from "@/repository/competitionTeamsRepository";
import { upsertTeams } from "@/repository/teamsRepository";
import { DbConnection, EnvBindings } from "@/type/context";

export const updateTeamAndLeagueInfo = async (
  env: EnvBindings,
  db: DbConnection,
  year: number,
  frameId: number,
  category: string,
) => {
  // 指定した年ののリーグ情報
  const competitionsFromApi = await getCompetitions(
    `${env.DATA_COLLECTION_DOMAIN}/SFPR01/createCompetitions`,
    year,
    frameId,
  );
  if (competitionsFromApi.length === 0) {
    return;
  }

  const competitionsFromDb = await getCompetitionsByIds(
    db,
    competitionsFromApi.map((c) => c.selectValue),
  );

  for (var competition of competitionsFromApi) {
    // 指定したカテゴリーのチーム情報
    const teamsFromApi = await getTeams(
      `${env.DATA_COLLECTION_DOMAIN}/SFPR01/createTeams`,
      competition.selectValue,
    );

    // CompetitionがDB登録されてなかったら登録
    if (!competitionsFromDb.some((c) => c.id === competition.selectValue)) {
      let competitionName = `${category}-${year}`;
      if (competition.displayName) {
        competitionName = `${competitionName}-${competition.displayName}`;
      }
      await addCompetition(
        db,
        competition.selectValue,
        category,
        competitionName,
        year,
        frameId,
      );
    }

    // チームの登録
    await upsertTeams(
      db,
      teamsFromApi.map((team) => {
        return {
          id: team.selectValue,
          name: team.displayName,
        };
      }),
    );
    await upsertCompetitionTeams(
      db,
      teamsFromApi.map((team) => {
        return {
          competition_id: competition.selectValue,
          team_id: team.selectValue,
        };
      }),
    );
  }
};
