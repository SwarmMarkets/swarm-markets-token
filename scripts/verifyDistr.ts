import hre from 'hardhat';

const distr = '';
const smt = '';
const owner = '';

async function main(): Promise<void> {
  await hre.run('verify:verify', {
    address: distr,
    constructorArguments: [smt, owner],
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
