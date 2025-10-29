import mongoose, { Schema } from "mongoose";
import type { IGamesRecord } from "../constant/constant.js";


const gamesRecord: Schema = new Schema<IGamesRecord>({
  gameId: { type: String, required: true },
  playersData: [
    {
      playerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      totalScore: { type: Number, required: true },
      flag: { type: Boolean, required: true },
    },
  ],
  winnerRewards: {
    winnerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    xp: { type: Number, required: true },
    gold: { type: Number, required: true },
  },
  gamePlayedTime: { type: String, required: true },
});

export const GamesRecord = mongoose.model<IGamesRecord>("GamesRecord", gamesRecord);
