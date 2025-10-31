import { User } from "../model/user.model.js"
import config from "../utils/LoadConfig.js";

export const createUserWithUid = async (udi:string) => {
  return await User.create({
    udi,
    heroesInventory: {
      heroes: [
        {
          heroId: config.default_heroes[0].heroId,
          heroLevel: 1,
          isActive: true,
        },
        {
          heroId: config.default_heroes[1].heroId,
          heroLevel: 1,
          isActive: true,
        },
      ],
      count: config.default_heroes.length,
    },
  });
}