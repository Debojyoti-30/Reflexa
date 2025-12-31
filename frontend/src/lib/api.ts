const API_BASE_URL = "http://localhost:4000";

export interface GameSessionResponse {
  roundId: string;
  delay: number;
}

export interface ScoreSubmissionResponse {
  score: number;
  signature: string;
}

export interface GlobalStats {
  totalPlayers: number;
  totalGames: number;
  rewardsDistributed: number;
}

export interface LeaderboardEntry {
  wallet: string;
  score: number;
  reactionTime: number;
  verified: boolean;
  roundId: string;
  createdAt: string;
}

export const api = {
  /**
   * Starts a new game session on the backend.
   * This generates a unique roundId and a secure delay for the reaction test.
   */
  async startGame(wallet: string): Promise<GameSessionResponse> {
    const response = await fetch(`${API_BASE_URL}/game/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet }),
    });
    if (!response.ok) throw new Error("Failed to start game session");
    return response.json();
  },

  /**
   * Submits the reaction time to be verified and scored by the backend.
   */
  async submitScore(data: {
    wallet: string;
    roundId: string;
    reactionTime: number;
  }): Promise<ScoreSubmissionResponse> {
    const response = await fetch(`${API_BASE_URL}/game/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to submit score");
    }
    return response.json();
  },

  /**
   * Fetches the top 10 players from the leaderboard.
   */
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const response = await fetch(`${API_BASE_URL}/leaderboard`);
    if (!response.ok) throw new Error("Failed to fetch leaderboard");
    return response.json();
  },

  /**
   * Fetches user statistics and recent games.
   */
  async getUserStats(wallet: string): Promise<{
    stats: {
      totalGames: number;
      bestScore: number;
      lastPlayedAt: string | null;
    };
    recentGames: LeaderboardEntry[];
  }> {
    const response = await fetch(`${API_BASE_URL}/user/${wallet}`);
    if (!response.ok) throw new Error("Failed to fetch user stats");
    return response.json();
  },
  async getGlobalStats(): Promise<GlobalStats> {
    const response = await fetch(`${API_BASE_URL}/leaderboard/stats`);
    if (!response.ok) throw new Error("Failed to fetch global stats");
    return response.json();
  },
};
