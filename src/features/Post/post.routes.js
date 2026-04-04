import {
  getFeedController,
  createPostController,
  deletePostController,
  updatePostController,
  getPostByIdController,
} from "./post.controller.js";
import { Router } from "express";
import { verifyToken } from "../../middleware/auth.js";
const router = Router();

router.get("/feed", getFeedController);
router.post("/createpost", createPostController);
router.delete("/deletepost/:id", deletePostController);
router.put("/updatepost/:id", updatePostController);
router.get("/getpost/:id", getPostByIdController);
