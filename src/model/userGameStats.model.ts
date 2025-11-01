import mongoose, { Schema } from "mongoose";
import type { IUserGameStats } from "../constant/constant.js";

const userGameStatsSchema: Schema = new Schema<IUserGameStats>({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  totalGamesPlayed: { type: Number, default: 0 },
  totalGamesWins: { type: Number, default: 0 },
  totalCoinsEarned: { type: Number, default: 0 },
  totalCoinsSpent: { type: Number, default: 0 },
  totalDiamondEarned: { type: Number, default: 0 },
  totalDiamondSpent: { type: Number, default: 0 },
  totalInAppPurchase: { type: Number, default: 0 },
});

export const UserGameStats = mongoose.model<IUserGameStats>(
  "UserGameStats",
  userGameStatsSchema
);
