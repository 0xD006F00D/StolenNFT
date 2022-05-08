const { ethers } = require('hardhat');
const { deployContract } = require('ethereum-waffle');
const BlackMarketABI = require('../../artifacts/contracts/BlackMarket.sol/BlackMarket.json');
const CounterfeitMoneyABI = require('../../artifacts/contracts/CounterfeitMoney.sol/CounterfeitMoney.json');
const CriminalRecordsABI = require('../../artifacts/contracts/CriminalRecords.sol/CriminalRecords.json');
const StakingHideoutABI = require('../../artifacts/contracts/StakingHideout.sol/StakingHideout.json');
const StolenNFTABI = require('../../artifacts/contracts/StolenNFT.sol/StolenNFT.json');
const MockNFTABI = require('../../artifacts/contracts/mock/MockNFT.sol/MockNFT.json');

const deployOverrides = {
	gasLimit: 30000000
};

const platformFixture = async function ([wallet, other], provider) {
	//console.log(`🛰  Deploying Contracts`);
	const StolenNFT = await deployContract(wallet, StolenNFTABI, [wallet.address], deployOverrides);
	const CounterfeitMoney = await deployContract(
		wallet,
		CounterfeitMoneyABI,
		[wallet.address],
		deployOverrides
	);
	const StakingHideout = await deployContract(
		wallet,
		StakingHideoutABI,
		[wallet.address, StolenNFT.address, CounterfeitMoney.address],
		deployOverrides
	);
	const BlackMarket = await deployContract(
		wallet,
		BlackMarketABI,
		[wallet.address, StolenNFT.address, CounterfeitMoney.address],
		deployOverrides
	);
	const CriminalRecords = await deployContract(
		wallet,
		CriminalRecordsABI,
		[
			wallet.address,
			StolenNFT.address,
			CounterfeitMoney.address,
			StakingHideout.address,
			BlackMarket.address
		],
		deployOverrides
	);

	await StolenNFT.setCriminalRecords(CriminalRecords.address);
	await CounterfeitMoney.setWorker(StakingHideout.address, true);
	await CounterfeitMoney.setWorker(CriminalRecords.address, true);

	// Make the owner also a minter for the test
	await CounterfeitMoney.setWorker(wallet.address, true);
	// Allow the owner to track wanted levels
	await CriminalRecords.setTheLaw(wallet.address, true);

	return { BlackMarket, CounterfeitMoney, CriminalRecords, StakingHideout, StolenNFT };
};

const mockNftFixtures = async function ([wallet, other], provider) {
	//console.log(`🛰  Minting Mock NFTs`);

	const MockNFT = await deployContract(
		wallet,
		MockNFTABI,
		['NotDoodles', 'NOOD', 'ipfs://QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/'],
		deployOverrides
	);

	return MockNFT;
};

const stolenNftFixture = async function ([wallet, other], provider) {
	const { BlackMarket, CounterfeitMoney, CriminalRecords, StakingHideout, StolenNFT } =
		await platformFixture([wallet, other], provider);
	const MockNFT = await mockNftFixtures([other.bob, other], provider);

	const stolenId = await stealNft(StolenNFT, MockNFT, other.alice);

	return {
		BlackMarket,
		CounterfeitMoney,
		CriminalRecords,
		StakingHideout,
		StolenNFT,
		MockNFT,
		stolenId
	};
};

const stealNft = async function (
	StolenNFT,
	MockNFT,
	user,
	id = 1,
	royalty = 5000,
	chainId = 31337
) {
	await StolenNFT.connect(user).steal(
		chainId,
		MockNFT.address,
		id,
		ethers.constants.AddressZero,
		royalty,
		''
	);

	const balanceOf = await StolenNFT.balanceOf(user.address);
	const stolenId = await StolenNFT.tokenOfOwnerByIndex(user.address, balanceOf - 1);

	return +stolenId;
};

module.exports = { platformFixture, mockNftFixtures, stolenNftFixture, stealNft };
