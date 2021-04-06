import { ethers } from 'hardhat';
import { Signer } from 'ethers';
import { expect } from 'chai';

import { SwarmMarketsToken, SmtPriceFeed } from '../typechain';

import Reverter from './utils/reverter';

let deployer: Signer;
let kakaroto: Signer;

let deployerAddress: string;
let kakarotoAddress: string;

let smtContract: SwarmMarketsToken;
let smtPriceFeedContract: SmtPriceFeed;
let smtPriceFeedContractKakaroto: SmtPriceFeed;

describe('SmtPriceFeed contract', function () {
  const reverter = new Reverter();

  before(async () => {
    [deployer, kakaroto] = await ethers.getSigners();
    [deployerAddress, kakarotoAddress] = await Promise.all([deployer.getAddress(), kakaroto.getAddress()]);

    const SmtPriceFeedFactory = await ethers.getContractFactory('SmtPriceFeed');

    const SwarmMarketsTokenFactory = await ethers.getContractFactory('SwarmMarketsToken');

    smtContract = (await SwarmMarketsTokenFactory.deploy(deployerAddress)) as SwarmMarketsToken;
    await smtContract.deployed();

    // TODO - use addresses from mocked contracts
    smtPriceFeedContract = (await SmtPriceFeedFactory.deploy(
      deployerAddress,
      deployerAddress,
      smtContract.address,
    )) as SmtPriceFeed;
    await smtPriceFeedContract.deployed();

    smtPriceFeedContractKakaroto = smtPriceFeedContract.connect(kakaroto);

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
});
