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

  // Check if any player left the game, then the other one wins
  if(playerOne.gameLeft) return playerTwo.id;
  if(playerTwo.gameLeft) return playerOne.id;

  // If game finishes

  // Check which player capture the flag  
  if (playerOne.isFlagBearer) return playerOne.id;
  if (playerTwo.isFlagBearer) return playerTwo.id;

  // If no flag is captured in game

  // Check which player have highest score
  if (playerOne.totalScore > playerTwo.totalScore) return playerOne.id;
  if (playerTwo.totalScore > playerOne.totalScore) return playerTwo.id;

};

export const saveGameRecord = async (gameData:any, winnerPlayerId:string, rewardBasedOnLevel:any) => {
  const { gameId, playerOne, playerTwo, totalTime } = gameData;

  await GamesRecord.create({
    gameId: gameId,
    playersData: [
      {
        playerId: playerOne.id,
        totalScore: playerOne.totalScore,
        isFlagBearer: playerOne.isFlagBearer,
        gameLeft: playerOne.isFlagBearer,
      },
      {
        playerId: playerTwo.id,
        totalScore: playerTwo.totalScore,
        isFlagBearer: playerTwo.isFlagBearer,
        gameLeft: playerTwo.isFlagBearer,
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

export const rewardGameWinner = async (
  gameData: any,
  winnerPlayerId: string,
  isLevelUp:boolean
) => {
  const user = await User.findOne({ _id: winnerPlayerId });

  if (!user) {
    throw new ApiError(400, "User not found !!");
  }

  const rewardBasedOnLevel =
    config.game_finish_rewards.winning_rewards.levels.find(
      (item: any) => item.level === user.currentLevel
    );
  // increase user xp and gold 
  user.experiencePoints += rewardBasedOnLevel.xp;
  user.goldEarned += rewardBasedOnLevel.gold_coins;


  // Now run levelUp() with latest XP
  const { isLevelUp: updatedIsLevelUp } = levelUp(
    user,
    winnerPlayerId,
    isLevelUp
  );
  await user.save();

  await saveGameRecord(gameData, winnerPlayerId, rewardBasedOnLevel);
  return { isLevelUp: updatedIsLevelUp };
};
