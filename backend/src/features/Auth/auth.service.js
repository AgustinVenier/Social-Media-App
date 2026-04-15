import bcrypt from "bcrypt";
import { searchUserByName, createUser } from "../User/user.repository.js";

async function registerAuthService(username, password) {
  try {
    if (!username || username.trim().length === 0) {
      throw new Error("El username es requerido");
    }
    if (username.length < 3) {
      throw new Error("El username debe tener al menos 3 caracteres");
    }
    if (username.length > 100) {
      throw new Error("El username no puede tener más de 100 caracteres");
    }

    if (!password || password.length === 0) {
      throw new Error("La contraseña es requerida");
    }
    if (password.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    // Verificar si el usuario ya existe
    const existingUser = await searchUserByName(username);
    if (existingUser && existingUser.length > 0) {
      throw new Error("El usuario ya existe");
    }

    // Crear usuario
    await createUser(username, password);
  } catch (error) {
    throw error;
  }
}

async function loginAuthService(username, password) {
  try {
    if (!username || username.trim().length === 0) {
      throw new Error("El username es requerido");
    }
    if (!password || password.length === 0) {
      throw new Error("La contraseña es requerida");
    }

    // Buscar usuario
    const users = await searchUserByName(username);
    if (!users || users.length === 0) {
      throw new Error("Usuario no encontrado");
    }

    const user = users[0];

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Contraseña incorrecta");
    }

    return user;
  } catch (error) {
    throw error;
  }
}

export { registerAuthService, loginAuthService };
