import { Navbar } from "@/components/layout/Navbar";
import { ReactionGame } from "@/components/game/ReactionGame";

const Game = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col relative pt-16 overflow-hidden">
        {/* Background - adjusted to be relative to main or keep it fixed but ensure it doesn't block */}
        <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none z-0" />

        <div className="flex-1 flex flex-col relative z-10 w-full">
          <ReactionGame />
        </div>
      </main>
    </div>
  );
};

export default Game;
