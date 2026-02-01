import { checkBadgeEligibility } from "../services/badgeService.js";
import { signBadge } from "../services/scoreSigner.js";

export async function getEligibleBadges(req, res) {
  const { wallet } = req.params;

  try {
    // Note: In a real app, you might want to pass the latest score
    // but for "Check Profile" we just check general eligibility
    const badges = await checkBadgeEligibility(wallet);
    res.json({ eligibleBadges: badges });
  } catch (error) {
    console.error("Error fetching eligible badges:", error);
    res.status(500).json({ error: "Failed to check eligibility" });
  }
}

export async function claimBadgeSignature(req, res) {
  const { wallet, badgeId } = req.body;

  try {
    // 1. Re-verify eligibility on the backend before signing
    const eligibleBadges = await checkBadgeEligibility(wallet);

    if (!eligibleBadges.includes(badgeId)) {
      return res.status(403).json({ error: "Not eligible for this badge" });
    }

    // 2. Generate signature for minting
    const signature = await signBadge(wallet, badgeId);

    res.json({
      wallet,
      badgeId,
      signature,
    });
  } catch (error) {
    console.error("Error generating badge signature:", error);
    res.status(500).json({ error: "Failed to generate claim signature" });
  }
}
