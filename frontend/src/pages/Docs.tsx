import { Navbar } from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { BookOpen, Zap, Shield, Trophy, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { CyberButton } from "@/components/ui/cyber-button";

const Docs = () => {
  const sections = [
    {
      title: "What is Reflexa?",
      icon: Zap,
      content:
        "Reflexa is a skill-based play-to-earn arena where players compete in high-stakes reaction time challenges. Powered by the Avalanche blockchain and AI-verified human gameplay, it ensures a fair and transparent environment for all competitors.",
    },
    {
      title: "How it Works",
      icon: Target,
      content:
        "Players connect their wallets, enter the arena, and wait for the green signal. The faster your reaction time, the higher your score. High scores are recorded on the leaderboard, and top performers earn rewards in SKILL tokens.",
    },
    {
      title: "Fair Play & Anti-Bot",
      icon: Shield,
      content:
        "We use advanced AI monitoring to distinguish between human reflexes and automated bots. Every game result is verifiable on-chain, ensuring that only peak human performance is rewarded.",
    },
    {
      title: "Earning Rewards",
      icon: Trophy,
      content:
        "Rewards are distributed based on leaderboard rankings and tournament performance. The more you play and improve your skill, the higher your earning potential in $SKILL tokens.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none" />

      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-cyber flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold neon-text">
                Documentation
              </h1>
              <p className="text-muted-foreground">
                Everything you need to know about Reflexa
              </p>
            </div>
          </div>

          <div className="grid gap-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.section
                  key={section.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-8 rounded-2xl border border-glass-border"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                    <h2 className="font-display text-2xl font-bold text-foreground">
                      {section.title}
                    </h2>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </motion.section>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <Link to="/game">
              <CyberButton variant="glow" size="xl">
                Start Playing Now
              </CyberButton>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Docs;
