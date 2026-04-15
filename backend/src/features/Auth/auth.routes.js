import { Router } from "express";
import { verifyToken } from "../../middleware/authMiddleware.js";
import {
  loginController,
  registerController,
  logoutController,
} from "./auth.controller.js";

const router = Router();

router.post("/login", loginController);
router.post("/register", registerController);
router.post("/logout", verifyToken, logoutController);

export default router;
