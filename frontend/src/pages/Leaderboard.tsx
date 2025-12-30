import { motion } from "framer-motion";
import { Trophy, Medal, Crown, User } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

// Mock leaderboard data
const leaderboardData = [
  { rank: 1, address: "0x742d35Cc6634C0532925a3b844Bc9e7595f7C123", score: 985, time: "142ms" },
  { rank: 2, address: "0x8Ba1f109551bD432803012645Ac136ddd64DBa72", score: 962, time: "156ms" },
  { rank: 3, address: "0xdD870fA1b7C4700F2BD7f44238821C26f7392148", score: 945, time: "168ms" },
  { rank: 4, address: "0x583031D1113aD414F02576BD6afaBfb302140225", score: 923, time: "178ms" },
  { rank: 5, address: "0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB", score: 908, time: "189ms" },
  { rank: 6, address: "0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C", score: 892, time: "198ms" },
  { rank: 7, address: "0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c", score: 875, time: "212ms" },
  { rank: 8, address: "0x1aE0EA34a72D944a8C7603FfB3eC30a6669E454C", score: 856, time: "225ms" },
  { rank: 9, address: "0x0A098Eda01Ce92ff4A4CCb7A4fFFb5A43EBC70DC", score: 834, time: "238ms" },
  { rank: 10, address: "0x6C6E5f3C2ba9E1ABdc0E9d3E8D0a7F19b97F0A1c", score: 812, time: "251ms" },
];

const currentUserAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f7C123";

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5 text-neon-yellow" />;
    case 2:
      return <Medal className="w-5 h-5 text-gray-300" />;
    case 3:
      return <Medal className="w-5 h-5 text-amber-600" />;
    default:
      return <span className="w-5 text-center font-mono text-muted-foreground">{rank}</span>;
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
          <div className="space-y-2 mt-4">
            {leaderboardData.map((player, index) => {
              const isCurrentUser = player.address === currentUserAddress;
              
              return (
                <motion.div
                  key={player.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className={`
                    grid grid-cols-12 gap-4 px-4 py-4 rounded-xl border
                    ${getRankStyle(player.rank)}
                    ${isCurrentUser ? "ring-2 ring-primary" : ""}
                    transition-all duration-200
                  `}
                >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center">
                    {getRankIcon(player.rank)}
                  </div>

                  {/* Player */}
                  <div className="col-span-6 sm:col-span-5 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-cyber flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-sm">
                        {shortenAddress(player.address)}
                      </span>
                      {isCurrentUser && (
                        <span className="text-xs text-primary">You</span>
                      )}
                    </div>
                  </div>

                  {/* Time */}
                  <div className="col-span-2 sm:col-span-3 flex items-center justify-end">
                    <span className="font-mono text-sm text-neon-cyan">
                      {player.time}
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
            })}
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
            { label: "Total Players", value: "2,451" },
            { label: "Games Played", value: "15,892" },
            { label: "Rewards Distributed", value: "45,230 SKILL" },
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
