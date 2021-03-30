import { ethers } from 'hardhat';
import { Signer } from 'ethers';
import { expect } from 'chai';
import { SwarmMarketsToken } from '../typechain';

// let deployer: Signer;
let kakaroto: Signer;

// let deployerAddress: string;
let kakarotoAddress: string;

let SMTContract: SwarmMarketsToken;

const tokenSupply = ethers.constants.One.mul(250000000);

describe('STM', function () {
  before(async () => {
    [, kakaroto] = await ethers.getSigners();
    kakarotoAddress = await kakaroto.getAddress();

    const SwarmMarketsTokenFactory = await ethers.getContractFactory('SwarmMarketsToken');

    SMTContract = (await SwarmMarketsTokenFactory.deploy(tokenSupply, kakarotoAddress)) as SwarmMarketsToken;
    await SMTContract.deployed();
  });

  it('should be deployed with the right setup', async () => {
    expect(await SMTContract.name()).to.eq('Swarm Markets Token');
    expect(await SMTContract.symbol()).to.eq('SMT');
    expect(await SMTContract.decimals()).to.eq(18);
    expect(await SMTContract.totalSupply()).to.eq(tokenSupply);
    expect(await SMTContract.balanceOf(kakarotoAddress)).to.eq(tokenSupply);
  });
});
