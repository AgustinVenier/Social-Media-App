import { Router } from "express";
import {
  followController,
  unfollowController,
  checkFollowStatusController,
  getFollowersController,
  getFollowingController,
  getFollowersCountController,
  getFollowingCountController,
} from "./follow.controller.js";
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = Router();

router.post("/follow", verifyToken, followController);
router.post("/unfollow", verifyToken, unfollowController);
router.post("/status", verifyToken, checkFollowStatusController);
router.get("/followers/:idFollowed", getFollowersController);
router.get("/following/:idFollower", getFollowingController);
router.get("/count/followers/:idFollowed", getFollowersCountController);
router.get("/count/following/:idFollower", getFollowingCountController);

export default router;
