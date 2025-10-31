import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { GenericApiResponse } from "../utils/GenericApiResponse.js";
import {
  checkHeroAvailable,
  checkNpcHeroReused,
  validateHeroSlots,
} from "../services/hero.service.js";
import type { HeroesDeckProp } from "../constant/constant.js";
import {
  findWinnerPlayerId,
  rewardGameWinner,
} from "../services/game.service.js";
import { GamesRecord } from "../model/games.model.js";
import config from "../utils/LoadConfig.js";
import { User } from "../model/user.model.js";

export const gameFinish = async (req: Request, res: Response) => {
  try {
    const { gameData } = req.body;

    if (!gameData) {
      throw new ApiError(400, "Result are required to end game.");
    }

    const { gameId, playerOne, playerTwo, totalTime } = gameData;

    if (!gameId) {
      throw new ApiError(400, "GameId is required to end game.");
    }

    const gameIdExist = await GamesRecord.findOne({
      gameId: gameId,
    });

    if (gameIdExist) {
      throw new ApiError(401, `Game with this gameId already exists`);
    }

    if (!playerOne) {
      throw new ApiError(400, "playerOne data is required to end game.");
    }
    if (!playerTwo) {
      throw new ApiError(400, "playerTwo data is required to end game.");
    }
    if (!totalTime) {
      throw new ApiError(400, "totalTime data is required to end game.");
    }

    let isLevelUp = false;

    const winnerPlayerId = findWinnerPlayerId(playerOne, playerTwo);

    if (!winnerPlayerId) {
      throw new ApiError(400, "Unable to determine a winner");
    }

    // Give winning user rewards & Store game details in GamesRecord Collection
    const { isLevelUp: updatedIsLevelUp } = await rewardGameWinner(
      gameData,
      winnerPlayerId,
      isLevelUp
    );

    return res
      .status(200)
      .json(
        new GenericApiResponse(
          200,
          { player: { id: winnerPlayerId, isLevelUp: updatedIsLevelUp } },
          "Game Finished Successfully !!"
        )
      );
  } catch (err: any) {
    throw new ApiError(err?.statusCode || 500, err?.message || "Server Error");
  }
};

export const verifyHeroesDeck = async (req: Request, res: Response) => {
  try {
    const { heroes, userId } = req.body;
    
    if (!heroes) {
      throw new ApiError(400, "Heroes Array is required");
    }

    if (!userId) {
      throw new ApiError(400, "userId is required");
    }
    
    const user = await User.findOne({ _id: userId }).select("-refreshToken");

    const totalHeoresCount = config.deck_hero_count + config.npc_hero_count;

    if (heroes.length !== totalHeoresCount) {
      throw new ApiError(400, "4 Heroes are required");
    }

    // 4 Heroes + 1 NPC
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
