# StakingHideout



> A place to hide your stolen NFTs and earn some Counterfeit Money to bribe the police



*based on [Synthetix StakingRewards](https://github.com/Synthetixio/synthetix/blob/develop/contracts/StakingRewards.sol)*

## Methods

### balanceLimit

```solidity
function balanceLimit() external view returns (uint256)
```

Maximum number of NFTs that can be staked per thief




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

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

### lastUpdateTime

```solidity
function lastUpdateTime() external view returns (uint256)
```

Timestamp of the last time the calculations were run




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

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


### rewardPerToken

```solidity
function rewardPerToken() external view returns (uint256)
```

Returns the rewards payed per token




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | amount of reward per token |

### rewardPerTokenStored

```solidity
function rewardPerTokenStored() external view returns (uint256)
```

Stored reward rate for a staked token




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### rewardRate

```solidity
function rewardRate() external view returns (uint256)
```

The staking reward rate, default 100000eth/day = 100000/(60*60*24) = 1.1574074074




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### rewards

```solidity
function rewards(address) external view returns (uint256)
```

Amount of rewards earned by a staker that can be withdrawn



#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### rewardsToken

```solidity
function rewardsToken() external view returns (contract ICounterfeitMoney)
```

IERC20 token used to pay rewards




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract ICounterfeitMoney | undefined |

### setBalanceLimit

```solidity
function setBalanceLimit(uint256 _balanceLimit) external nonpayable
```

Sets the maximum number of NFTs that can be staked per thief

*Can only be called by the contract owner and emits a BalanceLimitChange event*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _balanceLimit | uint256 | The maximum stash size for a thief |

### setRewardRate

```solidity
function setRewardRate(uint256 _rewardRate) external nonpayable
```

Sets and updates the staking reward rate

*Can only be called by the contract owner a RewardRateChange event*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _rewardRate | uint256 | The rate to be set |

### stakingNft

```solidity
function stakingNft() external view returns (contract IStolenNFT)
```

IERC721 token used to stake and earn rewards with




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract IStolenNFT | undefined |

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

### userRewardPerTokenPaid

```solidity
function userRewardPerTokenPaid(address) external view returns (uint256)
```

Amount of staker&#39;s rewards per token since the last update



#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |



## Events

### BalanceLimitChange

```solidity
event BalanceLimitChange(uint256 newBalanceLimit)
```

Emitted when the balance limit changes



#### Parameters

| Name | Type | Description |
|---|---|---|
| newBalanceLimit  | uint256 | The new balance limit |

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |

### RewardPaid

```solidity
event RewardPaid(address indexed user, uint256 reward)
```

Emitted when a reward was payed to a staker



#### Parameters

| Name | Type | Description |
|---|---|---|
| user `indexed` | address | undefined |
| reward  | uint256 | undefined |

### RewardRateChange

```solidity
event RewardRateChange(uint256 newRewardRate)
```

Emitted when the reward rate changes



#### Parameters

| Name | Type | Description |
|---|---|---|
| newRewardRate  | uint256 | The new reward rate |

### Stashed

```solidity
event Stashed(address indexed user, uint256 indexed tokenId)
```

Emitted when a staker stakes an ERC721 token



#### Parameters

| Name | Type | Description |
|---|---|---|
| user `indexed` | address | undefined |
| tokenId `indexed` | uint256 | undefined |

### Unstashed

```solidity
event Unstashed(address indexed user, uint256 indexed tokenId)
```

Emitted when a staker unstakes an ERC721 token



#### Parameters

| Name | Type | Description |
|---|---|---|
| user `indexed` | address | undefined |
| tokenId `indexed` | uint256 | undefined |



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

### NewOwnerIsZeroAddress

```solidity
error NewOwnerIsZeroAddress()
```






### NotTheStaker

```solidity
error NotTheStaker()
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

### StashIsFull

```solidity
error StashIsFull()
```






### TokenNotStashed

```solidity
error TokenNotStashed()
```







