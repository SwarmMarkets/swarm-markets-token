import hre from 'hardhat';
import { ContractFactory } from 'ethers';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { SwarmMarketsToken, SmtDistributor, SmtVesting } from '../typechain';

import assert from 'assert';
import ora, { Ora } from 'ora';
import fsExtra from 'fs-extra';
import path from 'path';
import { promises as fs } from 'fs';
import { getChainId, networkNames } from '@openzeppelin/upgrades-core';

import SwarmMarketsTokenArtifact from '../artifacts/contracts/SwarmMarketsToken.sol/SwarmMarketsToken.json';
import SmtDistributorArtifact from '../artifacts/contracts/SmtDistributor.sol/SmtDistributor.json';
import SmtVestingArtifact from '../artifacts/contracts/SmtVesting.sol/SmtVesting.json';

let spinner: Ora;

const requiredConfigs = ['TREASURY_ACCOUNT'];
requiredConfigs.forEach(conf => assert(process.env[conf], `Missing configuration variable: ${conf}`));

async function main(): Promise<void> {
  const { ethers } = hre;
  // const [deployer] = await ethers.getSigners();
  // const deployerAddress = await deployer.getAddress();
  let deploymentData = await read();

  if (process.env.TREASURY_ACCOUNT) {
    startLog('Deploying SmtVesting contract');
    const SmtVestingFactory: ContractFactory = await ethers.getContractFactory('SmtVesting');
    const SmtVestingContract: SmtVesting = (await SmtVestingFactory.deploy("Vesting Swarm Markets Token v2", "vSMT2")) as SmtVesting;
    updatetLog(`Deploying SmtVesting contract - txHash: ${SmtVestingContract.deployTransaction.hash}`);
    await SmtVestingContract.deployed();

    deploymentData = {
      ...deploymentData,
      SmtVesting: {
        address: SmtVestingContract.address,
        abi: SmtVestingArtifact.abi,
        deployTransaction: await getRecipt(SmtVestingContract.deployTransaction),
      },
    };

    await write(deploymentData);
    stopLog(
      `SmtVesting deployed - txHash: ${SmtVestingContract.deployTransaction.hash} - address: ${SmtVestingContract.address}`,
    );

    // Set SmtVesting token
    startLog('Setting SmtVesting accepted token');
    const piaTx = await SmtVestingContract.setAcceptedToken(deploymentData.SwarmMarketsToken.address);
    updatetLog(`Setting SmtVesting accepted token - txHash: ${piaTx.hash}`);
    await piaTx.wait();
    stopLog(`Done setting SmtVesting accepted token - txHash: ${piaTx.hash}`);

    // Transfer SmtVesting ownership
    /*
    startLog('Add TREASURY_ACCOUNT to whitelist');
    const toTx = await SmtVestingContract.addWhitelistedAddress(process.env.TREASURY_ACCOUNT);
    updatetLog(`Add TREASURY_ACCOUNT to whitelist - txHash: ${toTx.hash}`);
    await toTx.wait();
    stopLog(`Done Add TREASURY_ACCOUNT to whitelist - txHash: ${toTx.hash}`);
    */
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
