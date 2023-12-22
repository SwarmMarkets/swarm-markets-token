import { ContractFactory } from 'ethers';
import hre from 'hardhat';
import { VMATR } from '../typechain';
const { ethers } = hre;

async function main(): Promise<void> {
  const MATRvesting: ContractFactory = await ethers.getContractFactory('vMATR');
  const matrv: VMATR = await MATRvesting.deploy() as VMATR;
  await matrv.deployed();

  console.log(`Deployed to ${matrv.address}`);
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
