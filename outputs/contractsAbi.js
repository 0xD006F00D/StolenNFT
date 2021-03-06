export const ContractsABI = {
  "BlackMarket": [
    "constructor(address _owner, address _stolenNFT, address _money)",
    "error CallerNotTheOwner()",
    "error GlobalIndexOutOfBounds(uint256 index)",
    "error MarketIsClosed()",
    "error NewOwnerIsZeroAddress()",
    "error NotTheSeller()",
    "error NotTheTokenOwner()",
    "error OwnerIndexOutOfBounds(uint256 index)",
    "error TokenNotListed()",
    "error TransactionFailed()",
    "event Canceled(address indexed seller, uint256 indexed tokenId, uint256 price)",
    "event Listed(address indexed seller, uint256 indexed tokenId, uint256 price)",
    "event MarketClosed(bool state)",
    "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
    "event Sold(address indexed buyer, address indexed seller, uint256 indexed tokenId, uint256 price)",
    "function balanceOf(address owner) view returns (uint256)",
    "function buy(uint256 tokenId)",
    "function buyWithPermit(uint256 tokenId, uint256 price, uint256 deadline, uint8 v, bytes32 r, bytes32 s)",
    "function cancelListing(uint256 tokenId)",
    "function closeMarket(bool _marketClosed)",
    "function getListing(uint256 tokenId) view returns (tuple(address seller, uint256 price))",
    "function listNft(uint256 tokenId, uint256 price)",
    "function listNftWithPermit(uint256 tokenId, uint256 price, uint256 deadline, uint8 v, bytes32 r, bytes32 s)",
    "function marketClosed() view returns (bool)",
    "function money() view returns (address)",
    "function owner() view returns (address)",
    "function renounceOwnership()",
    "function stolenNFT() view returns (address)",
    "function tokenByIndex(uint256 index) view returns (uint256)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
    "function totalSupply() view returns (uint256)",
    "function transferOwnership(address newOwner)",
    "function updateListing(uint256 tokenId, uint256 newPrice)"
  ],
  "CounterfeitMoney": [
    "constructor(address _owner)",
    "error ApproveFromZeroAddress()",
    "error ApproveToZeroAddress()",
    "error BurnAmountExceedsBalance()",
    "error BurnFromZeroAddress()",
    "error CallerNotTheOwner()",
    "error DecreasingAllowanceBelowZero()",
    "error InsufficientAllowance()",
    "error InvalidSignature()",
    "error InvalidSignatureSValue()",
    "error InvalidSignatureVValue()",
    "error MintToZeroAddress()",
    "error NewOwnerIsZeroAddress()",
    "error PermitDeadLineExpired()",
    "error PermitToOwner()",
    "error TransferAmountExceedsBalance()",
    "error TransferFromZeroAddress()",
    "error TransferToZeroAddress()",
    "error UnauthorizedWorker()",
    "event Approval(address indexed owner, address indexed spender, uint256 value)",
    "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
    "event ShiftChange(address indexed _worker, bool _working)",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "function DOMAIN_SEPARATOR() view returns (bytes32)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function balanceOf(address account) view returns (uint256)",
    "function burn(address from, uint256 amount)",
    "function decimals() view returns (uint8)",
    "function decreaseAllowance(address spender, uint256 subtractedValue) returns (bool)",
    "function increaseAllowance(address spender, uint256 addedValue) returns (bool)",
    "function name() view returns (string)",
    "function nonces(address owner) view returns (uint256)",
    "function owner() view returns (address)",
    "function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)",
    "function print(address to, uint256 amount)",
    "function renounceOwnership()",
    "function setWorker(address _worker, bool _working)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function transferFrom(address from, address to, uint256 amount) returns (bool)",
    "function transferOwnership(address newOwner)",
    "function workers(address) view returns (bool)"
  ],
  "CriminalRecords": [
    "constructor(address _owner, address _stolenNft, address _money, address _stakingHideout, address _blackMarket)",
    "error BribeIsNotEnough()",
    "error CallerNotTheOwner()",
    "error CaseNotFound()",
    "error NewOwnerIsZeroAddress()",
    "error NotTheLaw()",
    "error ProcessingReport()",
    "error ReportAlreadyFiled()",
    "error SurrenderInstead()",
    "error SuspectNotWanted()",
    "error TheftNotReported()",
    "error ThiefGotAway()",
    "error ThiefIsHiding()",
    "event Arrested(address indexed snitch, address indexed thief, uint256 indexed stolenId)",
    "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
    "event Promotion(address indexed user, bool aboveTheLaw, bool state)",
    "event Reported(address indexed snitch, address indexed thief, uint256 indexed stolenId)",
    "event Wanted(address indexed criminal, uint256 level)",
    "event WantedParamChange(uint8 maxWanted, uint8 sentence, uint256 thiefCaughtChance, uint256 reportDelay, uint256 reportValidity, uint256 reward, uint256 bribePerLevel)",
    "function aboveTheLaw(address) view returns (bool)",
    "function arrest() returns (bool)",
    "function bribe(address criminal, uint256 amount) returns (uint256)",
    "function bribeCheque(address criminal, uint256 amount, uint256 deadline, uint8 v, bytes32 r, bytes32 s) returns (uint256)",
    "function bribePerLevel() view returns (uint256)",
    "function crimeWitnessed(address criminal)",
    "function exchangeWitnessed(address from, address to)",
    "function getReport(address reporter) view returns (uint256, uint256, bool)",
    "function getWanted(address criminal) view returns (uint256)",
    "function maximumWanted() view returns (uint8)",
    "function money() view returns (address)",
    "function owner() view returns (address)",
    "function renounceOwnership()",
    "function reportDelay() view returns (uint32)",
    "function reportTheft(uint256 stolenId)",
    "function reportValidity() view returns (uint32)",
    "function reward() view returns (uint256)",
    "function sentence() view returns (uint8)",
    "function setAboveTheLaw(address badgeNumber, bool state)",
    "function setTheLaw(address badgeNumber, bool state)",
    "function setWantedParameters(uint8 _maxWanted, uint8 _sentence, uint8 _thiefCaughtChance, uint32 _reportDelay, uint32 _reportValidity, uint256 _reward, uint256 _bribePerLevel)",
    "function stolenNFT() view returns (address)",
    "function surrender(address criminal)",
    "function theLaw(address) view returns (bool)",
    "function thiefCaughtChance() view returns (uint8)",
    "function transferOwnership(address newOwner)"
  ],
  "StakingHideout": [
    "constructor(address _owner, address _stakingNft, address _rewardsToken)",
    "error CallerNotTheOwner()",
    "error GlobalIndexOutOfBounds(uint256 index)",
    "error NewOwnerIsZeroAddress()",
    "error NotTheStaker()",
    "error NotTheTokenOwner()",
    "error OwnerIndexOutOfBounds(uint256 index)",
    "error StashIsFull()",
    "error TokenNotStashed()",
    "event BalanceLimitChange(uint256 newBalanceLimit)",
    "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
    "event RewardPaid(address indexed user, uint256 reward)",
    "event RewardRateChange(uint256 newRewardRate)",
    "event Stashed(address indexed user, uint256 indexed tokenId)",
    "event Unstashed(address indexed user, uint256 indexed tokenId)",
    "function balanceLimit() view returns (uint256)",
    "function balanceOf(address owner) view returns (uint256)",
    "function earned(address account) view returns (uint256)",
    "function getReward()",
    "function getStaker(uint256 tokenId) view returns (address)",
    "function lastUpdateTime() view returns (uint256)",
    "function owner() view returns (address)",
    "function renounceOwnership()",
    "function rewardPerToken() view returns (uint256)",
    "function rewardPerTokenStored() view returns (uint256)",
    "function rewardRate() view returns (uint256)",
    "function rewards(address) view returns (uint256)",
    "function rewardsToken() view returns (address)",
    "function setBalanceLimit(uint256 _balanceLimit)",
    "function setRewardRate(uint256 _rewardRate)",
    "function stakingNft() view returns (address)",
    "function stash(uint256 tokenId)",
    "function stashWithPermit(uint256 tokenId, uint256 deadline, uint8 v, bytes32 r, bytes32 s)",
    "function tokenByIndex(uint256 index) view returns (uint256)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
    "function totalSupply() view returns (uint256)",
    "function transferOwnership(address newOwner)",
    "function unstash(uint256 tokenId)",
    "function userRewardPerTokenPaid(address) view returns (uint256)"
  ],
  "StolenNFT": [
    "constructor(address _owner)",
    "error AlreadyStolen(uint256 tokenId)",
    "error ApprovalToOwner()",
    "error ApproveToOwner()",
    "error CallerNotApprovedOrOwner()",
    "error CallerNotTheLaw()",
    "error CallerNotTheOwner()",
    "error CriminalRecordsOffline()",
    "error CrossChainUriMissing()",
    "error ErrorSendingTips()",
    "error GlobalIndexOutOfBounds(uint256 index)",
    "error InvalidChainId()",
    "error InvalidRoyalty()",
    "error InvalidSignature()",
    "error InvalidSignatureSValue()",
    "error InvalidSignatureVValue()",
    "error MintFromOwnAddress()",
    "error MintToZeroAddress()",
    "error NewOwnerIsZeroAddress()",
    "error NoTips()",
    "error NotTheTokenOwner()",
    "error NothingLeftToSteal()",
    "error OwnerIndexOutOfBounds(uint256 index)",
    "error PermitDeadLineExpired()",
    "error PermitToOwner()",
    "error QueryForNonExistentToken(uint256 tokenId)",
    "error QueryForZeroAddress()",
    "error ReceiverIsRetired()",
    "error SenderIsRetired()",
    "error StealingFromZeroAddress()",
    "error StealingStolenNft()",
    "error ThiefIsRetired()",
    "error TokenAlreadyMinted()",
    "error TransferFromNotTheOwner()",
    "error TransferToNonERC721Receiver()",
    "error TransferToZeroAddress()",
    "error UnsupportedToken()",
    "error YouAreRetired()",
    "error YouAreWanted()",
    "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
    "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)",
    "event CriminalRecordsChange(address recordsAddress)",
    "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
    "event Seized(address indexed thief, uint64 originalChainId, address originalContract, uint256 originalId, uint256 indexed stolenId)",
    "event Stolen(address indexed thief, uint64 originalChainId, address indexed originalContract, uint256 indexed originalId, uint256 stolenId)",
    "event SupplyChange(uint256 newSupply)",
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
    "function DOMAIN_SEPARATOR() view returns (bytes32)",
    "function approve(address to, uint256 tokenId)",
    "function balanceOf(address owner) view returns (uint256)",
    "function criminalRecords() view returns (address)",
    "function emptyTipJar(address recipient)",
    "function getApproved(uint256 tokenId) view returns (address)",
    "function getOriginal(uint256 stolenId) view returns (uint64, address, uint256)",
    "function getStolen(address originalAddress, uint256 originalId) view returns (uint256)",
    "function isApprovedForAll(address owner, address operator) view returns (bool)",
    "function maximumSupply() view returns (uint256)",
    "function name() view returns (string)",
    "function nonces(address owner) view returns (uint256)",
    "function originalOwnerOf(address contractAddress, uint256 tokenId) view returns (address)",
    "function originalTokenURI(address contractAddress, uint256 tokenId) view returns (string)",
    "function owner() view returns (address)",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)",
    "function renounceOwnership()",
    "function retire(bool isRetired)",
    "function retired(address thief) view returns (bool)",
    "function royaltyInfo(uint256 tokenId, uint256 salePrice) view returns (address, uint256)",
    "function safeTransferFrom(address from, address to, uint256 tokenId)",
    "function safeTransferFrom(address from, address to, uint256 tokenId, bytes _data)",
    "function setApprovalForAll(address operator, bool approved)",
    "function setCriminalRecords(address recordsAddress)",
    "function setMaximumSupply(uint256 _maximumSupply)",
    "function setTokenURI(uint256 stolenId, string uri)",
    "function steal(uint64 originalChainId, address originalAddress, uint256 originalId, address mintFrom, uint32 royaltyFee, string uri) payable returns (uint256)",
    "function supportsInterface(bytes4 interfaceId) view returns (bool)",
    "function surrender(uint256 stolenId)",
    "function swatted(uint256 stolenId)",
    "function symbol() view returns (string)",
    "function tokenByIndex(uint256 index) view returns (uint256)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
    "function tokenURI(uint256 tokenId) view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function transferFrom(address from, address to, uint256 tokenId)",
    "function transferOwnership(address newOwner)"
  ]
}