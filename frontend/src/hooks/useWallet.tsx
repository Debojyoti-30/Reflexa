import { useCallback, useMemo } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { toast } from "sonner";
import { chainConfig } from "@/config/chain";

export const useWallet = () => {
  const { login, logout, authenticated, user } = usePrivy();
  const { wallets } = useWallets();

  const primaryWallet = useMemo(() => {
    return (
      wallets.find((wallet) => wallet.address === user?.wallet?.address) ||
      wallets[0]
    );
  }, [wallets, user]);

  const connect = useCallback(async () => {
    try {
      await login();
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Connection Failed", {
        description: "An error occurred while connecting your wallet.",
      });
    }
  }, [login]);

  const disconnect = useCallback(async () => {
    try {
      await logout();
      toast.info("Wallet Disconnected");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [logout]);

  return {
    isConnected: authenticated,
    address: primaryWallet?.address || user?.wallet?.address || "",
    balance: "0", // Balance fetching can be added later if needed
    network: primaryWallet?.chainId
      ? primaryWallet.chainId === `eip155:${chainConfig.id}`
        ? chainConfig.name
        : "Other Network"
      : chainConfig.name,
    connect,
    disconnect,
    primaryWallet,
    user,
  };
};
