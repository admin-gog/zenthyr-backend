import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { AccessTokenPayload } from "../constant/constant.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../model/user.model.js";


export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const token = req.header("Authorization");

   if (!token) {
     throw new ApiError(401, "Unauthorized request");
   }

    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as AccessTokenPayload;

    const user = await User.findById(decodedToken?._id).select(
      "-refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    (req as any).user = user;

    // Pass control to next middleware/route
    next();
  } catch (error: any) {
    throw new ApiError(403, "Invalid access token");
  }
};