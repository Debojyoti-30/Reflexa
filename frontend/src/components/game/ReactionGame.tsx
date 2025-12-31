import { motion, AnimatePresence } from "framer-motion";
import { useReactionGame, GameState } from "@/hooks/useReactionGame";
import { useWallet } from "@/hooks/useWallet";
import { CyberButton } from "@/components/ui/cyber-button";
import {
  Trophy,
  RotateCcw,
  Upload,
  Zap,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const tierConfig = {
  legendary: { color: "text-neon-yellow", label: "LEGENDARY", emoji: "🏆" },
  excellent: { color: "text-neon-green", label: "EXCELLENT", emoji: "⚡" },
  good: { color: "text-primary", label: "GOOD", emoji: "🎯" },
  average: { color: "text-muted-foreground", label: "AVERAGE", emoji: "👍" },
  slow: { color: "text-neon-red", label: "SLOW", emoji: "🐌" },
};

const getStateContent = (state: GameState) => {
  switch (state) {
    case "idle":
      return {
        bg: "bg-muted",
        text: "TAP TO START",
        subtext: "Get ready to test your reflexes",
        pulse: false,
      };
    case "waiting":
      return {
        bg: "bg-neon-red",
        text: "WAIT...",
        subtext: "Don't click yet!",
        pulse: true,
      };
    case "ready":
      return {
        bg: "bg-neon-green",
        text: "GO!",
        subtext: "CLICK NOW!",
        pulse: true,
      };
    case "too-early":
      return {
        bg: "bg-neon-red",
        text: "TOO EARLY!",
        subtext: "Wait for green signal",
        pulse: false,
      };
    default:
      return {
        bg: "bg-muted",
        text: "",
        subtext: "",
        pulse: false,
      };
  }
};

export const ReactionGame = () => {
  const { address } = useWallet();
  const { gameState, result, startGame, handleClick, playAgain, isSubmitting } =
    useReactionGame();
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (gameState === "idle" || gameState === "too-early") {
      startGame(address);
    } else if (gameState === "waiting" || gameState === "ready") {
      handleClick(address);
    }
  };

  const stateContent = getStateContent(gameState);

  if (gameState === "result" && result) {
    const tier = tierConfig[result.tier];

    return (
      <div className="flex-1 flex items-center justify-center p-4 relative z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 md:p-10 rounded-3xl max-w-lg w-full text-center gradient-border relative z-30 pointer-events-auto"
        >
          {/* Result Header */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className="text-7xl mb-6 drop-shadow-[0_0_15px_rgba(186,255,255,0.4)]"
          >
            {tier.emoji}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`font-display text-3xl font-bold ${tier.color} mb-8`}
          >
            {tier.label}
          </motion.h2>

          <div className="grid grid-cols-2 gap-4 md:gap-6 mb-10">
            {/* Reaction Time */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 md:p-6 rounded-2xl bg-muted/40 border border-glass-border flex flex-col items-center justify-center"
            >
              <p className="text-[10px] md:text-xs text-muted-foreground mb-2 flex items-center gap-2 uppercase tracking-widest font-bold">
                <Clock className="w-3 h-3" />
                Reaction
              </p>
              <motion.p
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.5 }}
                className="font-display text-3xl md:text-4xl font-bold neon-text"
              >
                {result.reactionTime}
                <span className="text-lg md:text-xl text-muted-foreground ml-1">
                  ms
                </span>
              </motion.p>
            </motion.div>

            {/* Score */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="p-4 md:p-6 rounded-2xl bg-muted/40 border border-glass-border flex flex-col items-center justify-center"
            >
              <p className="text-[10px] md:text-xs text-muted-foreground mb-2 flex items-center gap-2 uppercase tracking-widest font-bold">
                <Trophy className="w-3 h-3" />
                Score
              </p>
              <p className="font-display text-3xl md:text-4xl font-bold text-secondary">
                {result.score}
              </p>
            </motion.div>
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-4"
          >
            <CyberButton
              variant="glow"
              size="lg"
              className="w-full h-14 md:h-16 text-lg relative z-40"
              onClick={() => navigate("/leaderboard")}
            >
              <Trophy className="w-5 h-5" />
              View Leaderboard
            </CyberButton>

            <div className="grid grid-cols-2 gap-4">
              <CyberButton
                variant="outline"
                size="lg"
                className="h-14 relative z-40"
                onClick={playAgain}
              >
                <RotateCcw className="w-5 h-5" />
                Retry
              </CyberButton>
              <CyberButton
                variant="secondary"
                size="lg"
                className="h-14 relative z-40"
                onClick={() => navigate("/leaderboard")}
              >
                <Trophy className="w-5 h-5" />
                Board
              </CyberButton>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-20 pointer-events-auto">
      {/* Instructions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={gameState}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="text-center mb-12"
        >
          {gameState === "too-early" && (
            <motion.div
              animate={{ x: [-10, 10, -10, 10, 0] }}
              className="flex items-center gap-2 text-neon-red mb-4"
            >
              <AlertTriangle className="w-8 h-8" />
              <span className="font-display text-2xl font-black uppercase tracking-tighter">
                Too Early!
              </span>
            </motion.div>
          )}
          <p className="text-lg md:text-xl font-bold text-muted-foreground uppercase tracking-widest">
            {gameState === "idle" && "Tap to start challenge"}
            {gameState === "waiting" && "Focus... wait for green"}
            {gameState === "ready" && "CLICK NOW!"}
            {gameState === "too-early" && "Wait for the signal next time"}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Main Game Button */}
      <div className="relative group">
        <motion.button
          onClick={handleButtonClick}
          whileHover={{ scale: gameState === "idle" ? 1.05 : 1 }}
          whileTap={{ scale: 0.95 }}
          animate={stateContent.pulse ? { scale: [1, 1.02, 1] } : {}}
          transition={
            stateContent.pulse ? { duration: 0.5, repeat: Infinity } : {}
          }
          className={`
            w-64 h-64 sm:w-80 sm:h-80 rounded-full
            ${stateContent.bg}
            flex flex-col items-center justify-center
            transition-all duration-300
            cursor-pointer select-none
            relative z-30 shadow-2xl border-4 border-white/10
          `}
          style={{
            boxShadow:
              gameState === "ready"
                ? "0 0 80px hsl(142 76% 52% / 0.8), inset 0 0 40px hsl(142 76% 52% / 0.4)"
                : gameState === "waiting"
                ? "0 0 40px hsl(0 84% 60% / 0.6), inset 0 0 20px hsl(0 84% 60% / 0.3)"
                : "0 0 30px rgba(0,0,0,0.5)",
          }}
        >
          <motion.span
            key={stateContent.text}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-display text-4xl sm:text-5xl font-black text-primary-foreground tracking-tighter"
          >
            {stateContent.text}
          </motion.span>
          <span className="text-xs md:text-sm text-primary-foreground/70 mt-4 font-bold uppercase tracking-widest">
            {stateContent.subtext}
          </span>
        </motion.button>
        {stateContent.pulse && (
          <div className="absolute inset-0 -z-10 animate-ping rounded-full bg-primary/20" />
        )}
      </div>

      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16"
      >
        <CyberButton
          variant="ghost"
          size="lg"
          onClick={() => navigate("/")}
          className="text-muted-foreground hover:text-primary tracking-widest font-black"
        >
          ← ABORT TO LOBBY
        </CyberButton>
      </motion.div>
    </div>
  );
};
