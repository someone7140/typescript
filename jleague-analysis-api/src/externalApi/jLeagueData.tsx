import { AppGraphQLError, NOT_FOUND_ERROR } from "@/type/error";

export type CompetitionsResponse = {
  competitionList:
    | {
        displayName: string;
        selectValue: number;
      }[]
    | null;
};

// 指定した年のリーグ情報
export const getCompetitions = async (
  url: string,
  year: number,
  frameId: number,
) => {
  const formData = new FormData();
  formData.append("competition_year", `${year}`);
  formData.append("competition_frame_id", `${frameId}`);
  formData.append("selectFlag", "true");
  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const competitionsResponse: CompetitionsResponse = await response.json();
  if (
    !competitionsResponse.competitionList ||
    competitionsResponse.competitionList.length < 0
  ) {
    throw new AppGraphQLError("Not found competition", NOT_FOUND_ERROR);
  }

  return competitionsResponse.competitionList;
};

export type TeamsResponse = {
  teamList:
    | {
        displayName: string;
        selectValue: number;
      }[]
    | null;
};

// 指定したリーグのチーム情報
export const getTeams = async (url: string, competitionId: number) => {
  const formData = new FormData();
  formData.append("competition_id", `${competitionId}`);
  formData.append("selectFlag", "true");
  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const teamsResponse: TeamsResponse = await response.json();
  if (!teamsResponse.teamList || teamsResponse.teamList.length < 0) {
    throw new AppGraphQLError("Not found teams", NOT_FOUND_ERROR);
  }

  return teamsResponse.teamList;
};

// 指定したチームの選手情報
export const getPlayersHtml = async (
  url: string,
  teamId: number,
  teamName: string,
) => {
  const formData = new FormData();
  formData.append("team_year_id_ex", `${teamId}`);
  formData.append("last_belong_team", `${teamId}`);
  formData.append("selectedTeamName", `${teamName}`);
  formData.append("selectedNationalOriginName", "（選択なし）");
  formData.append("selectedFieldPositionTypeName", "（選択なし）");
  formData.append("selectedJLeaguePlayerTypeNmae", "すべて");
  formData.append("selectedplayerNameFirstAlphabet", "（指定なし）");
  formData.append("j_league_current_belong_player_type", "3");

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  return await response.text();
};
