const { ethers } = require('hardhat');
const { use, expect } = require('chai');
const { solidity } = require('ethereum-waffle');

const { stolenNftFixture, stealNft } = require('./shared/fixtures.js');
const { signPermit } = require('./shared/helper.js');

use(solidity);

describe('BlackMarket', function () {
	let owner, alice, bob, eve;
	let BlackMarket, CounterfeitMoney, CriminalRecords, StakingHideout, StolenNFT;
	let MockNFT, stolenId;

	const params = {
		listingPrice: ethers.utils.parseEther('100'),
		validDeadline: ethers.constants.MaxUint256,
		invalidDeadline: Math.floor(new Date('2000/01/01').getTime() / 1000),
		royalty: 5000
	};

	async function listNft(user, tokenId) {
		tokenId = tokenId || stolenId;
		await StolenNFT.connect(user).approve(BlackMarket.address, tokenId);
		await BlackMarket.connect(user).listNft(tokenId, params.listingPrice);

		const listing = await BlackMarket.getListing(tokenId);
		expect(listing['seller']).to.equal(user.address);
		expect(listing['price']).to.equal(params.listingPrice);
	}

	beforeEach(async function () {
		[owner, alice, bob, eve] = await ethers.getSigners();
		// Owner deploys and Alice mints a stolen NFT
		({
			BlackMarket,
			CounterfeitMoney,
			CriminalRecords,
			StakingHideout,
			StolenNFT,
			MockNFT,
			stolenId
		} = await stolenNftFixture([owner, { alice, bob, eve }]));
	});

	describe('Constructor', function () {
		it('constructor() should initialize StolenNFT', async function () {
			expect(await BlackMarket.stolenNFT()).to.equal(StolenNFT.address);
		});
		it('constructor() should initialize CounterfeitMoney', async function () {
			expect(await BlackMarket.money()).to.equal(CounterfeitMoney.address);
		});
	});

	describe('Owner', function () {
		it('ownerOf() should return deployer as owner', async function () {
			expect(await BlackMarket.owner()).to.equal(owner.address);
		});
		it('cancelListing() should allow the owner remove and transfer a listed StolenNFT to the lister', async function () {
			await listNft(alice);

			await BlackMarket.cancelListing(stolenId);

			await expect(BlackMarket.getListing(stolenId)).to.be.revertedWith('TokenNotListed()');
			expect(await StolenNFT.ownerOf(stolenId)).to.equal(alice.address);
		});
		it('closeMarket() should disable listing and cause listNft to revert', async function () {
			await BlackMarket.closeMarket(true);

			await StolenNFT.connect(alice).approve(BlackMarket.address, stolenId);

			await expect(
				BlackMarket.connect(alice).listNft(stolenId, params.listingPrice)
			).to.be.revertedWith('MarketIsClosed()');
			expect(await StolenNFT.ownerOf(stolenId)).to.equal(alice.address);
		});
		it('closeMarket() should disable buying and cause buy to revert', async function () {
			await listNft(alice);
			await BlackMarket.closeMarket(true);

			await CounterfeitMoney.print(bob.address, params.listingPrice);
			await CounterfeitMoney.connect(bob).approve(BlackMarket.address, params.listingPrice);

			await expect(BlackMarket.connect(bob).buy(stolenId)).to.be.revertedWith('MarketIsClosed()');
		});
		it('closeMarket() should emit an event', async function () {
			await expect(BlackMarket.closeMarket(true))
				.to.emit(BlackMarket, 'MarketClosed')
				.withArgs(true);
			await expect(BlackMarket.closeMarket(false))
				.to.emit(BlackMarket, 'MarketClosed')
				.withArgs(false);
		});
		it('closeMarket() revert if set by non owner', async function () {
			await expect(BlackMarket.connect(eve).closeMarket(true)).to.be.revertedWith(
				'CallerNotTheOwner()'
			);
		});
	});

	describe('List', function () {
		it('listNftWithPermit() should list a StolenNFT with permit for a price and emit an event', async function () {
			const permit = await signPermit(
				StolenNFT,
				alice,
				BlackMarket.address,
				stolenId,
				params.validDeadline
			);

			await expect(
				BlackMarket.connect(alice).listNftWithPermit(
					stolenId,
					params.listingPrice,
					params.validDeadline,
					permit.v,
					permit.r,
					permit.s
				)
			)
				.to.emit(BlackMarket, 'Listed')
				.withArgs(alice.address, stolenId, params.listingPrice);

			const listing = await BlackMarket.getListing(stolenId);
			expect(listing['seller']).to.equal(alice.address);
			expect(listing['price']).to.equal(params.listingPrice);
		});
		it('listNftWithPermit() should revert and not list a StolenNFT with an invalid permit', async function () {
			const permit = await signPermit(
				StolenNFT,
				alice,
				BlackMarket.address,
				stolenId,
				params.invalidDeadline
			);

			await expect(
				BlackMarket.connect(alice).listNftWithPermit(
					stolenId,
					params.listingPrice,
					params.validDeadline,
					permit.v,
					permit.r,
					permit.s
				)
			).to.be.revertedWith('InvalidSignature()');

			await expect(BlackMarket.getListing(stolenId)).to.be.revertedWith('TokenNotListed()');
		});
		it('listNftWithPermit() should revert and not transfer a StolenNFT with somebody elses signature', async function () {
			const permit = await signPermit(
				StolenNFT,
				alice,
				BlackMarket.address,
				stolenId,
				params.validDeadline
			);

			await expect(
				BlackMarket.connect(eve).listNftWithPermit(
					stolenId,
					params.listingPrice,
					params.validDeadline,
					permit.v,
					permit.r,
					permit.s
				)
			).to.be.revertedWith('NotTheTokenOwner()');

			await expect(BlackMarket.getListing(stolenId)).to.be.revertedWith('TokenNotListed()');
			expect(await StolenNFT.ownerOf(stolenId)).to.equal(alice.address);
		});
		it('listNft() should list an approved StolenNFT for a price', async function () {
			await listNft(alice);
		});
		it('listNft() should revert and not list an unapproved StolenNFT for a price', async function () {
			await expect(
				BlackMarket.connect(alice).listNft(stolenId, params.listingPrice)
			).to.be.revertedWith('CallerNotApprovedOrOwner()');

			await expect(BlackMarket.getListing(stolenId)).to.be.revertedWith('TokenNotListed()');
		});
		it('listNft() should revert and not list a StolenNFT if not the owner', async function () {
			await StolenNFT.connect(alice).approve(BlackMarket.address, stolenId);

			await expect(
				BlackMarket.connect(eve).listNft(stolenId, params.listingPrice)
			).to.be.revertedWith('NotTheTokenOwner()');

			await expect(BlackMarket.getListing(stolenId)).to.be.revertedWith('TokenNotListed()');
		});
		it('listNft() should revert and not list a NFT that is not a StolenNFT', async function () {
			await MockNFT.approve(BlackMarket.address, 1);

			await expect(BlackMarket.listNft(1, params.listingPrice)).to.be.revertedWith(
				'NotTheTokenOwner()'
			);

			await expect(BlackMarket.getListing(1)).to.be.revertedWith('TokenNotListed()');
		});
	});

	describe('Modify Listing', function () {
		it('updateListing() should updated the price of a listed StolenNFT if the lister and emit an event', async function () {
			await listNft(alice);
			let newPrice = params.listingPrice.mul(2);

			await expect(BlackMarket.connect(alice).updateListing(stolenId, newPrice))
				.to.emit(BlackMarket, 'Listed')
				.withArgs(alice.address, stolenId, newPrice);

			const listing = await BlackMarket.getListing(stolenId);
			expect(listing['seller']).to.equal(alice.address);
			expect(listing['price']).to.equal(newPrice);
		});
		it('updateListing() should not updated the price of a listed StolenNFT if not the lister', async function () {
			await listNft(alice);

			await expect(
				BlackMarket.connect(eve).updateListing(stolenId, params.listingPrice.div(2))
			).to.be.revertedWith('NotTheSeller()');

			const listing = await BlackMarket.getListing(stolenId);
			expect(listing['seller']).to.equal(alice.address);
			expect(listing['price']).to.equal(params.listingPrice);
		});
		it('cancelListing() should remove and transfer a listed StolenNFT if the lister and emit an event', async function () {
			await listNft(alice);

			await expect(BlackMarket.connect(alice).cancelListing(stolenId))
				.to.emit(BlackMarket, 'Canceled')
				.withArgs(alice.address, stolenId, params.listingPrice);

			await expect(BlackMarket.getListing(stolenId)).to.be.revertedWith('TokenNotListed()');
			expect(await StolenNFT.ownerOf(stolenId)).to.equal(alice.address);
		});
		it('cancelListing() should remove and transfer a listed StolenNFT if multiple listings exist', async function () {
			await listNft(alice);
			let stolenId2 = await stealNft(StolenNFT, MockNFT, alice, 2, params.royalty);
			await listNft(alice, stolenId2);

			await BlackMarket.connect(alice).cancelListing(stolenId);

			await expect(BlackMarket.getListing(stolenId)).to.be.revertedWith('TokenNotListed()');
			expect(await StolenNFT.ownerOf(stolenId)).to.equal(alice.address);
		});

		it('cancelListing() should not remove and transfer a listed StolenNFT if not the lister', async function () {
			await listNft(alice);

			await expect(BlackMarket.connect(eve).cancelListing(stolenId)).to.be.revertedWith(
				'NotTheSeller()'
			);

			const listing = await BlackMarket.getListing(stolenId);
			expect(listing['seller']).to.equal(alice.address);
		});
	});

	describe('Buy', function () {
		it('buyWithPermit() should transfer a listed StolenNFT for a matching permitted amount and emit an event', async function () {
			await listNft(alice);
			await CounterfeitMoney.print(bob.address, params.listingPrice);

			const permit = await signPermit(
				CounterfeitMoney,
				bob,
				BlackMarket.address,
				params.listingPrice,
				params.validDeadline
			);

			await expect(
				BlackMarket.connect(bob).buyWithPermit(
					stolenId,
					params.listingPrice,
					params.validDeadline,
					permit.v,
					permit.r,
					permit.s
				)
			)
				.to.emit(BlackMarket, 'Sold')
				.withArgs(bob.address, alice.address, stolenId, params.listingPrice);

			await expect(BlackMarket.getListing(stolenId)).to.be.revertedWith('TokenNotListed()');
			expect(await StolenNFT.ownerOf(stolenId)).to.equal(bob.address);
		});
		it('buyWithPermit() should revert and not transfer a listed StolenNFT with an invalid permit', async function () {
			await listNft(alice);
			await CounterfeitMoney.print(bob.address, params.listingPrice);

			const permit = await signPermit(
				CounterfeitMoney,
				bob,
				BlackMarket.address,
				params.listingPrice,
				params.invalidDeadline
			);

			await expect(
				BlackMarket.connect(bob).buyWithPermit(
					stolenId,
					params.listingPrice,
					params.validDeadline,
					permit.v,
					permit.r,
					permit.s
				)
			).to.be.revertedWith('InvalidSignature()');

			expect(await StolenNFT.ownerOf(stolenId)).to.equal(BlackMarket.address);
		});
		it('buyWithPermit() should revert and not transfer a listed StolenNFT with somebody elses signature', async function () {
			await listNft(alice);
			await CounterfeitMoney.print(bob.address, params.listingPrice);

			const permit = await signPermit(
				CounterfeitMoney,
				bob,
				BlackMarket.address,
				params.listingPrice,
				params.validDeadline
			);

			await expect(
				BlackMarket.connect(eve).buyWithPermit(
					stolenId,
					params.listingPrice,
					params.validDeadline,
					permit.v,
					permit.r,
					permit.s
				)
			).to.be.revertedWith('InvalidSignature()');

			expect(await StolenNFT.ownerOf(stolenId)).to.equal(BlackMarket.address);
		});
		it('buy() should transfer a listed StolenNFT for a matching approved amount', async function () {
			await listNft(alice);

			await CounterfeitMoney.print(bob.address, params.listingPrice);
			await CounterfeitMoney.connect(bob).approve(BlackMarket.address, params.listingPrice);
			await BlackMarket.connect(bob).buy(stolenId);

			await expect(BlackMarket.getListing(stolenId)).to.be.revertedWith('TokenNotListed()');
			expect(await StolenNFT.ownerOf(stolenId)).to.equal(bob.address);
		});
		it('buy() should not transfer any tokens if the approved amount was to little', async function () {
			await listNft(alice);

			await CounterfeitMoney.print(bob.address, params.listingPrice);
			await CounterfeitMoney.connect(bob).approve(BlackMarket.address, params.listingPrice.sub(1));

			const bobBalance = await CounterfeitMoney.balanceOf(bob.address);
			await expect(BlackMarket.connect(bob).buy(stolenId)).to.be.revertedWith(
				'InsufficientAllowance()'
			);

			const listing = await BlackMarket.getListing(stolenId);
			expect(listing['seller']).to.equal(alice.address);
			expect(await StolenNFT.ownerOf(stolenId)).to.equal(BlackMarket.address);

			expect(await CounterfeitMoney.balanceOf(bob.address)).to.equal(bobBalance);
		});
		it('buy() should not transfer a StolenNFT that is not listed', async function () {
			await CounterfeitMoney.print(bob.address, params.listingPrice);
			await CounterfeitMoney.connect(bob).approve(BlackMarket.address, params.listingPrice);

			await expect(BlackMarket.connect(bob).buy(stolenId)).to.be.revertedWith('TokenNotListed()');

			await expect(BlackMarket.getListing(stolenId)).to.be.revertedWith('TokenNotListed()');
			expect(await StolenNFT.ownerOf(stolenId)).to.equal(alice.address);
		});

		it('buy() should transfer the correct royalties to the original holder', async function () {
			stolenId = await stealNft(StolenNFT, MockNFT, alice, 2, params.royalty);
			await listNft(alice);

			await CounterfeitMoney.print(eve.address, params.listingPrice);
			await CounterfeitMoney.connect(eve).approve(BlackMarket.address, params.listingPrice);

			let royalties = params.listingPrice.mul(params.royalty).div(10000);
			let sellerAmount = params.listingPrice.sub(royalties);

			await expect(() => BlackMarket.connect(eve).buy(stolenId)).to.changeTokenBalances(
				CounterfeitMoney,
				[bob, alice, eve],
				[royalties, sellerAmount, params.listingPrice.mul(-1)]
			);

			expect(await StolenNFT.ownerOf(stolenId)).to.equal(eve.address);
		});
		it('buy() should not transfer any royalties if no royalty receiver is specified', async function () {
			stolenId = await stealNft(StolenNFT, MockNFT, bob, 2, 0);
			await listNft(bob);

			await CounterfeitMoney.print(eve.address, params.listingPrice);
			await CounterfeitMoney.connect(eve).approve(BlackMarket.address, params.listingPrice);

			await expect(() => BlackMarket.connect(eve).buy(stolenId)).to.changeTokenBalances(
				CounterfeitMoney,
				[alice, bob, eve],
				[0, params.listingPrice, params.listingPrice.mul(-1)]
			);

			expect(await StolenNFT.ownerOf(stolenId)).to.equal(eve.address);
		});
	});

	describe('EnumerableEscrow', function () {
		it('balanceOf() should return the amount of listed tokens', async function () {
			await listNft(alice);
			expect(await BlackMarket.balanceOf(alice.address)).to.equal(1);
		});
		it('tokenOfOwnerByIndex() should return the tokenId by a specific index', async function () {
			await listNft(alice);
			const balance = await BlackMarket.balanceOf(alice.address);
			expect(await BlackMarket.tokenOfOwnerByIndex(alice.address, balance - 1)).to.equal(stolenId);
		});
		it('tokenOfOwnerByIndex() should revert if the index is out of bounds', async function () {
			await expect(BlackMarket.tokenOfOwnerByIndex(alice.address, 100)).to.be.revertedWith(
				'OwnerIndexOutOfBounds(100)'
			);
		});
		it('totalSupply() should return the total token balance', async function () {
			await listNft(alice);
			expect(await BlackMarket.totalSupply()).to.equal(1);
		});
		it('tokenByIndex() should return a tokenId by a specific index', async function () {
			await listNft(alice);
			const totalSupply = await BlackMarket.totalSupply();
			expect(await BlackMarket.tokenByIndex(totalSupply - 1)).to.equal(stolenId);
		});
		it('tokenByIndex() should revert if the index is out of bounds', async function () {
			await expect(BlackMarket.tokenByIndex(101)).to.be.revertedWith(
				'GlobalIndexOutOfBounds(101)'
			);
		});
	});
});
