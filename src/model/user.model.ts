import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"

interface IUser extends Document {
  _id:string;
  googleId: string;
  email: string;
  name: string;
  picture: string;
  refreshToken: string;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema: Schema = new Schema<IUser>({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  picture: { type: String },
  refreshToken: {
    type: String,
  },
});


userSchema.methods.generateAccessToken = function (this: IUser): string {
  const payload = {
    _id: this._id,
    email: this.email,
    picture: this.picture,
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
    email: this.email,
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