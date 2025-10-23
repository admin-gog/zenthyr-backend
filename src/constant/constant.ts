
export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token?: string;
}

export interface UserGoogleData {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export interface AccessTokenPayload {
  _id: string;
  udi: string;
}

export interface UserSelectedHero {
  type:string;
  level:number;
}