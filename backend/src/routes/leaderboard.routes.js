import express from "express";
import {
  getLeaderboard,
  getGlobalStats,
} from "../controllers/leaderboard.controller.js";

const router = express.Router();

router.get("/", getLeaderboard);
router.get("/stats", getGlobalStats);

export default router;
