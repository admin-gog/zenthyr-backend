import { Router } from "express";
import { addRetreiveUserDetails } from "../controller/user.controller.js";

const router = Router();

router.post('/user-info', addRetreiveUserDetails)


export default router;