import { ContractFactory } from 'ethers';
import hre from 'hardhat';
import { MATR } from '../typechain';
const { ethers } = hre;


async function main(): Promise<void> {
  const MATR: ContractFactory = await ethers.getContractFactory('MATR');
  const matr: MATR = await MATR.deploy() as MATR;
  await matr.deployed();

  console.log(`Deployed to ${matr.address}`);
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
