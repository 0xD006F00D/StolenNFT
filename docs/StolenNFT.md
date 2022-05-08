# StolenNFT



> Steal somebody&#39;s NFTs (with their permission of course)



*ERC721 Token supporting EIP-2612 signatures for token approvals*

## Methods

### DOMAIN_SEPARATOR

```solidity
function DOMAIN_SEPARATOR() external view returns (bytes32)
```



*See {IERC20Permit-DOMAIN_SEPARATOR}.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### approve

```solidity
function approve(address to, uint256 tokenId) external nonpayable
```



*See {IERC721-approve}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| to | address | undefined |
| tokenId | uint256 | undefined |

### balanceOf

```solidity
function balanceOf(address owner) external view returns (uint256)
```



*See {IERC721-balanceOf}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### criminalRecords

```solidity
function criminalRecords() external view returns (contract ICriminalRecords)
```

Contract used to track the thief&#39;s action




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract ICriminalRecords | undefined |

### emptyTipJar

```solidity
function emptyTipJar(address payable recipient) external nonpayable
```

Sends all collected tips to a specified address

*Can only be executed by the contract owner*

#### Parameters

| Name | Type | Description |
|---|---|---|
| recipient | address payable | Payable address that should receive all tips |

### getApproved

```solidity
function getApproved(uint256 tokenId) external view returns (address)
```



*See {IERC721-getApproved}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### getOriginal

```solidity
function getOriginal(uint256 stolenId) external view returns (uint64, address, uint256)
```

Returns the original NFT address and tokenID for a given stolenID if stolen



#### Parameters

| Name | Type | Description |
|---|---|---|
| stolenId | uint256 | The stolenID to lookup |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint64 | originalChainId The chain the NFT was stolen from |
| _1 | address | originalAddress The contract address of the original NFT |
| _2 | uint256 | originalId The tokenID of the original NFT |

### getStolen

```solidity
function getStolen(address originalAddress, uint256 originalId) external view returns (uint256)
```

Returns the stolenID for a given original NFT address and tokenID if stolen



#### Parameters

| Name | Type | Description |
|---|---|---|
| originalAddress | address | The contract address of the original NFT |
| originalId | uint256 | The tokenID of the original NFT |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | The stolenID |

### isApprovedForAll

```solidity
function isApprovedForAll(address owner, address operator) external view returns (bool)
```



*See {IERC721-isApprovedForAll}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | undefined |
| operator | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### maximumSupply

```solidity
function maximumSupply() external view returns (uint256)
```

Maximum supply of stolen NFTs




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### name

```solidity
function name() external view returns (string)
```



*See {IERC721Metadata-name}.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### nonces

```solidity
function nonces(address owner) external view returns (uint256)
```



*See {IERC20Permit-nonces}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### originalOwnerOf

```solidity
function originalOwnerOf(address contractAddress, uint256 tokenId) external view returns (address)
```

Returns the original owner of an IERC721 token if the owner is not a contract

*External call that can be influenced by caller, handle with care*

#### Parameters

| Name | Type | Description |
|---|---|---|
| contractAddress | address | The contract address of the NFT |
| tokenId | uint256 | The token id of the NFT |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | If the contract is a valid IERC721 token that exists the address will be returned if its not an contract address, zero-address otherwise |

### originalTokenURI

```solidity
function originalTokenURI(address contractAddress, uint256 tokenId) external view returns (string)
```

Returns the original tokenURI of an IERC721Metadata token

*External call that can be influenced by caller, handle with care*

#### Parameters

| Name | Type | Description |
|---|---|---|
| contractAddress | address | The contract address of the NFT |
| tokenId | uint256 | The token id of the NFT |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | If the contract is a valid IERC721Metadata token the tokenURI will be returned, an empty string otherwise |

### owner

```solidity
function owner() external view returns (address)
```



*Returns the address of the current owner.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### ownerOf

```solidity
function ownerOf(uint256 tokenId) external view returns (address)
```



*See {IERC721-ownerOf}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### permit

```solidity
function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external nonpayable
```



*See {IERC20Permit-permit}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | undefined |
| spender | address | undefined |
| value | uint256 | undefined |
| deadline | uint256 | undefined |
| v | uint8 | undefined |
| r | bytes32 | undefined |
| s | bytes32 | undefined |

### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```



*Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.*


### retire

```solidity
function retire(bool isRetired) external nonpayable
```

While thief&#39;s are retired stealing / sending is not possible This protects them from NFTs being sent to their address, increasing their wanted level



#### Parameters

| Name | Type | Description |
|---|---|---|
| isRetired | bool | Whether msg.sender is retiring or becoming a thief again |

### retired

```solidity
function retired(address thief) external view returns (bool)
```

Returns whether a thief is retired



#### Parameters

| Name | Type | Description |
|---|---|---|
| thief | address | The thief who should be checked out |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | True if criminal records are online and the thief is retired, false otherwise |

### royaltyInfo

```solidity
function royaltyInfo(uint256 tokenId, uint256 salePrice) external view returns (address, uint256)
```



*Returns how much royalty is owed and to whom, based on a sale price that may be denominated in any unit of exchange. The royalty amount is denominated and should be paid in that same unit of exchange.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | undefined |
| salePrice | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |
| _1 | uint256 | undefined |

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId) external nonpayable
```



*See {IERC721-safeTransferFrom}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| from | address | undefined |
| to | address | undefined |
| tokenId | uint256 | undefined |

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId, bytes _data) external nonpayable
```



*See {IERC721-safeTransferFrom}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| from | address | undefined |
| to | address | undefined |
| tokenId | uint256 | undefined |
| _data | bytes | undefined |

### setApprovalForAll

```solidity
function setApprovalForAll(address operator, bool approved) external nonpayable
```



*See {IERC721-setApprovalForAll}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| operator | address | undefined |
| approved | bool | undefined |

### setCriminalRecords

```solidity
function setCriminalRecords(address recordsAddress) external nonpayable
```

Sets the criminal records contract that should be used to track thefts

*Can only be set by the contract owner*

#### Parameters

| Name | Type | Description |
|---|---|---|
| recordsAddress | address | The address of the contract |

### setMaximumSupply

```solidity
function setMaximumSupply(uint256 _maximumSupply) external nonpayable
```

Sets the maximum amount of StolenNFTs that can be minted / stolen

*Can only be set by the contract owner, emits a SupplyChange event*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _maximumSupply | uint256 | The new maximum supply |

### setTokenURI

```solidity
function setTokenURI(uint256 stolenId, string uri) external nonpayable
```

Allows holder of the StolenNFT to overwrite the linked / stored tokenURI



#### Parameters

| Name | Type | Description |
|---|---|---|
| stolenId | uint256 | The token ID of the StolenNFT |
| uri | string | The new tokenURI that should be returned when tokenURI() is called or no uri if the nft originates from the same chain and the originals tokenURI should be linked |

### steal

```solidity
function steal(uint64 originalChainId, address originalAddress, uint256 originalId, address mintFrom, uint32 royaltyFee, string uri) external payable returns (uint256)
```

Steal / Mint an original NFT to create a StolenNFT

*Emits a Stolen event*

#### Parameters

| Name | Type | Description |
|---|---|---|
| originalChainId | uint64 | The chainId the NFT originates from, used to trace where the nft was stolen from |
| originalAddress | address | The original NFTs contract address |
| originalId | uint256 | The original NFTs token ID |
| mintFrom | address | Optional address the StolenNFT will be minted and transferred from |
| royaltyFee | uint32 | Optional royalty that should be payed to the original owner on secondary market sales |
| uri | string | Optional Metadata URI to overwrite / censor the original NFT |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) external view returns (bool)
```



*Returns true if this contract implements the interface defined by `interfaceId`. See the corresponding https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section] to learn more about how these ids are created. This function call must use less than 30 000 gas.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| interfaceId | bytes4 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### surrender

```solidity
function surrender(uint256 stolenId) external nonpayable
```

Allows the holder to return / burn the StolenNFT

*Emits a Swatted event*

#### Parameters

| Name | Type | Description |
|---|---|---|
| stolenId | uint256 | The token ID of the StolenNFT |

### swatted

```solidity
function swatted(uint256 stolenId) external nonpayable
```

Allows the StolenNFT to be taken away / burned by the authorities

*Emits a Swatted event*

#### Parameters

| Name | Type | Description |
|---|---|---|
| stolenId | uint256 | The token ID of the StolenNFT |

### symbol

```solidity
function symbol() external view returns (string)
```



*See {IERC721Metadata-symbol}.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### tokenByIndex

```solidity
function tokenByIndex(uint256 index) external view returns (uint256)
```



*See {IERC721Enumerable-tokenByIndex}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| index | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### tokenOfOwnerByIndex

```solidity
function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)
```



*See {IERC721Enumerable-tokenOfOwnerByIndex}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | undefined |
| index | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### tokenURI

```solidity
function tokenURI(uint256 tokenId) external view returns (string)
```



*Returns the Uniform Resource Identifier (URI) for `tokenId` token.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```



*See {IERC721Enumerable-totalSupply}.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 tokenId) external nonpayable
```



*See {IERC721-transferFrom}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| from | address | undefined |
| to | address | undefined |
| tokenId | uint256 | undefined |

### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```



*Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newOwner | address | undefined |



## Events

### Approval

```solidity
event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| owner `indexed` | address | undefined |
| approved `indexed` | address | undefined |
| tokenId `indexed` | uint256 | undefined |

### ApprovalForAll

```solidity
event ApprovalForAll(address indexed owner, address indexed operator, bool approved)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| owner `indexed` | address | undefined |
| operator `indexed` | address | undefined |
| approved  | bool | undefined |

### CriminalRecordsChange

```solidity
event CriminalRecordsChange(address recordsAddress)
```

Emitted when the criminalRecords get set or unset



#### Parameters

| Name | Type | Description |
|---|---|---|
| recordsAddress  | address | The new address of the CriminalRecords or zero address if disabled |

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |

### Seized

```solidity
event Seized(address indexed thief, uint64 originalChainId, address originalContract, uint256 originalId, uint256 indexed stolenId)
```

Emitted when a user was reported and gets his StolenNFT taken away / burned



#### Parameters

| Name | Type | Description |
|---|---|---|
| thief `indexed` | address | undefined |
| originalChainId  | uint64 | undefined |
| originalContract  | address | undefined |
| originalId  | uint256 | undefined |
| stolenId `indexed` | uint256 | undefined |

### Stolen

```solidity
event Stolen(address indexed thief, uint64 originalChainId, address indexed originalContract, uint256 indexed originalId, uint256 stolenId)
```

Emitted when a user steals / mints a NFT



#### Parameters

| Name | Type | Description |
|---|---|---|
| thief `indexed` | address | undefined |
| originalChainId  | uint64 | undefined |
| originalContract `indexed` | address | undefined |
| originalId `indexed` | uint256 | undefined |
| stolenId  | uint256 | undefined |

### SupplyChange

```solidity
event SupplyChange(uint256 newSupply)
```

Emitted when the maximum supply of StolenNFTs changes



#### Parameters

| Name | Type | Description |
|---|---|---|
| newSupply  | uint256 | the new maximum supply |

### Transfer

```solidity
event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| from `indexed` | address | undefined |
| to `indexed` | address | undefined |
| tokenId `indexed` | uint256 | undefined |



## Errors

### AlreadyStolen

```solidity
error AlreadyStolen(uint256 tokenId)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | undefined |

### ApprovalToOwner

```solidity
error ApprovalToOwner()
```






### ApproveToOwner

```solidity
error ApproveToOwner()
```






### CallerNotApprovedOrOwner

```solidity
error CallerNotApprovedOrOwner()
```






### CallerNotTheLaw

```solidity
error CallerNotTheLaw()
```






### CallerNotTheOwner

```solidity
error CallerNotTheOwner()
```






### CriminalRecordsOffline

```solidity
error CriminalRecordsOffline()
```






### CrossChainUriMissing

```solidity
error CrossChainUriMissing()
```






### ErrorSendingTips

```solidity
error ErrorSendingTips()
```






### GlobalIndexOutOfBounds

```solidity
error GlobalIndexOutOfBounds(uint256 index)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| index | uint256 | undefined |

### InvalidChainId

```solidity
error InvalidChainId()
```






### InvalidRoyalty

```solidity
error InvalidRoyalty()
```






### InvalidSignature

```solidity
error InvalidSignature()
```






### InvalidSignatureSValue

```solidity
error InvalidSignatureSValue()
```






### InvalidSignatureVValue

```solidity
error InvalidSignatureVValue()
```






### MintFromOwnAddress

```solidity
error MintFromOwnAddress()
```






### MintToZeroAddress

```solidity
error MintToZeroAddress()
```






### NewOwnerIsZeroAddress

```solidity
error NewOwnerIsZeroAddress()
```






### NoTips

```solidity
error NoTips()
```






### NotTheTokenOwner

```solidity
error NotTheTokenOwner()
```






### NothingLeftToSteal

```solidity
error NothingLeftToSteal()
```






### OwnerIndexOutOfBounds

```solidity
error OwnerIndexOutOfBounds(uint256 index)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| index | uint256 | undefined |

### PermitDeadLineExpired

```solidity
error PermitDeadLineExpired()
```






### PermitToOwner

```solidity
error PermitToOwner()
```






### QueryForNonExistentToken

```solidity
error QueryForNonExistentToken(uint256 tokenId)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | undefined |

### QueryForZeroAddress

```solidity
error QueryForZeroAddress()
```






### ReceiverIsRetired

```solidity
error ReceiverIsRetired()
```






### SenderIsRetired

```solidity
error SenderIsRetired()
```






### StealingFromZeroAddress

```solidity
error StealingFromZeroAddress()
```






### StealingStolenNft

```solidity
error StealingStolenNft()
```






### ThiefIsRetired

```solidity
error ThiefIsRetired()
```






### TokenAlreadyMinted

```solidity
error TokenAlreadyMinted()
```






### TransferFromNotTheOwner

```solidity
error TransferFromNotTheOwner()
```






### TransferToNonERC721Receiver

```solidity
error TransferToNonERC721Receiver()
```






### TransferToZeroAddress

```solidity
error TransferToZeroAddress()
```






### UnsupportedToken

```solidity
error UnsupportedToken()
```






### YouAreRetired

```solidity
error YouAreRetired()
```






### YouAreWanted

```solidity
error YouAreWanted()
```







