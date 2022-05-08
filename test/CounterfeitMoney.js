const { ethers } = require('hardhat');
const { use, expect } = require('chai');
const { solidity } = require('ethereum-waffle');

const { platformFixture } = require('./shared/fixtures.js');

use(solidity);

describe('CounterfeitMoney', function () {
	let owner, alice, bob, eve;
	let CounterfeitMoney, contracts;

	const params = {
		transferAmount: ethers.utils.parseEther('100')
	};

	beforeEach(async function () {
		[owner, alice, bob, eve] = await ethers.getSigners();
		({ CounterfeitMoney, ...contracts } = await platformFixture([owner]));
	});

	describe('Supply', function () {
		it('totalSupply() should initially be 0', async function () {
			expect(await CounterfeitMoney.totalSupply()).to.equal(0);
		});
	});

	describe('Owner', function () {
		it('ownerOf() should return deployer as owner', async function () {
			expect(await CounterfeitMoney.owner()).to.equal(owner.address);
		});
		it('setWorker() should set new minter if owner', async function () {
			await CounterfeitMoney.setWorker(alice.address, true);
			expect(await CounterfeitMoney.workers(alice.address)).to.equal(true);
			expect(await CounterfeitMoney.workers(eve.address)).to.equal(false);
		});
		it('setWorker() should unset new minter if owner', async function () {
			await CounterfeitMoney.setWorker(alice.address, true);
			expect(await CounterfeitMoney.workers(alice.address)).to.equal(true);
			await CounterfeitMoney.setWorker(alice.address, false);
			expect(await CounterfeitMoney.workers(alice.address)).to.equal(false);
		});
		it('setWorker() should not set new minter if not owner', async function () {
			expect(CounterfeitMoney.connect(eve).setWorker(eve.address, true)).to.be.revertedWith(
				'CallerNotTheOwner()'
			);
			expect(await CounterfeitMoney.workers(eve.address)).to.equal(false);
		});
	});

	describe('Print', function () {
		it('print() should mint new tokens if worker', async function () {
			const totalSupply = await CounterfeitMoney.totalSupply();
			// await expect(tx)
			// 	.to.emit(CounterfeitMoney, 'Transfer')
			// 	.withArgs(ethers.constants.AddressZero, alice.address, params.transferAmount);
			await expect(() =>
				CounterfeitMoney.print(alice.address, params.transferAmount)
			).to.changeTokenBalances(CounterfeitMoney, [owner, alice], [0, params.transferAmount]);
			expect(await CounterfeitMoney.totalSupply()).to.equal(
				totalSupply.add(params.transferAmount)
			);
		});
		it('print() should revert and not mint tokens if not a worker', async function () {
			const totalSupply = await CounterfeitMoney.totalSupply();
			await expect(
				CounterfeitMoney.connect(eve).print(alice.address, params.transferAmount)
			).to.revertedWith('UnauthorizedWorker()');
			expect(await CounterfeitMoney.totalSupply()).to.equal(totalSupply);
		});
	});

	describe('Burn', function () {
		it('burn() should burn approved tokens if worker', async function () {
			let totalSupply = await CounterfeitMoney.totalSupply();
			await CounterfeitMoney.print(alice.address, params.transferAmount);

			await CounterfeitMoney.connect(alice).approve(owner.address, params.transferAmount);

			// await expect(tx)
			// 	.to.emit(CounterfeitMoney, 'Transfer')
			// 	.withArgs(alice.address, ethers.constants.AddressZero, params.transferAmount);
			await expect(() =>
				CounterfeitMoney.burn(alice.address, params.transferAmount)
			).to.changeTokenBalances(
				CounterfeitMoney,
				[owner, alice],
				[0, params.transferAmount.mul(-1)]
			);
			expect(await CounterfeitMoney.totalSupply()).to.equal(totalSupply);
		});
		it('burn() should revert and not burn tokens if tokens not approved', async function () {
			await CounterfeitMoney.print(alice.address, params.transferAmount);
			let totalSupply = await CounterfeitMoney.totalSupply();

			await expect(CounterfeitMoney.burn(alice.address, params.transferAmount)).to.be.revertedWith(
				'InsufficientAllowance()'
			);
			expect(await CounterfeitMoney.totalSupply()).to.equal(totalSupply);
		});
		it('burn() should revert and not burn tokens if not a worker', async function () {
			await CounterfeitMoney.print(alice.address, params.transferAmount);
			let totalSupply = await CounterfeitMoney.totalSupply();

			await CounterfeitMoney.connect(alice).approve(owner.address, params.transferAmount);

			await expect(
				CounterfeitMoney.connect(eve).burn(alice.address, params.transferAmount)
			).to.be.revertedWith('UnauthorizedWorker()');
			expect(await CounterfeitMoney.totalSupply()).to.equal(totalSupply);
		});
	});

	describe('Transfer', function () {
		it('transfer() should transfer token from A to B', async function () {
			await CounterfeitMoney.print(alice.address, params.transferAmount.mul(2));
			const totalSupply = await CounterfeitMoney.totalSupply();

			await expect(() =>
				CounterfeitMoney.connect(alice).transfer(bob.address, params.transferAmount)
			).to.changeTokenBalances(
				CounterfeitMoney,
				[alice, bob],
				[params.transferAmount.mul(-1), params.transferAmount]
			);
			expect(await CounterfeitMoney.totalSupply()).to.equal(totalSupply);
		});
		it('transferFrom() should transfer tokens from A to B', async function () {
			await CounterfeitMoney.print(alice.address, params.transferAmount.mul(2));
			const totalSupply = await CounterfeitMoney.totalSupply();

			await CounterfeitMoney.connect(alice).approve(owner.address, params.transferAmount);

			await expect(() =>
				CounterfeitMoney.transferFrom(alice.address, owner.address, params.transferAmount)
			).to.changeTokenBalances(
				CounterfeitMoney,
				[alice, owner],
				[params.transferAmount.mul(-1), params.transferAmount]
			);
			expect(await CounterfeitMoney.totalSupply()).to.equal(totalSupply);
		});
	});
});
