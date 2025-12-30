import { motion } from "framer-motion";
import { User, Trophy, Zap, Clock, Target, Wallet } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { CyberButton } from "@/components/ui/cyber-button";
import { useWallet } from "@/hooks/useWallet";

const Profile = () => {
  const { isConnected, address, balance, connect } = useWallet();

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Mock user stats
  const userStats = {
    gamesPlayed: 47,
    bestTime: "156ms",
    averageTime: "234ms",
    totalEarnings: "1,250 SKILL",
    rank: 2,
    winRate: "68%",
  };

  const recentGames = [
    { id: 1, time: "162ms", score: 945, result: "win", date: "2 hours ago" },
    { id: 2, time: "189ms", score: 892, result: "loss", date: "3 hours ago" },
    { id: 3, time: "156ms", score: 962, result: "win", date: "5 hours ago" },
    { id: 4, time: "234ms", score: 756, result: "loss", date: "1 day ago" },
    { id: 5, time: "178ms", score: 908, result: "win", date: "1 day ago" },
  ];

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
                  <span>Rank #{userStats.rank}</span>
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
                <span className="text-sm font-medium text-primary">Testnet</span>
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
            { icon: Target, label: "Games Played", value: userStats.gamesPlayed },
            { icon: Clock, label: "Best Time", value: userStats.bestTime },
            { icon: Zap, label: "Win Rate", value: userStats.winRate },
            { icon: Trophy, label: "Total Earnings", value: userStats.totalEarnings },
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
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
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
          className="glass-card rounded-2xl overflow-hidden"
        >
          <div className="p-4 border-b border-glass-border">
            <h2 className="font-display text-lg font-bold">Recent Games</h2>
          </div>
          
          <div className="divide-y divide-glass-border">
            {recentGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    game.result === "win" ? "bg-neon-green/20" : "bg-neon-red/20"
                  }`}>
                    <Zap className={`w-5 h-5 ${
                      game.result === "win" ? "text-neon-green" : "text-neon-red"
                    }`} />
                  </div>
                  <div>
                    <p className="font-mono font-semibold">{game.time}</p>
                    <p className="text-xs text-muted-foreground">{game.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold">{game.score}</p>
                  <p className={`text-xs uppercase font-semibold ${
                    game.result === "win" ? "text-neon-green" : "text-neon-red"
                  }`}>
                    {game.result}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
