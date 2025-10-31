import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import type { IUser } from "../constant/constant.js";

const userSchema: Schema = new Schema<IUser>({
  googleId: { type: String },
  email: { type: String },
  name: { type: String },
  picture: { type: String },
  udi: { type: String },
  refreshToken: {
    type: String,
  },
  coins: { type: Number, default: 0 },
  diamonds: { type: Number, default: 0 },
  currentLevel: { type: Number, default: 1 },
  experiencePoints: { type: Number, default: 0 },
  elixir: { type: Number, default: 0 },
  goldEarned: { type: Number, default: 0 },
  diamondEarned: { type: Number, default: 0 },
  userStats: {
    matchPlayed: { type: Number, default: 0 },
    matchWins: { type: Number, default: 0 },
    matchLost: { type: Number, default: 0 },
  },
  heroesInventory: {
    // heroTypes: { type: String }
    heroes: [
      {
        heroId: { type: String, required: true },
        heroLevel: { type: Number, default: 1 },
        isActive: { type: Boolean },
      },
    ],
    count: { type: Number },
    // heroTypes array with objects containing - heroName or its types & its levels
  },
  cannonInventory: {
    cannon: [
      {
        type: { type: String },
        level: { type: Number, default: 1 },
        isActive: { type: Boolean },
      },
    ],
    count: { type: Number },
  },
});


userSchema.methods.generateAccessToken = function (this: IUser): string {
  const payload = {
    _id: this._id,
    udi: this.udi,
  };
  
  const secret = process.env.ACCESS_TOKEN_SECRET;
  const expiry = process.env.ACCESS_TOKEN_EXPIRY;
  
  if (!secret) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
  }
  
  if (!expiry) {
    throw new Error("ACCESS_TOKEN_EXPIRY is not defined");
  }
  
  const options: jwt.SignOptions = {
    expiresIn: "1H", // Default to 1 hour if not specified
  };
  
  return jwt.sign(payload, secret, options);
};

userSchema.methods.generateRefreshToken = function (this: IUser): string {
  const payload = {
    // email: this.email,
    _id: this._id,
  };
  
  const secret = process.env.REFRESH_TOKEN_SECRET;
  // const expiry = process.env.REFRESH_TOKEN_EXPIRY;
  
  if (!secret) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
  }
  
  const options: jwt.SignOptions = {
    expiresIn: "1D", // Default to 1 hour if not specified
  };
  
  return jwt.sign(payload, secret, options);
};

export const User = mongoose.model<IUser>("User", userSchema);