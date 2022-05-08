const { ethers } = require('hardhat');
const { use, expect } = require('chai');
const { solidity } = require('ethereum-waffle');

const { stolenNftFixture, stealNft } = require('./shared/fixtures.js');

use(solidity);

describe('StolenNFT', function () {
	let owner, alice, bob, eve;
	let BlackMarket, CounterfeitMoney, CriminalRecords, StakingHideout, StolenNFT;
	let MockNFT, stolenId;

	const params = {
		chainId: 31337,
		maximumSupply: 5,
		validURI: 'https://api.coolcatsnft.com/cat/2',
		tip: ethers.utils.parseEther('2'),
		mockTokenId: 2,
		validRoyalty: 5000,
		invalidRoyalty: 15000,
		salesPrice: ethers.utils.parseEther('100')
	};

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
	});

	describe('Owner', function () {
		it('ownerOf() should return deployer as owner', async function () {
			expect(await StolenNFT.owner()).to.equal(owner.address);
		});
		it('setMaximumSupply() should overwrite maximumSupply if owner and emit an event', async function () {
			await expect(StolenNFT.setMaximumSupply(params.maximumSupply))
				.to.emit(StolenNFT, 'SupplyChange')
				.withArgs(params.maximumSupply);
			expect(await StolenNFT.maximumSupply()).to.equal(params.maximumSupply);
		});
		it('setMaximumSupply() should revert and not overwrite maximumSupply if not owner', async function () {
			await expect(
				StolenNFT.connect(eve).setMaximumSupply(params.maximumSupply)
			).to.be.revertedWith('CallerNotTheOwner()');
			expect(await StolenNFT.maximumSupply()).to.equal(ethers.constants.MaxUint256);
		});
		it('setCriminalRecords() should overwrite criminalRecords if owner', async function () {
			await StolenNFT.setCriminalRecords(ethers.constants.AddressZero);
			expect(await StolenNFT.criminalRecords()).to.equal(ethers.constants.AddressZero);
		});
		it('setCriminalRecords() should revert and not overwrite baseURI if not owner', async function () {
			await expect(
				StolenNFT.connect(eve).setCriminalRecords(ethers.constants.AddressZero)
			).to.be.revertedWith('CallerNotTheOwner()');
			expect(await StolenNFT.criminalRecords()).to.equal(CriminalRecords.address);
		});
		it('emptyTipJar() should send collected tips to recipient if owner', async function () {
			await owner.sendTransaction({ to: StolenNFT.address, value: params.tip });
			await expect(await StolenNFT.emptyTipJar(alice.address)).to.changeEtherBalance(
				alice,
				params.tip
			);
		});
		it('emptyTipJar() should revert if the tip jar is empty', async function () {
			await expect(StolenNFT.emptyTipJar(alice.address)).to.revertedWith('NoTips()');
		});
		it('emptyTipJar() should revert if sending the tips to zero address', async function () {
			await expect(StolenNFT.emptyTipJar(ethers.constants.AddressZero)).to.revertedWith(
				'TransferToZeroAddress()'
			);
		});
		it('emptyTipJar() should revert and not send collected tips to recipient if not owner', async function () {
			await owner.sendTransaction({ to: StolenNFT.address, value: params.tip });
			await expect(StolenNFT.connect(eve).emptyTipJar(alice.address)).to.be.revertedWith(
				'CallerNotTheOwner()'
			);
		});
	});

	describe('Steal', function () {
		it('steal() should mint a valid NFT', async function () {
			stolenId = await stealNft(StolenNFT, MockNFT, alice, params.mockTokenId, 0);

			expect(await StolenNFT.tokenURI(stolenId)).to.equal(
				await MockNFT.tokenURI(params.mockTokenId)
			);
			expect(await StolenNFT.ownerOf(stolenId)).to.equal(alice.address);
		});
		it('steal() should emit a Stolen event', async function () {
			await expect(
				StolenNFT.connect(alice).steal(
					params.chainId,
					MockNFT.address,
					params.mockTokenId,
					ethers.constants.AddressZero,
					0,
					''
				)
			)
				.to.emit(StolenNFT, 'Stolen')
				.withArgs(
					alice.address,
					params.chainId,
					MockNFT.address,
					params.mockTokenId,
					stolenId + 1
				);
		});
		it('steal() should be able to receive a tip', async function () {
			await expect(
				await StolenNFT.connect(alice).steal(
					params.chainId,
					MockNFT.address,
					params.mockTokenId,
					ethers.constants.AddressZero,
					0,
					'',
					{ value: params.tip }
				)
			).to.changeEtherBalance(StolenNFT, params.tip);
		});
		it('steal() should revert and not mint more StolenNFTs than maximumSupply', async function () {
			await StolenNFT.setMaximumSupply(params.maximumSupply);
			for (let i = 1; i < params.maximumSupply; i++) {
				await stealNft(StolenNFT, MockNFT, alice, params.mockTokenId + i);
			}
			await expect(
				StolenNFT.connect(alice).steal(
					params.chainId,
					MockNFT.address,
					params.mockTokenId + params.maximumSupply,
					ethers.constants.AddressZero,
					0,
					''
				)
			).to.be.revertedWith('NothingLeftToSteal()');
			expect(await StolenNFT.totalSupply()).to.equal(params.maximumSupply);
		});
		it('steal() should revert and not mint when stealing a StolenNFT', async function () {
			await expect(
				StolenNFT.connect(alice).steal(
					params.chainId,
					StolenNFT.address,
					stolenId,
					ethers.constants.AddressZero,
					0,
					''
				)
			).to.be.revertedWith('StealingStolenNft()');
		});
		it('steal() should revert and not mint from zero address', async function () {
			await expect(
				StolenNFT.connect(alice).steal(
					params.chainId,
					ethers.constants.AddressZero,
					1,
					ethers.constants.AddressZero,
					0,
					''
				)
			).to.be.revertedWith('StealingFromZeroAddress()');
		});
		it('steal() should revert and not mint when an invalid chainId is given', async function () {
			const uInt64Max = '18446744073709551615';
			await expect(
				StolenNFT.connect(alice).steal(0, MockNFT.address, 1, ethers.constants.AddressZero, 0, '')
			).to.be.revertedWith('InvalidChainId()');
			await expect(
				StolenNFT.connect(alice).steal(
					uInt64Max,
					MockNFT.address,
					1,
					ethers.constants.AddressZero,
					0,
					''
				)
			).to.be.revertedWith('InvalidChainId()');
		});
		it('steal() should revert and not mint an already stolen NFT', async function () {
			await expect(
				StolenNFT.connect(alice).steal(
					params.chainId,
					MockNFT.address,
					1,
					ethers.constants.AddressZero,
					0,
					''
				)
			).to.be.revertedWith(`AlreadyStolen(${stolenId})`);
		});
		it('steal() should revert and not mint a non IERC721Metadata token if no tokenURI is given', async function () {
			await expect(
				StolenNFT.connect(alice).steal(
					params.chainId,
					CounterfeitMoney.address,
					1,
					ethers.constants.AddressZero,
					0,
					''
				)
			).to.be.revertedWith('UnsupportedToken()');
		});
		it('getStolen() should return a stolen NFTs tokenId', async function () {
			stolenId = await stealNft(StolenNFT, MockNFT, alice, params.mockTokenId, 0);
			expect(await StolenNFT.getStolen(MockNFT.address, params.mockTokenId)).to.equal(stolenId);
		});
		it('getStolen() should not return an un-stolen NFTs tokenId', async function () {
			expect(await StolenNFT.getStolen(MockNFT.address, params.mockTokenId)).to.equal(0);
		});
		it('getOriginal() should return a stolen NFTs original contract/tokenId', async function () {
			stolenId = await stealNft(StolenNFT, MockNFT, alice, params.mockTokenId, 0);

			const originalData = await StolenNFT.getOriginal(stolenId);
			expect(originalData[0]).to.equal(params.chainId);
			expect(originalData[1]).to.equal(MockNFT.address);
			expect(originalData[2]).to.equal(params.mockTokenId);
		});
		it('getOriginal() should not return a un-stolen NFTs original contract/tokenId', async function () {
			const originalData = await StolenNFT.getOriginal(stolenId + 1);
			expect(originalData[0]).to.equal(0);
			expect(originalData[1]).to.equal(ethers.constants.AddressZero);
			expect(originalData[2]).to.equal(0);
		});
		it('tokenURI() should be the same as originalTokenURI()', async function () {
			stolenId = await stealNft(StolenNFT, MockNFT, alice, params.mockTokenId, 0);

			expect(await StolenNFT.tokenURI(stolenId)).to.equal(
				await StolenNFT.originalTokenURI(MockNFT.address, params.mockTokenId)
			);
		});
	});

	describe('Steal with custom mintFrom', function () {
		it('steal() should mint a NFT from another address', async function () {
			await StolenNFT.connect(alice).steal(
				params.chainId,
				MockNFT.address,
				params.mockTokenId,
				bob.address,
				0,
				''
			);

			expect(await StolenNFT.ownerOf(stolenId + 1)).to.equal(alice.address);
		});
		it('steal() should emit a Mint and Transfer event', async function () {
			await expect(
				StolenNFT.connect(alice).steal(
					params.chainId,
					MockNFT.address,
					params.mockTokenId,
					bob.address,
					0,
					''
				)
			)
				.to.emit(StolenNFT, 'Transfer')
				.withArgs(ethers.constants.AddressZero, bob.address, params.mockTokenId)
				.to.emit(StolenNFT, 'Transfer')
				.withArgs(bob.address, alice.address, params.mockTokenId);

			expect(await StolenNFT.ownerOf(stolenId + 1)).to.equal(alice.address);
		});
		it('steal() should mint a NFT from the minter address but only emit the Mint event', async function () {
			let tx = await StolenNFT.connect(alice).steal(
				params.chainId,
				MockNFT.address,
				params.mockTokenId,
				alice.address,
				0,
				''
			);

			await expect(tx)
				.to.emit(StolenNFT, 'Transfer')
				.withArgs(ethers.constants.AddressZero, alice.address, params.mockTokenId);

			let transferEmitted = true;
			try {
				await expect(tx)
					.to.emit(StolenNFT, 'Transfer')
					.withArgs(alice.address, alice.address, params.mockTokenId);
			} catch (e) {
				transferEmitted = false;
			}
			expect(transferEmitted).to.equal(false);
		});
	});

	describe('Steal with custom royaltyFee', function () {
		it('steal() should mint with no royaltyFee and return no royalties via royaltyInfo()', async function () {
			await StolenNFT.connect(alice).steal(
				params.chainId,
				MockNFT.address,
				params.mockTokenId,
				bob.address,
				0,
				''
			);
			const royalty = await StolenNFT.royaltyInfo(stolenId + 1, 100);
			expect(royalty[0]).to.equal(ethers.constants.AddressZero);
			expect(royalty[1]).to.equal(0);
		});
		it('steal() should mint with a valid royaltyFee and return it via royaltyInfo()', async function () {
			await StolenNFT.connect(alice).steal(
				params.chainId,
				MockNFT.address,
				params.mockTokenId,
				bob.address,
				params.validRoyalty,
				''
			);
			const royalty = await StolenNFT.royaltyInfo(stolenId + 1, params.salesPrice);
			expect(royalty[0]).to.equal(bob.address);
			expect(royalty[1]).to.equal(params.salesPrice.mul(params.validRoyalty).div(10000));
		});
		it('steal() should revert if an invalid royalty fee is given', async function () {
			await expect(
				StolenNFT.connect(alice).steal(
					params.chainId,
					MockNFT.address,
					params.mockTokenId,
					bob.address,
					params.invalidRoyalty,
					''
				)
			).to.be.revertedWith('InvalidRoyalty()');
		});
		it('steal() should revert if an royalty is given for a cross-chain theft', async function () {
			await expect(
				StolenNFT.connect(alice).steal(
					1,
					MockNFT.address,
					params.mockTokenId,
					bob.address,
					params.validRoyalty,
					params.validURI
				)
			).to.be.revertedWith('InvalidRoyalty()');
		});
	});

	describe('Steal with custom URI', function () {
		it('steal() should mint with a valid URI and return it via tokenURI()', async function () {
			await StolenNFT.connect(alice).steal(
				params.chainId,
				MockNFT.address,
				params.mockTokenId,
				bob.address,
				params.validRoyalty,
				params.validURI
			);

			expect(await StolenNFT.tokenURI(stolenId + 1)).to.equal(params.validURI);
		});
		it('steal() should revert if stealing cross-chain without a valid URI', async function () {
			await expect(
				StolenNFT.connect(alice).steal(
					params.chainId + 1,
					MockNFT.address,
					params.mockTokenId,
					bob.address,
					0,
					''
				)
			).to.be.revertedWith('CrossChainUriMissing()');
		});
		it('setTokenURI() should overwrite the valid URI if holder', async function () {
			await StolenNFT.connect(alice).setTokenURI(stolenId, params.validURI);
			expect(await StolenNFT.tokenURI(stolenId)).to.equal(params.validURI);
		});
		it('setTokenURI() should not overwrite the valid URI if not holder', async function () {
			await expect(
				StolenNFT.connect(bob).setTokenURI(stolenId, params.validURI)
			).to.be.revertedWith('NotTheTokenOwner()');
		});
		it('setTokenURI() should set the originals tokenURI if URI is empty', async function () {
			await StolenNFT.connect(alice).steal(
				params.chainId,
				MockNFT.address,
				params.mockTokenId,
				bob.address,
				params.validRoyalty,
				params.validURI
			);

			expect(await StolenNFT.tokenURI(stolenId + 1)).to.equal(params.validURI);

			await StolenNFT.connect(alice).setTokenURI(stolenId + 1, '');

			expect(await StolenNFT.tokenURI(stolenId + 1)).to.equal(
				await MockNFT.tokenURI(params.mockTokenId)
			);
		});
		it('setTokenURI() should revert if an empty URI is given for a cross-chain NFT', async function () {
			await StolenNFT.connect(alice).steal(
				1,
				MockNFT.address,
				params.mockTokenId,
				bob.address,
				0,
				params.validURI
			);

			await expect(StolenNFT.connect(alice).setTokenURI(stolenId + 1, '')).to.be.revertedWith(
				'CrossChainUriMissing()'
			);

			expect(await StolenNFT.tokenURI(stolenId + 1)).to.equal(params.validURI);
		});
		it('setTokenURI() should revert the original NFT does not support token URI and the URI string is removed', async function () {
			await StolenNFT.connect(alice).steal(
				params.chainId,
				BlackMarket.address,
				params.mockTokenId,
				bob.address,
				params.validRoyalty,
				params.validURI
			);

			await expect(StolenNFT.connect(alice).setTokenURI(stolenId + 1, '')).to.be.revertedWith(
				'UnsupportedToken()'
			);

			expect(await StolenNFT.tokenURI(stolenId + 1)).to.equal(params.validURI);
		});
	});

	describe('Surrender', function () {
		it('surrender() should burn a held NFT and emit an event', async function () {
			await expect(await StolenNFT.connect(alice).surrender(stolenId))
				.to.emit(StolenNFT, 'Seized')
				.withArgs(alice.address, params.chainId, MockNFT.address, 1, stolenId);
			await expect(StolenNFT.ownerOf(stolenId)).to.be.revertedWith(
				`QueryForNonExistentToken(${stolenId})`
			);
		});
		it('surrender() should burn a held NFT and delete the tokenURI', async function () {
			await StolenNFT.connect(alice).steal(
				params.chainId,
				MockNFT.address,
				params.mockTokenId,
				bob.address,
				params.validRoyalty,
				params.validURI
			);

			expect(await StolenNFT.tokenURI(stolenId + 1)).to.equal(params.validURI);
			await StolenNFT.connect(alice).surrender(stolenId + 1);
			await expect(StolenNFT.tokenURI(stolenId + 1)).to.be.revertedWith(
				`QueryForNonExistentToken(${stolenId + 1})`
			);
		});
		it('surrender() should revert and not burn a NFT held by someone else', async function () {
			await expect(StolenNFT.connect(bob).surrender(stolenId)).to.be.revertedWith(
				'NotTheTokenOwner()'
			);
			expect(await StolenNFT.ownerOf(stolenId)).to.equal(alice.address);
		});
		it('surrender() should revert and not burn a NFT if not stolen yet', async function () {
			await expect(StolenNFT.connect(bob).surrender(100)).to.be.revertedWith(
				'QueryForNonExistentToken(100)'
			);
		});
	});

	describe('Retire', function () {
		it('retire() should allow the thief to retire if not wanted', async function () {
			await StolenNFT.connect(bob).retire(true);
			expect(await StolenNFT.retired(bob.address)).to.equal(true);
			await StolenNFT.connect(bob).retire(false);
			expect(await StolenNFT.retired(bob.address)).to.equal(false);
		});
		it('retire() should not allow the thief to retire if wanted', async function () {
			await expect(StolenNFT.connect(alice).retire(true)).to.be.revertedWith('YouAreWanted()');

			expect(await StolenNFT.retired(alice.address)).to.equal(false);
		});
		it('steal() should revert and not mint a NFT if the thief is offline', async function () {
			await StolenNFT.connect(bob).retire(true);

			await expect(
				StolenNFT.connect(bob).steal(
					params.chainId,
					MockNFT.address,
					params.mockTokenId,
					owner.address,
					params.validRoyalty,
					''
				)
			).to.be.revertedWith('YouAreRetired()');
		});
		it('swatted() should never be able to burn the NFT if retired', async function () {
			// Bob is the owner so no wanted added
			await StolenNFT.connect(bob).steal(
				params.chainId,
				MockNFT.address,
				params.mockTokenId,
				ethers.constants.AddressZero,
				params.validRoyalty,
				''
			);

			await StolenNFT.connect(bob).retire(true);
			expect(await StolenNFT.retired(bob.address)).to.equal(true);
			await StolenNFT.setCriminalRecords(owner.address);
			await expect(StolenNFT.swatted(stolenId + 1)).to.be.revertedWith('ThiefIsRetired()');
		});
		it('surrender() should revert and not burn a NFT if thief is retired', async function () {
			await StolenNFT.connect(bob).steal(
				params.chainId,
				MockNFT.address,
				params.mockTokenId,
				ethers.constants.AddressZero,
				params.validRoyalty,
				''
			);

			await StolenNFT.connect(bob).retire(true);
			expect(await StolenNFT.retired(bob.address)).to.equal(true);
			await expect(StolenNFT.connect(bob).surrender(stolenId + 1)).to.be.revertedWith(
				'YouAreRetired()'
			);
		});
		it('transferFrom() transfer to retired receiver should revert and not transfer a NFT', async function () {
			await StolenNFT.connect(bob).retire(true);
			await expect(
				StolenNFT.connect(alice).transferFrom(alice.address, bob.address, stolenId)
			).to.be.revertedWith('ReceiverIsRetired()');
		});
		it('transferFrom() retired sender should revert and not transfer a NFT', async function () {
			// Bob is the original owner, so he won't get any wanted levels
			await StolenNFT.connect(bob).steal(
				params.chainId,
				MockNFT.address,
				params.mockTokenId,
				ethers.constants.AddressZero,
				params.validRoyalty,
				''
			);

			await StolenNFT.connect(bob).retire(true);
			await expect(
				StolenNFT.connect(bob).transferFrom(bob.address, alice.address, stolenId + 1)
			).to.be.revertedWith('SenderIsRetired()');
		});
	});

	describe('Integration with CriminalRecords', function () {
		it("steal() increase the thief's wanted level", async function () {
			const sentence = await CriminalRecords.sentence();
			const wantedLevel = await CriminalRecords.getWanted(alice.address);
			await StolenNFT.connect(alice).steal(
				params.chainId,
				MockNFT.address,
				params.mockTokenId,
				ethers.constants.AddressZero,
				params.validRoyalty,
				''
			);
			expect(await CriminalRecords.getWanted(alice.address)).to.equal(+wantedLevel + sentence);
		});
		it("steal() should not increase the thief's wanted level if original owner", async function () {
			const wantedLevel = await CriminalRecords.getWanted(bob.address);
			await StolenNFT.connect(bob).steal(
				params.chainId,
				MockNFT.address,
				params.mockTokenId,
				ethers.constants.AddressZero,
				params.validRoyalty,
				''
			);
			expect(await CriminalRecords.getWanted(bob.address)).to.equal(wantedLevel);
		});
		it('steal() should not increase the mintFrom addresses wanted level', async function () {
			const wantedLevel = await CriminalRecords.getWanted(alice.address);
			await StolenNFT.connect(eve).steal(
				params.chainId,
				MockNFT.address,
				params.mockTokenId,
				alice.address,
				params.validRoyalty,
				''
			);
			expect(await CriminalRecords.getWanted(alice.address)).to.equal(wantedLevel);
		});
		it('swatted() should burn a StolenNFT if called by CriminalRecords', async function () {
			// Increase Wanted level to 50 to make it always work
			let wantedLevel = await CriminalRecords.getWanted(alice.address);
			for (let i = wantedLevel; i < 50 / 2 + 1; i++) {
				await CriminalRecords.crimeWitnessed(alice.address);
			}

			let reportDelay = 1;
			await CriminalRecords.setWantedParameters(50, 2, 50, reportDelay, 30, 1, 1);
			await CriminalRecords.connect(bob).reportTheft(stolenId);
			await new Promise((r) => setTimeout(r, (reportDelay + 1) * 1000));

			await expect(await CriminalRecords.connect(bob).arrest())
				.to.emit(CriminalRecords, 'Arrested')
				.withArgs(bob.address, alice.address, stolenId)
				.to.emit(StolenNFT, 'Seized')
				.withArgs(alice.address, params.chainId, MockNFT.address, 1, stolenId);

			await expect(StolenNFT.ownerOf(stolenId)).to.be.revertedWith(
				`QueryForNonExistentToken(${stolenId})`
			);
		});
		it('swatted() should not burn a StolenNFT if called by somebody else', async function () {
			await expect(StolenNFT.connect(eve).swatted(stolenId)).to.be.revertedWith(
				'CallerNotTheLaw()'
			);
		});
		it("surrender() should decrease the thief's wanted level", async function () {
			const sentence = await CriminalRecords.sentence();
			let wantedLevel = await CriminalRecords.getWanted(alice.address);
			await StolenNFT.connect(alice).surrender(stolenId);
			await expect(StolenNFT.ownerOf(stolenId)).to.be.revertedWith(
				`QueryForNonExistentToken(${stolenId})`
			);
			expect(await CriminalRecords.getWanted(alice.address)).to.equal(+wantedLevel - sentence);
		});
		it('transferFrom() should increase the receivers wanted level', async function () {
			const sentence = await CriminalRecords.sentence();
			let aliceWantedLevel = await CriminalRecords.getWanted(alice.address);
			let eveWantedLevel = await CriminalRecords.getWanted(eve.address);
			await StolenNFT.connect(alice).transferFrom(alice.address, eve.address, stolenId);
			expect(await CriminalRecords.getWanted(alice.address)).to.equal(aliceWantedLevel);
			expect(await CriminalRecords.getWanted(eve.address)).to.equal(+eveWantedLevel + sentence);
		});
		it('transferFrom() should not increase the zero-address wanted level on burn', async function () {
			let wantedLevel = await CriminalRecords.getWanted(alice.address);
			for (let i = wantedLevel; i < 50 / 2 + 1; i++) {
				await CriminalRecords.crimeWitnessed(alice.address);
			}

			await CriminalRecords.connect(bob).reportTheft(stolenId);
			expect(await CriminalRecords.getWanted(ethers.constants.AddressZero)).to.equal(0);
		});
		it('transferFrom() should still work but not track crime if CriminalRecords are offline', async function () {
			await StolenNFT.setCriminalRecords(ethers.constants.AddressZero);
			let aliceWantedLevel = await CriminalRecords.getWanted(alice.address);
			let eveWantedLevel = await CriminalRecords.getWanted(eve.address);
			await StolenNFT.connect(alice).transferFrom(alice.address, eve.address, stolenId);
			expect(await CriminalRecords.getWanted(alice.address)).to.equal(aliceWantedLevel);
			expect(await CriminalRecords.getWanted(eve.address)).to.equal(eveWantedLevel);
		});
		it('steal() should still work but not track crimes if CriminalRecords are offline', async function () {
			await StolenNFT.setCriminalRecords(ethers.constants.AddressZero);
			const wantedLevel = await CriminalRecords.getWanted(alice.address);
			await StolenNFT.connect(alice).steal(
				params.chainId,
				MockNFT.address,
				params.mockTokenId,
				ethers.constants.AddressZero,
				params.validRoyalty,
				''
			);
			expect(await StolenNFT.ownerOf(stolenId + 1)).to.equal(alice.address);
			expect(await CriminalRecords.getWanted(alice.address)).to.equal(wantedLevel);
		});
		it('surrender() should still work but not track crime if CriminalRecords are offline', async function () {
			await StolenNFT.setCriminalRecords(ethers.constants.AddressZero);
			let wantedLevel = await CriminalRecords.getWanted(alice.address);
			await StolenNFT.connect(alice).surrender(stolenId);
			await expect(StolenNFT.ownerOf(stolenId)).to.be.revertedWith(
				`QueryForNonExistentToken(${stolenId})`
			);
			expect(await CriminalRecords.getWanted(alice.address)).to.equal(wantedLevel);
		});
		it('retire() should not work if CriminalRecords are offline', async function () {
			await StolenNFT.setCriminalRecords(ethers.constants.AddressZero);
			await expect(StolenNFT.retire(true)).to.be.revertedWith('CriminalRecordsOffline()');
		});
		it('steal() should still work if criminal and CriminalRecords are offline', async function () {
			await StolenNFT.connect(bob).retire(true);
			await StolenNFT.setCriminalRecords(ethers.constants.AddressZero);

			const wantedLevel = await CriminalRecords.getWanted(bob.address);
			await StolenNFT.connect(bob).steal(
				params.chainId,
				MockNFT.address,
				params.mockTokenId,
				ethers.constants.AddressZero,
				params.validRoyalty,
				''
			);
			expect(await StolenNFT.ownerOf(stolenId + 1)).to.equal(bob.address);
			expect(await CriminalRecords.getWanted(bob.address)).to.equal(wantedLevel);
		});
	});

	describe('Misc', function () {
		it('originalOwnerOf() should return the owner of an ERC721 token', async function () {
			expect(await StolenNFT.originalOwnerOf(MockNFT.address, 1)).to.equal(bob.address);
		});
		it('originalOwnerOf() should return address zero if referencing a Non-ERC721 contract or address', async function () {
			expect(await StolenNFT.originalOwnerOf(StakingHideout.address, 1)).to.equal(
				ethers.constants.AddressZero
			);
			expect(await StolenNFT.originalOwnerOf(alice.address, 1)).to.equal(
				ethers.constants.AddressZero
			);
		});
		it('originalTokenURI() should return the original tokenURI of an ERC721 token', async function () {
			expect(await StolenNFT.originalTokenURI(MockNFT.address, 1)).to.equal(
				await MockNFT.tokenURI(1)
			);
		});
		it('originalTokenURI() should return an empty string if referencing a Non-ERC721 contract or address', async function () {
			expect(await StolenNFT.originalTokenURI(StakingHideout.address, 1)).to.equal('');
			expect(await StolenNFT.originalTokenURI(alice.address, 1)).to.equal('');
		});
		it('royaltyInfo() should not return a royalty Value if the holder is address zero', async function () {
			await StolenNFT.connect(alice).steal(
				params.chainId,
				BlackMarket.address,
				params.mockTokenId,
				bob.address,
				params.validRoyalty,
				params.validURI
			);
			const royalty = await StolenNFT.royaltyInfo(stolenId + 1, params.salesPrice);
			expect(royalty[0]).to.equal(ethers.constants.AddressZero);
			expect(royalty[1]).to.equal(0);
		});
		it('royaltyInfo() should not return a royalty Value if the holder is a contract', async function () {
			await MockNFT.connect(bob).transferFrom(bob.address, CriminalRecords.address, 1);

			const royalty = await StolenNFT.royaltyInfo(stolenId, params.salesPrice);
			expect(royalty[0]).to.equal(ethers.constants.AddressZero);
			expect(royalty[1]).to.equal(0);
		});
		it('supportsInterface() should show that the ERC721 Interface is supported', async function () {
			let ERC721Interface = 0x80ac58cd;
			let ERC721MetadataInterface = 0x5b5e139f;
			let ERC721EnumerableInterface = 0x780e9d63;
			let IERC2981Interface = 0x2a55205a;
			expect(await StolenNFT.supportsInterface(ERC721Interface)).to.equal(true);
			expect(await StolenNFT.supportsInterface(ERC721MetadataInterface)).to.equal(true);
			expect(await StolenNFT.supportsInterface(ERC721EnumerableInterface)).to.equal(true);
			expect(await StolenNFT.supportsInterface(IERC2981Interface)).to.equal(true);
		});
	});
});
