import mongoose, { Schema } from "mongoose";

interface IGamesPlayed extends Document {
  
}

const gamesPlayed: Schema = new Schema<IGamesPlayed>({});


export const GamesPlayed = mongoose.model<IGamesPlayed>("GamesPlayed", gamesPlayed);
