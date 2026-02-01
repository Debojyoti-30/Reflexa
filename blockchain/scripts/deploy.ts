import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const signerAddress = deployer.address; 

  // 1. Deploy Reflexa (Main Game Contract)
  const Reflexa = await ethers.getContractFactory("Reflexa");
  const reflexa = await Reflexa.deploy(signerAddress);
  await reflexa.waitForDeployment();
  console.log("Reflexa deployed to:", await reflexa.getAddress());

  // 2. Deploy ReflexaBadge (Soulbound NFT Contract)
  const baseURI = "https://reflexa.app/api/badges/metadata/"; // Placeholder URI
  const ReflexaBadge = await ethers.getContractFactory("ReflexaBadge");
  const reflexaBadge = await ReflexaBadge.deploy(signerAddress, baseURI);
  await reflexaBadge.waitForDeployment();
  console.log("ReflexaBadge deployed to:", await reflexaBadge.getAddress());

  console.log("Signer address set to:", signerAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
