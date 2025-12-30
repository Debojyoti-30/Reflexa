import { useState, useCallback, useRef } from "react";

export type GameState = "idle" | "waiting" | "ready" | "clicked" | "too-early" | "result";

export interface GameResult {
  reactionTime: number;
  score: number;
  tier: "legendary" | "excellent" | "good" | "average" | "slow";
}

const calculateScore = (reactionTime: number): number => {
  // Score formula: Higher score for faster reaction
  // Perfect (< 150ms) = 1000, Good (< 250ms) = 800, Average (< 400ms) = 600, etc.
  if (reactionTime < 150) return 1000;
  if (reactionTime < 200) return 950 - (reactionTime - 150);
  if (reactionTime < 250) return 900 - (reactionTime - 200) * 2;
  if (reactionTime < 350) return 800 - (reactionTime - 250) * 2;
  if (reactionTime < 500) return 600 - (reactionTime - 350);
  return Math.max(100, 450 - (reactionTime - 500) * 0.5);
};

const getTier = (reactionTime: number): GameResult["tier"] => {
  if (reactionTime < 180) return "legendary";
  if (reactionTime < 250) return "excellent";
  if (reactionTime < 350) return "good";
  if (reactionTime < 500) return "average";
  return "slow";
};

export const useReactionGame = () => {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [result, setResult] = useState<GameResult | null>(null);
  const [attempts, setAttempts] = useState(0);
  
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = useCallback(() => {
    setGameState("waiting");
    setResult(null);
    
    // Random delay between 1.5 and 5 seconds
    const delay = Math.random() * 3500 + 1500;
    
    timeoutRef.current = setTimeout(() => {
      startTimeRef.current = performance.now();
      setGameState("ready");
    }, delay);
  }, []);

  const handleClick = useCallback(() => {
    if (gameState === "waiting") {
      // Too early!
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setGameState("too-early");
      return;
    }
    
    if (gameState === "ready") {
      const endTime = performance.now();
      const reactionTime = Math.round(endTime - startTimeRef.current);
      const score = Math.round(calculateScore(reactionTime));
      const tier = getTier(reactionTime);
      
      setResult({ reactionTime, score, tier });
      setGameState("result");
      setAttempts((prev) => prev + 1);
    }
  }, [gameState]);

  const resetGame = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setGameState("idle");
    setResult(null);
  }, []);

  const playAgain = useCallback(() => {
    setGameState("idle");
    setResult(null);
  }, []);

  return {
    gameState,
    result,
    attempts,
    startGame,
    handleClick,
    resetGame,
    playAgain,
  };
};
