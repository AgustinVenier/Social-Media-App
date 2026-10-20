import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  registerAuthService,
  loginAuthService,
} from "./auth.service.js";

const SALT_ROUNDS = 10;

async function registerController(req, res) {
  const { username, password } = req.body;
  try {
    if (typeof username !== "string" || username.trim().length < 3 || username.length > 100 ||
        typeof password !== "string" || password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
      return res.status(400).json({ error: "Usuario invalido o contrasena fuera del rango de 8 a 72 bytes" });
    }
    const passHashed = await bcrypt.hash(password, SALT_ROUNDS);
    await registerAuthService(username, passHashed);
    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    res.status(400).json({ error: process.env.NODE_ENV === "production" && error.code ? "No se pudo procesar la solicitud" : error.message });
  }
}

async function loginController(req, res) {
  const { username, password } = req.body;
  try {
    const user = await loginAuthService(username, password);
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24,
      })
      .status(200)
      .json({ message: "Login exitoso", user });
  } catch (error) {
    res.status(401).json({ error: process.env.NODE_ENV === "production" && error.code ? "No se pudo procesar la solicitud" : error.message });
  }
}

async function logoutController(req, res) {
  try {
    res.clearCookie("token").status(200).json({ message: "Logout exitoso" });
  } catch (error) {
    res.status(500).json({ error: process.env.NODE_ENV === "production" && error.code ? "No se pudo procesar la solicitud" : error.message });
  }
}

export { registerController, loginController, logoutController };
