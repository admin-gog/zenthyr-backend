import { Router } from "express";
import { addRetreiveUserDetails, refreshAccessToken } from "../controller/user.controller.js";

const router = Router();

router.post('/auth/user-info', addRetreiveUserDetails)
router.post("/refresh-token", refreshAccessToken);


export default router;