import User from "../models/User.js";
import Score from "../models/Score.js";

export async function getUserStats(req, res) {
  const { wallet } = req.params;
  try {
    const user = await User.findOne({ wallet });
    const recentGames = await Score.find({ wallet })
      .sort({ createdAt: -1 })
      .limit(5);

    if (!user) {
      return res.json({
        stats: {
          totalGames: 0,
          bestScore: 0,
          lastPlayedAt: null,
        },
        recentGames: [],
      });
    }

    res.json({
      stats: user,
      recentGames,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user stats" });
  }
}
