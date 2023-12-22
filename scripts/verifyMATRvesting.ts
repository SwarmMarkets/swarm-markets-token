import hre from 'hardhat';
const { ethers } = hre;

async function main(): Promise<void> {
  const [owner] = await ethers.getSigners();
  await hre.run('verify:verify', {
    address: '0xB89251248F987F45f2911a8dcA6CD20Ac81119B9',
    constructorArguments: []
  });

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
