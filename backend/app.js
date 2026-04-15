import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./src/features/Auth/auth.routes.js";
import userRouter from "./src/features/User/user.routes.js";
import postRouter from "./src/features/Post/post.routes.js";
import followRouter from "./src/features/Follow/follow.routes.js";
import likesRouter from "./src/features/Like/like.routes.js";
import commentsRouter from "./src/features/Comment/comment.routes.js";
import { initDatabase } from "./src/database/init.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Inicializar base de datos
try {
  await initDatabase();
  console.log("✅ Base de datos inicializada");
} catch (error) {
  console.error("❌ Error al inicializar base de datos:", error);
}

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor ejecutándose en puerto ${PORT}`);
});
