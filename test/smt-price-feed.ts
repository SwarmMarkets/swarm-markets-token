import { ethers } from 'hardhat';
import { Signer } from 'ethers';
import { expect } from 'chai';

import {
  SwarmMarketsToken,
  SmtPriceFeed,
  BPoolMock,
  BRegistryMock,
  EurPriceFeedMock,
  XTokenWrapperMock,
  ChainlinkAggregatorMock,
  ERC20Detailed,
} from '../typechain';

import Reverter from './utils/reverter';

let deployer: Signer;
let kakaroto: Signer;

let deployerAddress: string;
let kakarotoAddress: string;

let smtContract: SwarmMarketsToken;
let smtPriceFeedContract: SmtPriceFeed;
let smtPriceFeedContractKakaroto: SmtPriceFeed;

let pool1: BPoolMock;
let pool2: BPoolMock;
let pool3: BPoolMock;
let pool4: BPoolMock;
let bRegistryContract: BRegistryMock;
let eurPriceFeedContract: EurPriceFeedMock;
let xTokenWrapperContract: XTokenWrapperMock;
let usdcEthFeedContract: ChainlinkAggregatorMock;
let xToken: ERC20Detailed;
let xSMT: ERC20Detailed;

describe('SmtPriceFeed contract', function () {
  const reverter = new Reverter();

  before(async () => {
    [deployer, kakaroto] = await ethers.getSigners();
    [deployerAddress, kakarotoAddress] = await Promise.all([deployer.getAddress(), kakaroto.getAddress()]);

    const SmtPriceFeedFactory = await ethers.getContractFactory('SmtPriceFeed');
    const SwarmMarketsTokenFactory = await ethers.getContractFactory('SwarmMarketsToken');
    const PoolFactory = await ethers.getContractFactory('BPoolMock');
    const BRegistryFactory = await ethers.getContractFactory('BRegistryMock');
    const EurPriceFeedFactory = await ethers.getContractFactory('EurPriceFeedMock');
    const XTokenWrapperFactory = await ethers.getContractFactory('XTokenWrapperMock');
    const ChainlinkAggregatorMockFactory = await ethers.getContractFactory('ChainlinkAggregatorMock');
    const ERC20DetailedFactory = await ethers.getContractFactory('ERC20Detailed');

    smtContract = (await SwarmMarketsTokenFactory.deploy(deployerAddress)) as SwarmMarketsToken;
    await smtContract.deployed();

    pool1 = (await PoolFactory.deploy(1)) as BPoolMock;
    await pool1.deployed();

    pool2 = (await PoolFactory.deploy(2)) as BPoolMock;
    await pool2.deployed();

    pool3 = (await PoolFactory.deploy(3)) as BPoolMock;
    await pool3.deployed();

    pool4 = (await PoolFactory.deploy(4)) as BPoolMock;
    await pool4.deployed();

    bRegistryContract = (await BRegistryFactory.deploy()) as BRegistryMock;
    await bRegistryContract.deployed();

    await bRegistryContract.setPools([pool1.address, pool2.address, pool3.address, pool4.address]);

    eurPriceFeedContract = (await EurPriceFeedFactory.deploy()) as EurPriceFeedMock;
    await eurPriceFeedContract.deployed();

    xTokenWrapperContract = (await XTokenWrapperFactory.deploy()) as XTokenWrapperMock;
    await xTokenWrapperContract.deployed();

    smtPriceFeedContract = (await SmtPriceFeedFactory.deploy(
      bRegistryContract.address,
      eurPriceFeedContract.address,
      smtContract.address,
      xTokenWrapperContract.address,
      '0x70e1f7aa3f4241d938e3ec487fde58a6a39763ea' // weth on rinkeby, the actual value doesnt matter
    )) as SmtPriceFeed;
    await smtPriceFeedContract.deployed();

    smtPriceFeedContractKakaroto = smtPriceFeedContract.connect(kakaroto);

    usdcEthFeedContract = (await ChainlinkAggregatorMockFactory.deploy(18, 839155000000000)) as ChainlinkAggregatorMock;
    await usdcEthFeedContract.deployed();

    xToken = (await ERC20DetailedFactory.deploy('xUSDC', 'xUSDC', 6)) as ERC20Detailed;
    await xToken.deployed();

    xSMT = (await ERC20DetailedFactory.deploy('xSMT', 'xSMT', 18)) as ERC20Detailed;
    await xSMT.deployed();

    await eurPriceFeedContract.setAssetEthFeed(xToken.address, usdcEthFeedContract.address);

    await xTokenWrapperContract.setTokenToXToken(
      '0x70e1f7aa3f4241d938e3ec487fde58a6a39763ea',
      '0x70e1f7aa3f4241d938e3ec487fde58a6a39763ea',
    );
    await xTokenWrapperContract.setTokenToXToken(smtContract.address, xSMT.address);

    await reverter.snapshot();
  });

  describe('#setRegistry', () => {
    beforeEach(async () => {
      await reverter.revert();
    });

    it('non owner should not be able to setRegistry', async () => {
      await expect(smtPriceFeedContractKakaroto.setRegistry(kakarotoAddress)).to.be.revertedWith(
        'Ownable: caller is not the owner',
      );
    });

    it('owner should not be able to setRegistry as zero address', async () => {
      await expect(smtPriceFeedContract.setRegistry(ethers.constants.AddressZero)).to.be.revertedWith(
        'registry is the zero address',
      );
    });

    it('owner should be able to setRegistry', async () => {
      await smtPriceFeedContract.setRegistry(kakarotoAddress);
      expect(await smtPriceFeedContract.registry()).to.eq(kakarotoAddress);
    });
  });

  describe('#setEurPriceFeed', () => {
    beforeEach(async () => {
      await reverter.revert();
    });

    it('non owner should not be able to setEurPriceFeed', async () => {
      await expect(smtPriceFeedContractKakaroto.setEurPriceFeed(kakarotoAddress)).to.be.revertedWith(
        'Ownable: caller is not the owner',
      );
    });

    it('owner should not be able to setEurPriceFeed as zero address', async () => {
      await expect(smtPriceFeedContract.setEurPriceFeed(ethers.constants.AddressZero)).to.be.revertedWith(
        'eurPriceFeed is the zero address',
      );
    });

    it('owner should be able to setEurPriceFeed', async () => {
      await smtPriceFeedContract.setEurPriceFeed(kakarotoAddress);
      expect(await smtPriceFeedContract.eurPriceFeed()).to.eq(kakarotoAddress);
    });
  });

  describe('#setSmt', () => {
    beforeEach(async () => {
      await reverter.revert();
    });

    it('non owner should not be able to setSmt', async () => {
      await expect(smtPriceFeedContractKakaroto.setSmt(kakarotoAddress)).to.be.revertedWith(
        'Ownable: caller is not the owner',
      );
    });

    it('owner should not be able to setSmt as zero address', async () => {
      await expect(smtPriceFeedContract.setSmt(ethers.constants.AddressZero)).to.be.revertedWith(
        'smt is the zero address',
      );
    });

    it('owner should be able to setSmt', async () => {
      await smtPriceFeedContract.setSmt(kakarotoAddress);
      expect(await smtPriceFeedContract.smt()).to.eq(kakarotoAddress);
    });
  });

  describe('#getPrice - #calculateAmount', () => {
    describe('when there are pools containing asset/SMT pair', () => {
      it('should get the right amount (avg from the 4 pools)', async () => {
        expect(
          (
            await bRegistryContract.getBestPoolsWithLimit(
              '0xC34Fb71AAc05d01F354108Ac6ff956f8c5deAeF4',
              ethers.constants.AddressZero,
              0,
            )
          ).length,
        ).to.eq(4);
        expect(await bRegistryContract.emptyOnAsset()).to.eq(false);
        const tokenAmountIn = ethers.constants.WeiPerEther.mul(4);

        const smtAmount = await smtPriceFeedContract.calculateAmount(
          '0xC34Fb71AAc05d01F354108Ac6ff956f8c5deAeF4',
          tokenAmountIn,
        );

        const totalPools = tokenAmountIn.add(tokenAmountIn.div(2)).add(tokenAmountIn.div(3)).add(tokenAmountIn.div(4));
        expect(smtAmount).to.eq(totalPools.div(4));
      });

      it('should get the right amount (from pool1)', async () => {
        expect(await bRegistryContract.emptyOnAsset()).to.eq(false);
        await bRegistryContract.setPools([pool1.address]);
        expect(
          (
            await bRegistryContract.getBestPoolsWithLimit(
              '0xC34Fb71AAc05d01F354108Ac6ff956f8c5deAeF4',
              ethers.constants.AddressZero,
              0,
            )
          ).length,
        ).to.eq(1);
        const tokenAmountIn = ethers.constants.WeiPerEther.mul(4);

        const smtAmount = await smtPriceFeedContract.calculateAmount(
          '0xC34Fb71AAc05d01F354108Ac6ff956f8c5deAeF4',
          tokenAmountIn,
        );

        expect(smtAmount).to.eq(tokenAmountIn);
      });

      it('should get the right price (avg from the 4 pools)', async () => {
        await reverter.revert();
        expect(
          (await bRegistryContract.getBestPoolsWithLimit(xToken.address, ethers.constants.AddressZero, 0)).length,
        ).to.eq(4);
        expect(await bRegistryContract.emptyOnAsset()).to.eq(false);
        const one = ethers.BigNumber.from(1000000); // 1 USDC

        const price = await smtPriceFeedContract.getPrice(xToken.address);

        const totalPools = one.add(one.div(2)).add(one.div(3)).add(one.div(4));
        expect(price).to.eq(totalPools.div(4));
      });

      it('should get the right price (from pool1)', async () => {
        expect(await bRegistryContract.emptyOnAsset()).to.eq(false);
        await bRegistryContract.setPools([pool1.address]);
        expect(
          (await bRegistryContract.getBestPoolsWithLimit(xToken.address, ethers.constants.AddressZero, 0)).length,
        ).to.eq(1);
        const one = ethers.BigNumber.from(1000000); // 1 USDC

        const price = await smtPriceFeedContract.getPrice(xToken.address);

        expect(price).to.eq(one);
      });
    });

    describe("when there aren't pools containing asset/SMT pair", () => {
      before(async () => {
        await reverter.revert();
        await bRegistryContract.setEmptyOnAsset(true);
      });

      beforeEach(async () => {
        expect(await bRegistryContract.emptyOnAsset()).to.eq(true);
        expect(
          (
            await bRegistryContract.getBestPoolsWithLimit(
              '0xC34Fb71AAc05d01F354108Ac6ff956f8c5deAeF4',
              ethers.constants.AddressZero,
              0,
            )
          ).length,
        ).to.eq(0);
        expect(
          (
            await bRegistryContract.getBestPoolsWithLimit(
              '0x70e1f7aa3f4241d938e3ec487fde58a6a39763ea',
              ethers.constants.AddressZero,
              0,
            )
          ).length,
        ).to.eq(4);
      });

      it('should return 0 if assetEthFeed is zero address', async () => {
        expect(await eurPriceFeedContract.assetEthFeed('0xC34Fb71AAc05d01F354108Ac6ff956f8c5deAeF4')).to.eq(
          ethers.constants.AddressZero,
        );

        const smtAmount = await smtPriceFeedContract.calculateAmount(
          '0xC34Fb71AAc05d01F354108Ac6ff956f8c5deAeF4',
          ethers.constants.WeiPerEther,
        );

        expect(smtAmount).to.eq(0);
      });

      it('should get the right amount using the avg from the 4 eth/smt pools and external asset feed)', async () => {
        expect(await eurPriceFeedContract.assetEthFeed(xToken.address)).not.to.eq(ethers.constants.AddressZero);
        const tokenAmountIn = ethers.BigNumber.from(100000); // 0.1 USDC

        const smtAmount = await smtPriceFeedContract.calculateAmount(xToken.address, tokenAmountIn);

        const ethToSmtAmount = ethers.constants.WeiPerEther.add(ethers.constants.WeiPerEther.div(2))
          .add(ethers.constants.WeiPerEther.div(3))
          .add(ethers.constants.WeiPerEther.div(4))
          .div(4);
        const assetToEthAmount = tokenAmountIn.mul(839155000000000).div(1000000);

        expect(smtAmount).to.eq(assetToEthAmount.mul(ethToSmtAmount).div(ethers.constants.WeiPerEther));
      });

      it('should get the right price using the avg from the 4 eth/smt pools and external asset feed)', async () => {
        expect(await eurPriceFeedContract.assetEthFeed(xToken.address)).not.to.eq(ethers.constants.AddressZero);
        const tokenAmountIn = ethers.BigNumber.from(1000000); // 1 USDC

        const price = await smtPriceFeedContract.getPrice(xToken.address);

        const ethToSmtAmount = ethers.constants.WeiPerEther.add(ethers.constants.WeiPerEther.div(2))
          .add(ethers.constants.WeiPerEther.div(3))
          .add(ethers.constants.WeiPerEther.div(4))
          .div(4);
        const assetToEthAmount = tokenAmountIn.mul(839155000000000).div(1000000);

        // price is iqual to calculateAmount for 1 asset
        expect(price).to.eq(assetToEthAmount.mul(ethToSmtAmount).div(ethers.constants.WeiPerEther));
      });

      it('should return 0 if there are no eth/smt pool', async () => {
        await bRegistryContract.setPools([]);
        expect(
          (
            await bRegistryContract.getBestPoolsWithLimit(
              '0x70e1f7aa3f4241d938e3ec487fde58a6a39763ea',
              ethers.constants.AddressZero,
              0,
            )
          ).length,
        ).to.eq(0);
        const tokenAmountIn = ethers.BigNumber.from(100000); // 0.1 USDC

        const smtAmount = await smtPriceFeedContract.calculateAmount(xToken.address, tokenAmountIn);
        expect(smtAmount).to.eq(0);
      });
    });
  });

  describe('latestAnswer', () => {
    before(async () => {
      await reverter.revert();
    });

    it('should return 0 when there are no pools with SMT/ETH', async () => {
      await bRegistryContract.setEmptyOnAsset(true);
      expect(
        (await bRegistryContract.getBestPoolsWithLimit(xSMT.address, ethers.constants.AddressZero, 0)).length,
      ).to.eq(0);

      const latestAnswer = await smtPriceFeedContract.latestAnswer();

      expect(latestAnswer).to.eq(0);
    });

    it('should return right value when there are pools with SMT/ETH', async () => {
      await bRegistryContract.setEmptyOnAsset(false);
      await bRegistryContract.setPools([pool1.address, pool2.address, pool3.address, pool4.address]);
      expect(
        (await bRegistryContract.getBestPoolsWithLimit(xSMT.address, ethers.constants.AddressZero, 0)).length,
      ).to.eq(4);

      const one = ethers.constants.WeiPerEther;

      const poolsAvg = one.add(one.div(2)).add(one.div(3)).add(one.div(4)).div(4);

      const latestAnswer = await smtPriceFeedContract.latestAnswer();

      expect(latestAnswer).to.eq(poolsAvg);
    });
  });
});
