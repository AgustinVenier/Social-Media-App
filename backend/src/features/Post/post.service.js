import {
  getFeed,
  createPost,
  deletePost,
  updatePost,
  getPostById,
  getPostsByUser,
} from "./post.repository.js";

async function getFeedService(userId) {
  try {
    if (!userId) {
      throw new Error("El usuario no está autenticado");
    }
    const feed = await getFeed(userId);
    if (!feed) {
      throw new Error("No se pudo obtener el feed");
    }
    return feed;
  } catch (error) {
    throw error;
  }
}

async function createPostService(idUser, description, photoUrl) {
  try {
    if (!idUser) {
      throw new Error("El usuario no está autenticado");
    }
    if (!description || description.trim().length === 0) {
      throw new Error("La descripción no puede estar vacía");
    }
    if (description.length > 255) {
      throw new Error("La descripción no puede tener más de 255 caracteres");
    }
    if (!photoUrl || photoUrl.trim().length === 0) {
      throw new Error("La URL de la foto no puede estar vacía");
    }
    if (photoUrl.length > 255) {
      throw new Error("La URL de la foto no puede tener más de 255 caracteres");
    }

    const result = await createPost(idUser, description, photoUrl);

    if (!result || result.insertId === 0) {
      throw new Error("No se pudo crear el post");
    }

    return result;
  } catch (error) {
    throw error;
  }
}

async function deletePostService(id, idUser) {
  try {
    if (!id || isNaN(id) || id <= 0) {
      throw new Error("El ID del post debe ser un número válido");
    }
    if (!idUser) {
      throw new Error("El usuario no está autenticado");
    }

    // Verificar que el post existe y es del usuario
    const post = await getPostById(id);
    if (!post || post.length === 0) {
      throw new Error("El post no existe");
    }
    if (post[0].idUser !== idUser) {
      throw new Error("No tienes permisos para eliminar este post");
    }

    const result = await deletePost(id);
    if (result.affectedRows === 0) {
      throw new Error("No se pudo eliminar el post");
    }

    return result;
  } catch (error) {
    throw error;
  }
}

async function updatePostService(id, idUser, description, photoUrl) {
  try {
    if (!id || isNaN(id) || id <= 0) {
      throw new Error("El ID del post debe ser un número válido");
    }
    if (!idUser) {
      throw new Error("El usuario no está autenticado");
    }
    if (!description || description.trim().length === 0) {
      throw new Error("La descripción no puede estar vacía");
    }
    if (description.length > 255) {
      throw new Error("La descripción no puede tener más de 255 caracteres");
    }
    if (!photoUrl || photoUrl.trim().length === 0) {
      throw new Error("La URL de la foto no puede estar vacía");
    }
    if (photoUrl.length > 255) {
      throw new Error("La URL de la foto no puede tener más de 255 caracteres");
    }

    const existingPost = await getPostById(id);
    if (!existingPost || existingPost.length === 0) {
      throw new Error("El post no existe");
    }
    if (existingPost[0].idUser !== idUser) {
      throw new Error("No tienes permisos para editar este post");
    }

    const result = await updatePost(id, description, photoUrl);
    if (result.affectedRows === 0) {
      throw new Error("No se pudo actualizar el post");
    }

    return result;
  } catch (error) {
    throw error;
  }
}

async function getPostByIdService(id) {
  try {
    if (!id || isNaN(id) || id <= 0) {
      throw new Error("El ID del post debe ser un número válido");
    }

    const post = await getPostById(id);
    if (!post || post.length === 0) {
      throw new Error("El post no existe");
    }

    return post[0];
  } catch (error) {
    throw error;
  }
}

async function getPostsByUserService(idUser) {
  try {
    if (!idUser) {
      throw new Error("El ID del usuario es requerido");
    }

    const posts = await getPostsByUser(idUser);
    if (!posts) {
      throw new Error("No se pudieron obtener los posts del usuario");
    }

    return posts;
  } catch (error) {
    throw error;
  }
}

export {
  getFeedService,
  createPostService,
  deletePostService,
  updatePostService,
  getPostByIdService,
  getPostsByUserService,
};
