import {
  likePostService,
  unlikePostService,
  getLikesCountService,
  getLikesOfPostService,
  checkIfUserLikedPostService,
  deleteLikesByPostService,
  deleteLikesByUserService,
} from "./like.service.js";

async function likePostController(req, res) {
  const { idPost } = req.body;
  const idUser = req.user.userId;
  try {
    const result = await likePostService(idPost, idUser);
    res.status(200).json({
      message: "Like agregado correctamente",
      likeId: result.insertId,
    });
  } catch (error) {
    res.status(400).json({ error: process.env.NODE_ENV === "production" && error.code ? "No se pudo procesar la solicitud" : error.message });
  }
}

async function unlikePostController(req, res) {
  const { idPost } = req.body;
  const idUser = req.user.userId;
  try {
    await unlikePostService(idPost, idUser);
    res.status(200).json({ message: "Like removido correctamente" });
  } catch (error) {
    res.status(400).json({ error: process.env.NODE_ENV === "production" && error.code ? "No se pudo procesar la solicitud" : error.message });
  }
}

async function getLikesCountController(req, res) {
  const { idPost } = req.params;
  try {
    const count = await getLikesCountService(idPost);
    res.status(200).json({ count });
  } catch (error) {
    res.status(400).json({ error: process.env.NODE_ENV === "production" && error.code ? "No se pudo procesar la solicitud" : error.message });
  }
}

async function getLikesOfPostController(req, res) {
  const { idPost } = req.params;
  try {
    const likes = await getLikesOfPostService(idPost);
    res.status(200).json(likes);
  } catch (error) {
    res.status(400).json({ error: process.env.NODE_ENV === "production" && error.code ? "No se pudo procesar la solicitud" : error.message });
  }
}

async function checkIfUserLikedPostController(req, res) {
  const { idPost } = req.params;
  const idUser = req.user.userId;
  try {
    const liked = await checkIfUserLikedPostService(idPost, idUser);
    res.status(200).json({ liked });
  } catch (error) {
    res.status(400).json({ error: process.env.NODE_ENV === "production" && error.code ? "No se pudo procesar la solicitud" : error.message });
  }
}

export {
  likePostController,
  unlikePostController,
  getLikesCountController,
  getLikesOfPostController,
  checkIfUserLikedPostController,
};
