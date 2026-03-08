import { parse } from "node-html-parser";
import { InferInsertPlayers } from "@/repository/playersRepository";

export const getPlayersFromHtml = (html: string) => {
  const root = parse(html);
  const tbody = root.querySelector("tbody#eventView");
  if (!tbody) {
    return [];
  }

  const playerTrs = tbody.querySelectorAll("tr");
  const players: InferInsertPlayers[] = [];
  for (const playerTr of playerTrs) {
    const playerTds = playerTr.querySelectorAll("td");
    // 選手ID・名
    const playerIdValue =
      playerTds[0].querySelector("input")?.attributes["value"];
    if (!playerIdValue) {
      continue;
    }
    const playerId = parseInt(playerIdValue);
    const playerName = playerTds[0].querySelector("a")?.textContent ?? "";
    // ポジション
    const position = playerTds[3].textContent;
    // 誕生日
    const birthDate = playerTds[4].textContent;
    // 身長・体重
    const heightAndWeight = playerTds[5].textContent.split("/");
    const height = parseInt(heightAndWeight[0]);
    const weight = parseInt(heightAndWeight[1]);
    players.push({
      id: playerId,
      name: playerName,
      position: position,
      birthDate: birthDate,
      height: height,
      weight: weight,
    });
  }

  return players;
};
