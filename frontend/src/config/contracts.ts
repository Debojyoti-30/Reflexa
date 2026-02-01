export const REFLEXA_CONTRACT_ADDRESS = "0x5e5A400DB8B6E2913A4a60064e4f158892E3605b";
export const REFLEXA_BADGE_CONTRACT_ADDRESS = "0x63Aa143afe1bDD98DDFE446Bb1D3DE4F8622DE87";

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

export const REFLEXA_BADGE_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "badgeId",
        "type": "string"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "mintBadge",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "badgeId",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "player",
        "type": "address"
      }
    ],
    "name": "hasBadge",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
