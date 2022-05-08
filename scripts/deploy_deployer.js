require('hardhat');
const ethers = hre.ethers;

// Gas usage of Create2Deployer from hardhat-gas-reporter
const DeployGasLimit = parseInt(151621 * 1.5);
const ArbDeployGasLimit = parseInt(2000000 * 1.5);
const TransferGasLimit = parseInt(21005); // + 5 for the L1 cost on optimism, will only work on testnet
const ArbTransferGasLimit = parseInt(500000);

const DYNAMIC_FUNDING = false;
const RETURN_FUNDING = false;

/*
 * Deploys the create2deployer after funding the wallet with the required amount of tokens from the funder wallet
 * The same nonce is required across networks or otherwise the create2deployer address will be different
 * Therefore using a new signer wallet/private key is recommended
 */
async function main() {
	console.log('Network', hre.network.name);

	const signer = new ethers.Wallet(process.env.DEPLOY_DEPLOYER_PRIVATE_KEY, ethers.provider);
	const funder = new ethers.Wallet(process.env.DEPLOY_PRIVATE_KEY, ethers.provider);

	console.log('Funder', funder.address);
	console.log('Signer', signer.address);

	const isArb = hre.network.name.toLowerCase().indexOf('arbitrum') >= 0;
	const deployGasLimit = isArb ? ArbDeployGasLimit : DeployGasLimit;
	const transferGasLimit = isArb ? ArbTransferGasLimit : TransferGasLimit;

	let feeData = await ethers.provider.getFeeData();

	if (DYNAMIC_FUNDING) {
		const fundingAmount = (feeData.maxFeePerGas ?? feeData.gasPrice).mul(deployGasLimit).add(1);

		console.log('Funding', ethers.utils.formatEther(fundingAmount));

		// Funder wallet must already have funds if not local
		if (hre.network.name == 'localhost' || hre.network.name == 'hardhat') {
			await ethers.provider.getSigner(0).sendTransaction({
				to: funder.address,
				value: fundingAmount.mul(2)
			});
		}

		let fundingTx = await funder.sendTransaction({
			to: signer.address,
			value: fundingAmount
		});
		await fundingTx.wait();

		console.log('Funded Create2Deployer account');
	}

	// Deploy Contract with funded signer
	const Create2Deployer = await ethers.getContractFactory('Create2Deployer', signer);
	const create2Deployer = await Create2Deployer.deploy({
		gasLimit: deployGasLimit
	});
	await create2Deployer.deployed();

	console.log('Create2Deployer deployed to:', create2Deployer.address);

	if (RETURN_FUNDING) {
		let transactionFee;
		let signerBalance = await ethers.provider.getBalance(signer.address);

		let transferOptions = {
			to: funder.address,
			gasLimit: transferGasLimit
		};

		feeData = await ethers.provider.getFeeData();
		if (feeData.maxFeePerGas) {
			transactionFee = feeData.maxFeePerGas.mul(transferGasLimit);
			transferOptions.maxFeePerGas = feeData.maxFeePerGas;
		} else {
			transactionFee = feeData.gasPrice.mul(transferGasLimit);
			transferOptions.gasPrice = feeData.gasPrice;
		}

		if (signerBalance.gt(transactionFee)) {
			transferOptions.value = signerBalance.sub(transactionFee).sub(1);

			try {
				let returnTx = await signer.sendTransaction(transferOptions);
				await returnTx.wait();
				console.log(
					'Returned leftover funds to funder: ',
					ethers.utils.formatEther(transferOptions.value)
				);
			} catch (e) {
				console.log(e);
				console.log('Could not return leftover funds to funder');
			}
		} else {
			console.log('Skipped returning leftover funds to funder');
		}
	}

	const changeLeft = await ethers.provider.getBalance(signer.address);
	console.log('Create2Deployer account balance:', ethers.utils.formatEther(changeLeft));
	const funderChangeLeft = await ethers.provider.getBalance(funder.address);
	console.log('Funding account balance:', ethers.utils.formatEther(funderChangeLeft));
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
