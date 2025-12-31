import express from "express";
import { getUserStats } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/:wallet", getUserStats);

export default router;
