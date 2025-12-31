import { motion } from "framer-motion";
import {
  User,
  Trophy,
  Zap,
  Clock,
  Target,
  Wallet,
  Loader2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { CyberButton } from "@/components/ui/cyber-button";
import { useWallet } from "@/hooks/useWallet";
import { useEffect, useState } from "react";
import { api, LeaderboardEntry } from "@/lib/api";

const Profile = () => {
  const { isConnected, address, balance, connect } = useWallet();
  const [userStats, setUserStats] = useState<{
    totalGames: number;
    bestScore: number;
    lastPlayedAt: string | null;
  } | null>(null);
  const [recentGames, setRecentGames] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!isConnected || !address) return;
      setIsLoading(true);
      try {
        const data = await api.getUserStats(address);
        setUserStats(data.stats);
        setRecentGames(data.recentGames);
      } catch (error) {
        console.error("Failed to fetch user stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserStats();
  }, [isConnected, address]);

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 rounded-2xl text-center max-w-md"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Wallet className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-muted-foreground mb-6">
              Connect your wallet to view your profile, stats, and game history.
            </p>
            <CyberButton onClick={connect} size="lg">
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </CyberButton>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none" />

      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-2xl mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-gradient-cyber flex items-center justify-center">
              <User className="w-12 h-12 text-primary-foreground" />
            </div>

            {/* Info */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="font-display text-2xl font-bold mb-2">
                {shortenAddress(address)}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-neon-yellow" />
                  <span>Best Score: {userStats?.bestScore || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-neon-cyan" />
                  <span>{balance} SKILL</span>
                </div>
              </div>
            </div>

            {/* Network Badge */}
            <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/30">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                <span className="text-sm font-medium text-primary">
                  Testnet
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            {
              icon: Target,
              label: "Games Played",
              value: userStats?.totalGames || 0,
            },
            {
              icon: Clock,
              label: "Last Played",
              value: userStats?.lastPlayedAt
                ? new Date(userStats.lastPlayedAt).toLocaleDateString()
                : "Never",
            },
            {
              icon: Zap,
              label: "Best Score",
              value: userStats?.bestScore || 0,
            },
            { icon: Trophy, label: "Balance", value: `${balance} SKILL` },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="glass-card p-4 rounded-xl text-center"
              >
                <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">
                  {stat.label}
                </p>
                <p className="font-display font-bold text-xl">{stat.value}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Recent Games */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl overflow-hidden relative"
        >
          <div className="p-4 border-b border-glass-border flex justify-between items-center">
            <h2 className="font-display text-lg font-bold">Recent Games</h2>
            {isLoading && (
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            )}
          </div>

          <div className="divide-y divide-glass-border min-h-[200px]">
            {recentGames.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
                <Zap className="w-8 h-8 opacity-20" />
                <p className="text-sm font-display uppercase tracking-widest">
                  No games recorded yet
                </p>
              </div>
            ) : (
              recentGames.map((game, index) => (
                <motion.div
                  key={game.roundId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10`}
                    >
                      <Zap className={`w-5 h-5 text-primary`} />
                    </div>
                    <div>
                      <p className="font-mono font-semibold">
                        {game.reactionTime}ms
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(game.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-lg">
                      {game.score}
                    </p>
                    <p
                      className={`text-[10px] uppercase font-bold text-primary tracking-tighter`}
                    >
                      Verified
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
