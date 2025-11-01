import type { Types } from "mongoose";

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

export interface ValidateHero {
  heroId: string;
  heroLevel: number;
  slotType: string;
}

export type HeroesDeckProp = ValidateHero[];

export interface IUser extends Document {
  _id: string;
  googleId: string;
  email: string;
  name: string;
  picture: string;
  refreshToken: string;
  udi?: string;
  coins?: number;
  diamonds?: number;
  currentLevel: number;
  experiencePoints?: number;
  elixir?: number;
  goldEarned?: number;
  diamondEarned?: number;

  userStats?: {
    matchPlayed: number;
    matchWins: number;
    matchLost: number;
  };

  heroesInventory: {
    heroes: [
      {
        heroId: string;
        heroLevel: string;
        isActive: number;
      }
    ];
    count: number;
  };

  cannonInventory?: {
    cannon: [
      {
        type?: string;
        level: number;
      }
    ];
    count: number;
  }[];
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export interface IPlayerData {
  playerId: Types.ObjectId;
  totalScore: number;
  isFlagBearer: boolean;
  gameLeft: boolean;
}

export interface PlayerDataProp {
  id: string;
  totalScore: number;
  isFlagBearer: boolean;
  gameLeft:boolean;
}

export interface IWinnerRewards {
  winnerId: Types.ObjectId;
  xp: number;
  gold: number;
}

export interface IGamesRecord extends Document {
  gameId: string;
  playersData: IPlayerData[];
  winnerRewards: IWinnerRewards;
  gamePlayedTime: String;
}

export interface IUserGameStats extends Document {
  userId: Types.ObjectId;
  totalGamesPlayed: number;
  totalGamesWins: number;
  totalCoinsEarned: number;
  totalCoinsSpent: number;
  totalDiamondEarned: number;
  totalDiamondSpent: number;
  totalInAppPurchase: number;
}