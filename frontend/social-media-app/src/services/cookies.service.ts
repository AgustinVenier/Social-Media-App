import Cookies from "js-cookie";
import type { User } from "@/models";

/**
 * Guarda el usuario en cookies (persiste 7 días)
 */
export const setUserCookie = (userInfo: User) => {
  try {
    Cookies.set("userInfo", JSON.stringify(userInfo), {
      expires: 7,
      secure: import.meta.env.PROD, // Solo HTTPS en producción
      sameSite: "strict",
    });
    console.log("Usuario guardado en cookie");
  } catch (error) {
    console.error("Error al guardar usuario en cookie:", error);
  }
};

/**
 * Obtiene el usuario desde cookies
 */
export const getUserCookie = (): User | null => {
  try {
    const userInfo = Cookies.get("userInfo");
    if (userInfo) {
      return JSON.parse(userInfo);
    }
    return null;
  } catch (error) {
    console.error("Error al leer usuario desde cookie:", error);
    return null;
  }
};

/**
 * Obtiene solo el username desde cookies
 */
export const getUsername = (): string | null => {
  const user = getUserCookie();
  return user?.username || null;
};

/**
 * Elimina la cookie del usuario
 */
export const clearUserCookie = () => {
  try {
    Cookies.remove("userInfo");
    console.log("Cookie del usuario eliminada");
  } catch (error) {
    console.error("Error al eliminar cookie:", error);
  }
};
