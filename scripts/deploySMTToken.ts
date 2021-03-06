import hre from 'hardhat';
import { ContractFactory } from 'ethers';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { SwarmMarketsToken, SmtPriceFeed } from '../typechain';

import assert from 'assert';
import ora, { Ora } from 'ora';
import fsExtra from 'fs-extra';
import path from 'path';
import { promises as fs } from 'fs';
import { getChainId, networkNames } from '@openzeppelin/upgrades-core';

import SwarmMarketsTokenArtifact from '../artifacts/contracts/SwarmMarketsToken.sol/SwarmMarketsToken.json';

let spinner: Ora;

const requiredConfigs = ['TREASURY_ACCOUNT'];
requiredConfigs.forEach(conf => assert(process.env[conf], `Missing configuration variable: ${conf}`));

async function main(): Promise<void> {
  const { ethers } = hre;
  // const [deployer] = await ethers.getSigners();
  // const deployerAddress = await deployer.getAddress();
  let deploymentData = await read();

  let swarmMarketsToken: SwarmMarketsToken;
  if (process.env.TREASURY_ACCOUNT) {
    startLog('Deploying SwarmMarketsToken contract');
    const swarmMarketsTokenAddress = deploymentData['SwarmMarketsToken'] && deploymentData['SwarmMarketsToken'].address;
    if(swarmMarketsTokenAddress){
      stopLog(`SwarmMarketsToken already deployed at ${swarmMarketsTokenAddress}`);
      swarmMarketsToken= (await ethers.getContractAt( 'SwarmMarketsToken', swarmMarketsTokenAddress)) as SwarmMarketsToken;
    } else {
      const SwarmMarketsTokenFactory: ContractFactory = await ethers.getContractFactory('SwarmMarketsToken');
      swarmMarketsToken= (await SwarmMarketsTokenFactory.deploy(
        process.env.TREASURY_ACCOUNT,
      )) as SwarmMarketsToken;
      updatetLog(`Deploying SwarmMarketsToken contract - txHash: ${swarmMarketsToken.deployTransaction.hash}`);
      await swarmMarketsToken.deployed();

      deploymentData = {
        ...deploymentData,
        SwarmMarketsToken: {
          address: swarmMarketsToken.address,
          abi: SwarmMarketsTokenArtifact.abi,
          deployTransaction: await getRecipt(swarmMarketsToken.deployTransaction),
        },
      };

      await write(deploymentData);
      stopLog(
        `SwarmMarketsToken deployed - txHash: ${swarmMarketsToken.deployTransaction.hash} - address: ${swarmMarketsToken.address}`,
      );
    }
  }
}

async function read(): Promise<any> {
  const deploymentsFile = await getDeploymentFile();

  try {
    return JSON.parse(await fs.readFile(deploymentsFile, 'utf8'));
  } catch (e) {
    if (e.code === 'ENOENT') {
      return {};
    } else {
      throw e;
    }
  }
}

async function write(data: any): Promise<void> {
  const deploymentsFile = await getDeploymentFile();
  await fsExtra.ensureFile(deploymentsFile);
  await fs.writeFile(deploymentsFile, JSON.stringify(data, null, 2) + '\n');
}

async function getDeploymentFile() {
  const chainId = await getChainId(hre.network.provider);
  const name = networkNames[chainId] ?? `unknown-${chainId}`;
  return path.join(`deployments/${name}.json`);
}

function startLog(message: string) {
  spinner = ora().start(message);
}

function updatetLog(message: string) {
  spinner.text = message;
}

function stopLog(message: string) {
  spinner.succeed(message);
}

async function getRecipt(transactionResponse: TransactionResponse) {
  const receipt = await transactionResponse.wait();
  return {
    ...transactionResponse,
    ...receipt,
    gasPrice: transactionResponse.gasPrice.toString(),
    gasLimit: transactionResponse.gasLimit.toString(),
    value: transactionResponse.value.toString(),
    gasUsed: receipt.gasUsed.toString(),
    cumulativeGasUsed: receipt.cumulativeGasUsed.toString(),
  };
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    spinner.fail();
    console.error(error);
    process.exit(1);
  });
