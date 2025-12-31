export const REFLEXA_CONTRACT_ADDRESS = "0x45a6C6F5EE305F6add44b4793877826CA49c7B13";

export const REFLEXA_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_signerAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "roundId",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "score",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "submitScore",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "playerStats",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "bestScore",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalGames",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
