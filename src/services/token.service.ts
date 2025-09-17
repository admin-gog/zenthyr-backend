import type { GoogleTokenResponse, UserGoogleData } from "../constant/constant.js";
import { User } from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js";


export const generateAccessAndRefereshTokens = async (userId :string) => {
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

export const getGoogleAccessToken = async (
  authCode: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
): Promise<GoogleTokenResponse> => {
  const url = "https://oauth2.googleapis.com/token";

  const params = new URLSearchParams();
  params.append("code", authCode);
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("redirect_uri", redirectUri);
  params.append("grant_type", "authorization_code");

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(response.status, errorText);
  }

  return response.json() as Promise<GoogleTokenResponse>;
};

export const userGoogleInfo = async (accessToken: string): Promise<UserGoogleData> => {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(response.status, errorText);
  }
  const data = await response.json();

  return data;
};