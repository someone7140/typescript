import { getCompetitions, getTeams } from "@/externalApi/jLeagueData";
import { DbConnection, EnvBindings } from "@/type/context";

export const updateTeamAndLeagueInfo = async (
  env: EnvBindings,
  db: DbConnection,
  year: number,
  frameId: number,
  category: string,
) => {
  // 指定した年のJ1のリーグ情報
  const j1Categories = await getCompetitions(
    `${env.DATA_COLLECTION_DOMAIN}/SFPR01/createCompetitions`,
    year,
    frameId,
  );

  // 指定したカテゴリーのチーム情報
  for (var j1Category of j1Categories) {
    const j1Teams = await getTeams(
      `${env.DATA_COLLECTION_DOMAIN}/SFPR01/createTeams`,
      j1Category.selectValue,
    );
    console.log(j1Teams);
  }
};
