import hre, { ethers } from 'hardhat';

const distr = '0x98da72acfBAc0b5ef911974CEEF209637DfE0373';
const smt = '0xFa1EDF1A0cEB62Db77c13da2DA99f17a81760D22';

async function main(): Promise<void> {
  const [dep] = await ethers.getSigners();
  await hre.run('verify:verify', {
    address: distr,
    constructorArguments: [smt, dep.address],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    // spinner.fail();
    console.error(error);
    process.exit(1);
  });
