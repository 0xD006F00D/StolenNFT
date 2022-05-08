// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../utils/Ownable.sol";
import "../tokens/ERC721.sol";
import "../tokens/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MockNFT is ERC721, ERC721Enumerable, Ownable {
	string private _storedBaseURI;
	uint256 public constant MAX_SUPPLY = 10000;
	using Strings for uint256;

	constructor(
		string memory _name,
		string memory _symbol,
		string memory baseURI
	) payable Ownable(msg.sender) ERC721(_name, _symbol) {
		_storedBaseURI = baseURI;

		mint(10);
	}

	receive() external payable {}

	function _beforeTokenTransfer(
		address from,
		address to,
		uint256 tokenId
	) internal override(ERC721, ERC721Enumerable) {
		super._beforeTokenTransfer(from, to, tokenId);
	}

	function supportsInterface(bytes4 interfaceId)
		public
		view
		virtual
		override(ERC721, ERC721Enumerable)
		returns (bool)
	{
		return super.supportsInterface(interfaceId);
	}

	function setBaseURI(string memory storedBaseURI) public onlyOwner {
		_storedBaseURI = storedBaseURI;
	}

	function _baseURI() internal view virtual returns (string memory) {
		return _storedBaseURI;
	}

	function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
		require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

		string memory baseURI = _baseURI();
		return
			bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString())) : "";
	}

	function mint(uint256 numberOfTokens) public payable {
		uint256 supply = totalSupply();
		require(supply + numberOfTokens <= MAX_SUPPLY, "Trying to mint more than available");
		for (uint256 i = 0; i < numberOfTokens; i++) {
			_mint(msg.sender, supply + i);
		}
	}

	function withdraw() public onlyOwner {
		uint256 balance = address(this).balance;
		payable(msg.sender).transfer(balance);
	}
}
