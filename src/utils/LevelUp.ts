import { ApiError } from "./ApiError.js";
import config from "./LoadConfig.js";

export const levelUp = (user: any, winnerPlayerId: string, isLevelUp:boolean) => {
  try {
    const xpThreshold = config.level_up_xp.find(
      (lvl: any) => lvl.level === user.currentLevel
    );

    if (user.experiencePoints && user.experiencePoints >= xpThreshold.xp) {
      user.experiencePoints -= xpThreshold.xp;
      user.currentLevel += 1;
      isLevelUp = true;
    }
    return { isLevelUp };
  } catch (err: any) {
    throw new ApiError(err?.statusCode || 500, err?.message || "Server Error");
  }
};
