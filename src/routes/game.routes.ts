import { Router } from "express";
import { verifyToken } from "../middleware/verify.middleware.js";
import { verifyHeroesDeck } from "../controller/games.controller.js";


const router = Router();

router.post("/game/verify-deck",verifyToken,verifyHeroesDeck)

export default router;