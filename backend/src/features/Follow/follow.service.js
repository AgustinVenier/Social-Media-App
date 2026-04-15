import {
  followUser,
  unfollowUser,
  isUserFollowed,
  getFollowers,
  getFollowing,
  getFollowersCount,
  getFollowingCount,
} from "./follow.repository.js";

async function followUserService(idFollower, idFollowed) {
  try {
    if (!idFollower || !idFollowed) {
      throw new Error("Los IDs de usuario son requeridos");
    }

    if (idFollower === idFollowed) {
      throw new Error("No puedes seguirte a ti mismo");
    }

    const alreadyFollowed = await isUserFollowed(idFollower, idFollowed);
    if (alreadyFollowed) {
      throw new Error("Ya estás siguiendo a este usuario");
    }

    await followUser(idFollower, idFollowed);
    return { message: "Usuario seguido exitosamente" };
  } catch (error) {
    throw error;
  }
}

async function unfollowUserService(idFollower, idFollowed) {
  try {
    if (!idFollower || !idFollowed) {
      throw new Error("Los IDs de usuario son requeridos");
    }

    const isFollowed = await isUserFollowed(idFollower, idFollowed);
    if (!isFollowed) {
      throw new Error("No estás siguiendo a este usuario");
    }

    const result = await unfollowUser(idFollower, idFollowed);
    if (result.affectedRows === 0) {
      throw new Error("No se pudo dejar de seguir al usuario");
    }

    return { message: "Usuario dejado de seguir exitosamente" };
  } catch (error) {
    throw error;
  }
}

async function checkFollowStatusService(idFollower, idFollowed) {
  try {
    if (!idFollower || !idFollowed) {
      throw new Error("Los IDs de usuario son requeridos");
    }

    const isFollowed = await isUserFollowed(idFollower, idFollowed);
    return { isFollowed };
  } catch (error) {
    throw error;
  }
}

async function getFollowersService(idFollowed) {
  try {
    if (!idFollowed) {
      throw new Error("El ID del usuario es requerido");
    }

    const followers = await getFollowers(idFollowed);
    return followers;
  } catch (error) {
    throw error;
  }
}

async function getFollowingService(idFollower) {
  try {
    if (!idFollower) {
      throw new Error("El ID del usuario es requerido");
    }

    const following = await getFollowing(idFollower);
    return following;
  } catch (error) {
    throw error;
  }
}

async function getFollowersCountService(idFollowed) {
  try {
    if (!idFollowed) {
      throw new Error("El ID del usuario es requerido");
    }

    const count = await getFollowersCount(idFollowed);
    return count;
  } catch (error) {
    throw error;
  }
}

async function getFollowingCountService(idFollower) {
  try {
    if (!idFollower) {
      throw new Error("El ID del usuario es requerido");
    }

    const count = await getFollowingCount(idFollower);
    return count;
  } catch (error) {
    throw error;
  }
}

export {
  followUserService,
  unfollowUserService,
  checkFollowStatusService,
  getFollowersService,
  getFollowingService,
  getFollowersCountService,
  getFollowingCountService,
};
