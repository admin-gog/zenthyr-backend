import type { Request, Response } from "express";
import {
  generateAccessAndRefereshTokens,
  getGoogleAccessToken,
  userGoogleInfo,
} from "../services/token.service.js";
import { User } from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken"
import { ApiResponse } from "../utils/ApiResponse.js";


export async function addRetreiveUserDetails(req: Request, res: Response) {
  try {
    const { code, udi } = req.body;

    if (!udi) {
      throw new ApiError(400, "Missing unique device identifier");
    }

    let user;

    if (code) {

      let googleUser;
      // Exchange auth code for Google access token
      try {
        const tokenData = await getGoogleAccessToken(
          code,
          process.env.GOOGLE_CLIENT_ID!,
          process.env.GOOGLE_CLIENT_SECRET!,
          process.env.GOOGLE_REDIRECT_URI!
        );
  
        // Fetch user details from Google
         googleUser = await userGoogleInfo(tokenData.access_token);
      } catch (error) {
        console.log(
          "Google API failed, falling back to UID-only user creation:",
          error
        );
        googleUser = null;
      }

      if (googleUser) {
        // Try finding user by email
        user = await User.findOne({ email: googleUser.email });

        if (!user) {
          // Try finding user by UID
          const userWithUdi = await User.findOne({ udi });
          if (userWithUdi) {
            userWithUdi.googleId = googleUser.id;
            userWithUdi.email = googleUser.email;
            userWithUdi.name = googleUser.name;
            userWithUdi.picture = googleUser.picture;

            delete userWithUdi.udi; // remove UID after attaching Google info
            await userWithUdi.save();
            user = userWithUdi;
          } else {
            // No UID match → create new user with Google info
            user = await User.create({
              googleId: googleUser.id,
              email: googleUser.email,
              name: googleUser.name,
              picture: googleUser.picture,
            });
          }
        }
      } else {
        // Google API failed → fallback: create/find user using UID only
        user = await User.findOne({ udi });
        if (!user) {
          user = await User.create({ udi });
        }
      }
    } else {
      // create/find user with just udi
      user = await User.findOne({ udi });
      if (!user) {
        user = await User.create({ udi });
      }
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user._id
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          user: {
            _id: user._id,
            email: user.email ?? null,
            name: user.name ?? null,
            picture: user.picture ?? null,
            udi: user.udi,
          },
          accessToken,
          refreshToken,
        },
        "Success"
      )
    );
  } catch (err: any) {
    throw new ApiError(err?.statusCode || 500, err?.message || "Server Error");
  }
}


interface RefreshTokenPayload extends jwt.JwtPayload {
  email: string;
}

export const refreshAccessToken = async (req : Request, res : Response) => {
  const incomingRefreshToken = req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as RefreshTokenPayload;

    const user = await User.findOne({ email: decodedToken.email });


    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const { accessToken, refreshToken } =
      await generateAccessAndRefereshTokens(user._id);

    return res
      .status(200)
      .json(
         new ApiResponse(200,{ accessToken, refreshToken: refreshToken },"Tokens generated successfully")
      );
  } catch (error : any) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
};
