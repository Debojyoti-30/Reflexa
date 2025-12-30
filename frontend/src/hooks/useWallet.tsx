import { useState, useCallback } from "react";
import { toast } from "sonner";

interface WalletState {
  isConnected: boolean;
  address: string;
  balance: string;
  network: string;
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: "",
    balance: "0",
    network: "Testnet",
  });

  const connect = useCallback(async () => {
    // TODO: Integrate with wagmi/web3 wallet connection
    // This is a mock implementation for hackathon demo
    
    try {
      // Simulate wallet connection delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock connected state
      const mockAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f7C123";
      const mockBalance = "1,250";
      
      setWalletState({
        isConnected: true,
        address: mockAddress,
        balance: mockBalance,
        network: "Testnet",
      });
      
      toast.success("Wallet Connected!", {
        description: `Connected to ${mockAddress.slice(0, 6)}...${mockAddress.slice(-4)}`,
      });
    } catch (error) {
      toast.error("Connection Failed", {
        description: "Please make sure MetaMask is installed and unlocked.",
      });
    }
  }, []);

  const disconnect = useCallback(() => {
    setWalletState({
      isConnected: false,
      address: "",
      balance: "0",
      network: "Testnet",
    });
    
    toast.info("Wallet Disconnected");
  }, []);

  return {
    ...walletState,
    connect,
    disconnect,
  };
};
