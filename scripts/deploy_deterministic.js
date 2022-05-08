require('hardhat');
const ethers = hre.ethers;

// Based on https://github.com/pcaversaccio/create2deployer
// Ethereum, Arbitrum, Optimism, Avalanche, Fantom, Polygon, Harmony
const CREATE2_DEPLOYER_ADDRESS = '0x543A73dbB5E49f3a8aC9FCddcC63B278da566ea3';
const CREATE2_DEPLOYER_ABI = ['function deploy(bytes32 salt, bytes code)'];

const SALT = process.env.DEPLOY_SALT;
const OWNER = process.env.DEPLOY_OWNER;
// StolenNFT is the most expensive costing ~2831550 Gas for deployment ~ 3428155 via create2
const GASLIMIT = 4 * 10 ** 6;
const ARB_GASLIMIT = 30 * 10 ** 6;

const MANUAL_SETUP = true;
const NO_DEPLOY = false;

let Contracts = {
	StolenNFT: '',
	CounterfeitMoney: '',
	BlackMarket: '',
	StakingHideout: '',
	CriminalRecords: ''
};

// let Contracts = {
// 	StolenNFT: '0xe17b5aC5BD4a70436Af32Aee07BA9e2aE262e2eE',
// 	CounterfeitMoney: '0x5ae23249A4F7EC4F7087FA5adE0Eb385240f8cCc',
// 	BlackMarket: '0x05f6ad680c3aaA15a03B8bd3abe16Dd84fEF9869',
// 	StakingHideout: '0x8aA628416C25Ea6C279f29e793382871081d9343',
// 	CriminalRecords: ''
// };

function getArgs(name, ownerAddress, signerAddress) {
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
			return [MANUAL_SETUP ? ownerAddress : signerAddress];
	}
}

/*
 * Deploys the contracts deterministically via the given create2Deployer to a given network
 */
async function main() {
	let create2Deployer;
	let results = [];

	let wallet = new ethers.Wallet(process.env.DEPLOY_PRIVATE_KEY, ethers.provider);
	let signer = wallet.connect(ethers.provider);

	console.log('Network', hre.network.name);
	console.log('Deployer', signer.address);
	//console.log('Gaslimit', GASLIMIT);

	//if (hre.network.name == 'mainnet') return;

	if (hre.network.name == 'localhost' || hre.network.name == 'hardhat') {
		await ethers.provider.getSigner(0).sendTransaction({
			to: signer.address,
			value: ethers.utils.parseEther('2')
		});

		let hhCreate2Deployer = await ethers.getContractFactory('Create2Deployer', signer);
		create2Deployer = await hhCreate2Deployer.deploy();
		await create2Deployer.deployed();
	} else {
		create2Deployer = new ethers.Contract(CREATE2_DEPLOYER_ADDRESS, CREATE2_DEPLOYER_ABI, signer);
	}

	for (let c = 0; c < Object.keys(Contracts).length; c++) {
		let contractName = Object.keys(Contracts)[c];
		let contractArgs = getArgs(contractName, OWNER, signer.address);

		let contract = await ethers.getContractFactory(contractName);
		let deployTransaction = contract.getDeployTransaction(...contractArgs);
		let initCode = deployTransaction.data;

		const computedContractAddress = ethers.utils.getCreate2Address(
			CREATE2_DEPLOYER_ADDRESS,
			ethers.utils.id(SALT),
			ethers.utils.keccak256(initCode)
		);

		// Start mid deployment, set deployed contract addresses first
		if (Contracts[contractName].length > 0) {
			console.log('Skipping', contractName, 'with', contractArgs, 'to', computedContractAddress);
			continue;
		} else {
			Contracts[contractName] = computedContractAddress;
			console.log('Deploying', contractName, 'with', contractArgs, 'to', computedContractAddress);
		}

		if (NO_DEPLOY) continue;

		let options = {};
		//Some networks fail to calculate, disable for ethereum
		if (hre.network.name.toLowerCase().indexOf('arbitrum') >= 0) {
			options.gasLimit = ARB_GASLIMIT;
		} else {
			options.gasLimit = GASLIMIT;
		}

		let feeData = await ethers.provider.getFeeData();

		// Tighter estimation
		// if (feeData.maxFeePerGas) {
		// 	let priority = ethers.BigNumber.from(2000000000); //1.5 gwei default
		// 	options.maxPriorityFeePerGas = priority;
		// 	options.maxFeePerGas = feeData.gasPrice.add(priority);
		// }

		// Polygon/Fantom have the base fee as priority, ether does not seem to pick that up
		if (
			hre.network.name.toLowerCase().indexOf('polygon') >= 0 ||
			hre.network.name.toLowerCase().indexOf('fantom') >= 0
		) {
			options.maxFeePerGas = feeData.gasPrice;
			options.maxPriorityFeePerGas = feeData.gasPrice;
		}

		let createReceipt = await create2Deployer.deploy(ethers.utils.id(SALT), initCode, options);
		createReceipt = await createReceipt.wait();

		results.push({
			contract: contractName,
			address: createReceipt.events[0].address,
			deployTransaction: createReceipt.transactionHash,
			match: createReceipt.events[0].address === computedContractAddress
		});
	}

	console.table(results);
	console.log(Contracts);

	if (NO_DEPLOY) return;

	if (MANUAL_SETUP) {
		console.log('Manual Owner Tasks: ');
		console.log('StolenNFT.setCriminalRecords', [Contracts.CriminalRecords]);
		console.log('CounterfeitMoney.setWorker', [
			Contracts.StakingHideout,
			Contracts.CriminalRecords
		]);
	} else {
		// The automated setup should be used for testing only
		// Contract addresses would change if StolenNFT/CriminalRecords
		// were deployed with a different owner
		console.log('Configuring CriminalRecords');
		const SNFTContractFactory = await ethers.getContractFactory('StolenNFT', signer);
		const SNFTContract = await SNFTContractFactory.attach(Contracts.StolenNFT);
		let tx = await SNFTContract.setCriminalRecords(Contracts.CriminalRecords);
		await tx.wait();
		tx = await SNFTContract.transferOwnership(OWNER);
		await tx.wait();

		console.log('Configuring CounterfeitMoney');
		const CNTFContractFactory = await ethers.getContractFactory('CounterfeitMoney', signer);
		const CNTFContract = await CNTFContractFactory.attach(Contracts.CounterfeitMoney);
		tx = await CNTFContract.setWorker(Contracts.StakingHideout, true);
		await tx.wait();
		tx = await CNTFContract.setWorker(Contracts.CriminalRecords, true);
		await tx.wait();
		tx = await CNTFContract.transferOwnership(OWNER);
		await tx.wait();
	}
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
