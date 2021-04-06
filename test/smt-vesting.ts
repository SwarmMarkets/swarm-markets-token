import { ethers } from 'hardhat';
import { Signer } from 'ethers';
import { expect } from 'chai';

// import { createObjectCsvWriter } from 'csv-writer';
import csv from 'csv-parser';
import fsExtra from 'fs-extra';
import path from 'path';

import { SmtVestingWithSetters, SwarmMarketsToken } from '../typechain';

import Reverter from './utils/reverter';
import Time from './utils/time';

let deployer: Signer;
let kakaroto: Signer;

let deployerAddress: string;
let kakarotoAddress: string;

let smtVesting: SmtVestingWithSetters;
let smtVestingKakaroto: SmtVestingWithSetters;
let smt: SwarmMarketsToken;

const getData = (): Promise<any> => {
  const results: any[] = [];
  const myPromise = new Promise(resolve => {
    fsExtra
      .createReadStream(path.join(`data/vesting-schedule.csv`))
      .pipe(csv())
      .on('data', data => results.push(data))
      .on('end', () => {
        resolve(results);
      });
  });
  return myPromise;
};

let initialBlock: any;

describe('SmtVesting contract', function () {
  const reverter = new Reverter();
  const time = new Time();

  before(async () => {
    [deployer, kakaroto] = await ethers.getSigners();
    [deployerAddress, kakarotoAddress] = await Promise.all([deployer.getAddress(), kakaroto.getAddress()]);

    const SmtVestingFactory = await ethers.getContractFactory('SmtVestingWithSetters');

    smtVesting = (await SmtVestingFactory.deploy()) as SmtVestingWithSetters;
    await smtVesting.deployed();

    initialBlock = (await smtVesting.initialBlock()).toNumber();

    smtVestingKakaroto = smtVesting.connect(kakaroto);

    const SwarmMarketsTokenFactory = await ethers.getContractFactory('SwarmMarketsToken');

    smt = (await SwarmMarketsTokenFactory.deploy(smtVesting.address)) as SwarmMarketsToken;
    await smt.deployed();

    await reverter.snapshot();
  });

  describe('setToken', () => {
    it('non owner should not be able to set token', async () => {
      await expect(smtVestingKakaroto.setToken(smt.address)).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('owner should not be able to set token as zero address', async () => {
      await expect(smtVesting.setToken(ethers.constants.AddressZero)).to.be.revertedWith('token is the zero address');
    });

    it('owner should be able to set token', async () => {
      await smtVesting.setToken(smt.address);
      expect(await smtVesting.token()).to.eq(smt.address);
    });

    it('owner should not be able to set token twice', async () => {
      await expect(smtVesting.setToken(kakarotoAddress)).to.be.revertedWith('token is already set');
    });
  });

  describe('vesting', async () => {
    let data: any[];

    before(async () => {
      data = await getData();
    });

    describe('accumulateAnualComBatch', async () => {
      it('should get the right value year after year ', async () => {
        for (let i = 0; i < data.length; i++) {
          const row = data[i];

          const isFirstYCBClaimed = i === 0 ? false : true;
          const blockNumber = initialBlock + 2102400 * i;
          const lastClaimedBlock = initialBlock + 2102399 * i;

          const accumulateAnualComBatch = await smtVesting.accumulateAnualComBatch(
            isFirstYCBClaimed,
            blockNumber,
            lastClaimedBlock,
          );

          expect(ethers.utils.formatUnits(accumulateAnualComBatch)).to.eq(row['AnualCommunityBatch']);
        }
      });

      it('should get the 0 when called for a year already claimed', async () => {
        for (let i = 0; i < data.length; i++) {
          const isFirstYCBClaimed = true;
          const blockNumber = 40320 + 2102400 * i;
          const lastClaimedBlock = 40319 + 2102400 * i;

          const accumulateAnualComBatch = await smtVesting.accumulateAnualComBatch(
            isFirstYCBClaimed,
            blockNumber,
            lastClaimedBlock,
          );

          expect(accumulateAnualComBatch).to.eq(0);
        }
      });

      it('should accumulate skiped years', async () => {
        let acc = ethers.utils.parseEther(data[1]['AnualCommunityBatch']);
        acc = acc.add(ethers.utils.parseEther(data[2]['AnualCommunityBatch']));
        acc = acc.add(ethers.utils.parseEther(data[3]['AnualCommunityBatch']));
        acc = acc.add(ethers.utils.parseEther(data[4]['AnualCommunityBatch']));
        acc = acc.add(ethers.utils.parseEther(data[5]['AnualCommunityBatch']));
        acc = acc.add(ethers.utils.parseEther(data[6]['AnualCommunityBatch']));
        acc = acc.add(ethers.utils.parseEther(data[7]['AnualCommunityBatch']));
        acc = acc.add(ethers.utils.parseEther(data[8]['AnualCommunityBatch']));

        const accumulateAnualComBatch = await smtVesting.accumulateAnualComBatch(
          true,
          2102400 * 8 + initialBlock,
          initialBlock,
        );

        expect(accumulateAnualComBatch).to.eq(acc);
      });
    });

    describe('accumulateCurrentYear', async () => {
      it('should get the right value week after week ', async () => {
        for (let y = 0; y < 5; y++) {
          const row = data[y];

          for (let w = 1; w < 53; w++) {
            const blockNumber = initialBlock + 2102400 * y + 40320 * w;
            const lastClaimedBlock = blockNumber - 40320;

            const accumulateCurrentYear = await smtVesting.accumulateCurrentYear(blockNumber, lastClaimedBlock);
            expect(ethers.utils.formatUnits(accumulateCurrentYear)).to.eq(row[`W${w}`]);
          }
        }
      });

      it('should get the right value week after week in the half of the week', async () => {
        for (let y = 0; y < 5; y++) {
          const row = data[y];

          for (let w = 1; w < 53; w++) {
            const blockNumber = initialBlock + 2102400 * y + 40320 * w - 20160;
            const lastClaimedBlock = y === 0 && w === 1 ? initialBlock : blockNumber - 40320;

            const accumulateCurrentYear = await smtVesting.accumulateCurrentYear(blockNumber, lastClaimedBlock);
            let expected = ethers.utils.parseEther(row[`W${w}`]).mul(20160).div(40320);

            expected =
              w === 1
                ? expected
                : expected.add(
                    ethers.utils
                      .parseEther(row[`W${w - 1}`])
                      .mul(20160)
                      .div(40320),
                  );

            expect(accumulateCurrentYear).to.eq(expected);
          }
        }
      });
    });

    describe('accumulateFromPastYears', async () => {
      it('should get the right value accumulating from a past year', async () => {
        const blockNumber = initialBlock + 2102400 + 40320 * 2; //(Y2 W3)
        const lastClaimedBlock = initialBlock + 40320 * 2; // Y1 W2
        const accumulateFromPastYears = await smtVesting.accumulateFromPastYears(blockNumber, lastClaimedBlock);

        let acc = ethers.utils.parseEther(data[0]['W3']);
        for (let w = 4; w < 53; w++) {
          acc = acc.add(ethers.utils.parseEther(data[0][`W${w}`]));
        }
        acc = acc.add(ethers.utils.parseEther(data[1]['W1']));
        acc = acc.add(ethers.utils.parseEther(data[1]['W2']));

        expect(accumulateFromPastYears).to.eq(acc);
      });

      it('should get the right value accumulating from a past year half of week', async () => {
        const blockNumber = initialBlock + 2102400 + 40320 * 2 + 20160; //(Y2 W3)
        const lastClaimedBlock = initialBlock + 40320 * 2 + 20160; // Y1 W2
        const accumulateFromPastYears = await smtVesting.accumulateFromPastYears(blockNumber, lastClaimedBlock);

        let acc = ethers.utils.parseEther(data[0]['W3']).mul(20160).div(40320);
        for (let w = 4; w < 53; w++) {
          acc = acc.add(ethers.utils.parseEther(data[0][`W${w}`]));
        }
        acc = acc.add(ethers.utils.parseEther(data[1]['W1']));
        acc = acc.add(ethers.utils.parseEther(data[1]['W2']));
        acc = acc.add(ethers.utils.parseEther(data[1]['W3']).mul(20160).div(40320));

        expect(accumulateFromPastYears).to.eq(acc);
      });
    });

    describe('claimableAmount', async () => {
      it('should get the right value week after week ', async () => {
        let lastClaimedBlock = initialBlock;
        let firstYCBClaimed = false;
        for (let y = 0; y < 5; y++) {
          const row = data[y];

          for (let w = 0; w < 52; w++) {
            const blockNumber = initialBlock + 2102400 * y + 40320 * w;

            const accumulateCurrentYear = await smtVesting['claimableAmount(bool,uint256,uint256)'](
              firstYCBClaimed,
              blockNumber,
              lastClaimedBlock,
            );

            let amount = ethers.BigNumber.from(0);
            if (w === 0) {
              amount = amount.add(ethers.utils.parseEther(row['AnualCommunityBatch']));
              if (y !== 0) {
                amount = amount.add(ethers.utils.parseEther(data[y - 1]['W52']));
              }
            } else {
              amount = ethers.utils.parseEther(row[`W${w}`]);
            }

            expect(accumulateCurrentYear).to.eq(amount);

            // this imitates what a claim would do
            firstYCBClaimed = true;
            lastClaimedBlock = blockNumber;
          }
        }
      });

      it('should get the right value with some weeks in between claim', async () => {
        let lastClaimedBlock = initialBlock;
        let firstYCBClaimed = false;
        for (let y = 0; y < 10; y++) {
          const row = data[y];
          for (let w = 0; w < 52; w += 4) {
            const blockNumber = initialBlock + 2102400 * y + 40320 * w;

            const accumulateCurrentYear = await smtVesting['claimableAmount(bool,uint256,uint256)'](
              firstYCBClaimed,
              blockNumber,
              lastClaimedBlock,
            );

            let amount = ethers.BigNumber.from(0);
            if (w === 0) {
              amount = amount.add(ethers.utils.parseEther(row['AnualCommunityBatch']));
              if (y !== 0) {
                amount = amount.add(ethers.utils.parseEther(data[y - 1]['W49']));
                amount = amount.add(ethers.utils.parseEther(data[y - 1]['W50']));
                amount = amount.add(ethers.utils.parseEther(data[y - 1]['W51']));
                amount = amount.add(ethers.utils.parseEther(data[y - 1]['W52']));
              }
            } else {
              amount = ethers.utils.parseEther(row[`W${w}`]);
              amount = amount.add(ethers.utils.parseEther(row[`W${w - 1}`]));
              amount = amount.add(ethers.utils.parseEther(row[`W${w - 2}`]));
              amount = amount.add(ethers.utils.parseEther(row[`W${w - 3}`]));
            }

            expect(accumulateCurrentYear).to.eq(amount);

            // this imitates what a claim would do
            firstYCBClaimed = true;
            lastClaimedBlock = blockNumber;
          }
        }
      });
    });

    describe('claim', () => {
      before(async () => {
        await reverter.revert();

        await smtVesting.setToken(smt.address);

        await reverter.snapshot();
      });

      beforeEach(async () => {
        await reverter.revert();
      });

      it('should get the right value week after week ', async () => {
        for (let y = 0; y < 5; y++) {
          const row = data[y];

          for (let w = 0; w < 52; w++) {
            const blockNumber = initialBlock + 2102400 * y + 40320 * w;

            const initialVetingBalance = await smt.balanceOf(smtVesting.address);
            const initialOwnerBalance = await smt.balanceOf(deployerAddress);

            await smtVesting['claim(uint256)'](blockNumber);

            let amount = ethers.BigNumber.from(0);
            if (w === 0) {
              amount = amount.add(ethers.utils.parseEther(row['AnualCommunityBatch']));
              if (y !== 0) {
                amount = amount.add(ethers.utils.parseEther(data[y - 1]['W52']));
              }
            } else {
              amount = ethers.utils.parseEther(row[`W${w}`]);
            }

            expect(await smt.balanceOf(smtVesting.address)).to.eq(initialVetingBalance.sub(amount));
            expect(await smt.balanceOf(deployerAddress)).to.eq(initialOwnerBalance.add(amount));

            expect(await smtVesting.lastClaimedBlock()).to.eq(blockNumber);
            expect(await smtVesting.firstYCBClaimed()).to.eq(true);
          }
        }
      });

      it('should get the right value with some weeks in between claim', async () => {
        for (let y = 0; y < 10; y++) {
          const row = data[y];
          for (let w = 0; w < 52; w += 4) {
            const blockNumber = initialBlock + 2102400 * y + 40320 * w;

            const initialVetingBalance = await smt.balanceOf(smtVesting.address);
            const initialOwnerBalance = await smt.balanceOf(deployerAddress);

            await smtVesting['claim(uint256)'](blockNumber);

            let amount = ethers.BigNumber.from(0);
            if (w === 0) {
              amount = amount.add(ethers.utils.parseEther(row['AnualCommunityBatch']));
              if (y !== 0) {
                amount = amount.add(ethers.utils.parseEther(data[y - 1]['W49']));
                amount = amount.add(ethers.utils.parseEther(data[y - 1]['W50']));
                amount = amount.add(ethers.utils.parseEther(data[y - 1]['W51']));
                amount = amount.add(ethers.utils.parseEther(data[y - 1]['W52']));
              }
            } else {
              amount = ethers.utils.parseEther(row[`W${w}`]);
              amount = amount.add(ethers.utils.parseEther(row[`W${w - 1}`]));
              amount = amount.add(ethers.utils.parseEther(row[`W${w - 2}`]));
              amount = amount.add(ethers.utils.parseEther(row[`W${w - 3}`]));
            }

            expect(await smt.balanceOf(smtVesting.address)).to.eq(initialVetingBalance.sub(amount));
            expect(await smt.balanceOf(deployerAddress)).to.eq(initialOwnerBalance.add(amount));

            expect(await smtVesting.lastClaimedBlock()).to.eq(blockNumber);
            expect(await smtVesting.firstYCBClaimed()).to.eq(true);
          }
        }
      });

      it('should claim some amount and transfer to the owner', async () => {
        await time.advanceBlockTo(20160);
        // const claimableAmount = await smtVesting['claimableAmount()']()
        const initialVetingBalance = await smt.balanceOf(smtVesting.address);
        const initialOwnerBalance = await smt.balanceOf(deployerAddress);

        expect(await smtVesting.lastClaimedBlock()).to.eq(initialBlock);
        expect(await smtVesting.firstYCBClaimed()).to.eq(false);

        const receipt = await (await smtVesting['claim()']()).wait();

        const claimEvent = receipt.events?.find((log: any) => log.event && log.event === 'Claim');
        const amount = (claimEvent && claimEvent.args ? claimEvent.args.amount : '') as string;

        expect(await smt.balanceOf(smtVesting.address)).to.eq(initialVetingBalance.sub(amount));
        expect(await smt.balanceOf(deployerAddress)).to.eq(initialOwnerBalance.add(amount));

        expect(await smtVesting.lastClaimedBlock()).to.eq(20161);
        expect(await smtVesting.firstYCBClaimed()).to.eq(true);
      });
    });
  });

  // DO NOT REMOVE - It is useful for getting the complete vesting schedule
  // describe('Complete vesting schedule', () => {
  //   it('should get the right values for each week - year', async () => {
  //     const records:any[] = [];

  //     for (let year = 0; year < 100; year++) {
  //       const yearAD = ethers.utils.formatUnits(await smtVesting.yearAnualDistribution(year))
  //       const cBatch = ethers.utils.formatUnits(await smtVesting.yearAnualCommunityBatch(year))
  //       const wBatch = ethers.utils.formatUnits(await smtVesting.yearAnualWeeklyBatch(year))
  //       const record: any = { year: year + 1, yearAD, cBatch, wBatch }
  //       for (let week = 0; week < 52; week++) {
  //         const yearWeekRelaseBatch = await smtVesting.yearWeekRelaseBatch(year, week)
  //         record[`w${week+1}`] = ethers.utils.formatUnits(yearWeekRelaseBatch)
  //       }
  //       records.push(record)
  //     }
  //     await fsExtra.ensureFile(path.join(`data/vesting-schedule.csv`));
  //     await csvWriter.writeRecords(records)
  //   }).timeout(2000000)
  // });
});

// const csvWriter = createObjectCsvWriter({
//   path: path.join(`data/vesting-schedule.csv`),
//   header: [
//     { id: 'year', title: 'Year' },
//     { id: 'yearAD', title: 'TotalAnnualDistribution' },
//     { id: 'cBatch', title: 'AnualCommunityBatch' },
//     { id: 'wBatch', title: 'AnualWeeklyBatch' },
//     { id: 'w1', title: 'W1' },
//     { id: 'w2', title: 'W2' },
//     { id: 'w3', title: 'W3' },
//     { id: 'w4', title: 'W4' },
//     { id: 'w5', title: 'W5' },
//     { id: 'w6', title: 'W6' },
//     { id: 'w7', title: 'W7' },
//     { id: 'w8', title: 'W8' },
//     { id: 'w9', title: 'W9' },
//     { id: 'w10', title: 'W10' },
//     { id: 'w11', title: 'W11' },
//     { id: 'w12', title: 'W12' },
//     { id: 'w13', title: 'W13' },
//     { id: 'w14', title: 'W14' },
//     { id: 'w15', title: 'W15' },
//     { id: 'w16', title: 'W16' },
//     { id: 'w17', title: 'W17' },
//     { id: 'w18', title: 'W18' },
//     { id: 'w19', title: 'W19' },
//     { id: 'w20', title: 'W20' },
//     { id: 'w21', title: 'W21' },
//     { id: 'w22', title: 'W22' },
//     { id: 'w23', title: 'W23' },
//     { id: 'w24', title: 'W24' },
//     { id: 'w25', title: 'W25' },
//     { id: 'w26', title: 'W26' },
//     { id: 'w27', title: 'W27' },
//     { id: 'w28', title: 'W28' },
//     { id: 'w29', title: 'W29' },
//     { id: 'w30', title: 'W30' },
//     { id: 'w31', title: 'W31' },
//     { id: 'w32', title: 'W32' },
//     { id: 'w33', title: 'W33' },
//     { id: 'w34', title: 'W34' },
//     { id: 'w35', title: 'W35' },
//     { id: 'w36', title: 'W36' },
//     { id: 'w37', title: 'W37' },
//     { id: 'w38', title: 'W38' },
//     { id: 'w39', title: 'W39' },
//     { id: 'w40', title: 'W40' },
//     { id: 'w41', title: 'W41' },
//     { id: 'w42', title: 'W42' },
//     { id: 'w43', title: 'W43' },
//     { id: 'w44', title: 'W44' },
//     { id: 'w45', title: 'W45' },
//     { id: 'w46', title: 'W46' },
//     { id: 'w47', title: 'W47' },
//     { id: 'w48', title: 'W48' },
//     { id: 'w49', title: 'W49' },
//     { id: 'w50', title: 'W50' },
//     { id: 'w51', title: 'W51' },
//     { id: 'w52', title: 'W52' },
//   ],
// });
