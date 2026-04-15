import {
  getFeedController,
  createPostController,
  deletePostController,
  updatePostController,
  getPostByIdController,
  getPostsByUserController,
} from "./post.controller.js";
import { Router } from "express";
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = Router();

router.get("/feed", verifyToken, getFeedController);
router.post("/create", verifyToken, createPostController);
router.delete("/:id", verifyToken, deletePostController);
router.put("/:id", verifyToken, updatePostController);
router.get("/:id", getPostByIdController);
router.get("/user/:idUser", getPostsByUserController);

export default router;
