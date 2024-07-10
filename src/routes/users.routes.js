import { Router } from "express";
import userRegistration from "../controllers/users.controllers.js";

const router = Router();

router.route("/registration").post(userRegistration);

export default router
