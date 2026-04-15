import {
  createComment,
  updateComment,
  deleteComment,
  getCommentById,
  getCommentsByPost,
  getCommentsCountByPost,
  deleteCommentsByPost,
  deleteCommentsByUser,
  getCommentsByUser,
  getCommentsCountByUser,
  getCommentsByPostWithPagination,
} from "./comment.repository.js";

async function createCommentService(idPost, idUser, description) {
  try {
    // Validaciones
    if (!idPost || isNaN(idPost) || idPost <= 0) {
      throw new Error("El ID del post debe ser un número válido");
    }
    if (!idUser) {
      throw new Error("El usuario no está autenticado");
    }
    if (!description || description.trim().length === 0) {
      throw new Error("La descripción del comentario no puede estar vacía");
    }
    if (description.length > 500) {
      throw new Error("La descripción no puede tener más de 500 caracteres");
    }

    const result = await createComment(idPost, idUser, description.trim());
    if (!result || !result.id) {
      throw new Error("No se pudo crear el comentario");
    }

    return result;
  } catch (error) {
    throw error;
  }
}

async function updateCommentService(id, idUser, description) {
  try {
    // Validaciones
    if (!id) {
      throw new Error("El ID del comentario es requerido");
    }
    if (!idUser) {
      throw new Error("El usuario no está autenticado");
    }
    if (!description || description.trim().length === 0) {
      throw new Error("La descripción del comentario no puede estar vacía");
    }
    if (description.length > 500) {
      throw new Error("La descripción no puede tener más de 500 caracteres");
    }

    // Verificar que el comentario existe
    const comment = await getCommentById(id);
    if (!comment) {
      throw new Error("El comentario no existe");
    }

    // Verificar que el usuario es el creador
    if (comment.idUser !== idUser) {
      throw new Error("No tienes permisos para editar este comentario");
    }

    const result = await updateComment(id, description.trim());
    if (result.affectedRows === 0) {
      throw new Error("No se pudo actualizar el comentario");
    }

    return { message: "Comentario actualizado correctamente" };
  } catch (error) {
    throw error;
  }
}

async function deleteCommentService(id, idUser) {
  try {
    // Validaciones
    if (!id) {
      throw new Error("El ID del comentario es requerido");
    }
    if (!idUser) {
      throw new Error("El usuario no está autenticado");
    }

    // Verificar que el comentario existe
    const comment = await getCommentById(id);
    if (!comment) {
      throw new Error("El comentario no existe");
    }

    // Verificar que el usuario es el creador
    if (comment.idUser !== idUser) {
      throw new Error("No tienes permisos para eliminar este comentario");
    }

    const result = await deleteComment(id);
    if (result.affectedRows === 0) {
      throw new Error("No se pudo eliminar el comentario");
    }

    return { message: "Comentario eliminado correctamente" };
  } catch (error) {
    throw error;
  }
}

async function getCommentsCountByPostService(idPost) {
  try {
    if (!idPost || isNaN(idPost) || idPost <= 0) {
      throw new Error("El ID del post debe ser un número válido");
    }

    const count = await getCommentsCountByPost(idPost);
    return count;
  } catch (error) {
    throw error;
  }
}

async function getCommentsByPostService(idPost, limit = 10, offset = 0) {
  try {
    if (!idPost || isNaN(idPost) || idPost <= 0) {
      throw new Error("El ID del post debe ser un número válido");
    }

    let comments;
    if (limit && !isNaN(limit) && limit > 0) {
      comments = await getCommentsByPostWithPagination(idPost, limit, offset);
    } else {
      comments = await getCommentsByPost(idPost);
    }

    if (!comments) {
      throw new Error("No se pudo obtener los comentarios");
    }

    return comments;
  } catch (error) {
    throw error;
  }
}

async function getCommentsByUserService(idUser) {
  try {
    if (!idUser) {
      throw new Error("El usuario no es válido");
    }

    const comments = await getCommentsByUser(idUser);
    if (!comments) {
      throw new Error("No se pudo obtener los comentarios del usuario");
    }

    return comments;
  } catch (error) {
    throw error;
  }
}

async function getCommentsCountByUserService(idUser) {
  try {
    if (!idUser) {
      throw new Error("El usuario no es válido");
    }

    const count = await getCommentsCountByUser(idUser);
    return count;
  } catch (error) {
    throw error;
  }
}

export {
  createCommentService,
  updateCommentService,
  deleteCommentService,
  getCommentsCountByPostService,
  getCommentsByPostService,
  getCommentsByUserService,
  getCommentsCountByUserService,
};
