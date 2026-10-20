import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import fs from "node:fs";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateEnvironment } from "./src/config/environment.js";
import cookieParser from "cookie-parser";
import authRouter from "./src/features/Auth/auth.routes.js";
import userRouter from "./src/features/User/user.routes.js";
import postRouter from "./src/features/Post/post.routes.js";
import followRouter from "./src/features/Follow/follow.routes.js";
import likesRouter from "./src/features/Like/like.routes.js";
import commentsRouter from "./src/features/Comment/comment.routes.js";
import { getPool, closePool } from "./src/config/database.js";

validateEnvironment();
const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet({ contentSecurityPolicy: false, strictTransportSecurity: process.env.NODE_ENV === "production" ? undefined : false }));
// Limite por instancia; para escalar usar un store compartido o Azure Front Door/WAF.
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: "draft-8", legacyHeaders: false }));
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  if (process.env.NODE_ENV === "production") res.setHeader("Strict-Transport-Security", "max-age=31536000");
  if (req.path.startsWith("/api")) res.setHeader("Cache-Control", "no-store");
  if (!["GET", "HEAD", "OPTIONS"].includes(req.method) &&
      (req.get("sec-fetch-site") === "cross-site" ||
       (req.get("origin") && req.get("origin") !== `${req.protocol}://${req.get("host")}`))) {
    return res.status(403).json({ error: "Origen no permitido" });
  }
  next();
});

// Middleware
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
// Rutas
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/follow", followRouter);
app.use("/api/likes", likesRouter);
app.use("/api/comments", commentsRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/ready", async (req, res) => {
  try {
    const pool = await getPool();
    await pool.query("SELECT 1");
    res.json({ status: "ready" });
  } catch { res.status(503).json({ status: "unavailable" }); }
});
app.use("/api", (req, res) => res.status(404).json({ error: "Ruta no encontrada" }));

// Carpeta donde GitHub Actions coloca React compilado
const frontendPath = fileURLToPath(new URL("./public", import.meta.url));

app.use(express.static(frontendPath));

// Para permitir navegación por las rutas de React
app.get(/.*/, (req, res, next) => {
  if (path.extname(req.path)) return res.sendStatus(404);
  res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.use((error, req, res, next) => {
  console.error("Request failed:", error.code || error.name);
  res.status(error.status || 500).json({ error: error.status === 400 ? "Solicitud invalida" : "Error del servidor" });
});
if (process.env.NODE_ENV === "production" && !fs.existsSync(path.join(frontendPath, "index.html"))) {
  throw new Error("Falta compilar el frontend en backend/public");
}
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Servidor ejecutándose en puerto ${server.address().port}`);
});

for (const signal of ["SIGTERM", "SIGINT"]) {
  process.once(signal, () => {
    const timeout = setTimeout(() => process.exit(1), 10000);
    timeout.unref();
    server.close(async () => { await closePool(); process.exit(0); });
  });
}
