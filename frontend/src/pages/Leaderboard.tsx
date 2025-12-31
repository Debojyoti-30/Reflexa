import { motion } from "framer-motion";
import { Trophy, Medal, Crown, User, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { useEffect, useState } from "react";
import { api, LeaderboardEntry, GlobalStats } from "@/lib/api";
import { useWallet } from "@/hooks/useWallet";

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5 text-neon-yellow" />;
    case 2:
      return <Medal className="w-5 h-5 text-gray-300" />;
    case 3:
      return <Medal className="w-5 h-5 text-amber-600" />;
    default:
      return (
        <span className="w-5 text-center font-mono text-muted-foreground">
          {rank}
        </span>
      );
  }
};

const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-neon-yellow/10 border-neon-yellow/30";
    case 2:
      return "bg-gray-300/10 border-gray-300/30";
    case 3:
      return "bg-amber-600/10 border-amber-600/30";
    default:
      return "bg-muted/30 border-glass-border";
  }
};

const Leaderboard = () => {
  const { address: currentUserAddress } = useWallet();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const [lbData, statsData] = await Promise.all([
          api.getLeaderboard(),
          api.getGlobalStats(),
        ]);
        setLeaderboardData(lbData);
        setGlobalStats(statsData);
      } catch (error) {
        console.error("Failed to fetch leaderboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none" />

      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-neon-yellow" />
            <h1 className="font-display text-4xl font-bold neon-text">
              Leaderboard
            </h1>
          </div>
          <p className="text-muted-foreground">
            Top reaction times from the arena
          </p>
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-display uppercase tracking-wider text-muted-foreground border-b border-glass-border">
            <div className="col-span-1">Rank</div>
            <div className="col-span-6 sm:col-span-5">Player</div>
            <div className="col-span-2 sm:col-span-3 text-right">Time</div>
            <div className="col-span-3 text-right">Score</div>
          </div>

          {/* Table Rows */}
          <div className="space-y-2 mt-4 min-h-[400px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-muted-foreground font-display text-sm tracking-widest uppercase">
                  Fetching stats from the arena...
                </p>
              </div>
            ) : leaderboardData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Trophy className="w-12 h-12 text-muted/30" />
                <p className="text-muted-foreground font-display text-sm tracking-widest uppercase">
                  No records yet. Be the first!
                </p>
              </div>
            ) : (
              leaderboardData.map((player, index) => {
                const rank = index + 1;
                const isCurrentUser = player.wallet === currentUserAddress;

                return (
                  <motion.div
                    key={`${player.wallet}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className={`
                      grid grid-cols-12 gap-4 px-4 py-4 rounded-xl border
                      ${getRankStyle(rank)}
                      ${isCurrentUser ? "ring-2 ring-primary" : ""}
                      transition-all duration-200
                    `}
                  >
                    {/* Rank */}
                    <div className="col-span-1 flex items-center">
                      {getRankIcon(rank)}
                    </div>

                    {/* Player */}
                    <div className="col-span-6 sm:col-span-5 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-cyber flex items-center justify-center">
                        <User className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-sm leading-none mb-1">
                          {shortenAddress(player.wallet)}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[10px] font-bold uppercase text-primary tracking-tighter">
                            You
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Time */}
                    <div className="col-span-2 sm:col-span-3 flex items-center justify-end">
                      <span className="font-mono text-sm text-neon-cyan">
                        {player.reactionTime}ms
                      </span>
                    </div>

                    {/* Score */}
                    <div className="col-span-3 flex items-center justify-end">
                      <span className="font-display font-bold text-lg">
                        {player.score}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Stats Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-3xl mx-auto mt-8 grid grid-cols-3 gap-4"
        >
          {[
            {
              label: "Total Players",
              value: globalStats?.totalPlayers?.toLocaleString() || "0",
            },
            {
              label: "Games Played",
              value: globalStats?.totalGames?.toLocaleString() || "0",
            },
            {
              label: "Rewards Distributed",
              value: `${
                globalStats?.rewardsDistributed?.toLocaleString() || "0"
              } SKILL`,
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="glass-card p-4 text-center rounded-xl"
            >
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className="font-display font-bold text-lg text-primary">
                {stat.value}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
