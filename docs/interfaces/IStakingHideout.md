# IStakingHideout



> A place to hide your stolen NFTs and earn some CounterfeitMoney





## Methods

### balanceOf

```solidity
function balanceOf(address owner) external view returns (uint256)
```



*Returns the users balance of tokens stored by the contract.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### earned

```solidity
function earned(address account) external view returns (uint256)
```

Returns the rewards earned for a given account



#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | The amount of rewards earned by an user |

### getReward

```solidity
function getReward() external nonpayable
```

Transfers the collected staking rewards to the message sender




### getStaker

```solidity
function getStaker(uint256 tokenId) external view returns (address)
```

Get the staker of a staked StolenNFT



#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | The tokenId of the StolenNFT that was staked |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | The address of the staker |

### rewardPerToken

```solidity
function rewardPerToken() external view returns (uint256)
```

Returns the rewards payed per token




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | amount of reward per token |

### stash

```solidity
function stash(uint256 tokenId) external nonpayable
```

Deposits an approved stolen NFT into the contract if the hideout still has enough space

*Emits a {Stashed} Event and updates token rewards*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | The message senders approved token that should be staked |

### stashWithPermit

```solidity
function stashWithPermit(uint256 tokenId, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external nonpayable
```

Deposits a stolen NFT into the contract in a single call by providing a valid EIP-2612 Permit

*Same as {xref-IStakingHideout-stash-uint256-}[`stash`], with additional signature parameters which allow the approval and transfer the StolenNFT in a single Transaction using EIP-2612 Permits Emits a {Stashed} Event and updates token rewards*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | The message senders token that should be staked |
| deadline | uint256 | timestamp until when the given signature will be valid |
| v | uint8 | The parity of the y co-ordinate of r of the signature |
| r | bytes32 | The x co-ordinate of the r value of the signature |
| s | bytes32 | The x co-ordinate of the s value of the signature |

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

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```



*Returns the total amount of tokens stored by the contract.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### unstash

```solidity
function unstash(uint256 tokenId) external nonpayable
```

Transfers the staked stolen NFT back to the staker

*Emits a {Unstashed} Event and updates token rewards*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | The message senders approved token that should be staked |



## Events

### RewardPaid

```solidity
event RewardPaid(address indexed user, uint256 reward)
```

Emitted when a reward was payed to a staker



#### Parameters

| Name | Type | Description |
|---|---|---|
| user `indexed` | address | The staker |
| reward  | uint256 | The reward amount |

### Stashed

```solidity
event Stashed(address indexed user, uint256 indexed tokenId)
```

Emitted when a staker stakes an ERC721 token



#### Parameters

| Name | Type | Description |
|---|---|---|
| user `indexed` | address | The staker |
| tokenId `indexed` | uint256 | The token deposited |

### Unstashed

```solidity
event Unstashed(address indexed user, uint256 indexed tokenId)
```

Emitted when a staker unstakes an ERC721 token



#### Parameters

| Name | Type | Description |
|---|---|---|
| user `indexed` | address | The staker |
| tokenId `indexed` | uint256 | The token deposited |



