import type { Request, Response } from "express";
import { getAccessToken, userGoogleInfo } from "../services/token.service.js";
import { User } from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken"


const generateAccessAndRefereshTokens = async (userId :string) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

export async function addRetreiveUserDetails(req: Request, res: Response) {
  try {
    const { code } = req.body;

    if (!code) {
      throw new ApiError(400, "Missing authorization code");
    }

    // generate access token from auth-token
    const tokenData = await getAccessToken(
      code,
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      process.env.GOOGLE_REDIRECT_URI!
    );

    // Fetch user details using access-token
    const googleUser = await userGoogleInfo(tokenData.access_token);

    // Store in MongoDB (if not exists)
    let user = await User.findOne({ email: googleUser.email });
    if (!user) {
      user = await User.create({
        googleId: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
      });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);


    res.status(200).json({
      user: {
        _id: user._id,
        googleId: user.googleId,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
      accessToken,
      refreshToken,
    });
  } catch (err:any) {
    throw new ApiError(err?.statusCode, err?.message);
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
          { accessToken, refreshToken: refreshToken },
      );
  } catch (error : any) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
};
