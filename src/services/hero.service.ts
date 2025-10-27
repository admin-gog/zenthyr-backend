import type { HeroesDeckProp, UserSelectedHero, ValidateHero } from "../constant/constant.js";
import { ApiError } from "../utils/ApiError.js";
import config from "../utils/LoadConfig.js";

export const validateHeroes = (hero: UserSelectedHero, user: any) => {
  const selectedHero = user.heroesInventory.heroes.find(
    (check: any) => check.type === hero.type
  );

  if (!selectedHero) {
    throw new ApiError(400, `Hero type ${hero.type} not found in inventory`);
  }

  if (selectedHero.level === hero.level) {
    throw new ApiError(400, "Higher level is required to use hero ");
  }
  return true;
};

export const checkHeroAvailable = (hero:ValidateHero, user:any) => {

  const selectedHero = user.heroesInventory.heroes.find(
    (check: any) => check.heroId === hero.heroId
  );

  if (!selectedHero) {
    throw new ApiError(400, `Hero ${hero.heroId} is not found in inventory`);
  }

  if (selectedHero.heroLevel !== hero.heroLevel) {
    throw new ApiError(400, "Invalid hero level");
  }
  return true;
};

export const validateHeroSlots = (hero: ValidateHero, heroesDeck: HeroesDeckProp) => {
  // 3.1 Find hero maxSlots from config.json
  const heroConfig = config.heroes.find(
    (h: ValidateHero) => h.heroId === hero.heroId
  );
  if (!heroConfig) {
    throw new ApiError(400, `Hero "${hero}" does not exist in config.`);
  }

  // 3.2 Count how many times this hero is already in the deck
  const currentCount = heroesDeck.filter(
    (h) => h.heroId === hero.heroId
  ).length;

  // 3.3 Enforce maxSlotsAvailable for this hero
  if (currentCount > heroConfig.maxSlotsAvailable) {
    throw new ApiError(
      400,`You can't keep "${heroConfig.heroId}" more than ${heroConfig.maxSlotsAvailable} times.`
    );
  }

  heroesDeck.push(hero);

  return true;
};

export const checkNpcHeroReused = (heroesDeck: HeroesDeckProp) => {

  const npcHero = heroesDeck.find((h) => h.slotType === "NPC");
  if (!npcHero) {
     throw new ApiError(400, "Deck validation failed: NPC hero is missing.");
  }

  const reused = heroesDeck.filter((h) => h.heroId === npcHero.heroId).length > 1;

  if (reused) {
    throw new ApiError(
      400,
      `Invalid deck: NPC hero "${npcHero.heroId}" can't be uses as both 'Normal' & 'NPc' `
    );
  }

  return true;
}