require('hardhat');
const ethers = hre.ethers;

const OWNER = process.env.DEPLOY_OWNER;

let Contracts = {
	StolenNFT: '0xe17b5aC5BD4a70436Af32Aee07BA9e2aE262e2eE',
	CounterfeitMoney: '0x5ae23249A4F7EC4F7087FA5adE0Eb385240f8cCc',
	BlackMarket: '0x05f6ad680c3aaA15a03B8bd3abe16Dd84fEF9869',
	StakingHideout: '0x8aA628416C25Ea6C279f29e793382871081d9343',
	CriminalRecords: '0x480e07D16814f6e9d5e8Db9044C539bb19446840'
};

function getArgs(name, ownerAddress) {
	switch (name) {
		case 'BlackMarket':
			return [ownerAddress, Contracts.StolenNFT, Contracts.CounterfeitMoney];
		case 'StakingHideout':
			return [ownerAddress, Contracts.StolenNFT, Contracts.CounterfeitMoney];
		case 'CriminalRecords':
			return [
				ownerAddress,
				Contracts.StolenNFT,
				Contracts.CounterfeitMoney,
				Contracts.StakingHideout,
				Contracts.BlackMarket
			];
		case 'StolenNFT':
		case 'CounterfeitMoney':
		default:
			return [ownerAddress];
	}
}

/*
 * Deploys the contracts deterministically via the given create2Deployer to a given network
 */
async function main() {
	console.log('Network', hre.network.name);

	for (let c = 0; c < Object.keys(Contracts).length; c++) {
		let contractName = Object.keys(Contracts)[c];
		let contractAddress = Object.values(Contracts)[c];
		let contractArgs = getArgs(contractName, OWNER);

		console.log('Verifying', contractName, contractAddress, contractArgs);

		await hre.run('verify:verify', {
			address: contractAddress,
			constructorArguments: contractArgs
		});
	}
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
