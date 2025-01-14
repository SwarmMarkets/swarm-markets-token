import { ethers } from 'hardhat';

const smt = '0xFa1EDF1A0cEB62Db77c13da2DA99f17a81760D22';
async function main() {
  const [dep] = await ethers.getSigners();
  const factory = await ethers.getContractFactory('SmtDistributor');
  const distr = await factory.deploy(smt, dep.address);
  await distr.deployed();
  console.log('Distr: ', distr.address);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
