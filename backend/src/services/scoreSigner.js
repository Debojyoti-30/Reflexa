import { ethers } from "ethers";

const PRIVATE_KEY = process.env.SIGNING_PRIVATE_KEY;
console.log("SIGNING_PRIVATE_KEY loaded:", !!PRIVATE_KEY);

const signerWallet = PRIVATE_KEY ? new ethers.Wallet(PRIVATE_KEY) : null;

export async function signScore(walletAddress, roundId, score) {
  if (!signerWallet) throw new Error("Signer wallet not initialized");

  const messageHash = ethers.solidityPackedKeccak256(
    ["address", "string", "uint256"],
    [walletAddress, roundId, score]
  );

  const signature = await signerWallet.signMessage(
    ethers.toBeArray(messageHash)
  );
  return signature;
}

export async function signBadge(walletAddress, badgeId) {
  if (!signerWallet) throw new Error("Signer wallet not initialized");

  // Matches the contract: keccak256(abi.encodePacked(player, badgeId))
  const messageHash = ethers.solidityPackedKeccak256(
    ["address", "string"],
    [walletAddress, badgeId]
  );

  const signature = await signerWallet.signMessage(
    ethers.toBeArray(messageHash)
  );
  return signature;
}
