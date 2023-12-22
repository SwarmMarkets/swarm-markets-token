import hre from 'hardhat';
const { ethers } = hre;

async function main(): Promise<void> {
  const [owner] = await ethers.getSigners();
  await hre.run('verify:verify', {
    address: '0xEeBA1f1eb2f70fC33A9B40ED3a1804fEdC0455db',
    constructorArguments: [owner.address]
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
