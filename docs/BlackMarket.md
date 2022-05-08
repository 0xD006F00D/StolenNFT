# BlackMarket



> A place where bad people do bad deals





## Methods

### balanceOf

```solidity
function balanceOf(address owner) external view returns (uint256)
```



*See {IEnumerableEscrow-tokenOfOwnerByIndex}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### buy

```solidity
function buy(uint256 tokenId) external nonpayable
```

Buy a listed StolenNFT on the market

*Emits a {Sold} Event*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | The token id of the StolenNFT to buy |

### buyWithPermit

```solidity
function buyWithPermit(uint256 tokenId, uint256 price, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external nonpayable
```

Buy a listed NFT on the market by providing a valid EIP-2612 Permit for the Money transaction

*Same as {xref-IBlackMarket-buy-uint256-}[`buy`], with additional signature parameters which allow the approval and transfer of CounterfeitMoney in a single Transaction using EIP-2612 Permits Emits a {Sold} Event*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | The token id of the StolenNFT to buy |
| price | uint256 | undefined |
| deadline | uint256 | timestamp until when the given signature will be valid |
| v | uint8 | The parity of the y co-ordinate of r of the signature |
| r | bytes32 | The x co-ordinate of the r value of the signature |
| s | bytes32 | The x co-ordinate of the s value of the signature |

### cancelListing

```solidity
function cancelListing(uint256 tokenId) external nonpayable
```

Cancel an existing listing on the market

*Emits a {Canceled} Event*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | The token id of the listed StolenNFT that should be canceled |

### closeMarket

```solidity
function closeMarket(bool _marketClosed) external nonpayable
```

Allows the market to be closed, disabling listing and buying



#### Parameters

| Name | Type | Description |
|---|---|---|
| _marketClosed | bool | Whether the market should be closed or opened |

### getListing

```solidity
function getListing(uint256 tokenId) external view returns (struct IBlackMarket.Listing)
```

Get an existing listing on the market by its tokenId



#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | The token id of the listed StolenNFT that should be retrieved |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | IBlackMarket.Listing | undefined |

### listNft

```solidity
function listNft(uint256 tokenId, uint256 price) external nonpayable
```

List a StolenNFT on the market

*Emits a {Listed} Event*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | The token id of the StolenNFT to list |
| price | uint256 | The price the StolenNFT should be listed for |

### listNftWithPermit

```solidity
function listNftWithPermit(uint256 tokenId, uint256 price, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external nonpayable
```

List a StolenNFT on the market by providing a valid EIP-2612 Permit for the token transaction

*Same as {xref-IBlackMarket-listNft-uint256-uint256-}[`listNft`], with additional signature parameters which allow the approval and transfer of CounterfeitMoney in a single Transaction using EIP-2612 Permits Emits a {Listed} Event*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | The token id of the StolenNFT to list |
| price | uint256 | The price the StolenNFT should be listed for |
| deadline | uint256 | timestamp until when the given signature will be valid |
| v | uint8 | The parity of the y co-ordinate of r of the signature |
| r | bytes32 | The x co-ordinate of the r value of the signature |
| s | bytes32 | The x co-ordinate of the s value of the signature |

### marketClosed

```solidity
function marketClosed() external view returns (bool)
```

Whether listing / buying is possible




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### money

```solidity
function money() external view returns (contract ICounterfeitMoney)
```

ERC20 Token used to pay for a listing




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract ICounterfeitMoney | undefined |

### owner

```solidity
function owner() external view returns (address)
```



*Returns the address of the current owner.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```



*Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.*


### stolenNFT

```solidity
function stolenNFT() external view returns (contract IStolenNFT)
```

ERC721 Token that is listed for sale




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract IStolenNFT | undefined |

### tokenByIndex

```solidity
function tokenByIndex(uint256 index) external view returns (uint256)
```



*See {IEnumerableEscrow-tokenByIndex}.*

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



*See {IEnumerableEscrow-tokenOfOwnerByIndex}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | undefined |
| index | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```



*See {IEnumerableEscrow-totalSupply}.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```



*Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newOwner | address | undefined |

### updateListing

```solidity
function updateListing(uint256 tokenId, uint256 newPrice) external nonpayable
```

Update an existing listing on the market

*Emits a {Listed} Event*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | The token id of the StolenNFT that is already listed |
| newPrice | uint256 | The new price the StolenNFT |



## Events

### Canceled

```solidity
event Canceled(address indexed seller, uint256 indexed tokenId, uint256 price)
```

Emitted when a user canceled a listed StolenNFT



#### Parameters

| Name | Type | Description |
|---|---|---|
| seller `indexed` | address | undefined |
| tokenId `indexed` | uint256 | undefined |
| price  | uint256 | undefined |

### Listed

```solidity
event Listed(address indexed seller, uint256 indexed tokenId, uint256 price)
```

Emitted when a user lists a StolenNFT



#### Parameters

| Name | Type | Description |
|---|---|---|
| seller `indexed` | address | undefined |
| tokenId `indexed` | uint256 | undefined |
| price  | uint256 | undefined |

### MarketClosed

```solidity
event MarketClosed(bool state)
```

Emitted when the market closes or opens



#### Parameters

| Name | Type | Description |
|---|---|---|
| state  | bool | undefined |

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |

### Sold

```solidity
event Sold(address indexed buyer, address indexed seller, uint256 indexed tokenId, uint256 price)
```

Emitted when a user sells a StolenNFT



#### Parameters

| Name | Type | Description |
|---|---|---|
| buyer `indexed` | address | undefined |
| seller `indexed` | address | undefined |
| tokenId `indexed` | uint256 | undefined |
| price  | uint256 | undefined |



## Errors

### CallerNotTheOwner

```solidity
error CallerNotTheOwner()
```






### GlobalIndexOutOfBounds

```solidity
error GlobalIndexOutOfBounds(uint256 index)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| index | uint256 | undefined |

### MarketIsClosed

```solidity
error MarketIsClosed()
```






### NewOwnerIsZeroAddress

```solidity
error NewOwnerIsZeroAddress()
```






### NotTheSeller

```solidity
error NotTheSeller()
```






### NotTheTokenOwner

```solidity
error NotTheTokenOwner()
```






### OwnerIndexOutOfBounds

```solidity
error OwnerIndexOutOfBounds(uint256 index)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| index | uint256 | undefined |

### TokenNotListed

```solidity
error TokenNotListed()
```






### TransactionFailed

```solidity
error TransactionFailed()
```







