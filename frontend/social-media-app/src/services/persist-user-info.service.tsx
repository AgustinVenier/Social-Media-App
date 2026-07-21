import { type User } from "@/models";
import { setUserCookie, getUserCookie } from "./cookies.service";

/**
 * Guarda la información del usuario en cookies
 */
export const persistenceUserInfo = (userInfo: User) => {
  console.log("Guardando usuario en cookie:", userInfo);
  setUserCookie(userInfo);
};

/**
 * Obtiene la información del usuario desde cookies (sincrónica)
 */
export const getPersistedUserInfo = () => {
  const user = getUserCookie();
  console.log("Leyendo usuario desde cookie:", user);
  return user;
};
