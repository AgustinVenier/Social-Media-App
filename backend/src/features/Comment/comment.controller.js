import {
  createCommentService,
  updateCommentService,
  deleteCommentService,
  getCommentsCountByPostService,
  getCommentsByPostService,
  getCommentsByUserService,
  getCommentsCountByUserService,
} from "./comment.service.js";

async function createCommentController(req, res) {
  const { idPost, description } = req.body;
  const idUser = req.user.userId;

  try {
    const result = await createCommentService(idPost, idUser, description);
    res.status(201).json({
      message: "Comentario creado correctamente",
      commentId: result.id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function updateCommentController(req, res) {
  const { id } = req.params;
  const { description } = req.body;
  const idUser = req.user.userId;

  try {
    await updateCommentService(id, idUser, description);
    res.status(200).json({ message: "Comentario actualizado correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function deleteCommentController(req, res) {
  const { id } = req.params;
  const idUser = req.user.userId;

  try {
    await deleteCommentService(id, idUser);
    res.status(200).json({ message: "Comentario eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getCommentsCountByPostController(req, res) {
  const { idPost } = req.params;

  try {
    const count = await getCommentsCountByPostService(idPost);
    res.status(200).json({ count });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getCommentsByPostController(req, res) {
  const { idPost } = req.params;
  const { limit, offset } = req.query;

  try {
    const comments = await getCommentsByPostService(
      idPost,
      limit ? parseInt(limit) : 10,
      offset ? parseInt(offset) : 0,
    );
    res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getCommentsByUserController(req, res) {
  const { idUser } = req.params;

  try {
    const comments = await getCommentsByUserService(idUser);
    res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getCommentsCountByUserController(req, res) {
  const { idUser } = req.params;

  try {
    const count = await getCommentsCountByUserService(idUser);
    res.status(200).json({ count });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export {
  createCommentController,
  updateCommentController,
  deleteCommentController,
  getCommentsCountByPostController,
  getCommentsByPostController,
  getCommentsByUserController,
  getCommentsCountByUserController,
};
