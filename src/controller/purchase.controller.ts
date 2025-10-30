import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { GenericApiResponse } from "../utils/GenericApiResponse.js";

const goldPacks = [
    { "id": "small_chest", "diamondsCost": 10, "coinsReward": 100 },
    { "id": "medium_chest", "diamondsCost": 25, "coinsReward": 300 },
    { "id": "big_chest", "diamondsCost": 50, "coinsReward": 700 }
  ]


  // initiate in-app purchase

export const initiateInAppPurchase = async (req : Request ,res : Response) => {
  try {
    const { packId } = req.body;
    const user = (req as any).user;

    if (!packId) {
      throw new ApiError(400, "Missing packId");
    }

    // 1. Find the pack from config
    const pack = goldPacks.find((p) => p.id === packId);

    if (!pack) {
      throw new ApiError(400, "Invalid packId");
    }

    // 3. Check diamonds balance
    if ((user.diamonds ?? 0) < pack.diamondsCost) {
      throw new ApiError(400, "Insufficient diamonds");
    }

    // 4. Perform transaction (atomic update recommended)
    user.diamonds = (user.diamonds ?? 0) - pack.diamondsCost;
    user.coins = (user.coins ?? 0) + pack.coinsReward;

    await user.save();

    // 5. Success response
    return res.status(200).json(
      new GenericApiResponse(
        200,
        {
          user
        },
        "Purchase successful"
      )
    );
  } catch (err: any) {
     throw new ApiError(err?.statusCode || 500, err?.message || "Server Error");
  }

} 