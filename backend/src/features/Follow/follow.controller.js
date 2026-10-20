import {
  followUserByUsernameService,
  unfollowUserService,
  checkFollowStatusService,
  getFollowersService,
  getFollowingService,
  getFollowersCountService,
  getFollowingCountService,
} from "./follow.service.js";

async function followController(req, res) {
  const idFollower = req.user.userId;
  const { username } = req.body;

  try {
    await followUserByUsernameService(idFollower, username);
    res.status(200).json({ message: "Usuario seguido exitosamente" });
  } catch (error) {
    res.status(400).json({ error: process.env.NODE_ENV === "production" && error.code ? "No se pudo procesar la solicitud" : error.message });
  }
}

async function unfollowController(req, res) {
  const idFollower = req.user.userId;
  const { idFollowed } = req.body;

  try {
    await unfollowUserService(idFollower, idFollowed);
    res.status(200).json({ message: "Usuario dejado de seguir exitosamente" });
  } catch (error) {
    res.status(400).json({ error: process.env.NODE_ENV === "production" && error.code ? "No se pudo procesar la solicitud" : error.message });
  }
}

async function checkFollowStatusController(req, res) {
  const idFollower = req.user.userId;
  const { idFollowed } = req.body;

  try {
    const result = await checkFollowStatusService(idFollower, idFollowed);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: process.env.NODE_ENV === "production" && error.code ? "No se pudo procesar la solicitud" : error.message });
  }
}

async function getFollowersController(req, res) {
  const { idFollowed } = req.params;

  try {
    const followers = await getFollowersService(idFollowed);
    res.status(200).json(followers);
  } catch (error) {
    res.status(400).json({ error: process.env.NODE_ENV === "production" && error.code ? "No se pudo procesar la solicitud" : error.message });
  }
}

async function getFollowingController(req, res) {
  const { idFollower } = req.params;

  try {
    const following = await getFollowingService(idFollower);
    res.status(200).json(following);
  } catch (error) {
    res.status(400).json({ error: process.env.NODE_ENV === "production" && error.code ? "No se pudo procesar la solicitud" : error.message });
  }
}

async function getFollowersCountController(req, res) {
  const { idFollowed } = req.params;

  try {
    const count = await getFollowersCountService(idFollowed);
    res.status(200).json({ count });
  } catch (error) {
    res.status(400).json({ error: process.env.NODE_ENV === "production" && error.code ? "No se pudo procesar la solicitud" : error.message });
  }
}

async function getFollowingCountController(req, res) {
  const { idFollower } = req.params;

  try {
    const count = await getFollowingCountService(idFollower);
    res.status(200).json({ count });
  } catch (error) {
    res.status(400).json({ error: process.env.NODE_ENV === "production" && error.code ? "No se pudo procesar la solicitud" : error.message });
  }
}

export {
  followController,
  unfollowController,
  checkFollowStatusController,
  getFollowersController,
  getFollowingController,
  getFollowersCountController,
  getFollowingCountController,
};

