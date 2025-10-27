import type { Request, Response } from "express"
import { ApiError } from "../utils/ApiError.js"
import { GenericApiResponse } from "../utils/GenericApiResponse.js";
import { checkHeroAvailable, checkNpcHeroReused, validateHeroSlots } from "../services/hero.service.js";
import type { HeroesDeckProp } from "../constant/constant.js";


export const gameEnd = async (req: Request,res: Response) => {
  const {result} = req.body;

  const { gameId, playerOne, playerTwo } = result;
}

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

    return res.status(200).json(
      new GenericApiResponse(
        200,
        {},
        "Deck is Verified !!"
      )
    );
  } catch (err:any) {
     throw new ApiError(err?.statusCode || 500, err?.message || "Server Error");
  }
};