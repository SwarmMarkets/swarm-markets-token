import { ethers } from 'hardhat';

const smt = '0x4d544E1236D1D36fCcD0bA31E5c30FC5cFB4FF4a';
const owner = '0x1dEE90df6cDd8a7dA3510FB5b0305EFE57239641';

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
