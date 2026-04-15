import {
  likePost,
  unlikePost,
  checkIfUserLikedPost,
  getLikesCount,
  getLikesOfPost,
  deleteLikesByPost,
  deleteLikesByUser,
} from "./like.repository.js";

async function likePostService(idPost, idUser) {
  try {
    // Validaciones
    if (!idPost || isNaN(idPost) || idPost <= 0) {
      throw new Error("El ID del post debe ser un número válido");
    }
    if (!idUser) {
      throw new Error("El usuario no está autenticado");
    }

    // Verificar si el usuario ya dio like al post
    const alreadyLiked = await checkIfUserLikedPost(idPost, idUser);
    if (alreadyLiked) {
      throw new Error("El usuario ya ha dado like a este post");
    }

    const result = await likePost(idPost, idUser);
    if (!result || result.insertId === 0) {
      throw new Error("No se pudo agregar el like");
    }

    return result;
  } catch (error) {
    throw error;
  }
}

async function unlikePostService(idPost, idUser) {
  try {
    // Validaciones
    if (!idPost || isNaN(idPost) || idPost <= 0) {
      throw new Error("El ID del post debe ser un número válido");
    }
    if (!idUser) {
      throw new Error("El usuario no está autenticado");
    }

    // Verificar si el usuario realmente dio like al post
    const alreadyLiked = await checkIfUserLikedPost(idPost, idUser);
    if (!alreadyLiked) {
      throw new Error("El usuario no ha dado like a este post");
    }

    const result = await unlikePost(idPost, idUser);
    if (!result || result.affectedRows === 0) {
      throw new Error("No se pudo remover el like");
    }

    return result;
  } catch (error) {
    throw error;
  }
}

async function getLikesCountService(idPost) {
  try {
    if (!idPost || isNaN(idPost) || idPost <= 0) {
      throw new Error("El ID del post debe ser un número válido");
    }

    const count = await getLikesCount(idPost);
    return count;
  } catch (error) {
    throw error;
  }
}

async function getLikesOfPostService(idPost) {
  try {
    if (!idPost || isNaN(idPost) || idPost <= 0) {
      throw new Error("El ID del post debe ser un número válido");
    }

    const likes = await getLikesOfPost(idPost);
    if (!likes) {
      throw new Error("No se pudo obtener los likes del post");
    }
    return likes;
  } catch (error) {
    throw error;
  }
}

async function checkIfUserLikedPostService(idPost, idUser) {
  try {
    if (!idPost || isNaN(idPost) || idPost <= 0) {
      throw new Error("El ID del post debe ser un número válido");
    }
    if (!idUser) {
      throw new Error("El usuario no está autenticado");
    }

    const liked = await checkIfUserLikedPost(idPost, idUser);
    return liked;
  } catch (error) {
    throw error;
  }
}

async function deleteLikesByPostService(idPost) {
  try {
    if (!idPost || isNaN(idPost) || idPost <= 0) {
      throw new Error("El ID del post debe ser un número válido");
    }

    await deleteLikesByPost(idPost);
    return { message: "Likes del post eliminados correctamente" };
  } catch (error) {
    throw error;
  }
}

async function deleteLikesByUserService(idUser) {
  try {
    if (!idUser) {
      throw new Error("El usuario no es válido");
    }

    await deleteLikesByUser(idUser);
    return { message: "Likes del usuario eliminados correctamente" };
  } catch (error) {
    throw error;
  }
}

export {
  likePostService,
  unlikePostService,
  getLikesCountService,
  getLikesOfPostService,
  checkIfUserLikedPostService,
  deleteLikesByPostService,
  deleteLikesByUserService,
};
