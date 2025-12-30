import { motion } from "framer-motion";
import { Clock, Zap, Target, AlertTriangle, Trophy } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { useWallet } from "@/hooks/useWallet";
import { Link } from "react-router-dom";

const rules = [
  { icon: Clock, text: "Wait for the signal to turn GREEN" },
  { icon: Zap, text: "Click as fast as possible" },
  { icon: AlertTriangle, text: "Don't click too early!" },
  { icon: Target, text: "Fastest reaction wins" },
];

export const GameLobby = () => {
  const { isConnected, connect } = useWallet();

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Game Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 rounded-2xl gradient-border"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-cyber flex items-center justify-center"
              >
                <Zap className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              <h2 className="font-display text-3xl font-bold neon-text mb-2">
                Reaction Time Challenge
              </h2>
              <p className="text-muted-foreground">
                Test your reflexes against the arena
              </p>
            </div>

            {/* Rules */}
            <div className="space-y-3 mb-8">
              <h3 className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-4">
                Game Rules
              </h3>
              {rules.map((rule, index) => {
                const Icon = rule.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-glass-border"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{rule.text}</span>
                  </motion.div>
                );
              })}
            </div>

            {/* Entry Stake */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-glass-border mb-8">
              <div>
                <p className="text-sm text-muted-foreground">Entry Stake</p>
                <p className="font-display text-2xl font-bold text-primary">
                  10 SKILL
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Prize Pool</p>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-neon-yellow" />
                  <span className="font-display text-2xl font-bold text-neon-yellow">
                    20 SKILL
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            {isConnected ? (
              <Link to="/game" className="block">
                <CyberButton variant="game" size="xl" className="w-full">
                  <Zap className="w-5 h-5" />
                  Start Game
                </CyberButton>
              </Link>
            ) : (
              <CyberButton
                variant="default"
                size="xl"
                className="w-full"
                onClick={connect}
              >
                Connect Wallet to Play
              </CyberButton>
            )}

            {/* Cooldown Timer Placeholder */}
            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground">
                Next cooldown reset in: <span className="text-primary font-mono">--:--:--</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
