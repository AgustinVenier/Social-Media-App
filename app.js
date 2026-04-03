import express from "express";
import feedRouter from "./src/features/Feed/feed.routes.js";
import profileRouter from "./src/features/Profile/profile.routes.js";
import cookieParser from "cookie-parser";
import { getAllFollowersByUserId } from "../Follower/follower.service.js";

const app = express();

app.use(express.json());
app.use(cookieParserarser());

app.use("/api", feedRouter);
app.use("/api", profileRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
