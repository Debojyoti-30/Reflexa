import { motion } from "framer-motion";
import {
  User,
  Trophy,
  Zap,
  Clock,
  Target,
  Wallet,
  Loader2,
  Medal,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { CyberButton } from "@/components/ui/cyber-button";
import { useWallet } from "@/hooks/useWallet";
import { useEffect, useState } from "react";
import { api, LeaderboardEntry } from "@/lib/api";
import { ethers } from "ethers";
import {
  REFLEXA_ABI,
  REFLEXA_CONTRACT_ADDRESS,
  REFLEXA_BADGE_ABI,
  REFLEXA_BADGE_CONTRACT_ADDRESS,
} from "@/config/contracts";

const BADGE_METADATA: Record<
  string,
  { title: string; desc: string; icon: React.ComponentType }
> = {
  FIVE_GAMES: {
    title: "Rookie",
    desc: "Completed your first 5 verified games",
    icon: Medal,
  },
  TOP_1_PERCENT: {
    title: "Elite Reflex",
    desc: "Reached the top 1% of all players",
    icon: Trophy,
  },
  HUNDRED_GAMES: {
    title: "Centurion",
    desc: "Completed 100 verified games",
    icon: Target,
  },
  PERFECT_SCORE: {
    title: "Godspeed",
    desc: "Achieved a reaction time ≤ 100ms",
    icon: Zap,
  },
};
import { chainConfig } from "@/config/chain";
import { toast } from "sonner";

const Profile = () => {
  const { isConnected, address, balance, connect } = useWallet();
  const [userStats, setUserStats] = useState<{
    totalGames: number;
    bestScore: number;
    lastPlayedAt: string | null;
  } | null>(null);
  const [recentGames, setRecentGames] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [onChainStats, setOnChainStats] = useState<{
    bestScore: number;
    totalGames: number;
  } | null>(null);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [eligibleBadges, setEligibleBadges] = useState<string[]>([]);
  const [isMinting, setIsMinting] = useState<string | null>(null);


  useEffect(() => {
    const fetchBlockchainData = async () => {
      if (!address) return;
      try {
        const provider = new ethers.JsonRpcProvider(
          chainConfig.rpcUrls.default.http[0]
        );

        // 1. Fetch Stats
        const gameContract = new ethers.Contract(
          REFLEXA_CONTRACT_ADDRESS,
          REFLEXA_ABI,
          provider
        );
        const stats = await gameContract.playerStats(address);
        setOnChainStats({
          bestScore: Number(stats.bestScore),
          totalGames: Number(stats.totalGames),
        });

        // 2. Fetch Earned Badges
        const badgeContract = new ethers.Contract(
          REFLEXA_BADGE_CONTRACT_ADDRESS,
          REFLEXA_BADGE_ABI,
          provider
        );
        const owned: string[] = [];
        for (const badgeId of Object.keys(BADGE_METADATA)) {
          const has = await badgeContract.hasBadge(badgeId, address);
          if (has) owned.push(badgeId);
        }
        setEarnedBadges(owned);
      } catch (error) {
        console.error("Failed to fetch blockchain data:", error);
      }
    };
    fetchBlockchainData();
  }, [address]);

  useEffect(() => {
    const fetchEligible = async () => {
      if (!address || !isConnected) return;
      try {
        const { eligibleBadges } = await api.getEligibleBadges(address);
        // Only keep those not already earned on-chain
        setEligibleBadges(
          eligibleBadges.filter((id) => !earnedBadges.includes(id))
        );
      } catch (error) {
        console.error("Failed to fetch eligible badges:", error);
      }
    };
    fetchEligible();
  }, [address, isConnected, earnedBadges]);

  const handleMintBadge = async (badgeId: string) => {
    if (!address) return;
    setIsMinting(badgeId);
    try {
      const { signature } = await api.claimBadgeSignature(address, badgeId);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        REFLEXA_BADGE_CONTRACT_ADDRESS,
        REFLEXA_BADGE_ABI,
        signer
      );

      const tx = await contract.mintBadge(address, badgeId, signature);
      toast.info("Minting your badge...");
      await tx.wait();

      setEarnedBadges((prev) => [...prev, badgeId]);
      setEligibleBadges((prev) => prev.filter((id) => id !== badgeId));
      toast.success("Badge earned! Check your wallet.");
    } catch (error: unknown) {
      console.error("Minting failed:", error);
      toast.error(
        error instanceof Error && 'reason' in error 
          ? (error as { reason: string }).reason 
          : "Minting failed. Please try again."
      );
    } finally {
      setIsMinting(null);
    }
  };

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
            {
              icon: Trophy,
              label: "On-Chain Best",
              value: onChainStats?.bestScore || 0,
            },
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

        {/* Badges Cabinet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Medal className="w-6 h-6 text-primary" />
            <h2 className="font-display text-xl font-bold">Skill Badges</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(BADGE_METADATA).map(([id, meta], index) => {
              const isEarned = earnedBadges.includes(id);
              const isEligible = eligibleBadges.includes(id);
              const Icon = meta.icon;

              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className={`glass-card p-6 rounded-2xl border-2 transition-all ${
                    isEarned
                      ? "border-neon-green/50 bg-neon-green/5"
                      : isEligible
                      ? "border-primary/50 bg-primary/5 animate-pulse-subtle"
                      : "border-glass-border opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl ${
                        isEarned ? "bg-neon-green/20" : "bg-muted"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          isEarned ? "text-neon-green" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    {isEarned && (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-neon-green uppercase">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </div>
                    )}
                  </div>

                  <h3 className="font-display font-bold mb-1">{meta.title}</h3>
                  <p className="text-xs text-muted-foreground mb-6 h-8">
                    {meta.desc}
                  </p>

                  <div className="mt-auto">
                    {isEarned ? (
                      <div className="w-full py-2 rounded-lg bg-neon-green/10 text-neon-green text-center text-xs font-bold uppercase tracking-widest border border-neon-green/20">
                        Achieved
                      </div>
                    ) : isEligible ? (
                      <CyberButton
                        size="sm"
                        className="w-full"
                        onClick={() => handleMintBadge(id)}
                        disabled={isMinting === id}
                      >
                        {isMinting === id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Claim Badge"
                        )}
                      </CyberButton>
                    ) : (
                      <div className="flex items-center justify-center gap-2 py-2 text-muted-foreground text-xs font-medium">
                        <Lock className="w-3 h-3" />
                        <span>Locked</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
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
