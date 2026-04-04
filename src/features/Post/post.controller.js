import {
  getFeedService,
  createPostService,
  deletePostService,
  updatePostService,
  getPostByIdService,
} from "./post.service.js";

async function getFeedController(req, res) {
  //obtego userId del token??
  const userId = req.user.userId;
  try {
    const feed = await getFeedService(userId);
    res.json(feed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deletePostController(req, res) {
  const { id } = req.params;
  try {
    await deletePostService(id);
    res.json({ message: "Post eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createPostController(req, res) {
  const { photoUrl, description } = req.body;
  try {
    const post = await createPostService(desc, photoUrl);
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updatePostController(req, res) {
  const { id } = req.params;
  const { photoUrl, description } = req.body;
  try {
    await updatePostService(id, desc, photoUrl);
    res.json({ message: "Post actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getPostByIdController(req, res) {
  const { id } = req.params;
  try {
    const post = await getPostByIdService(id);
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export {
  getFeedController,
  createPostController,
  deletePostController,
  updatePostController,
  getPostByIdController,
};
