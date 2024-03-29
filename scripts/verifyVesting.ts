import hre from 'hardhat';
import path from 'path';
import { promises as fs } from 'fs';
import assert from 'assert';



async function main(): Promise<void> {


  // SwarmMarketsToken
  await hre.run('verify:verify', {
    address: "0x41b0f5f7641168219b7F5171B1D4905D264226Bc",
    constructorArguments: ["Vesting Swarm Markets Token v2", "vSMT2"],
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
