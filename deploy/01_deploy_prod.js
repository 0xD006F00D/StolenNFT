const { ethers } = require('hardhat');

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
	const { deploy } = deployments;
	const { deployer, owner } = await getNamedAccounts();
	const chainId = await getChainId();

	console.log(`Using deployer ${deployer}`);
	console.log(`ChainID ${chainId}`);

	//
	// CounterfeitMoney
	//
	console.log(`🛰  Deploying: "CounterfeitMoney"`);
	await deploy('CounterfeitMoney', {
		from: deployer,
		log: true,
		args: [deployer]
	});
	const CNTFContract = await ethers.getContract('CounterfeitMoney', deployer);
	console.log(`✅  Successfully deployed: "CounterfeitMoney"`);

	///
	/// StolenNFT
	///
	console.log(`🛰  Deploying: "StolenNFT"`);
	await deploy('StolenNFT', {
		from: deployer,
		log: true,
		args: [deployer]
	});
	const SNFTContract = await ethers.getContract('StolenNFT', deployer);
	console.log(`✅  Successfully deployed: "StolenNFT"`);

	///
	/// StakingHideout
	///
	console.log(`🛰  Deploying: "StakingHideout"`);
	await deploy('StakingHideout', {
		from: deployer,
		log: true,
		args: [owner, SNFTContract.address, CNTFContract.address]
	});
	const HideoutContract = await ethers.getContract('StakingHideout', deployer);
	console.log(`✅  Successfully deployed: "StakingHideout"`);

	///
	/// BlackMarket
	///
	console.log(`🛰  Deploying: "BlackMarket"`);
	await deploy('BlackMarket', {
		from: deployer,
		log: true,
		args: [owner, SNFTContract.address, CNTFContract.address]
	});
	const MarketContract = await ethers.getContract('BlackMarket', deployer);
	console.log(`✅  Successfully deployed: "BlackMarket"`);

	///
	/// CriminalRecords
	///
	console.log(`🛰  Deploying: "CriminalRecords"`);
	await deploy('CriminalRecords', {
		from: deployer,
		log: true,
		args: [
			owner,
			SNFTContract.address,
			CNTFContract.address,
			HideoutContract.address,
			MarketContract.address
		]
	});
	const RecordsContract = await ethers.getContract('CriminalRecords', deployer);
	console.log(`✅  Successfully deployed: "CriminalRecords"`);

	console.log('🛰  Set CriminalRecords in StolenNFT');
	await SNFTContract.setCriminalRecords(RecordsContract.address);

	console.log('🛰  Set CounterfeitMoney and CriminalRecords in StakingContract');
	await CNTFContract.setWorker(HideoutContract.address, true);
	await CNTFContract.setWorker(RecordsContract.address, true);

	await SNFTContract.transferOwnership(owner);
	await CNTFContract.transferOwnership(owner);
};
module.exports.tags = ['local', 'prod'];
