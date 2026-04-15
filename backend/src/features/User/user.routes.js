import { Router } from "express";
import {
  getUserController,
  updateUserController,
  updateUserPhotoController,
  deleteUserController,
} from "./user.controller.js";
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = Router();

router.get("/profile", verifyToken, getUserController);
router.put("/update", verifyToken, updateUserController);
router.put("/photo", verifyToken, updateUserPhotoController);
router.delete("/delete", verifyToken, deleteUserController);

export default router;
