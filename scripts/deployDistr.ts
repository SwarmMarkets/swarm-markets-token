import { ethers } from 'hardhat';

const smt = '';
const owner = '';

async function main() {
  const factory = await ethers.getContractFactory('SmtDistributor');
  const distr = await factory.deploy(smt, owner);
  await distr.deployed();
  console.log('Distr: ', distr.address);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
