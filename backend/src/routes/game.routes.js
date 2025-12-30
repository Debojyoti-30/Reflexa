import express from "express";
import { startGame,submitScore } from "../controllers/game.contoller.js";

const router = express.Router();

router.post("/start",startGame);
router.post("/submit",submitScore);

export default router;
