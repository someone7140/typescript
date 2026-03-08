import {
  getCompetitions,
  getPlayersHtml,
  getTeams,
} from "@/externalApi/jLeagueData";
import {
  addCompetition,
  getCompetitionsByIds,
  getCompetitionsByYear,
} from "@/repository/competitionsRepository";
import {
  getTeamsByCompetitionIds,
  upsertCompetitionTeams,
} from "@/repository/competitionTeamsRepository";
import { upsertTeams } from "@/repository/teamsRepository";
import { getPlayersFromHtml } from "@/service/scrapingService";
import { DbConnection, EnvBindings } from "@/type/context";

export const updateTeamAndLeagueInfo = async (
  env: EnvBindings,
  db: DbConnection,
  year: number,
  frameId: number,
  category: string,
) => {
  // 指定した年のリーグ情報
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
          competitionId: competition.selectValue,
          teamId: team.selectValue,
        };
      }),
    );
  }
};

export const updatePlayerInfo = async (
  env: EnvBindings,
  db: DbConnection,
  year: number,
) => {
  const competitionsFromDb = await getCompetitionsByYear(db, year);
  const teamsFromDb = await getTeamsByCompetitionIds(
    db,
    competitionsFromDb.map((c) => c.id),
  );

  for (const team of teamsFromDb) {
    const playerHtml = await getPlayersHtml(
      `${env.DATA_COLLECTION_DOMAIN}/SFIX03/search`,
      team.teams.id,
      team.teams.name,
    );
    getPlayersFromHtml(playerHtml);
    break;
  }
};
