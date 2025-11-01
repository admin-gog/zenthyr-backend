import type { Request, Response } from "express";
import { UserGameStats } from "../model/userGameStats.model.js";
import { GenericApiResponse } from "../utils/GenericApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const fetchUserGameStats = async (req: Request, res: Response) => {
  try {
    const id = (req as any).user._id;

    if(!id){
      throw new ApiError(400,"UserId not found")
    }
  
    const gameStats = await UserGameStats.findOne({ userId : id});

    res
      .status(200)
      .json(
        new GenericApiResponse(
          200,
          gameStats,
          "Data retrieved successfully"
        )
      );
  } catch (err : any) {
    throw new ApiError(err?.statusCode || 500, err?.message || "Server Error");
  }
}