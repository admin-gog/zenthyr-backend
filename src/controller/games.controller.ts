import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { GenericApiResponse } from "../utils/GenericApiResponse.js";
import {
  checkHeroAvailable,
  checkNpcHeroReused,
  validateHeroSlots,
} from "../services/hero.service.js";
import type { HeroesDeckProp } from "../constant/constant.js";
import { findWinnerPlayerId, rewardGameWinner, saveGameRecord } from "../services/game.service.js";
import { GamesRecord } from "../model/games.model.js";
import { validateHeroObject, validatePlayer } from "../utils/ValidateData.js";

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
    validatePlayer(playerOne, "playerOne");
    validatePlayer(playerTwo, "playerTwo");

    const winnerPlayerId = findWinnerPlayerId(playerOne, playerTwo);

    // Give winning user rewards & Store game details in GamesRecord Collection
    await rewardGameWinner(gameData,winnerPlayerId);

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
      validateHeroObject(hero);
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
