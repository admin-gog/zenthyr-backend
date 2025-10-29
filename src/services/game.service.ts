import type { PlayerDataProp } from "../constant/constant.js";
import { GamesRecord } from "../model/games.model.js";
import { User } from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { levelUp } from "../utils/LevelUp.js";
import config from "../utils/LoadConfig.js";

export const findWinnerPlayerId = (
  playerOne: PlayerDataProp,
  playerTwo: PlayerDataProp
) => {
  let winnerPlayerId = "";

  if (playerOne.flag) {
    winnerPlayerId = playerOne.id;
  } else if (playerTwo.flag) {
    winnerPlayerId = playerTwo.id;
  } else {
     throw new ApiError(401,"No Winner found")
  }

  return winnerPlayerId;
};

export const saveGameRecord = async (gameData:any, winnerPlayerId:string, rewardBasedOnLevel:any) => {
  const { gameId, playerOne, playerTwo, totalTime } = gameData;

  await GamesRecord.create({
    gameId: gameId,
    playersData: [
      {
        playerId: playerOne.id,
        totalScore: playerOne.totalScore,
        flag: playerOne.flag,
      },
      {
        playerId: playerTwo.id,
        totalScore: playerTwo.totalScore,
        flag: playerTwo.flag,
      },
    ],
    winnerRewards: {
      winnerId: winnerPlayerId,
      xp: rewardBasedOnLevel.xp,
      gold: rewardBasedOnLevel.gold_coins,
    },
    gamePlayedTime: totalTime,
  });
};

export const rewardGameWinner = async (gameData:any,winnerPlayerId:string) => {
  const user = await User.findOne({ _id: winnerPlayerId });

  if (!user) {
    throw new ApiError(400, "User not found !!");
  }

  const rewardBasedOnLevel =
    config.game_finish_rewards.winning_rewards.levels.find(
      (item: any) => item.level === user.currentLevel
    );

  await User.updateOne(
    { _id: winnerPlayerId },
    {
      $inc: {
        experiencePoints: rewardBasedOnLevel.xp,
        goldEarned: rewardBasedOnLevel.gold_coins,
      },
    }
  );

  const updatedUser = await User.findById(winnerPlayerId);

  // Now run levelUp() with latest XP
  await levelUp(updatedUser, winnerPlayerId);

  await saveGameRecord(gameData, winnerPlayerId, rewardBasedOnLevel);
};
