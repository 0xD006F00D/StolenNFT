# CriminalRecords



> Police HQ - tracking criminals - staying corrupt





## Methods

### aboveTheLaw

```solidity
function aboveTheLaw(address) external view returns (bool)
```

Contracts that cannot be sentenced



#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### arrest

```solidity
function arrest() external nonpayable returns (bool)
```

After previous report was filed the arrest can be triggered If the arrest is successful the stolen NFT will be returned / burned If the thief gets away another report has to be filed

*Emits a {Arrested} and {Wanted} Event*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | Returns true if the report was successful |

### bribe

```solidity
function bribe(address criminal, uint256 amount) external nonpayable returns (uint256)
```

Decrease the criminals wanted level by providing a bribe denominated in CounterfeitMoney

*The decrease depends on {bribePerLevel}. If more CounterfeitMoney is given then needed it will not be transferred / burned. Emits a {Wanted} Event*

#### Parameters

| Name | Type | Description |
|---|---|---|
| criminal | address | The criminal whose wanted level should be reduced |
| amount | uint256 | Amount of CounterfeitMoney available to pay the bribe |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | Number of wanted levels that have been removed |

### bribeCheque

```solidity
function bribeCheque(address criminal, uint256 amount, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external nonpayable returns (uint256)
```

Decrease the criminals wanted level by providing a bribe denominated in CounterfeitMoney and a valid EIP-2612 Permit

*Same as {xref-ICriminalRecords-bribe-address-uint256-}[`bribe`], with additional signature parameters which allow the approval and transfer of CounterfeitMoney in a single Transaction using EIP-2612 Permits Emits a {Wanted} Event*

#### Parameters

| Name | Type | Description |
|---|---|---|
| criminal | address | The criminal whose wanted level should be reduced |
| amount | uint256 | Amount of CounterfeitMoney available to pay the bribe |
| deadline | uint256 | timestamp until when the given signature will be valid |
| v | uint8 | The parity of the y co-ordinate of r of the signature |
| r | bytes32 | The x co-ordinate of the r value of the signature |
| s | bytes32 | The x co-ordinate of the s value of the signature |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | Number of wanted levels that have been removed |

### bribePerLevel

```solidity
function bribePerLevel() external view returns (uint256)
```

How much to bribe to remove a wanted level




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | The cost of a bribe |

### crimeWitnessed

```solidity
function crimeWitnessed(address criminal) external nonpayable
```

Executed when a theft of a NFT was witnessed, increases the criminals wanted level

*Emits a {Wanted} Event*

#### Parameters

| Name | Type | Description |
|---|---|---|
| criminal | address | The criminal who committed the crime |

### exchangeWitnessed

```solidity
function exchangeWitnessed(address from, address to) external nonpayable
```

Executed when a transfer of a NFT was witnessed, increases the receivers wanted level

*Emits a {Wanted} Event*

#### Parameters

| Name | Type | Description |
|---|---|---|
| from | address | The sender of the stolen NFT |
| to | address | The receiver of the stolen NFT |

### getReport

```solidity
function getReport(address reporter) external view returns (uint256, uint256, bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| reporter | address | The reporter who reported the theft |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | stolenId The reported stolen NFT |
| _1 | uint256 | timestamp The timestamp when the theft was reported |
| _2 | bool | processed true if the report has been processed, false if not reported / processed or expired |

### getWanted

```solidity
function getWanted(address criminal) external view returns (uint256)
```

Returns the wanted level of a given criminal



#### Parameters

| Name | Type | Description |
|---|---|---|
| criminal | address | The criminal whose wanted level should be returned |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | The criminals wanted level |

### maximumWanted

```solidity
function maximumWanted() external view returns (uint8)
```

Maximum wanted level a thief can have




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint8 | The maximum wanted level |

### money

```solidity
function money() external view returns (contract ICounterfeitMoney)
```

ERC20 token used to pay bribes and rewards




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


### reportDelay

```solidity
function reportDelay() external view returns (uint32)
```

Time that has to pass between the report and the arrest of a criminal




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint32 | The time |

### reportTheft

```solidity
function reportTheft(uint256 stolenId) external nonpayable
```

Report the theft of a stolen NFT, required to trigger an arrest

*Emits a {Reported} Event*

#### Parameters

| Name | Type | Description |
|---|---|---|
| stolenId | uint256 | The stolen NFTs tokenID that should be reported |

### reportValidity

```solidity
function reportValidity() external view returns (uint32)
```

Time how long a report will be valid




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint32 | The time |

### reward

```solidity
function reward() external view returns (uint256)
```

The reward if a citizen successfully reports a criminal




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | The reward |

### sentence

```solidity
function sentence() external view returns (uint8)
```

The wanted level sentence given for a crime




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint8 | The sentence |

### setAboveTheLaw

```solidity
function setAboveTheLaw(address badgeNumber, bool state) external nonpayable
```

Set which addresses / contracts are above the law and cannot be sentenced / tracked

*Can only be called by the current owner, can also be used to reset addresses*

#### Parameters

| Name | Type | Description |
|---|---|---|
| badgeNumber | address | Address which should be set |
| state | bool | If the given address should be above the law or not |

### setTheLaw

```solidity
function setTheLaw(address badgeNumber, bool state) external nonpayable
```

Set which addresses / contracts are authorized to sentence thief&#39;s

*Can only be called by the current owner, can also be used to reset addresses*

#### Parameters

| Name | Type | Description |
|---|---|---|
| badgeNumber | address | Address which should be set |
| state | bool | If the given address should authorized or not |

### setWantedParameters

```solidity
function setWantedParameters(uint8 _maxWanted, uint8 _sentence, uint8 _thiefCaughtChance, uint32 _reportDelay, uint32 _reportValidity, uint256 _reward, uint256 _bribePerLevel) external nonpayable
```

Executed when a theft of a NFT was witnessed, increases the criminals wanted level

*Can only be called by the current owner*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _maxWanted | uint8 | Maximum wanted level a thief can have |
| _sentence | uint8 | The wanted level sentence given for a crime |
| _thiefCaughtChance | uint8 | The chance a report will be successful |
| _reportDelay | uint32 | The time that has to pass between a users reports |
| _reportValidity | uint32 | undefined |
| _reward | uint256 | The reward if a citizen successfully reports a criminal |
| _bribePerLevel | uint256 | How much to bribe to remove a wanted level |

### stolenNFT

```solidity
function stolenNFT() external view returns (contract IStolenNFT)
```

ERC721 token which is being monitored by the authorities




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract IStolenNFT | undefined |

### surrender

```solidity
function surrender(address criminal) external nonpayable
```

Allows the criminal to surrender and to decrease his wanted level

*Emits a {Wanted} Event*

#### Parameters

| Name | Type | Description |
|---|---|---|
| criminal | address | The criminal who turned himself in |

### theLaw

```solidity
function theLaw(address) external view returns (bool)
```

Officers / Contracts that can track and sentence others



#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### thiefCaughtChance

```solidity
function thiefCaughtChance() external view returns (uint8)
```

The percentage between 0-100 a report is successful and the thief is caught




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint8 | The chance |

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

### Arrested

```solidity
event Arrested(address indexed snitch, address indexed thief, uint256 indexed stolenId)
```

Emitted when a the criminal is arrested



#### Parameters

| Name | Type | Description |
|---|---|---|
| snitch `indexed` | address | undefined |
| thief `indexed` | address | undefined |
| stolenId `indexed` | uint256 | undefined |

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |

### Promotion

```solidity
event Promotion(address indexed user, bool aboveTheLaw, bool state)
```

Emitted when theLaw/aboveTheLaw is set or unset



#### Parameters

| Name | Type | Description |
|---|---|---|
| user `indexed` | address | The user that got promoted / demoted |
| aboveTheLaw  | bool | Whether the user is set to be theLaw or aboveTheLaw |
| state  | bool | true if it was a promotion, false if it was a demotion |

### Reported

```solidity
event Reported(address indexed snitch, address indexed thief, uint256 indexed stolenId)
```

Emitted when a report against a criminal was filed



#### Parameters

| Name | Type | Description |
|---|---|---|
| snitch `indexed` | address | undefined |
| thief `indexed` | address | undefined |
| stolenId `indexed` | uint256 | undefined |

### Wanted

```solidity
event Wanted(address indexed criminal, uint256 level)
```

Emitted when the wanted level of a criminal changes



#### Parameters

| Name | Type | Description |
|---|---|---|
| criminal `indexed` | address | undefined |
| level  | uint256 | undefined |

### WantedParamChange

```solidity
event WantedParamChange(uint8 maxWanted, uint8 sentence, uint256 thiefCaughtChance, uint256 reportDelay, uint256 reportValidity, uint256 reward, uint256 bribePerLevel)
```

Emitted when any wanted parameter is being changed



#### Parameters

| Name | Type | Description |
|---|---|---|
| maxWanted  | uint8 | Maximum wanted level a thief can have |
| sentence  | uint8 | The wanted level sentence given for a crime |
| thiefCaughtChance  | uint256 | The chance a report will be successful |
| reportDelay  | uint256 | The time that has to pass between report and arrest |
| reportValidity  | uint256 | The time the report is valid for |
| reward  | uint256 | The reward if a citizen successfully reports a criminal |
| bribePerLevel  | uint256 | How much to bribe to remove a wanted level |



## Errors

### BribeIsNotEnough

```solidity
error BribeIsNotEnough()
```






### CallerNotTheOwner

```solidity
error CallerNotTheOwner()
```






### CaseNotFound

```solidity
error CaseNotFound()
```






### NewOwnerIsZeroAddress

```solidity
error NewOwnerIsZeroAddress()
```






### NotTheLaw

```solidity
error NotTheLaw()
```






### ProcessingReport

```solidity
error ProcessingReport()
```






### ReportAlreadyFiled

```solidity
error ReportAlreadyFiled()
```






### SurrenderInstead

```solidity
error SurrenderInstead()
```






### SuspectNotWanted

```solidity
error SuspectNotWanted()
```






### TheftNotReported

```solidity
error TheftNotReported()
```






### ThiefGotAway

```solidity
error ThiefGotAway()
```






### ThiefIsHiding

```solidity
error ThiefIsHiding()
```







