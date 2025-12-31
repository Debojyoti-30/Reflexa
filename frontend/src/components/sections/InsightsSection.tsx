import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Zap,
  Shield,
  Trophy,
  Users,
  TrendingUp,
  Lightbulb,
} from "lucide-react";

const insights = [
  {
    icon: Zap,
    title: "Instant Verification",
    text: "Game results are processed in milliseconds through our proprietary edge-AI validation engine, ensuring 100% human authenticity.",
    color: "text-neon-cyan",
  },
  {
    icon: Shield,
    title: "Anti-Sybil Guard",
    text: "Our multi-layered security protocols prevent botting and multi-accounting, preserving the integrity of the prize pool.",
    color: "text-neon-purple",
  },
  {
    icon: Trophy,
    title: "Provable Fairness",
    text: "Every game state and outcome is anchored to the Avalanche blockchain, making every reward provably fair and immutable.",
    color: "text-neon-yellow",
  },
  {
    icon: Users,
    title: "Global Arena",
    text: "Connect with thousands of players worldwide. Compete in real-time tournaments and climb the ranks to become a legend.",
    color: "text-secondary",
  },
  {
    icon: TrendingUp,
    title: "Skill Economy",
    text: "Reflexa isn't just a game; it's a new paradigm of digital labor where your cognitive agility translates directly into value.",
    color: "text-neon-green",
  },
  {
    icon: Lightbulb,
    title: "Future of Play",
    text: "Experience the evolution of competitive gaming. No luck, no RNG, just pure human potential unleashed in the arena.",
    color: "text-primary",
  },
];

export const InsightsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % insights.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentInsight = insights[currentIndex];
  const Icon = currentInsight.icon;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 neon-text">
              Real-Time Arena Insights
            </h2>
            <p className="text-muted-foreground text-lg">
              Powering the next generation of skill-based competition
            </p>
          </motion.div>

          <div className="relative min-h-[400px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1, y: -20 }}
                transition={{ duration: 0.5 }}
                className="glass-card p-12 rounded-3xl border border-glass-border w-full relative z-10"
              >
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    className={`w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-8 border border-glass-border ${currentInsight.color}`}
                  >
                    <Icon className="w-10 h-10" />
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`font-display text-3xl font-bold mb-6 ${currentInsight.color}`}
                  >
                    {currentInsight.title}
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl text-muted-foreground leading-relaxed max-w-2xl"
                  >
                    {currentInsight.text}
                  </motion.p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Background decorative elements */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className={`w-96 h-96 rounded-full blur-[100px] transition-colors duration-1000 ${
                  currentIndex % 2 === 0 ? "bg-primary" : "bg-secondary"
                }`}
              />
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-3 mt-12">
            {insights.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? "w-8 bg-primary shadow-[0_0_10px_rgba(217,70,239,0.5)]"
                    : "w-2 bg-muted hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
