import type { Request, Response } from "express"
import { ApiError } from "../utils/ApiError.js"
import { GenericApiResponse } from "../utils/GenericApiResponse.js";
import type { UserSelectedHero } from "../constant/constant.js";


const validateHeroes = (hero: UserSelectedHero, user : any) => {
  const selectedHero = user.heroesInventory.heroes.find(
    (check : any) => check.type === hero.type
  );

  if (!selectedHero) {
    throw new ApiError(400, `Hero type ${hero.type} not found in inventory`);
  }

  if (selectedHero.level === hero.level) {
    throw new ApiError(400, "Higher level is required to use hero ");
  }
  return true;
};

export const gameStart = async (req: Request,res: Response) => {
  const {slot} = req.body;
  const user = (req as any).user;
  
  if (!slot || !slot.heroes) {
    throw new ApiError(400, "Slot with heroes is required");
  }

  if(slot?.heroes.length < 4){
    throw new ApiError(400, "4 Heroes are required");
  }
  
  // check if its user first game or not

  for (let hero of slot?.heroes){
    validateHeroes(hero,user)
  }

  // check re-generate of herooes
  // value should be replaced from config.json
  user.elixir = user.elixix - 2;
  user.coins = user.coins - 5;

  await user.save();

  res.status(200).json(
    new GenericApiResponse(
      200,
      {},
      "Slots are Verified"
    )
  );
 
}


export const gameEnd = async (req: Request,res: Response) => {
  const {result} = req.body;

  const { gameId, playerOne, playerTwo } = result;
}