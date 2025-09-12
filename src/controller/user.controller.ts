import type { Request, Response } from "express";
import { getAccessToken, userGoogleInfo } from "../services/token.service.js";
import { User } from "../model/user.model.js";
import jwt from "jsonwebtoken";


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

    const jwtPayload = {
      id: user._id,
      email: user.email,
      picture: user.picture,
    };
    const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
      expiresIn: "1H", // optional, can be adjusted
    });

    res.status(200).json({ user, token: jwtToken });
  } catch (err) {
    res.status(500).json(err);
  }
}
