require('hardhat');
const ethers = hre.ethers;

const localChainId = 31337;

module.exports = async ({ provider, getNamedAccounts, deployments, getChainId }) => {
	const { deploy } = deployments;
	const { deployer, owner, test } = await getNamedAccounts();
	const chainId = await getChainId();

	if (chainId != localChainId) throw 'Trying to deploy local script';

	console.log(`Using deployer ${deployer}`);

	const ownerWallet = ethers.provider.getSigner(0);
	await ownerWallet.sendTransaction({
		to: test,
		value: ethers.utils.parseEther('2')
	});

	///
	/// MockNFT
	///
	await deploy('MockNFT', {
		from: deployer,
		//args: ['Doodles', 'DOOD', 'ipfs://QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/'], //Doodles
		args: ['CoolCats', 'COOL', 'https://api.coolcatsnft.com/cat/'], //CoolCats
		log: true
	});
	const MockNFTContract = await ethers.getContract('MockNFT', owner);

	for (let i = 1; i < 5; i++) {
		await MockNFTContract.mint(100);
	}

	///
	/// Environment Test Stuff
	///

	const CNTFContract = await ethers.getContract('CounterfeitMoney', deployer);
	const SNFTContract = await ethers.getContract('StolenNFT', deployer);
	const MarketContract = await ethers.getContract('BlackMarket', deployer);
	const HideoutContract = await ethers.getContract('StakingHideout', deployer);
	const RecordsContract = await ethers.getContract('CriminalRecords', deployer);

	// console.log('📡  Granting some Permissions');
	// await SNFTContract.transferOwnership(test);
	// await CNTFContract.transferOwnership(test);
	// await RecordsContract.transferOwnership(test);
	// await HideoutContract.transferOwnership(test);
	// await MarketContract.transferOwnership(test);

	console.log('📡  Stealing some NFTs');
	for (var i = 100; i < 120; i++) {
		await SNFTContract.steal(
			localChainId,
			MockNFTContract.address,
			i,
			ethers.constants.AddressZero,
			5000,
			''
		);
	}

	console.log('📡  Listing some NFTs');
	for (var i = 1; i < 5; i++) {
		await SNFTContract.approve(MarketContract.address, i);
		await MarketContract.listNft(i, ethers.utils.parseEther((10 * i).toString()));
	}

	console.log('📡  Stake some Cats');
	for (var i = 5; i < 10; i++) {
		await SNFTContract.approve(HideoutContract.address, i);
		await HideoutContract.stash(i);
	}

	console.log('📡  Sending some NFTs');
	for (var i = 15; i < 20; i++) {
		await SNFTContract.transferFrom(deployer, test, i);
	}

	console.log({
		StolenNFT: SNFTContract.address,
		CounterfeitMoney: CNTFContract.address,
		BlackMarket: MarketContract.address,
		StakingHideout: HideoutContract.address,
		CriminalRecords: RecordsContract.address
	});

	// Issue with timestamps if auto-mining is enabled
	// Every block must have new timestamps but multiple blocks could be mined per second
	// https://github.com/NomicFoundation/hardhat/issues/2133#issuecomment-989829600
	// Wait for blocktime to be in the future to synchronize it and mine a block
	// Otherwise this could affect the timestamp used the smart contracts for permits / reports

	let block = await ethers.provider.getBlock('latest');
	let timeDifference = block.timestamp - Math.ceil(new Date().getTime() / 1000);

	if (timeDifference > 0) {
		console.log('Synchronizing - time difference:', timeDifference);
		setTimeout(async () => {
			await network.provider.send('evm_setNextBlockTimestamp', [
				Math.ceil(new Date().getTime() / 1000)
			]);
			await hre.network.provider.request({
				method: 'evm_mine',
				params: []
			});
			// await ethers.provider.send('evm_setAutomine', [false]);
			// await ethers.provider.send('evm_setIntervalMining', [5000]);

			block = await ethers.provider.getBlock('latest');
			timeDifference = block.timestamp - Math.ceil(new Date().getTime() / 1000);
			console.log('Synchronizing - new time difference:', timeDifference);
		}, (timeDifference + 1) * 1000);
	}
};
module.exports.tags = ['local'];
