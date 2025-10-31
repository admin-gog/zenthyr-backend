import { ApiError } from "./ApiError.js";

export const validatePlayer = (player: any, playerName: string) => {
  if (!player) {
    throw new ApiError(400, `${playerName} data is required to end game.`);
  }

  if (!player.id) {
    throw new ApiError(400, `${playerName} id is missing`);
  }

  if (player.totalScore === undefined || player.totalScore === null) {
    throw new ApiError(400, `${playerName} totalScore is missing`);
  }

  if (typeof player.flag !== "boolean") {
    throw new ApiError(400, `${playerName} flag must be a boolean`);
  }
}


export const validateHeroObject = (hero: any) => {
  if (Object.entries(hero).length < 3) {
    throw new ApiError(400, `Hero Object have missing properties`);
  }
};