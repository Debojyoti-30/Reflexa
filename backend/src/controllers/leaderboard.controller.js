import Score from "../models/Score.js";
import User from "../models/User.js";

export async function getLeaderboard(req, res) {
  try {
    const top = await Score.find({ verified: true })
      .sort({ score: -1 })
      .limit(10);
    res.json(top);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
}

export async function getGlobalStats(req, res) {
  try {
    const totalPlayers = await User.countDocuments();

    const gamesPlayedResult = await User.aggregate([
      { $group: { _id: null, total: { $sum: "$totalGames" } } },
    ]);
    const totalGames =
      gamesPlayedResult.length > 0 ? gamesPlayedResult[0].total : 0;

    const verifiedScoresCount = await Score.countDocuments({ verified: true });
    // Assume 1 SKILL per verified score for now as a mock for distributed rewards
    const rewardsDistributed = verifiedScoresCount;

    res.json({
      totalPlayers,
      totalGames,
      rewardsDistributed,
    });
  } catch (error) {
    console.error("Error fetching global stats:", error);
    res.status(500).json({ error: "Failed to fetch global stats" });
  }
}
