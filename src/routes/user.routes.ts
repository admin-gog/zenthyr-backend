import { Router } from "express";
import { addRetreiveUserDetails, refreshAccessToken } from "../controller/user.controller.js";
import { verifyToken } from "../middleware/verify.middleware.js";
import { initiateInAppPurchase } from "../controller/purchase.controller.js";

const router = Router();

/**
 * @openapi
 * paths:
 *   /api/v1/user/auth:
 *     post:
 *       summary: User Authentication
 *       description: >
 *         Creates or retrieves a user based on Google OAuth code or a unique device identifier (UDI).  
 *         - If a Google authorization `code` is provided, the API exchanges it for user info and links or creates the user.  
 *         - If Google authentication fails or no code is provided, the API falls back to creating/retrieving user using `udi`.  
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   description: Google OAuth authorization code (optional)
 *                   example: "4/0AY0e-g7exampleCode12345"
 *                 udi:
 *                   type: string
 *                   description: Unique device identifier (required)
 *                   example: "device-12345-uuid"
 *       responses:
 *         "200":
 *           description: User authenticated successfully
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
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "652cddc39b12345fbc123456"
 *                           email:
 *                             type: string
 *                             example: "user@example.com"
 *                           name:
 *                             type: string
 *                             example: "John Doe"
 *                           picture:
 *                             type: string
 *                             example: "https://lh3.googleusercontent.com/a-/example.jpg"
 *                           udi:
 *                             type: string
 *                             example: "device-12345-uuid"
 *                       accessToken:
 *                         type: string
 *                         description: JWT access token
 *                         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                       refreshToken:
 *                         type: string
 *                         description: JWT refresh token
 *                         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   message:
 *                     type: string
 *                     example: "Success"
 *         "400":
 *           description: Missing unique device identifier
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   statusCode:
 *                     type: integer
 *                     example: 400
 *                   message:
 *                     type: string
 *                     example: "Missing unique device identifier"
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
 * /api/v1/refresh-token:
 *   post:
 *     summary: Refresh Access Token
 *     description: >
 *       Validates the incoming refresh token and issues new access and refresh tokens.
 *       <br><br>
 *       - Requires a valid `refreshToken` in the request body.  
 *       - If token is invalid, expired, or does not match the stored token, the request fails with 401.  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Valid refresh token obtained from a previous login or token refresh.
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       "200":
 *         description: Tokens generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: Newly issued JWT access token
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     refreshToken:
 *                       type: string
 *                       description: Newly issued JWT refresh token
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 message:
 *                   type: string
 *                   example: "Tokens generated successfully"
 *       "401":
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "Invalid refresh token"
 * /api/v1/user/purchase-coins:
 *   post:
 *     summary: Purchase coins using diamonds
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: "JWT access token."
 *         schema:
 *          type: string
 *     description: |
 *       Allows an authenticated user to purchase coin packs using their diamond balance.
 *       Requires a valid JWT access token in the `Authorization` header.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - packId
 *             properties:
 *               packId:
 *                 type: string
 *                 description: ID of the coin pack to purchase
 *                 example: "medium_chest"
 *     responses:
 *       "200":
 *         description: Purchase successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       description: Updated user data after purchase
 *                 message:
 *                   type: string
 *                   example: "Purchase successful"
 *       "400":
 *         description: Bad Request (Missing or invalid packId, or insufficient diamonds)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Insufficient diamonds"
 *       "401":
 *         description: Unauthorized - Missing or invalid access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "Unauthorized request"
 *       "500":
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Server Error"
 */

router.post('/user/auth', addRetreiveUserDetails)
router.post("/refresh-token", refreshAccessToken);
router.post("/user/purchase-coins",verifyToken,initiateInAppPurchase)


export default router;