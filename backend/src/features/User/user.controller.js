import {
  getUserService,
  updateUserService,
  updateUserPhotoService,
  deleteUserService,
} from "./user.service.js";

async function getUserController(req, res) {
  const userId = req.user.userId;
  try {
    const user = await getUserService(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function updateUserController(req, res) {
  const userId = req.user.userId;
  const { username, urlPhoto } = req.body;
  try {
    await updateUserService(userId, username, urlPhoto);
    res.status(200).json({ message: "Usuario actualizado exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function updateUserPhotoController(req, res) {
  const userId = req.user.userId;
  const { urlPhoto } = req.body;
  try {
    await updateUserPhotoService(userId, urlPhoto);
    res.status(200).json({ message: "Foto actualizada exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function deleteUserController(req, res) {
  const userId = req.user.userId;
  try {
    await deleteUserService(userId);
    res
      .clearCookie("token")
      .status(200)
      .json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export {
  getUserController,
  updateUserController,
  updateUserPhotoController,
  deleteUserController,
};
