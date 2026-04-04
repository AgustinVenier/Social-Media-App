import {
  getFeed,
  createPost,
  deletePost,
  updatePost,
  getPostById,
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

async function createPostService(desc, photoUrl) {
  try {
    if (desc.length > 255) {
      throw new Error("La descripción no puede tener más de 255 caracteres");
    }
    if (photoUrl.length > 255) {
      throw new Error("La URL de la foto no puede tener más de 255 caracteres");
    }
    if (photoUrl.length === 0) {
      throw new Error("La URL de la foto no puede estar vacía");
    }
    if (desc.length === 0) {
      throw new Error("La descripción no puede estar vacía");
    }

    const result = await createPost(desc, photoUrl);

    if (!result || result.insertId === 0) {
      throw new Error("No se pudo crear el post");
    }

    return result;
  } catch (error) {
    throw error;
  }
}

async function deletePostService(id) {
  try {
    const result = await deletePost(id);
    if (!result) {
      throw new Error("No se pudo eliminar el post");
    }
    if (result.affectedRows === 0) {
      throw new Error("No se encontró el post a eliminar");
    }
    if (result.affectedRows > 1) {
      throw new Error("Se eliminaron múltiples posts, algo salió mal");
    }
    return result;
  } catch (error) {
    throw error;
  }
}

async function updatePostService(id, desc, photoUrl) {
  try {
    if (desc.length > 255) {
      throw new Error("La descripción no puede tener más de 255 caracteres");
    }
    if (photoUrl.length > 255) {
      throw new Error("La URL de la foto no puede tener más de 255 caracteres");
    }
    if (photoUrl.length === 0) {
      throw new Error("La URL de la foto no puede estar vacía");
    }
    if (desc.length === 0) {
      throw new Error("La descripción no puede estar vacía");
    }
    if (isNaN(id)) {
      throw new Error("El ID del post debe ser un número");
    }
    if (id <= 0) {
      throw new Error("El ID del post debe ser un número positivo");
    }

    const existingPost = await getPostById(id);
    if (!existingPost || existingPost.length === 0) {
      throw new Error("No se encontró el post a actualizar");
    }
  } catch (error) {
    throw error;
  }
}
