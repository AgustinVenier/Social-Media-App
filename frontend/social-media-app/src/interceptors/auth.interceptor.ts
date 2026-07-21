import axios from "axios";
import store from "../redux/store";
import { clearUser } from "../redux/states/user.state";
import { clearUserCookie } from "../services/cookies.service";

/**
 * Configura Axios para el manejo de autenticación por cookie httpOnly.
 * El token JWT vive únicamente en la cookie httpOnly seteada por el backend:
 * nunca es accesible desde JS, así que no hay nada que adjuntar manualmente.
 */
export const setupAuthInterceptor = () => {
  // Envía y acepta la cookie de sesión en requests cross-origin (5173 -> 3000)
  axios.defaults.withCredentials = true;

  // Interceptor de RESPONSE: maneja sesión expirada o inválida
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.warn("Sesión expirada, limpiando sesión...");

        store.dispatch(clearUser());
        clearUserCookie();

        window.location.href = "/login";
      }

      return Promise.reject(error);
    }
  );
};
