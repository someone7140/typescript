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
