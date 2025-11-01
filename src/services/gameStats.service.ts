import type { PlayerDataProp } from "../constant/constant.js";
import { GamesRecord } from "../model/games.model.js";
import { UserGameStats } from "../model/userGameStats.model.js";
import { ApiError } from "../utils/ApiError.js";

export const updateUserGameStats = async (
  userGameData: PlayerDataProp,
  winnerPlayerId:string,
  gameId:string
) => {
  try {
    const { gameLeft, id } = userGameData;
    const userGameStats = await UserGameStats.findOne({ userId: id });
    if (!userGameStats) {
      return;
    }

    // If player didn't left the game, add that stat to totalGamesPlayed
    if (!gameLeft) {
      userGameStats.totalGamesPlayed++;
    }

    // If player is winner, add that stat to totalGamesWins
    if(userGameStats.userId.equals(winnerPlayerId)){
      userGameStats.totalGamesWins++;

      const gameRecord = await GamesRecord.findOne({ gameId });
      if (!gameRecord) return;
      const { gold } = gameRecord.winnerRewards;
      userGameStats.totalCoinsEarned += gold;
    }

    userGameStats.save();
  } catch (err: any) {
    throw new ApiError(err?.statusCode || 500, err?.message || "Server Error");
  }
};