// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// import "@openzeppelin/contracts/token/ERC1155/ERC721.sol";
import "erc721a/contracts/ERC721A.sol";
import "hardhat/console.sol";

contract SimpleERC721A is ERC721A {
    string public baseURI;
    uint256 public maxSupply;
    uint256 public tokenCounter;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _baseURI,
        uint256 _maxSupply
    ) ERC721A(_name, _symbol) {
        baseURI = _baseURI;
        maxSupply = _maxSupply;
    }

    function mint(uint256 quantity) external {
        require(totalSupply() + quantity <= maxSupply, "Exceeds max supply");
        _safeMint(msg.sender, quantity);
        
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return string(abi.encodePacked(baseURI, _toString(tokenId), ".png"));
    }

    function getNfts(uint256 counter) public returns(uint256) {
        return tokenCounter = counter;
    }
}