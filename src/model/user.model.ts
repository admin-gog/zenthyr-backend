import mongoose, { Schema } from "mongoose";

const UserSchema: Schema = new Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  picture: { type: String },
});

export const User = mongoose.model("User", UserSchema);
