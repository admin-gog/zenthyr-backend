import { Router } from "express";
import { verifyToken } from "../middleware/verify.middleware.js";
import { gameFinish, verifyHeroesDeck } from "../controller/games.controller.js";


const router = Router();

router.post("/game/verify-deck",verifyToken,verifyHeroesDeck);
router.post("/game/finish",verifyToken,gameFinish);

export default router;