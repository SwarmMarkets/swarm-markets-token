import { ethers } from 'hardhat';
import { Signer, ContractFactory } from 'ethers';
import { expect } from 'chai';

import { createObjectCsvWriter } from 'csv-writer';
import csv from 'csv-parser';
import fsExtra from 'fs-extra';
import path from 'path';

import { SmtVesting } from '../typechain';

import Reverter from './utils/reverter';
import Time from './utils/time';

let deployer: Signer;
let kakaroto: Signer;
let vegeta: Signer;
let karpincho: Signer;

let deployerAddress: string;
let kakarotoAddress: string;
let vegetaAddress: string;
let karpinchoAddress: string;

let smtVesting: SmtVesting;

const tokenSupply = ethers.constants.One.mul(250000000);

const csvWriter = createObjectCsvWriter({
  path: path.join(`data/vesting-schedule.csv`),
  header: [
    { id: 'year', title: 'Year' },
    { id: 'yearAD', title: 'TotalAnnualDistribution' },
    { id: 'cBatch', title: 'AnualCommunityBatch' },
    { id: 'wBatch', title: 'AnualWeeklyBatch' },
    { id: 'w1', title: 'W1' },
    { id: 'w2', title: 'W2' },
    { id: 'w3', title: 'W3' },
    { id: 'w4', title: 'W4' },
    { id: 'w5', title: 'W5' },
    { id: 'w6', title: 'W6' },
    { id: 'w7', title: 'W7' },
    { id: 'w8', title: 'W8' },
    { id: 'w9', title: 'W9' },
    { id: 'w10', title: 'W10' },
    { id: 'w11', title: 'W11' },
    { id: 'w12', title: 'W12' },
    { id: 'w13', title: 'W13' },
    { id: 'w14', title: 'W14' },
    { id: 'w15', title: 'W15' },
    { id: 'w16', title: 'W16' },
    { id: 'w17', title: 'W17' },
    { id: 'w18', title: 'W18' },
    { id: 'w19', title: 'W19' },
    { id: 'w20', title: 'W20' },
    { id: 'w21', title: 'W21' },
    { id: 'w22', title: 'W22' },
    { id: 'w23', title: 'W23' },
    { id: 'w24', title: 'W24' },
    { id: 'w25', title: 'W25' },
    { id: 'w26', title: 'W26' },
    { id: 'w27', title: 'W27' },
    { id: 'w28', title: 'W28' },
    { id: 'w29', title: 'W29' },
    { id: 'w30', title: 'W30' },
    { id: 'w31', title: 'W31' },
    { id: 'w32', title: 'W32' },
    { id: 'w33', title: 'W33' },
    { id: 'w34', title: 'W34' },
    { id: 'w35', title: 'W35' },
    { id: 'w36', title: 'W36' },
    { id: 'w37', title: 'W37' },
    { id: 'w38', title: 'W38' },
    { id: 'w39', title: 'W39' },
    { id: 'w40', title: 'W40' },
    { id: 'w41', title: 'W41' },
    { id: 'w42', title: 'W42' },
    { id: 'w43', title: 'W43' },
    { id: 'w44', title: 'W44' },
    { id: 'w45', title: 'W45' },
    { id: 'w46', title: 'W46' },
    { id: 'w47', title: 'W47' },
    { id: 'w48', title: 'W48' },
    { id: 'w49', title: 'W49' },
    { id: 'w50', title: 'W50' },
    { id: 'w51', title: 'W51' },
    { id: 'w52', title: 'W52' },
  ],
});

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

describe('STM', function () {
  const reverter = new Reverter();
  const time = new Time();

  before(async () => {
    [deployer, kakaroto, vegeta, karpincho] = await ethers.getSigners();
    [deployerAddress, kakarotoAddress, vegetaAddress, karpinchoAddress] = await Promise.all([
      deployer.getAddress(),
      kakaroto.getAddress(),
      vegeta.getAddress(),
      karpincho.getAddress(),
    ]);

    const SmtVestingFactory = await ethers.getContractFactory('SmtVesting');

    smtVesting = (await SmtVestingFactory.deploy()) as SmtVesting;
    await smtVesting.deployed();
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
          const lastClaimedBlock = 1 + 2102399 * i;
          const cYear = i;

          const accumulateAnualComBatch = await smtVesting.accumulateAnualComBatch(
            isFirstYCBClaimed,
            lastClaimedBlock,
            cYear,
          );

          expect(ethers.utils.formatUnits(accumulateAnualComBatch)).to.eq(row['AnualCommunityBatch']);
        }
      });

      it('should get the 0 when called for a year already claimed', async () => {
        for (let i = 0; i < data.length; i++) {
          const row = data[i];

          const isFirstYCBClaimed = true;
          const lastClaimedBlock = 2102400 * (i + 1);
          const cYear = i;

          const accumulateAnualComBatch = await smtVesting.accumulateAnualComBatch(
            isFirstYCBClaimed,
            lastClaimedBlock,
            cYear,
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

        const accumulateAnualComBatch = await smtVesting.accumulateAnualComBatch(true, 1, 8);

        expect(accumulateAnualComBatch).to.eq(acc);
      });
    });

    describe('accumulateCurrentYear', async () => {
      it('should get the right value week after week ', async () => {
        const initialBlock = 1;
        for (let y = 0; y < 5; y++) {
          const row = data[y];

          for (let w = 1; w < 53; w++) {
            const blockNumber = initialBlock + 2102400 * y + 40320 * w;
            const cYear = y;
            const cWeek = w;
            const lastClaimedBlock = blockNumber - 40320;

            const accumulateCurrentYear = await smtVesting.accumulateCurrentYear(
              blockNumber,
              cYear,
              cWeek,
              lastClaimedBlock,
            );
            expect(ethers.utils.formatUnits(accumulateCurrentYear)).to.eq(row[`W${w}`]);
          }
        }
      });

      it('should get the right value week after week in the half of the week', async () => {
        const initialBlock = 1;
        for (let y = 0; y < 5; y++) {
          const row = data[y];

          for (let w = 1; w < 53; w++) {
            const blockNumber = initialBlock + 2102400 * y + 40320 * w - 20160;
            const cYear = y;
            const cWeek = w - 1;
            const lastClaimedBlock = y === 0 && w === 1 ? 1 : blockNumber - 40320;

            const accumulateCurrentYear = await smtVesting.accumulateCurrentYear(
              blockNumber,
              cYear,
              cWeek,
              lastClaimedBlock,
            );
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
      it('should get the right value week after week ', async () => {
        const initialBlock = 1;
        for (let y = 0; y < 5; y++) {
          const row = data[y];

          for (let w = 1; w < 53; w++) {
            const blockNumber = initialBlock + 2102400 * y + 40320 * w;
            const cYear = y;
            const cWeek = w;
            const lastClaimedBlock = blockNumber - 40320;

            const accumulateCurrentYear = await smtVesting.accumulateCurrentYear(
              blockNumber,
              cYear,
              cWeek,
              lastClaimedBlock,
            );
            expect(ethers.utils.formatUnits(accumulateCurrentYear)).to.eq(row[`W${w}`]);
          }
        }
      });

      it('should get the right value week after week in the half of the week', async () => {
        const initialBlock = 1;
        for (let y = 0; y < 5; y++) {
          const row = data[y];

          for (let w = 1; w < 53; w++) {
            const blockNumber = initialBlock + 2102400 * y + 40320 * w - 20160;
            const cYear = y;
            const cWeek = w - 1;
            const lastClaimedBlock = y === 0 && w === 1 ? 1 : blockNumber - 40320;

            const accumulateCurrentYear = await smtVesting.accumulateCurrentYear(
              blockNumber,
              cYear,
              cWeek,
              lastClaimedBlock,
            );
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

    // for (const row of data) {

    // }
    // it('should get the right values', async () => {
    //   await time.advanceBlockTo(40321);
    //   const amount = await smtVesting.claimableAmount()
    //   console.log(amount.toString())
    // })
  });

  // describe('Complete vesting schedule', () => {
  // it('should get the right values for each year', async () => {
  //   let total = ethers.BigNumber.from(0)
  //   for (let year = 0; year < 100; year++) {
  //     const yearAnualDistribution = await smtVesting.yearAnualDistribution(year)
  //     console.log(`Year ${year + 1}: ${yearAnualDistribution.toString()}`)
  //     total = total.add(yearAnualDistribution)
  //   }

  //   console.log('TOTAL: ', total.toString())
  // })

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
