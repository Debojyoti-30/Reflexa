// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ReflexaBadge is ERC721, Ownable {
    using ECDSA for bytes32;

    address public signerAddress;
    string private _baseTokenURI;
    
    // Mapping to track which badges a user has already minted to prevent duplicates
    // badgeId => (userAddress => hasMinted)
    mapping(string => mapping(address => bool)) public hasBadge;

    constructor(address _signerAddress, string memory baseURI) 
        ERC721("Reflexa Achievement Badge", "RFXB") 
        Ownable(msg.sender) 
    {
        signerAddress = _signerAddress;
        _baseTokenURI = baseURI;
    }

    /**
     * @dev Overriding transfer function to make it Soulbound.
     * Transfers are only allowed during minting (from 0) or burning (to 0).
     */
    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert("ReflexaBadge: Achievement badges are Soulbound and non-transferable");
        }
        return super._update(to, tokenId, auth);
    }

    function setSignerAddress(address _newSigner) external onlyOwner {
        signerAddress = _newSigner;
    }

    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Mint a badge using a backend signature.
     * @param player The address of the player receiving the badge.
     * @param badgeId The unique identifier of the badge (e.g., "TOP_1_PERCENT").
     * @param signature The ECDSA signature from the backend signer.
     */
    function mintBadge(
        address player,
        string calldata badgeId,
        bytes calldata signature
    ) external {
        require(!hasBadge[badgeId][player], "Badge already earned and minted");
        
        // Verify signature: sign(player, badgeId)
        bytes32 messageHash = keccak256(abi.encodePacked(player, badgeId));
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
        
        address recoveredSigner = ethSignedMessageHash.recover(signature);
        require(recoveredSigner == signerAddress, "Invalid backend signature");

        // Use a hash of the badgeId string as the tokenId
        uint256 tokenId = uint256(keccak256(abi.encodePacked(badgeId, player)));
        
        hasBadge[badgeId][player] = true;
        _safeMint(player, tokenId);
    }
}
