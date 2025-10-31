import { Router } from "express";
import { addRetreiveUserDetails, refreshAccessToken } from "../controller/user.controller.js";
import { verifyToken } from "../middleware/verify.middleware.js";
import { initiateInAppPurchase } from "../controller/purchase.controller.js";

const router = Router();

router.post('/user/auth', addRetreiveUserDetails)
router.post("/refresh-token", refreshAccessToken);
router.post("/user/purchase-coins",verifyToken,initiateInAppPurchase)


export default router;