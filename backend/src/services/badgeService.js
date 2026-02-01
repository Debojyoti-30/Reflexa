import User from "../models/User.js";
import Score from "../models/Score.js";

export const BADGE_IDS = {
  FIVE_GAMES: "FIVE_GAMES",
  TOP_1_PERCENT: "TOP_1_PERCENT",
  HUNDRED_GAMES: "HUNDRED_GAMES",
  PERFECT_SCORE: "PERFECT_SCORE",
};

/**
 * Check eligibility for all badges for a specific user.
 */
export async function checkBadgeEligibility(
  wallet,
  currentScore,
  currentReactionTime
) {
  const user = await User.findOne({ wallet });
  if (!user) return [];

  const eligibleBadges = [];

  // 0. 5 Games Played (Rookie)
  if (user.totalGames >= 5) {
    eligibleBadges.push(BADGE_IDS.FIVE_GAMES);
  }

  // 1. 100 Games Played
  if (user.totalGames >= 100) {
    eligibleBadges.push(BADGE_IDS.HUNDRED_GAMES);
  }

  // 2. Perfect Score
  // Eligible if current round is perfect OR if they have any verified perfect score in history
  if (currentReactionTime && currentReactionTime <= 100) {
    eligibleBadges.push(BADGE_IDS.PERFECT_SCORE);
  } else {
    const historicalPerfect = await Score.findOne({
      wallet,
      reactionTime: { $lte: 100 },
      verified: true,
    });
    if (historicalPerfect) {
      eligibleBadges.push(BADGE_IDS.PERFECT_SCORE);
    }
  }

  // 3. Top 1% Reflex
  const totalUsers = await User.countDocuments();
  if (totalUsers >= 10) {
    const topCount = Math.ceil(totalUsers * 0.01);
    const topUsers = await User.find()
      .sort({ bestScore: -1 })
      .limit(topCount)
      .select("bestScore");

    if (topUsers.length > 0) {
      const threshold = topUsers[topUsers.length - 1].bestScore;
      if (user.bestScore >= threshold) {
        eligibleBadges.push(BADGE_IDS.TOP_1_PERCENT);
      }
    }
  }

  return eligibleBadges;
}
