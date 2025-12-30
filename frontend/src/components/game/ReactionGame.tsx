import { motion, AnimatePresence } from "framer-motion";
import { useReactionGame, GameState } from "@/hooks/useReactionGame";
import { CyberButton } from "@/components/ui/cyber-button";
import { Trophy, RotateCcw, Upload, Zap, AlertTriangle, Clock } from "lucide-react";
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
  const { gameState, result, startGame, handleClick, playAgain } = useReactionGame();
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (gameState === "idle" || gameState === "too-early") {
      startGame();
    } else if (gameState === "waiting" || gameState === "ready") {
      handleClick();
    }
  };

  const handleSubmitScore = () => {
    // TODO: Submit score to backend/blockchain
    toast.success("Score Submitted!", {
      description: "Your result has been recorded on-chain.",
    });
  };

  const stateContent = getStateContent(gameState);

  if (gameState === "result" && result) {
    const tier = tierConfig[result.tier];
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4 pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 rounded-2xl max-w-md w-full text-center gradient-border"
        >
          {/* Result Header */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className="text-6xl mb-4"
          >
            {tier.emoji}
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`font-display text-2xl font-bold ${tier.color} mb-6`}
          >
            {tier.label}
          </motion.h2>

          {/* Reaction Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <p className="text-sm text-muted-foreground mb-2 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              Reaction Time
            </p>
            <motion.p
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.5 }}
              className="font-display text-6xl font-bold neon-text"
            >
              {result.reactionTime}
              <span className="text-2xl text-muted-foreground ml-1">ms</span>
            </motion.p>
          </motion.div>

          {/* Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-4 rounded-xl bg-muted/50 border border-glass-border mb-8"
          >
            <p className="text-sm text-muted-foreground mb-1 flex items-center justify-center gap-2">
              <Trophy className="w-4 h-4" />
              Score
            </p>
            <p className="font-display text-4xl font-bold text-secondary">
              {result.score}
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col gap-3"
          >
            <CyberButton
              variant="glow"
              size="lg"
              className="w-full"
              onClick={handleSubmitScore}
            >
              <Upload className="w-5 h-5" />
              Submit Score
            </CyberButton>
            
            <div className="flex gap-3">
              <CyberButton
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={playAgain}
              >
                <RotateCcw className="w-5 h-5" />
                Play Again
              </CyberButton>
              <CyberButton
                variant="ghost"
                size="lg"
                className="flex-1"
                onClick={() => navigate("/leaderboard")}
              >
                <Trophy className="w-5 h-5" />
                Leaderboard
              </CyberButton>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-20">
      {/* Instructions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={gameState}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="text-center mb-8"
        >
          {gameState === "too-early" && (
            <div className="flex items-center gap-2 text-neon-red mb-4">
              <AlertTriangle className="w-6 h-6" />
              <span className="font-display text-xl">You clicked too early!</span>
            </div>
          )}
          <p className="text-muted-foreground">
            {gameState === "idle" && "Tap the button to begin"}
            {gameState === "waiting" && "Wait for it..."}
            {gameState === "ready" && "NOW! CLICK!"}
            {gameState === "too-early" && "Tap to try again"}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Main Game Button */}
      <motion.button
        onClick={handleButtonClick}
        whileHover={{ scale: gameState === "idle" ? 1.05 : 1 }}
        whileTap={{ scale: 0.95 }}
        animate={stateContent.pulse ? { scale: [1, 1.05, 1] } : {}}
        transition={stateContent.pulse ? { duration: 0.5, repeat: Infinity } : {}}
        className={`
          w-64 h-64 sm:w-80 sm:h-80 rounded-full
          ${stateContent.bg}
          flex flex-col items-center justify-center
          transition-colors duration-300
          cursor-pointer select-none
          ${gameState === "ready" ? "neon-glow" : ""}
          ${gameState === "waiting" ? "shadow-[0_0_30px_hsl(0_84%_60%/0.5)]" : ""}
        `}
        style={{
          boxShadow: gameState === "ready" 
            ? "0 0 60px hsl(142 76% 52% / 0.8), 0 0 100px hsl(142 76% 52% / 0.4)"
            : gameState === "waiting"
            ? "0 0 40px hsl(0 84% 60% / 0.6)"
            : undefined
        }}
      >
        <motion.span
          key={stateContent.text}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground"
        >
          {stateContent.text}
        </motion.span>
        <span className="text-sm text-primary-foreground/70 mt-2">
          {stateContent.subtext}
        </span>
      </motion.button>

      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <CyberButton
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
        >
          ← Back to Lobby
        </CyberButton>
      </motion.div>
    </div>
  );
};
