import hre from 'hardhat';
import path from 'path';
import { promises as fs } from 'fs';
import assert from 'assert';

import { getChainId, networkNames } from '@openzeppelin/upgrades-core';

const requiredConfigs = ['TREASURY_ACCOUNT'];
requiredConfigs.forEach(conf => assert(process.env[conf], `Missing configuration variable: ${conf}`));

async function main(): Promise<void> {
  const deploymentData = await read(await getDeploymentFile());

  if (process.env.TREASURY_ACCOUNT) {
    // SwarmMarketsToken
    await hre.run('verify:verify', {
      address: deploymentData.SwarmMarketsToken.address,
      constructorArguments: [process.env.TREASURY_ACCOUNT],
      contract: 'contracts/SwarmMarketsToken.sol:SwarmMarketsToken',
    });

    // SmtPriceFeed
    await hre.run('verify:verify', {
      address: deploymentData.SmtPriceFeed.address,
      constructorArguments: [
        process.env.BREGISTRY,
        process.env.EUR_USD_FEED,
        deploymentData.SwarmMarketsToken.address,
        process.env.XTOKENWRAPPER,
      ],
      contract: 'contracts/SmtPriceFeed.sol:SmtPriceFeed',
    });
  }
}

async function read(filename: string): Promise<any> {
  try {
    return JSON.parse(await fs.readFile(filename, 'utf8'));
  } catch (e) {
    if (e.code === 'ENOENT') {
      return {};
    } else {
      throw e;
    }
  }
}

async function getDeploymentFile() {
  const chainId = await getChainId(hre.network.provider);
  const name = networkNames[chainId] ?? `unknown-${chainId}`;
  return path.join(`deployments/${name}.json`);
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
