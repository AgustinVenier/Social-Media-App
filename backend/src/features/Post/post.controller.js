import {
  getFeedService,
  createPostService,
  deletePostService,
  updatePostService,
  getPostByIdService,
  getPostsByUserService,
} from "./post.service.js";

async function getFeedController(req, res) {
  const userId = req.user.userId;
  const { page, limit } = req.query;
  try {
    const feed = await getFeedService(userId, page, limit);
    res.status(200).json(feed);
  } catch (error) {
    res.status(400).json({ error: process.env.NODE_ENV === "production" && error.code ? "No se pudo procesar la solicitud" : error.message });
  }
}

async function createPostController(req, res) {
  const idUser = req.user.userId;
  const { description, photoUrl } = req.body;
  try {
    const post = await createPostService(idUser, description, photoUrl);
    res.status(201).json({
      message: "Post creado correctamente",
      postId: post.insertId,
    });
  } catch (error) {
    res.status(400).json({ error: process.env.NODE_ENV === "production" && error.code ? "No se pudo procesar la solicitud" : error.message });
  }
}

async function deletePostController(req, res) {
  const { id } = req.params;
  const idUser = req.user.userId;
  try {
    await deletePostService(id, idUser);
    res.status(200).json({ message: "Post eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ error: process.env.NODE_ENV === "production" && error.code ? "No se pudo procesar la solicitud" : error.message });
  }
}

async function updatePostController(req, res) {
  const { id } = req.params;
  const idUser = req.user.userId;
  const { description, photoUrl } = req.body;
  try {
    await updatePostService(id, idUser, description, photoUrl);
    res.status(200).json({ message: "Post actualizado correctamente" });
  } catch (error) {
    res.status(400).json({ error: process.env.NODE_ENV === "production" && error.code ? "No se pudo procesar la solicitud" : error.message });
  }
}

async function getPostByIdController(req, res) {
  const { id } = req.params;
  try {
    const post = await getPostByIdService(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ error: process.env.NODE_ENV === "production" && error.code ? "No se pudo procesar la solicitud" : error.message });
  }
}

async function getPostsByUserController(req, res) {
  const { idUser } = req.params;
  const { page, limit } = req.query;
  try {
    const posts = await getPostsByUserService(idUser, page, limit);
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ error: process.env.NODE_ENV === "production" && error.code ? "No se pudo procesar la solicitud" : error.message });
  }
}

export {
  getFeedController,
  createPostController,
  deletePostController,
  updatePostController,
  getPostByIdController,
  getPostsByUserController,
};
