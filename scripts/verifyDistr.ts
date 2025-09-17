import hre from 'hardhat';

const distr = '0xbCdEb213c74B0a1BD3586DFa07Ba4107470A0e18';
const smt = '0x4d544E1236D1D36fCcD0bA31E5c30FC5cFB4FF4a';
const owner = '0x1dEE90df6cDd8a7dA3510FB5b0305EFE57239641';

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
