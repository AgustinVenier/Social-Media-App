import bcrypt from "bcrypt";
import {
  searchUserByName,
  getUserById,
  updateUser,
  updateUserPhoto,
  deleteUser,
} from "./user.repository.js";

async function getUserService(userId) {
  try {
    if (!userId) {
      throw new Error("El ID del usuario es requerido");
    }

    const user = await getUserById(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return user;
  } catch (error) {
    throw error;
  }
}

async function updateUserService(userId, username, urlPhoto) {
  try {
    if (!userId) {
      throw new Error("El ID del usuario es requerido");
    }

    if (username && username.length < 3) {
      throw new Error("El username debe tener al menos 3 caracteres");
    }
    if (username && username.length > 100) {
      throw new Error("El username no puede tener más de 100 caracteres");
    }

    if (urlPhoto && urlPhoto.length > 255) {
      throw new Error("La URL de la foto no puede tener más de 255 caracteres");
    }

    await updateUser(userId, username, urlPhoto);
    return { message: "Usuario actualizado exitosamente" };
  } catch (error) {
    throw error;
  }
}

async function updateUserPhotoService(userId, urlPhoto) {
  try {
    if (!userId) {
      throw new Error("El ID del usuario es requerido");
    }
    if (!urlPhoto || urlPhoto.trim().length === 0) {
      throw new Error("La URL de la foto es requerida");
    }
    if (urlPhoto.length > 255) {
      throw new Error("La URL de la foto no puede tener más de 255 caracteres");
    }

    await updateUserPhoto(userId, urlPhoto);
    return { message: "Foto de perfil actualizada exitosamente" };
  } catch (error) {
    throw error;
  }
}

async function deleteUserService(userId) {
  try {
    if (!userId) {
      throw new Error("El ID del usuario es requerido");
    }

    const result = await deleteUser(userId);
    if (result.affectedRows === 0) {
      throw new Error("Usuario no encontrado");
    }

    return { message: "Usuario eliminado exitosamente" };
  } catch (error) {
    throw error;
  }
}

export {
  getUserService,
  updateUserService,
  updateUserPhotoService,
  deleteUserService,
};
