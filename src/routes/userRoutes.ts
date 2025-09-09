import { Router } from "express";
import { userDetails } from "../controller/userController.js";

const router = Router();

router.post('/',userDetails)


export default router;