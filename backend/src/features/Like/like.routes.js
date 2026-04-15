import {
  likePostController,
  unlikePostController,
  getLikesCountController,
  getLikesOfPostController,
  checkIfUserLikedPostController,
} from "./like.controller.js";
import { Router } from "express";
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = Router();

// Dar like a un post
router.post("/like", verifyToken, likePostController);

// Remover like de un post
router.post("/unlike", verifyToken, unlikePostController);

// Obtener cantidad de likes de un post
router.get("/count/:idPost", getLikesCountController);

// Obtener todos los likes de un post (usuarios que dieron like)
router.get("/getlikes/:idPost", getLikesOfPostController);

// Verificar si el usuario actual dio like al post
router.get("/checklike/:idPost", verifyToken, checkIfUserLikedPostController);

export default router;
