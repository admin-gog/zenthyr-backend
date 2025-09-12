import type { GoogleUser, TokenResponse } from "../constant/constant.js";
import { ApiError } from "../utils/ApiError.js";

export const getAccessToken = async (
  authCode: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
): Promise<TokenResponse
> => {
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

  return response.json() as Promise<TokenResponse>;
};

export const userGoogleInfo = async (accessToken: string): Promise<GoogleUser> => {
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