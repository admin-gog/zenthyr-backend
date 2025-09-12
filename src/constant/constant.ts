export interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token?: string;
}

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export interface UserTokenPayload {
  _id: string;
  email: string;
  picture: string;
}