import { Router } from "express";
import { gameFinish, verifyHeroesDeck } from "../controller/games.controller.js";


const router = Router();

router.post("/game/verify-deck",verifyHeroesDeck);
router.post("/game/finish",gameFinish);

export default router;