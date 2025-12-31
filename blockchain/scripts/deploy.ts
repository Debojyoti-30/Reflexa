import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // In a real scenario, this would be the address corresponding to the backend's private key
  const signerAddress = deployer.address; // For demo purposes, we use the deployer

  const Reflexa = await ethers.getContractFactory("Reflexa");
  const reflexa = await Reflexa.deploy(signerAddress);

  await reflexa.waitForDeployment();

  console.log("Reflexa deployed to:", await reflexa.getAddress());
  console.log("Signer address set to:", signerAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
