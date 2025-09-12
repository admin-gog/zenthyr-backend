import type { Request, Response } from "express";
import { getAccessToken, userGoogleInfo } from "../services/token.service.js";
import { User } from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js";

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
      return res.status(400).json({ error: "Missing authorization code" });
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


    res.status(200).json(
      {
        user: user,
        accessToken,
        refreshToken,
      },
    );
  } catch (err) {
    res.status(500).json(err);
  }
}
