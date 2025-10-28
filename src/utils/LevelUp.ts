import { User } from "../model/user.model.js";
import { ApiError } from "./ApiError.js";
import config from "./LoadConfig.js";


export const levelUp = async(user : any, winnerPlayerId:string) => {

try {
  const xpThreshold = config.level_up_xp.find(
      (lvl:any) => lvl.level === user.currentLevel
    );

    if(user.experiencePoints)
    if (user.experiencePoints >= xpThreshold.xp) {
      // Calculate how many levels user can gain (if they had extra XP)
      const levelsGained = Math.floor(user.experiencePoints / xpThreshold.xp);
      await User.updateOne(
        { _id: winnerPlayerId },
        {
          $inc: {
            currentLevel: levelsGained,
          },
          $set: {
            experiencePoints: 0,
          },
        }
      );
    }
} catch (err:any) {
     throw new ApiError(err?.statusCode || 500, err?.message || "Server Error");
}
}
