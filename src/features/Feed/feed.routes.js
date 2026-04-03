import { Router } from "express";
import { getFeed } from "./feed.controller.js";

const router = Router();

router.get("feed", getFeed());

export default router;
