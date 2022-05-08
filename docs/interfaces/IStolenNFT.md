# IStolenNFT



> Steal somebody&#39;s NFTs (with their permission of course)



*ERC721 Token supporting EIP-2612 signatures for token approvals*

## Methods

### DOMAIN_SEPARATOR

```solidity
function DOMAIN_SEPARATOR() external view returns (bytes32)
```



*Returns the domain separator used in the encoding of the signature for {permit}, as defined by {EIP712}.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### approve

```solidity
function approve(address to, uint256 tokenId) external nonpayable
```



*Gives permission to `to` to transfer `tokenId` token to another account. The approval is cleared when the token is transferred. Only a single account can be approved at a time, so approving the zero address clears previous approvals. Requirements: - The caller must own the token or be an approved operator. - `tokenId` must exist. Emits an {Approval} event.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| to | address | undefined |
| tokenId | uint256 | undefined |

### balanceOf

```solidity
function balanceOf(address owner) external view returns (uint256 balance)
```



*Returns the number of tokens in ``owner``&#39;s account.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| balance | uint256 | undefined |

### getApproved

```solidity
function getApproved(uint256 tokenId) external view returns (address operator)
```



*Returns the account approved for `tokenId` token. Requirements: - `tokenId` must exist.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| operator | address | undefined |

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



*Returns if the `operator` is allowed to manage all of the assets of `owner`. See {setApprovalForAll}*

#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | undefined |
| operator | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### name

```solidity
function name() external view returns (string)
```



*Returns the token collection name.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### nonces

```solidity
function nonces(address owner) external view returns (uint256)
```



*Returns the current nonce for `owner`. This value must be included whenever a signature is generated for {permit}. Every successful call to {permit} increases ``owner``&#39;s nonce by one. This prevents a signature from being used multiple times.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### ownerOf

```solidity
function ownerOf(uint256 tokenId) external view returns (address owner)
```



*Returns the owner of the `tokenId` token. Requirements: - `tokenId` must exist.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| owner | address | undefined |

### permit

```solidity
function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external nonpayable
```



*Sets `value` as the allowance of `spender` over ``owner``&#39;s tokens, given ``owner``&#39;s signed approval. IMPORTANT: The same issues {IERC20-approve} has related to transaction ordering also apply here. Emits an {Approval} event. Requirements: - `spender` cannot be the zero address. - `deadline` must be a timestamp in the future. - `v`, `r` and `s` must be a valid `secp256k1` signature from `owner` over the EIP712-formatted function arguments. - the signature must use ``owner``&#39;s current nonce (see {nonces}). For more information on the signature format, see the https://eips.ethereum.org/EIPS/eip-2612#specification[relevant EIP section].*

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

### royaltyInfo

```solidity
function royaltyInfo(uint256 tokenId, uint256 salePrice) external view returns (address receiver, uint256 royaltyAmount)
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
| receiver | address | undefined |
| royaltyAmount | uint256 | undefined |

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId) external nonpayable
```



*Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients are aware of the ERC721 protocol to prevent tokens from being forever locked. Requirements: - `from` cannot be the zero address. - `to` cannot be the zero address. - `tokenId` token must exist and be owned by `from`. - If the caller is not `from`, it must be have been allowed to move this token by either {approve} or {setApprovalForAll}. - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer. Emits a {Transfer} event.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| from | address | undefined |
| to | address | undefined |
| tokenId | uint256 | undefined |

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId, bytes data) external nonpayable
```



*Safely transfers `tokenId` token from `from` to `to`. Requirements: - `from` cannot be the zero address. - `to` cannot be the zero address. - `tokenId` token must exist and be owned by `from`. - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}. - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer. Emits a {Transfer} event.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| from | address | undefined |
| to | address | undefined |
| tokenId | uint256 | undefined |
| data | bytes | undefined |

### setApprovalForAll

```solidity
function setApprovalForAll(address operator, bool _approved) external nonpayable
```



*Approve or remove `operator` as an operator for the caller. Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller. Requirements: - The `operator` cannot be the caller. Emits an {ApprovalForAll} event.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| operator | address | undefined |
| _approved | bool | undefined |

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



*Returns the token collection symbol.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### tokenByIndex

```solidity
function tokenByIndex(uint256 index) external view returns (uint256)
```



*Returns a token ID at a given `index` of all the tokens stored by the contract. Use along with {totalSupply} to enumerate all tokens.*

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



*Returns a token ID owned by `owner` at a given `index` of its token list. Use along with {balanceOf} to enumerate all of ``owner``&#39;s tokens.*

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



*Returns the total amount of tokens stored by the contract.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 tokenId) external nonpayable
```



*Transfers `tokenId` token from `from` to `to`. WARNING: Usage of this method is discouraged, use {safeTransferFrom} whenever possible. Requirements: - `from` cannot be the zero address. - `to` cannot be the zero address. - `tokenId` token must be owned by `from`. - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}. Emits a {Transfer} event.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| from | address | undefined |
| to | address | undefined |
| tokenId | uint256 | undefined |



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

### Seized

```solidity
event Seized(address indexed thief, uint64 originalChainId, address originalContract, uint256 originalId, uint256 indexed stolenId)
```

Emitted when a user was reported and gets his StolenNFT taken away / burned



#### Parameters

| Name | Type | Description |
|---|---|---|
| thief `indexed` | address | The user who returned the StolenNFT |
| originalChainId  | uint64 | The chain the Nft was stolen from |
| originalContract  | address | The original NFTs contract address |
| originalId  | uint256 | The original NFTs token ID |
| stolenId `indexed` | uint256 | The token ID of the StolenNFT |

### Stolen

```solidity
event Stolen(address indexed thief, uint64 originalChainId, address indexed originalContract, uint256 indexed originalId, uint256 stolenId)
```

Emitted when a user steals / mints a NFT



#### Parameters

| Name | Type | Description |
|---|---|---|
| thief `indexed` | address | The user who stole a NFT |
| originalChainId  | uint64 | The chain the Nft was stolen from |
| originalContract `indexed` | address | The original NFTs contract address |
| originalId `indexed` | uint256 | The original NFTs token ID |
| stolenId  | uint256 | The token ID of the minted StolenNFT |

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



