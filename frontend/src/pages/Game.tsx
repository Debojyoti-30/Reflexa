import { Navbar } from "@/components/layout/Navbar";
import { ReactionGame } from "@/components/game/ReactionGame";

const Game = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Background */}
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none" />
      
      <ReactionGame />
    </div>
  );
};

export default Game;
