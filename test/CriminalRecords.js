const { ethers } = require('hardhat');
const { use, expect } = require('chai');
const { solidity } = require('ethereum-waffle');

const { stolenNftFixture, stealNft } = require('./shared/fixtures.js');
const { signPermit } = require('./shared/helper.js');

use(solidity);

describe('CriminalRecords', function () {
	let owner, alice, bob, eve;
	let BlackMarket, CounterfeitMoney, CriminalRecords, StakingHideout, StolenNFT;
	let MockNFT, stolenId;

	const params = {
		validDeadline: ethers.constants.MaxUint256,
		invalidDeadline: Math.floor(new Date('2000/01/01').getTime() / 1000)
	};

	const wantedParameters = {
		maximumWanted: 50,
		sentence: 2,
		thiefCaughtChance: 50,
		reportDelay: 1,
		reportValidity: 30,
		reward: ethers.utils.parseEther('10'),
		bribePerLevel: ethers.utils.parseEther('10')
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

		await CriminalRecords.setWantedParameters(...Object.values(wantedParameters));
	});

	async function report(
		reporter,
		tokenId,
		sleep = wantedParameters.reportDelay,
		processed = true
	) {
		await CriminalRecords.connect(reporter).reportTheft(tokenId);
		await expectReport(reporter, tokenId, sleep, processed);
	}

	async function expectReport(
		reporter,
		tokenId,
		sleep = wantedParameters.reportDelay,
		processed = true
	) {
		if (sleep) {
			await new Promise((r) => setTimeout(r, (sleep + 1) * 1000));
			await hre.network.provider.request({
				method: 'evm_mine',
				params: []
			});
		}

		let report = await CriminalRecords.getReport(reporter.address);
		let block = await ethers.provider.getBlock('latest');
		let timestamp = block.timestamp;

		expect(report[0].toNumber()).to.equal(tokenId);
		expect(report[1].toNumber()).to.be.lessThanOrEqual(timestamp);
		expect(report[2]).to.equal(processed);
	}

	describe('Constructor', function () {
		it('constructor() should initialize StolenNFT', async function () {
			expect(await CriminalRecords.stolenNFT()).to.equal(StolenNFT.address);
		});
		it('constructor() should initialize CounterfeitMoney', async function () {
			expect(await CriminalRecords.money()).to.equal(CounterfeitMoney.address);
		});
		it('constructor() should initialize StolenNFT as theLaw', async function () {
			expect(await CriminalRecords.theLaw(StolenNFT.address)).to.equal(true);
		});
		it('constructor() should initialize StakingHideout and BlackMarket as aboveTheLaw', async function () {
			expect(await CriminalRecords.aboveTheLaw(StakingHideout.address)).to.equal(true);
			expect(await CriminalRecords.aboveTheLaw(BlackMarket.address)).to.equal(true);
		});
	});

	describe('Owner', function () {
		it('ownerOf() should return deployer as owner', async function () {
			expect(await CriminalRecords.owner()).to.equal(owner.address);
		});
		it('setWantedParameters() should overwrite parameters if owner and emit event', async function () {
			let wantedParams = [
				wantedParameters.maximumWanted - 1,
				wantedParameters.sentence - 1,
				wantedParameters.thiefCaughtChance - 1,
				wantedParameters.reportDelay - 1,
				wantedParameters.reportValidity - 1,
				wantedParameters.reward.sub(1),
				wantedParameters.bribePerLevel.sub(1)
			];
			await expect(CriminalRecords.setWantedParameters(...wantedParams))
				.to.emit(CriminalRecords, 'WantedParamChange')
				.withArgs(...wantedParams);

			expect(await CriminalRecords.maximumWanted()).to.equal(wantedParams[0]);
			expect(await CriminalRecords.sentence()).to.equal(wantedParams[1]);
			expect(await CriminalRecords.thiefCaughtChance()).to.equal(wantedParams[2]);
			expect(await CriminalRecords.reportDelay()).to.equal(wantedParams[3]);
			expect(await CriminalRecords.reportValidity()).to.equal(wantedParams[4]);
			expect(await CriminalRecords.reward()).to.equal(wantedParams[5]);
			expect(await CriminalRecords.bribePerLevel()).to.equal(wantedParams[6]);
		});
		it('setWantedParameters() should not overwrite parameters if not owner', async function () {
			await expect(
				CriminalRecords.connect(eve).setWantedParameters(...Object.values(wantedParameters))
			).to.be.revertedWith('CallerNotTheOwner()');
		});
		it('setAboveTheLaw() should add/remove an address if owner and emit an event', async function () {
			await expect(CriminalRecords.setAboveTheLaw(alice.address, true))
				.to.emit(CriminalRecords, 'Promotion')
				.withArgs(alice.address, true, true);
			expect(await CriminalRecords.aboveTheLaw(alice.address)).to.equal(true);
			await expect(CriminalRecords.setAboveTheLaw(alice.address, false))
				.to.emit(CriminalRecords, 'Promotion')
				.withArgs(alice.address, true, false);
			expect(await CriminalRecords.aboveTheLaw(alice.address)).to.equal(false);
		});
		it('setAboveTheLaw() should revert and not add an address if not owner', async function () {
			await expect(
				CriminalRecords.connect(eve).setAboveTheLaw(eve.address, true)
			).to.be.revertedWith('CallerNotTheOwner()');
			expect(await CriminalRecords.aboveTheLaw(eve.address)).to.equal(false);
		});
		it('setTheLaw() should add/remove an address if owner and emit an event', async function () {
			await expect(CriminalRecords.setTheLaw(alice.address, true))
				.to.emit(CriminalRecords, 'Promotion')
				.withArgs(alice.address, false, true);
			expect(await CriminalRecords.theLaw(alice.address)).to.equal(true);
			await expect(CriminalRecords.setTheLaw(alice.address, false))
				.to.emit(CriminalRecords, 'Promotion')
				.withArgs(alice.address, false, false);
			expect(await CriminalRecords.theLaw(alice.address)).to.equal(false);
		});
		it('setTheLaw() should revert and not add an address if not owner', async function () {
			await expect(CriminalRecords.connect(eve).setTheLaw(eve.address, true)).to.be.revertedWith(
				'CallerNotTheOwner()'
			);
			expect(await CriminalRecords.theLaw(eve.address)).to.equal(false);
		});
	});

	describe('Wanted Tracking', function () {
		it('crimeWitnessed() should increase wanted by sentence if the Law and emit an event', async function () {
			const wantedLevel = await CriminalRecords.getWanted(alice.address);
			const newWantedLevel = +wantedLevel + wantedParameters.sentence;

			await expect(CriminalRecords.crimeWitnessed(alice.address))
				.to.emit(CriminalRecords, 'Wanted')
				.withArgs(alice.address, newWantedLevel);
			expect(await CriminalRecords.getWanted(alice.address)).to.equal(newWantedLevel);
		});
		it('crimeWitnessed() should revert and not increase wanted by sentence if not the Law', async function () {
			const wantedLevel = await CriminalRecords.getWanted(eve.address);
			await expect(CriminalRecords.connect(eve).crimeWitnessed(eve.address)).to.be.revertedWith(
				'NotTheLaw()'
			);

			expect(await CriminalRecords.connect(eve).getWanted(eve.address)).to.equal(wantedLevel);
		});
		it('crimeWitnessed() should not increase wanted if tracking address that is above the law', async function () {
			expect(await CriminalRecords.getWanted(StakingHideout.address)).to.equal(0);
			await CriminalRecords.crimeWitnessed(StakingHideout.address);
			expect(await CriminalRecords.getWanted(StakingHideout.address)).to.equal(0);
		});
		it('crimeWitnessed() should not increase wanted if caller is above the law', async function () {
			await CriminalRecords.setAboveTheLaw(owner.address, true);

			expect(await CriminalRecords.getWanted(bob.address)).to.equal(0);
			await CriminalRecords.crimeWitnessed(bob.address);
			expect(await CriminalRecords.getWanted(bob.address)).to.equal(0);
		});
		it('surrender() should decrease wanted by sentence if the Law and emit an event', async function () {
			await CriminalRecords.crimeWitnessed(alice.address);
			const wantedLevel = await CriminalRecords.getWanted(alice.address);
			const newWantedLevel = +wantedLevel - wantedParameters.sentence;

			await expect(CriminalRecords.surrender(alice.address))
				.to.emit(CriminalRecords, 'Wanted')
				.withArgs(alice.address, newWantedLevel);
			expect(await CriminalRecords.getWanted(alice.address)).to.equal(newWantedLevel);

			expect(await CriminalRecords.getWanted(alice.address)).to.equal(newWantedLevel);
		});
		it('surrender() should revert and not decrease wanted by sentence if not the Law', async function () {
			await CriminalRecords.crimeWitnessed(eve.address);
			const wantedLevel = await CriminalRecords.getWanted(eve.address);

			await expect(CriminalRecords.connect(eve).surrender(eve.address)).to.be.revertedWith(
				'NotTheLaw()'
			);

			expect(await CriminalRecords.getWanted(eve.address)).to.equal(wantedLevel);
		});
		it('surrender() should not increase wanted if tracking address that is above the law', async function () {
			expect(await CriminalRecords.getWanted(StakingHideout.address)).to.equal(0);
			await CriminalRecords.surrender(StakingHideout.address);
			expect(await CriminalRecords.getWanted(StakingHideout.address)).to.equal(0);
		});
		it('surrender() should not increase wanted if caller is above the law', async function () {
			await CriminalRecords.setAboveTheLaw(owner.address, true);

			expect(await CriminalRecords.getWanted(bob.address)).to.equal(0);
			await CriminalRecords.surrender(bob.address);
			expect(await CriminalRecords.getWanted(bob.address)).to.equal(0);
		});
		it('surrender() should reset wanted level if wanted level is higher than maximum', async function () {
			let wantedParams = [
				100,
				100,
				wantedParameters.thiefCaughtChance,
				wantedParameters.reportDelay,
				wantedParameters.reportValidity,
				wantedParameters.reward,
				wantedParameters.bribePerLevel
			];
			await CriminalRecords.setWantedParameters(...wantedParams);

			// Increase wanted to 100
			await CriminalRecords.crimeWitnessed(bob.address);

			expect(await CriminalRecords.getWanted(bob.address)).to.equal(100);

			// Reset max wanted to 50
			wantedParams = [
				wantedParameters.maximumWanted,
				wantedParameters.sentence,
				wantedParameters.thiefCaughtChance,
				wantedParameters.reportDelay,
				wantedParameters.reportValidity,
				wantedParameters.reward,
				wantedParameters.bribePerLevel
			];
			await CriminalRecords.setWantedParameters(...wantedParams);

			// Should be 48
			await CriminalRecords.surrender(bob.address);

			expect(await CriminalRecords.getWanted(bob.address)).to.equal(
				wantedParameters.maximumWanted - wantedParameters.sentence
			);
		});
		it('surrender() should set wanted level to maximum on overflow', async function () {
			let wantedParams = [
				255,
				254,
				wantedParameters.thiefCaughtChance,
				wantedParameters.reportDelay,
				wantedParameters.reportValidity,
				wantedParameters.reward,
				wantedParameters.bribePerLevel
			];
			await CriminalRecords.setWantedParameters(...wantedParams);

			// Increase wanted to 254
			await CriminalRecords.crimeWitnessed(bob.address);

			expect(await CriminalRecords.getWanted(bob.address)).to.equal(254);

			// Reset max wanted to 50
			wantedParams = [
				255,
				2,
				wantedParameters.thiefCaughtChance,
				wantedParameters.reportDelay,
				wantedParameters.reportValidity,
				wantedParameters.reward,
				wantedParameters.bribePerLevel
			];
			await CriminalRecords.setWantedParameters(...wantedParams);

			// Should be 255
			await CriminalRecords.crimeWitnessed(bob.address);

			expect(await CriminalRecords.getWanted(bob.address)).to.equal(255);
		});
		it('exchangeWitnessed() should increase wanted by sentence if the Law', async function () {
			await CriminalRecords.crimeWitnessed(alice.address);
			const wantedLevel = await CriminalRecords.getWanted(bob.address);

			await CriminalRecords.exchangeWitnessed(alice.address, bob.address);
			expect(await CriminalRecords.getWanted(bob.address)).to.equal(
				+wantedLevel + wantedParameters.sentence
			);
		});
		it('exchangeWitnessed() should revert and not increase wanted by sentence if not the Law', async function () {
			await CriminalRecords.crimeWitnessed(eve.address);
			const wantedLevel = await CriminalRecords.getWanted(bob.address);

			await expect(
				CriminalRecords.connect(eve).exchangeWitnessed(eve.address, bob.address)
			).to.be.revertedWith('NotTheLaw()');

			expect(await CriminalRecords.getWanted(bob.address)).to.equal(wantedLevel);
		});
		it('exchangeWitnessed() should not increase wanted if exchange was mint/burn', async function () {
			// owner is above the law / our placeholder for the test
			await CriminalRecords.setAboveTheLaw(owner.address, true);
			await CriminalRecords.crimeWitnessed(owner.address);
			expect(await CriminalRecords.getWanted(owner.address)).to.equal(0);
			const wantedLevel = await CriminalRecords.getWanted(bob.address);

			await CriminalRecords.exchangeWitnessed(owner.address, bob.address);
			expect(await CriminalRecords.getWanted(bob.address)).to.equal(wantedLevel);

			await CriminalRecords.exchangeWitnessed(bob.address, owner.address);
			expect(await CriminalRecords.getWanted(bob.address)).to.equal(wantedLevel);
			await CriminalRecords.setAboveTheLaw(owner.address, false);
		});
	});

	describe('Bribe', function () {
		it('bribeCheque() should decrease wanted by permitted amount', async function () {
			await CriminalRecords.crimeWitnessed(alice.address);
			const wantedLevel = await CriminalRecords.getWanted(alice.address);
			const bribeAmount = wantedParameters.bribePerLevel.mul(wantedLevel);

			await CounterfeitMoney.print(alice.address, bribeAmount);

			const permit = await signPermit(
				CounterfeitMoney,
				alice,
				CriminalRecords.address,
				bribeAmount,
				wantedParameters.validDeadline
			);

			await CriminalRecords.connect(alice).bribeCheque(
				alice.address,
				bribeAmount,
				params.validDeadline,
				permit.v,
				permit.r,
				permit.s
			);

			expect(await CriminalRecords.getWanted(alice.address)).to.equal(0);
			expect(await CounterfeitMoney.balanceOf(alice.address)).to.equal(0);
		});
		it('bribeCheque() should revert and not decrease wanted if permit for amount is invalid', async function () {
			await CriminalRecords.crimeWitnessed(alice.address);
			const wantedLevel = await CriminalRecords.getWanted(alice.address);
			const bribeAmount = wantedParameters.bribePerLevel.mul(wantedLevel);

			await CounterfeitMoney.print(alice.address, bribeAmount);

			const permit = await signPermit(
				CounterfeitMoney,
				bob,
				CriminalRecords.address,
				bribeAmount,
				params.validDeadline
			);

			await expect(
				CriminalRecords.connect(alice).bribeCheque(
					alice.address,
					bribeAmount,
					params.validDeadline,
					permit.v,
					permit.r,
					permit.s
				)
			).to.be.revertedWith('InvalidSignature()');

			expect(await CriminalRecords.getWanted(alice.address)).to.equal(wantedLevel);
			expect(await CounterfeitMoney.balanceOf(alice.address)).to.equal(bribeAmount);
		});
		it('bribe() should decrease wanted by approved amount', async function () {
			await CriminalRecords.crimeWitnessed(alice.address);
			const wantedLevel = await CriminalRecords.getWanted(alice.address);
			const bribeAmount = wantedParameters.bribePerLevel.mul(wantedLevel);

			await CounterfeitMoney.print(alice.address, bribeAmount);
			await CounterfeitMoney.connect(alice).approve(CriminalRecords.address, bribeAmount);

			await CriminalRecords.connect(alice).bribe(alice.address, bribeAmount);

			expect(await CriminalRecords.getWanted(alice.address)).to.equal(0);
			expect(await CounterfeitMoney.balanceOf(alice.address)).to.equal(0);
		});
		it('bribe() should decrease wanted and return rest if too much is payed', async function () {
			await CriminalRecords.crimeWitnessed(alice.address);
			const wantedLevel = await CriminalRecords.getWanted(alice.address);
			const bribeAmount = wantedParameters.bribePerLevel.mul(wantedLevel);

			await CounterfeitMoney.print(alice.address, bribeAmount.mul(2));
			await CounterfeitMoney.connect(alice).approve(CriminalRecords.address, bribeAmount.mul(2));

			await CriminalRecords.connect(alice).bribe(alice.address, bribeAmount.mul(2));

			expect(await CriminalRecords.getWanted(alice.address)).to.equal(0);
			expect(await CounterfeitMoney.balanceOf(alice.address)).to.equal(bribeAmount);
		});
		it('bribe() should revert if too little is payed', async function () {
			await CriminalRecords.crimeWitnessed(alice.address);

			const wantedLevel = await CriminalRecords.getWanted(alice.address);
			const bribeAmount = wantedParameters.bribePerLevel.sub(1);

			await CounterfeitMoney.print(alice.address, bribeAmount);
			await CounterfeitMoney.connect(alice).approve(CriminalRecords.address, bribeAmount);

			await expect(
				CriminalRecords.connect(alice).bribe(alice.address, bribeAmount)
			).to.be.revertedWith('BribeIsNotEnough()');

			expect(await CriminalRecords.getWanted(alice.address)).to.equal(wantedLevel);
			expect(await CounterfeitMoney.balanceOf(alice.address)).to.equal(bribeAmount);
		});
		it('bribe() should revert if amount does not match approved allowance', async function () {
			await CriminalRecords.crimeWitnessed(alice.address);
			const wantedLevel = await CriminalRecords.getWanted(alice.address);
			const bribeAmount = wantedParameters.bribePerLevel.mul(wantedLevel);

			await CounterfeitMoney.print(alice.address, bribeAmount);
			await CounterfeitMoney.connect(alice).approve(CriminalRecords.address, bribeAmount.sub(1));

			await expect(
				CriminalRecords.connect(alice).bribe(alice.address, bribeAmount)
			).to.be.revertedWith('InsufficientAllowance()');

			expect(await CriminalRecords.getWanted(alice.address)).to.equal(wantedLevel);
			expect(await CounterfeitMoney.balanceOf(alice.address)).to.equal(bribeAmount);
		});
		it('bribe() should revert if msg.sender is not wanted', async function () {
			const bribeAmount = wantedParameters.bribePerLevel;

			expect(await CriminalRecords.getWanted(bob.address)).to.equal(0);
			await CounterfeitMoney.print(bob.address, bribeAmount);
			await CounterfeitMoney.connect(bob).approve(CriminalRecords.address, bribeAmount);

			await expect(
				CriminalRecords.connect(bob).bribe(bob.address, bribeAmount)
			).to.be.revertedWith('SuspectNotWanted()');

			expect(await CriminalRecords.getWanted(bob.address)).to.equal(0);
			expect(await CounterfeitMoney.balanceOf(bob.address)).to.equal(bribeAmount);
		});
	});

	describe('Report Theft', function () {
		it('reportTheft() should work with a stolen NFT and emit an event', async function () {
			await expect(CriminalRecords.connect(bob).reportTheft(stolenId))
				.to.emit(CriminalRecords, 'Reported')
				.withArgs(bob.address, alice.address, stolenId);

			await expectReport(bob, stolenId);
		});
		it('reportTheft() should revert if the NFT is not stolen', async function () {
			await expect(CriminalRecords.connect(bob).reportTheft(stolenId + 2)).to.be.revertedWith(
				`QueryForNonExistentToken(${stolenId + 2})`
			);
		});
		it('reportTheft() should revert if thief is reporting own theft', async function () {
			await expect(CriminalRecords.connect(alice).reportTheft(stolenId)).to.be.revertedWith(
				'SurrenderInstead()'
			);
		});
		it('reportTheft() should revert if the NFT is stashed or listed', async function () {
			await StolenNFT.connect(alice).approve(BlackMarket.address, stolenId);
			await BlackMarket.connect(alice).listNft(stolenId, 0);

			await expect(CriminalRecords.connect(bob).reportTheft(stolenId)).to.be.revertedWith(
				'ThiefIsHiding()'
			);
		});
		it('reportTheft() should revert if the thief is not wanted', async function () {
			// Directly decrease as the owner is also the law for the test
			await CriminalRecords.surrender(alice.address);

			await expect(CriminalRecords.connect(bob).reportTheft(stolenId)).to.be.revertedWith(
				'SuspectNotWanted()'
			);
		});
		it('reportTheft() should revert if already reported by user within validity', async function () {
			await CriminalRecords.connect(bob).reportTheft(stolenId);

			await expectReport(bob, stolenId);

			await expect(CriminalRecords.connect(bob).reportTheft(stolenId)).to.be.revertedWith(
				'ReportAlreadyFiled()'
			);
		});
		it('reportTheft() should allow to overwrite an expired report for the same theft', async function () {
			let wantedParams = { ...wantedParameters };
			wantedParams.reportDelay = 1;
			wantedParams.reportValidity = 2;
			await CriminalRecords.setWantedParameters(...Object.values(wantedParams));

			await CriminalRecords.connect(bob).reportTheft(stolenId);
			await expectReport(bob, stolenId, wantedParams.reportValidity, false);

			await CriminalRecords.connect(bob).reportTheft(stolenId);
		});
		it('reportTheft() should allow to overwrite an report by reporting another theft', async function () {
			await CriminalRecords.connect(bob).reportTheft(stolenId);
			await expectReport(bob, stolenId, 0, false);

			stolenId = await stealNft(StolenNFT, MockNFT, alice, 2);
			await CriminalRecords.connect(bob).reportTheft(stolenId);
			await expectReport(bob, stolenId, 0, false);
		});
		it('getReport() should return a valid reports information', async function () {
			await CriminalRecords.connect(bob).reportTheft(stolenId);
			await expectReport(bob, stolenId, 0, false);
		});
		it('getReport() should return not processed if reportDelay has not passed', async function () {
			await CriminalRecords.connect(bob).reportTheft(stolenId);
			await expectReport(bob, stolenId, 0, false);
		});
		it('getReport() should return processed if reportDelay has passed', async function () {
			let wantedParams = { ...wantedParameters };
			wantedParams.reportDelay = 1;
			await CriminalRecords.setWantedParameters(...Object.values(wantedParams));

			await CriminalRecords.connect(bob).reportTheft(stolenId);
			await expectReport(bob, stolenId, wantedParams.reportDelay, true);
		});
		it('getReport() should return not processed if reportValidity has passed', async function () {
			let wantedParams = { ...wantedParameters };
			wantedParams.reportDelay = 1;
			wantedParams.reportValidity = 2;
			await CriminalRecords.setWantedParameters(...Object.values(wantedParams));

			await CriminalRecords.connect(bob).reportTheft(stolenId);
			await expectReport(bob, stolenId, wantedParams.reportValidity, false);
		});
		it('getReport() should revert if no report has been made', async function () {
			await expect(CriminalRecords.getReport(bob.address)).to.be.revertedWith('CaseNotFound()');
		});
	});

	describe('Arrest', function () {
		it('arrest() should sometimes work when reported', async function () {
			const wantedLevel = await CriminalRecords.getWanted(alice.address);
			const balance = await CounterfeitMoney.balanceOf(bob.address);
			let success;

			await report(bob, stolenId);
			await CriminalRecords.connect(bob).arrest();

			try {
				await StolenNFT.ownerOf(stolenId);
				success = false;
			} catch (e) {
				success = true;
			}
			console.log((success ? 'Successful' : 'Unsuccessful') + ' report');

			if (success) {
				expect(await CounterfeitMoney.balanceOf(bob.address)).to.equal(
					wantedParameters.reward.mul(wantedLevel)
				);
				expect(await CriminalRecords.getWanted(alice.address)).to.equal(
					+wantedLevel + wantedParameters.sentence
				);
			} else {
				expect(await CounterfeitMoney.balanceOf(bob.address)).to.equal(balance);
				expect(await CriminalRecords.getWanted(alice.address)).to.equal(wantedLevel);
			}
		});
		it('arrest() should always work if the wanted level is >= 50 and emit an event', async function () {
			let wantedLevel = await CriminalRecords.getWanted(alice.address);
			for (
				let i = wantedLevel;
				i < wantedParameters.maximumWanted / wantedParameters.sentence + 1;
				i++
			) {
				await CriminalRecords.crimeWitnessed(alice.address);
			}
			wantedLevel = await CriminalRecords.getWanted(alice.address);

			const reward = wantedParameters.reward.mul(wantedLevel);

			await report(bob, stolenId);
			await expect(CriminalRecords.connect(bob).arrest())
				.to.emit(CriminalRecords, 'Arrested')
				.withArgs(bob.address, alice.address, stolenId);

			expect(await CounterfeitMoney.balanceOf(bob.address)).to.equal(reward);
			expect(await CriminalRecords.getWanted(alice.address)).to.equal(
				wantedParameters.maximumWanted
			);
		});
		it('arrest() should always work if the chance is 100 percent and emit an event', async function () {
			let wantedParams = { ...wantedParameters };
			wantedParams.thiefCaughtChance = 100;
			await CriminalRecords.setWantedParameters(...Object.values(wantedParams));
			let wantedLevel = await CriminalRecords.getWanted(alice.address);

			const reward = wantedParams.reward.mul(wantedLevel);

			await report(bob, stolenId);
			await expect(CriminalRecords.connect(bob).arrest())
				.to.emit(CriminalRecords, 'Arrested')
				.withArgs(bob.address, alice.address, stolenId);

			expect(await CounterfeitMoney.balanceOf(bob.address)).to.equal(reward);
			expect(await CriminalRecords.getWanted(alice.address)).to.equal(
				+wantedLevel + wantedParams.sentence
			);
		});
		it('arrest() should not work most of the time if the chance is 0 percent and not emit an event', async function () {
			let wantedParams = { ...wantedParameters };
			wantedParams.thiefCaughtChance = 0;
			await CriminalRecords.setWantedParameters(...Object.values(wantedParams));

			const wantedLevel = await CriminalRecords.getWanted(alice.address);
			const balance = await CounterfeitMoney.balanceOf(bob.address);

			await report(bob, stolenId);

			try {
				await expect(CriminalRecords.connect(bob).arrest())
					.to.not.emit(CriminalRecords, 'Arrested')
					.withArgs(bob.address, alice.address, stolenId);
			} catch (e) {
				console.log('Skipped because Alices wanted level was', wantedLevel.toNumber());
				return;
			}

			expect(await CounterfeitMoney.balanceOf(bob.address)).to.equal(balance);
			expect(await CriminalRecords.getWanted(alice.address)).to.equal(wantedLevel);
		});
		it('arrest() should be unsuccessful if the reported NFT is stashed or listed', async function () {
			await report(bob, stolenId);

			await StolenNFT.connect(alice).approve(BlackMarket.address, stolenId);
			await BlackMarket.connect(alice).listNft(stolenId, 0);

			await CriminalRecords.connect(bob).arrest();

			expect(await StolenNFT.ownerOf(stolenId)).to.eq(BlackMarket.address);
		});
		it('arrest() should be unsuccessful if the thief is no longer wanted', async function () {
			await report(bob, stolenId);
			// Decrease Alice's wanted level she got by stealing the NFT in the fixture
			await CriminalRecords.surrender(alice.address);

			await CriminalRecords.connect(bob).arrest();

			expect(await StolenNFT.ownerOf(stolenId)).to.eq(alice.address);
		});
		it('arrest() should revert if the reported NFT is not stolen', async function () {
			await report(bob, stolenId);
			await StolenNFT.connect(alice).surrender(stolenId);
			await expect(CriminalRecords.connect(bob).arrest()).to.be.revertedWith(
				`QueryForNonExistentToken(${stolenId})`
			);
		});
		it('arrest() should revert if no report was made', async function () {
			await expect(CriminalRecords.connect(bob).arrest()).to.be.revertedWith('TheftNotReported()');
		});
		it('arrest() should revert if somebody else made the report', async function () {
			await report(bob, stolenId);
			await expect(CriminalRecords.connect(eve).arrest()).to.be.revertedWith('TheftNotReported()');
		});
		it('arrest() should revert if somebody else arrested more quickly', async function () {
			let wantedParams = { ...wantedParameters };
			wantedParams.thiefCaughtChance = 100;
			await CriminalRecords.setWantedParameters(...Object.values(wantedParams));

			const wantedLevel = await CriminalRecords.getWanted(alice.address);
			const balance = await CounterfeitMoney.balanceOf(bob.address);

			await report(bob, stolenId);
			await report(eve, stolenId);

			await expect(CriminalRecords.connect(eve).arrest())
				.to.emit(CriminalRecords, 'Arrested')
				.withArgs(eve.address, alice.address, stolenId);

			await expect(CriminalRecords.connect(bob).arrest()).to.be.revertedWith(
				`QueryForNonExistentToken(${stolenId})`
			);

			expect(await CounterfeitMoney.balanceOf(eve.address)).to.equal(
				wantedParameters.reward.mul(wantedLevel)
			);
			expect(await CounterfeitMoney.balanceOf(bob.address)).to.equal(balance);
		});
		it('arrest() should revert if the report is still processing', async function () {
			let wantedParams = { ...wantedParameters };
			wantedParams.thiefCaughtChance = 100;
			wantedParams.reportDelay = 30;
			await CriminalRecords.setWantedParameters(...Object.values(wantedParams));

			await report(bob, stolenId, 0, false);
			await expect(CriminalRecords.connect(bob).arrest()).to.be.revertedWith('ProcessingReport()');
		});
		it('arrest() should revert if the report is no longer valid', async function () {
			let wantedParams = { ...wantedParameters };
			wantedParams.thiefCaughtChance = 100;
			wantedParams.reportValidity = 2;
			await CriminalRecords.setWantedParameters(...Object.values(wantedParams));

			await report(bob, stolenId, wantedParams.reportValidity, false);
			await expect(CriminalRecords.connect(bob).arrest()).to.be.revertedWith('ThiefGotAway()');
		});
		it('arrest() should work if stolen NFT was transferred after report', async function () {
			let wantedParams = { ...wantedParameters };
			wantedParams.thiefCaughtChance = 100;
			await CriminalRecords.setWantedParameters(...Object.values(wantedParams));

			await report(bob, stolenId);
			await StolenNFT.connect(alice).transferFrom(alice.address, eve.address, stolenId);

			await expect(CriminalRecords.connect(bob).arrest())
				.to.emit(CriminalRecords, 'Arrested')
				.withArgs(bob.address, eve.address, stolenId);
		});
		it('arrest() should revert if arrest was already made', async function () {
			let wantedParams = { ...wantedParameters };
			wantedParams.thiefCaughtChance = 100;
			await CriminalRecords.setWantedParameters(...Object.values(wantedParams));

			await report(bob, stolenId);
			await CriminalRecords.connect(bob).arrest();

			await expect(CriminalRecords.connect(bob).arrest()).to.be.revertedWith('TheftNotReported()');
		});
		it('getReport() should revert after arrest was triggered', async function () {
			let wantedParams = { ...wantedParameters };
			wantedParams.thiefCaughtChance = 100;
			await CriminalRecords.setWantedParameters(...Object.values(wantedParams));

			await report(bob, stolenId);
			await CriminalRecords.connect(bob).arrest();

			await expect(CriminalRecords.getReport(bob.address)).to.be.revertedWith('CaseNotFound()');
		});
	});
});
