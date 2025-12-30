import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, Shield, Bot, Coins, ChevronRight, Gamepad2 } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { useWallet } from "@/hooks/useWallet";

const features = [
  {
    icon: Zap,
    title: "Skill-Based",
    description: "Pure skill competition. No luck, no randomness.",
  },
  {
    icon: Bot,
    title: "Anti-Bot",
    description: "AI-verified human gameplay ensures fair competition.",
  },
  {
    icon: Coins,
    title: "On-Chain Rewards",
    description: "Earn tokens directly to your wallet.",
  },
  {
    icon: Shield,
    title: "Provably Fair",
    description: "All results verified on blockchain.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const HeroSection = () => {
  const { isConnected, connect } = useWallet();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 cyber-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

      {/* Animated glow orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-neon-cyan/10 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-neon-purple/10 blur-3xl"
      />

      <div className="container mx-auto px-4 pt-20 pb-12 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="text-sm font-medium text-primary">
              Live on Testnet
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="neon-text">Prove Your Skill.</span>
            <br />
            <span className="bg-gradient-cyber bg-clip-text text-transparent">
              Earn On-Chain.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            The first truly skill-based play-to-earn arena. No gambling, no luck
            — just pure human reflexes competing for real rewards.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            {isConnected ? (
              <Link to="/game">
                <div className="relative group">
                  {/* Glow layer */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none">
                    <div className="absolute inset-y-0 left-0 w-[3px] bg-cyan-400 blur-md" />
                    <div className="absolute inset-y-0 right-0 w-[3px] bg-fuchsia-500 blur-md" />
                  </div>

                  <CyberButton
                    variant="glow"
                    size="xl"
                    className="relative z-10"
                  >
                    <Gamepad2 className="w-5 h-5" />
                    Enter Arena
                    <ChevronRight className="w-5 h-5" />
                  </CyberButton>
                </div>
              </Link>
            ) : (
              <div className="relative group">
                {/* Glow layer */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none">
                  <div className="absolute inset-y-0 left-0 w-[3px] bg-purple-400 blur-md" />
                  <div className="absolute inset-y-0 right-0 w-[3px] bg-cyan-400 blur-md" />
                </div>

                <CyberButton
                  variant="glow"
                  size="xl"
                  className="relative z-10"
                  onClick={connect}
                >
                  <Zap className="w-5 h-5" />
                  Connect Wallet & Play
                </CyberButton>
              </div>
            )}

            <CyberButton variant="outline" size="lg">
              How It Works
            </CyberButton>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="glass-card p-6 text-center group cursor-default"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-cyber flex items-center justify-center"
                  >
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </motion.div>
                  <h3 className="font-display font-semibold text-sm mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
