import { Router } from "express";
import {
  gameFinish,
  verifyHeroesDeck,
} from "../controller/games.controller.js";

const router = Router();

/**
 * @openapi
 * paths:
 *   /api/v1/game/verify:
 *     post:
 *       summary: Verify Heroes Deck
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: MongoDb assigned id (_id)
 *                   example: "68ff5d3ef484f150640e776a"
 *                 heroes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       heroId:
 *                         type: string
 *                         example: "Brightsteel"
 *                       heroLevel:
 *                         type: integer
 *                         example: 1
 *                       slotType:
 *                         type: string
 *                         example: "Normal / NPC"
 *       responses:
 *         "200":
 *           description: Deck Verified successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   statusCode:
 *                     type: integer
 *                     example: 200
 *                   data:
 *                     type: object
 *                     example: {}
 *                   message:
 *                     type: string
 *                     example: "Deck is Verified !!"
 *         "400":
 *           description: Missing data in request body
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   statusCode:
 *                     type: integer
 *                   message:
 *                     type: string
 *               example:
 *                 missingUserId:
 *                   summary: Missing userId
 *                   value:
 *                     statusCode: 400
 *                     message: "userId is required"
 *                 invalidHeroesDeck:
 *                   summary: Missing/Invalid Heroes Deck
 *                   value:
 *                     statusCode: 400
 *                   message: "Heroes Array is required and must contain only 4 items"
 *         "500":
 *           description: Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   statusCode:
 *                     type: integer
 *                     example: 500
 *                   message:
 *                     type: string
 *                     example: "Server Error"
 *   /api/v1/game/finish:
 *     post:
 *       summary: Add game record & Increase winning user XP and gold
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gameId:
 *                   type: string
 *                   description: Unique gameId
 *                   example: "x-13"
 *                 playerOne:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "68ff5d3ef484f150640e776a"
 *                     totalScore:
 *                       type: string
 *                       example: "80"
 *                     isFlagBearer:
 *                       type: boolean
 *                       example: true
 *                     gameLeft:
 *                       type: boolean
 *                       example: false
 *                 playerTwo:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "68ff5d3ef484f150640e776a"
 *                     totalScore:
 *                       type: string
 *                       example: "80"
 *                     isFlagBearer:
 *                       type: boolean
 *                       example: false
 *                     gameLeft:
 *                       type: boolean
 *                       example: false
 *                 totalTime:
 *                   type: string
 *                   example: "400"
 *       responses:
 *         "200":
 *           description: Deck Verified successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   statusCode:
 *                     type: integer
 *                     example: 200
 *                   data:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "68ff5d60f484f150640e7773"
 *                       isLevelUp:
 *                         type: boolean
 *                         example: false
 *                   message:
 *                     type: string
 *                     example: "Game Finished Successfully !!"
 *         "400":
 *           description: Missing data in request body
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   statusCode:
 *                     type: integer
 *                   message:
 *                     type: string
 *               example:
 *                 missingGameData:
 *                   summary: GameData - {gameId, playerOne, playerTwo, totalTime} is required in request body
 *                   value:
 *                     statusCode: 400
 *                     message: "GameId is required to end game."
 *                 uniqueGameId:
 *                   summary: To check if gameId is unique or not
 *                   value:
 *                     statusCode: 400
 *                   message: "Game with this gameId already exists"
 *         "500":
 *           description: Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   statusCode:
 *                     type: integer
 *                     example: 500
 *                   message:
 *                     type: string
 *                     example: "Server Error"
 */

router.post("/game/verify-deck", verifyHeroesDeck);
router.post("/game/finish", gameFinish);

export default router;
