const { ethers } = require('hardhat');
const { use, expect } = require('chai');
const { solidity } = require('ethereum-waffle');
const { deployContract } = require('ethereum-waffle');

use(solidity);

const ContractJSON = require('../artifacts/contracts/mock/MockNFT.sol/MockNFT.json');
const Create2DeployerJSON = require('../artifacts/contracts/utils/Create2Deployer.sol/Create2Deployer.json');

describe('Create2', function () {
	let signer;
	let create2Deployer;
	let deployTransaction;
	let initCode;
	let initCodeHash;

	const testContractName = 'MockNFT';
	const saltText = 'salt message';
	const salt = ethers.utils.id(saltText);

	beforeEach(async function () {
		[signer] = await ethers.getSigners();

		create2Deployer = await deployContract(signer, Create2DeployerJSON);

		let contract = await ethers.getContractFactory(testContractName);
		deployTransaction = contract.getDeployTransaction('MockNFT', 'MNFT', '');
		initCode = deployTransaction.data;
		initCodeHash = ethers.utils.keccak256(deployTransaction.data);
	});

	describe('deploy', function () {
		it('deploy() deploys a valid contract', async function () {
			const offChainComputed = ethers.utils.getCreate2Address(
				create2Deployer.address,
				salt,
				initCodeHash
			);

			await create2Deployer.deploy(salt, initCode);

			const deployedContract = new ethers.Contract(offChainComputed, ContractJSON.abi, signer);
			expect(await deployedContract.balanceOf(signer.address)).to.equal(0);
		});
		it('deploy() reverts if redeploying a contract', async function () {
			await create2Deployer.deploy(salt, initCode);
			await expect(create2Deployer.deploy(salt, initCode)).to.be.reverted;
		});
		it('deploy() reverts if no bytecode is given', async function () {
			await expect(create2Deployer.deploy(salt, '0x')).to.be.reverted;
		});
	});
});
