import {
  createCommentController,
  updateCommentController,
  deleteCommentController,
  getCommentsCountByPostController,
  getCommentsByPostController,
  getCommentsByUserController,
  getCommentsCountByUserController,
} from "./comment.controller.js";
import { Router } from "express";
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = Router();

// Crear comentario
router.post("/create", verifyToken, createCommentController);

// Actualizar comentario (solo si es el creador)
router.put("/:id", verifyToken, updateCommentController);

// Eliminar comentario (solo si es el creador)
router.delete("/:id", verifyToken, deleteCommentController);

// Obtener cantidad de comentarios de un post
router.get("/count/:idPost", getCommentsCountByPostController);

// Obtener todos los comentarios de un post (con paginación opcional)
router.get("/post/:idPost", getCommentsByPostController);

// Obtener todos los comentarios de un usuario
router.get("/user/:idUser/comments", getCommentsByUserController);

// Obtener cantidad de comentarios de un usuario
router.get("/user/:idUser/count", getCommentsCountByUserController);

export default router;
