import { Router } from "express";
import { userRegistration, loginUser } from "../controllers/users.controllers.js";

const router = Router();

router.route("/registration").post(userRegistration);
router.route("/loginUser").post(loginUser)



export default router
