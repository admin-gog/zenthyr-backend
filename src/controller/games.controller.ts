import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { GenericApiResponse } from "../utils/GenericApiResponse.js";
import {
  checkHeroAvailable,
  checkNpcHeroReused,
  validateHeroSlots,
} from "../services/hero.service.js";
import type { HeroesDeckProp } from "../constant/constant.js";
import { User } from "../model/user.model.js";
import config from "../utils/LoadConfig.js";
import { levelUp } from "../utils/LevelUp.js";

export const gameFinish = async (req: Request, res: Response) => {
  try {
    const { result } = req.body;
    if(!result){
      throw new ApiError(400, "Result are required to end game.");
    }

    const { gameId, playerOne, playerTwo } = result;

    if (!gameId) {
      throw new ApiError(400, "GameId is required to end game.");
    }
    if (!playerOne) {
      throw new ApiError(400, "PlayerOne data is required to end game.");
    }
    if (!playerTwo) {
      throw new ApiError(400, "playerTwo data is required to end game.");
    }
    
    let winnerPlayerId = "";

    if (playerOne.flag) {
      winnerPlayerId = playerOne.id;
    } else {
      winnerPlayerId = playerTwo.id;
    }

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

    return res
      .status(200)
      .json(new GenericApiResponse(200, {}, "Game Finished Successfully !!"));
  } catch (err: any) {
    throw new ApiError(err?.statusCode || 500, err?.message || "Server Error");
  }
};

export const verifyHeroesDeck = (req: Request, res: Response) => {
  try {
    const { heroes } = req.body;
    const user = (req as any).user;

    if (!heroes) {
      throw new ApiError(400, "Heroes Array is required");
    }

    if (heroes.length !== 5) {
      throw new ApiError(400, "5 Heroes are required");
    }

    // 4 Heroes + 1 NPC
    // let availableSlot = 5;
    let heroesDeck: HeroesDeckProp = [];

    for (let hero of heroes) {
      // 1 - Check if user hve this hero and have same level as request
      checkHeroAvailable(hero, user);

      // 2 - check if choosed hero have reached max slot
      validateHeroSlots(hero, heroesDeck);
    }

    // 3 - check if NPC hero is reused or not
    checkNpcHeroReused(heroesDeck);

    return res
      .status(200)
      .json(new GenericApiResponse(200, {}, "Deck is Verified !!"));
  } catch (err: any) {
    throw new ApiError(err?.statusCode || 500, err?.message || "Server Error");
  }
};
