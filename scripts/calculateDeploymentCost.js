require('hardhat');
const ethers = hre.ethers;
const request = require('request-promise-native');

// Sum of gas usage of all contracts from hardhat-gas-reporter
//const GasLimit = 7660374;

// Gas limit of create2Deployer
//const GasLimit = 151621;

// Sum of GasLimits of all contracts from testnet Deployment
const GasLimit = 9477152;
const ArbGasLimit = 80472318;

// let GasLimit = {
// 	StolenNFT: {
// 		default: 3428155,
// 		arbitrum: 28734983,
// 	},
// 	CounterfeitMoney: {
// 		default: 1383110 ,
// 		arbitrum: 12681199,
// 	},
// 	BlackMarket: {
// 		default: 1445408,
// 		arbitrum: 12328625,
// 	},
// 	StakingHideout: {
// 		default: 1379216 ,
// 		arbitrum: 11825984,
// 	},
// 	CriminalRecords: {
// 		default: 1841263,
// 		arbitrum: 14901527,
// 	}
// };

const API_KEY = hre.config.gasReporter.coinmarketcap;

const symbols = {
	mainnet: 'ETH',
	optimism: 'ETH',
	arbitrum: 'ETH',
	avalanche: 'AVAX',
	harmony: 'ONE',
	polygon: 'MATIC',
	fantom: 'FTM'
};

async function getTokenPrice(token, currency = 'USD') {
	const coinmarketcap =
		`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/` +
		`latest?symbol=${token}&CMC_PRO_API_KEY=${API_KEY}&convert=${currency}`;

	let price = 0;
	try {
		let response = await request.get(coinmarketcap);
		response = JSON.parse(response);
		price = response.data[token].quote[currency].price.toFixed(2);
	} catch (error) {
		console.log(error);
		return null;
	}

	return price;
}

/*
 * Gets the current max Gas price and the deployment costs
 * for all contracts and for all production tagged networks
 */
async function main() {
	let results = [];

	for (let name in hre.config.networks) {
		let network = hre.config.networks[name];
		if (!network.tags.includes('production')) continue;

		console.log('Fetching data for', name);

		let provider = new ethers.providers.JsonRpcProvider(network.url);
		let feeData = await provider.getFeeData();
		let fundingAmount;
		let maxFundingAmount;
		let gasPrice;
		let maxGasPrice;

		const isArb = hre.network.name.toLowerCase().indexOf('arbitrum') >= 0;
		const gasLimit = isArb ? ArbGasLimit : GasLimit;

		if (feeData.gasPrice) {
			fundingAmount = feeData.gasPrice.mul(gasLimit);
			gasPrice = feeData.gasPrice;

			maxFundingAmount = fundingAmount;
			maxGasPrice = gasPrice;
		}

		if (feeData.maxFeePerGas) {
			maxFundingAmount = feeData.maxFeePerGas.mul(gasLimit);
			maxGasPrice = feeData.maxFeePerGas;
		}

		console.log(feeData);

		let tokenPrice = await getTokenPrice(symbols[name]);

		results.push({
			network: name,
			GasFee: parseFloat(ethers.utils.formatUnits(gasPrice, 'gwei')).toFixed(5),
			MaxGasFee: parseFloat(ethers.utils.formatUnits(maxGasPrice, 'gwei')).toFixed(5),
			Funding: parseFloat(ethers.utils.formatEther(fundingAmount)).toFixed(5),
			MaxFunding: parseFloat(ethers.utils.formatEther(maxFundingAmount)).toFixed(5),
			FundingCost: parseFloat(ethers.utils.formatEther(fundingAmount) * (tokenPrice ?? 0)).toFixed(
				2
			),
			MaxFundingCost: parseFloat(
				ethers.utils.formatEther(maxFundingAmount) * (tokenPrice ?? 0)
			).toFixed(2)
		});
	}

	console.table(results);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
