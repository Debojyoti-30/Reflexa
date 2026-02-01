import express from "express";
import {
  getEligibleBadges,
  claimBadgeSignature,
} from "../controllers/badge.controller.js";

const router = express.Router();

router.get("/eligible/:wallet", getEligibleBadges);
router.post("/claim-signature", claimBadgeSignature);

export default router;
