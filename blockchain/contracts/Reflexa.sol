// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Reflexa is Ownable {
    using ECDSA for bytes32;

    address public signerAddress;
    
    struct UserStats {
        uint256 bestScore;
        uint256 totalGames;
    }
    
    mapping(address => UserStats) public playerStats;
    mapping(string => bool) public processedRounds;
    
    event ScoreSubmitted(address indexed player, string roundId, uint256 score);

    constructor(address _signerAddress) Ownable(msg.sender) {
        signerAddress = _signerAddress;
    }

    function setSignerAddress(address _newSigner) external onlyOwner {
        signerAddress = _newSigner;
    }

    function submitScore(
        string calldata roundId,
        uint256 score,
        bytes calldata signature
    ) external {
        require(!processedRounds[roundId], "Round already processed");
        
        // Construct the message hash
        bytes32 messageHash = keccak256(abi.encodePacked(msg.sender, roundId, score));
        
        // Apply Ethereum signed message prefix
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
        
        // Recover signer address
        address recoveredSigner = ethSignedMessageHash.recover(signature);
        
        require(recoveredSigner == signerAddress, "Invalid signature");

        // Mark round as processed
        processedRounds[roundId] = true;
        
        // Update stats
        playerStats[msg.sender].totalGames += 1;
        if (score > playerStats[msg.sender].bestScore) {
            playerStats[msg.sender].bestScore = score;
        }

        emit ScoreSubmitted(msg.sender, roundId, score);
    }
}
