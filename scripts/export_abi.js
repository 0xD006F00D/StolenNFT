require('hardhat');
const ethers = hre.ethers;

const path = require('path');
const fs = require('fs');

const workingDir = './details/';
const jsonAbiFile = 'contractsAbi.json';
const fullAbiFile = 'contractsAbi.js';

/*
 * Triggers the Hardhat-deploy export task and converts the ABI into the Human Readable format
 */
async function main() {
	const jsonAbiPath = path.normalize(path.join(hre.config.paths.root, workingDir, jsonAbiFile));
	const fullAbiPath = path.normalize(path.join(hre.config.paths.root, workingDir, fullAbiFile));

	// Export JSON ABI
	await hre.run('export', { export: jsonAbiPath });
	const jsonAbi = require(jsonAbiPath);

	delete jsonAbi.contracts.MockNFT;

	// Convert to Full ABI
	let fullAbi = {};
	for (let [name, contract] of Object.entries(jsonAbi.contracts)) {
		let iface = new ethers.utils.Interface(contract.abi);
		fullAbi[name] = iface.format(ethers.utils.FormatTypes.full);
	}

	// Write
	const declaration = 'export const ContractsABI = ';
	fs.writeFileSync(fullAbiPath, declaration + JSON.stringify(fullAbi, null, 2), 'utf-8');
	console.log('Written full ABI to', fullAbiPath);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
