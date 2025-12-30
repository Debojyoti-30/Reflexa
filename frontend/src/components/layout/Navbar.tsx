import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Wallet, Trophy, User, Gamepad2, Zap } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { useWallet } from "@/hooks/useWallet";

const navItems = [
  { path: "/", label: "Play", icon: Gamepad2 },
  { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { path: "/profile", label: "Profile", icon: User },
];

export const Navbar = () => {
  const location = useLocation();
  const { isConnected, address, balance, connect, disconnect } = useWallet();

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-glass-border"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-lg bg-gradient-cyber flex items-center justify-center"
            >
              <Zap className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <span className="font-display font-bold text-xl neon-text hidden sm:block">
              REFLEXA
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/30"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Wallet & Balance */}
          <div className="flex items-center gap-3">
            {isConnected && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-glass-border"
              >
                <Zap className="w-4 h-4 text-neon-yellow" />
                <span className="font-semibold text-sm">{balance} SKILL</span>
              </motion.div>
            )}
            
            {isConnected ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-primary/30">
                  <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                  <span className="font-mono text-sm">{shortenAddress(address)}</span>
                </div>
                <CyberButton
                  variant="ghost"
                  size="sm"
                  onClick={disconnect}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Wallet className="w-4 h-4" />
                </CyberButton>
              </motion.div>
            ) : (
              <CyberButton onClick={connect} size="sm">
                <Wallet className="w-4 h-4" />
                <span className="hidden sm:inline">Connect</span>
              </CyberButton>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
