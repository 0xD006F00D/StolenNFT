const { ethers } = require('hardhat');
const { use, expect } = require('chai');
const { solidity } = require('ethereum-waffle');

const { stolenNftFixture, stealNft } = require('./shared/fixtures.js');
const { signPermit } = require('./shared/helper.js');

use(solidity);

describe('StakingHideout', function () {
	let owner, alice, bob, eve;
	let BlackMarket, CounterfeitMoney, CriminalRecords, StakingHideout, StolenNFT;
	let MockNFT, stolenId;

	const params = {
		rewardRate: ethers.utils.parseEther('1'),
		balanceLimit: 5,
		stakingDuration: 2,
		validDeadline: ethers.constants.MaxUint256,
		invalidDeadline: Math.floor(new Date('2000/01/01').getTime() / 1000)
	};

	async function stashNft(user, tokenId) {
		tokenId = tokenId || stolenId;
		await StolenNFT.connect(user).approve(StakingHideout.address, tokenId);
		await StakingHideout.connect(user).stash(tokenId);
		expect(await StakingHideout.getStaker(tokenId)).to.equal(user.address);
	}

	beforeEach(async function () {
		[owner, alice, bob, eve] = await ethers.getSigners();
		({
			BlackMarket,
			CounterfeitMoney,
			CriminalRecords,
			StakingHideout,
			StolenNFT,
			MockNFT,
			stolenId
		} = await stolenNftFixture([owner, { alice, bob, eve }]));

		await StakingHideout.setRewardRate(params.rewardRate);
		await StakingHideout.setBalanceLimit(params.balanceLimit);
	});

	describe('Constructor', function () {
		it('constructor() should initialize StolenNFT', async function () {
			expect(await StakingHideout.stakingNft()).to.equal(StolenNFT.address);
		});
		it('constructor() should initialize CounterfeitMoney', async function () {
			expect(await StakingHideout.rewardsToken()).to.equal(CounterfeitMoney.address);
		});
	});

	describe('Owner', function () {
		it('ownerOf() should return deployer as owner', async function () {
			expect(await StakingHideout.owner()).to.equal(owner.address);
		});
		it('setRewardRate() should overwrite parameters if owner and emit an event', async function () {
			await expect(StakingHideout.setRewardRate(params.rewardRate.add(1)))
				.to.emit(StakingHideout, 'RewardRateChange')
				.withArgs(params.rewardRate.add(1));
			expect(await StakingHideout.rewardRate()).to.equal(params.rewardRate.add(1));
		});
		it('setRewardRate() should not overwrite parameters if not owner', async function () {
			await expect(
				StakingHideout.connect(eve).setRewardRate(params.rewardRate.add(1))
			).to.be.revertedWith('CallerNotTheOwner()');
			expect(await StakingHideout.rewardRate()).to.equal(params.rewardRate);
		});
		it('setBalanceLimit() should overwrite parameters if owner and emit an event', async function () {
			await expect(StakingHideout.setBalanceLimit(params.balanceLimit + 1))
				.to.emit(StakingHideout, 'BalanceLimitChange')
				.withArgs(params.balanceLimit + 1);
			expect(await StakingHideout.balanceLimit()).to.equal(params.balanceLimit + 1);
		});
		it('setBalanceLimit() should not overwrite parameters if not owner', async function () {
			await expect(
				StakingHideout.connect(eve).setBalanceLimit(params.balanceLimit + 1)
			).to.be.revertedWith('CallerNotTheOwner()');
			expect(await StakingHideout.balanceLimit()).to.equal(params.balanceLimit);
		});
	});

	describe('Stash', function () {
		it('stashWithPermit() should stake a StolenNFT with permit and emit event', async function () {
			const permit = await signPermit(
				StolenNFT,
				alice,
				StakingHideout.address,
				stolenId,
				params.validDeadline
			);

			await expect(
				StakingHideout.connect(alice).stashWithPermit(
					stolenId,
					params.validDeadline,
					permit.v,
					permit.r,
					permit.s
				)
			)
				.to.emit(StakingHideout, 'Stashed')
				.withArgs(alice.address, stolenId);

			expect(await StakingHideout.getStaker(stolenId)).to.equal(alice.address);
		});
		it('stashWithPermit() should revert and not stake a StolenNFT with an invalid permit', async function () {
			const permit = await signPermit(
				StolenNFT,
				eve,
				StakingHideout.address,
				stolenId,
				params.validDeadline
			);

			await expect(
				StakingHideout.connect(alice).stashWithPermit(
					stolenId,
					params.validDeadline,
					permit.v,
					permit.r,
					permit.s
				)
			).to.be.revertedWith('InvalidSignature()');

			await expect(StakingHideout.getStaker(stolenId)).to.be.revertedWith('TokenNotStashed()');
		});
		it('stash() should stake an approved StolenNFT', async function () {
			await stashNft(alice);
		});
		it('stash() should revert and not stake StolenNFT if not approved', async function () {
			await expect(StakingHideout.connect(alice).stash(stolenId)).to.be.revertedWith(
				'CallerNotApprovedOrOwner()'
			);
			await expect(StakingHideout.getStaker(stolenId)).to.be.revertedWith('TokenNotStashed()');
		});
		it('stash() should revert and not stake StolenNFT if not the owner', async function () {
			await StolenNFT.connect(alice).approve(StakingHideout.address, stolenId);
			await expect(StakingHideout.connect(eve).stash(stolenId)).to.be.revertedWith(
				'NotTheTokenOwner()'
			);
			await expect(StakingHideout.getStaker(stolenId)).to.be.revertedWith('TokenNotStashed()');
		});
		it('stash() should revert and not stake StolenNFT if stash is already full', async function () {
			for (let id = 2; id <= params.balanceLimit + 1; id++) {
				await StolenNFT.connect(alice).approve(StakingHideout.address, stolenId);
				await StakingHideout.connect(alice).stash(stolenId);
				stolenId = await stealNft(StolenNFT, MockNFT, alice, id);
			}
			await StolenNFT.connect(alice).approve(StakingHideout.address, stolenId);
			await expect(StakingHideout.connect(alice).stash(stolenId)).to.be.revertedWith(
				'StashIsFull()'
			);
			expect(await StakingHideout.balanceOf(alice.address)).to.eq(params.balanceLimit);
		});
		it('stash() should revert and not stake a NFT that is not a StolenNFT', async function () {
			await MockNFT.approve(StakingHideout.address, 1);
			await expect(StakingHideout.stash(1)).to.be.revertedWith('NotTheTokenOwner()');
			await expect(StakingHideout.getStaker(stolenId)).to.be.revertedWith('TokenNotStashed()');
		});
		it('unstash() should return the staked StolenNFT to the staker and emit an event', async function () {
			await stashNft(alice);

			await expect(StakingHideout.connect(alice).unstash(stolenId))
				.to.emit(StakingHideout, 'Unstashed')
				.withArgs(alice.address, stolenId);

			expect(await StolenNFT.ownerOf(stolenId)).to.equal(alice.address);
			await expect(StakingHideout.getStaker(stolenId)).to.be.revertedWith('TokenNotStashed()');
		});
		it('unstash() should not allow non-staker to unstake the staked StolenNFT', async function () {
			await stashNft(alice);

			await expect(StakingHideout.connect(eve).unstash(stolenId)).to.be.revertedWith(
				'NotTheStaker()'
			);

			expect(await StakingHideout.getStaker(stolenId)).to.equal(alice.address);
		});
	});

	describe('Rewards', function () {
		it('getReward() should transfer the reward for staking a NFT', async function () {
			await stashNft(alice);
			await new Promise((r) => setTimeout(r, 1000 * params.stakingDuration));
			await StakingHideout.connect(alice).getReward();

			expect(await CounterfeitMoney.balanceOf(alice.address)).to.be.gte(
				params.rewardRate.mul(params.stakingDuration)
			);
		});
		it('getReward() should split the reward if two users are staking', async function () {
			let aliceNft = stolenId;
			let bobNft = stealNft(StolenNFT, MockNFT, bob, 2);

			await stashNft(alice, aliceNft);
			await stashNft(bob, bobNft);
			await new Promise((r) => setTimeout(r, 1000 * params.stakingDuration));
			await StakingHideout.connect(alice).getReward();
			await StakingHideout.connect(bob).getReward();

			expect(await CounterfeitMoney.balanceOf(alice.address)).to.be.gte(
				params.rewardRate.mul(params.stakingDuration).div(2)
			);
			expect(await CounterfeitMoney.balanceOf(bob.address)).to.be.gte(
				params.rewardRate.mul(params.stakingDuration).div(2)
			);
		});
		it('getReward() should not transfer anything for staking nothing', async function () {
			await StakingHideout.connect(bob).getReward();
			expect(await CounterfeitMoney.balanceOf(bob.address)).to.equal(0);
		});
	});

	describe('EnumerableEscrow', function () {
		it('balanceOf() should return the amount of listed tokens', async function () {
			await stashNft(alice);
			expect(await StakingHideout.balanceOf(alice.address)).to.equal(1);
		});
		it('tokenOfOwnerByIndex() should return the tokenId by a specific index', async function () {
			await stashNft(alice);
			const balance = await StakingHideout.balanceOf(alice.address);
			expect(await StakingHideout.tokenOfOwnerByIndex(alice.address, balance - 1)).to.equal(
				stolenId
			);
		});
		it('tokenOfOwnerByIndex() should revert if the index is out of bounds', async function () {
			await expect(StakingHideout.tokenOfOwnerByIndex(alice.address, 100)).to.be.revertedWith(
				'OwnerIndexOutOfBounds(100)'
			);
		});
		it('totalSupply() should return the total token balance', async function () {
			await stashNft(alice);
			expect(await StakingHideout.totalSupply()).to.equal(1);
		});
		it('tokenByIndex() should return a tokenId by a specific index', async function () {
			await stashNft(alice);
			const totalSupply = await StakingHideout.totalSupply();
			expect(await StakingHideout.tokenByIndex(totalSupply - 1)).to.equal(stolenId);
		});
		it('tokenByIndex() should revert if the index is out of bounds', async function () {
			await expect(StakingHideout.tokenByIndex(100)).to.be.revertedWith(
				'GlobalIndexOutOfBounds(100)'
			);
		});
	});
});
