import hre from 'hardhat';
import { ContractFactory } from 'ethers';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { SmtVesting } from '../typechain';

import assert from 'assert';
import fsExtra from 'fs-extra';
import path from 'path';
import { promises as fs } from 'fs';
import { getChainId, networkNames } from '@openzeppelin/upgrades-core';

import SmtVestingArtifact from '../artifacts/contracts/SmtVesting.sol/SmtVesting.json';


const requiredConfigs = ['TREASURY_ACCOUNT'];
requiredConfigs.forEach(conf => assert(process.env[conf], `Missing configuration variable: ${conf}`));

async function main(): Promise<void> {
  const { ethers } = hre;
  // const [deployer] = await ethers.getSigners();
  // const deployerAddress = await deployer.getAddress();
  let deploymentData = await read();

  console.log('Deploying SmtVesting contract');
  const SmtVestingFactory: ContractFactory = await ethers.getContractFactory('SmtVesting');
  const SmtVestingContract: SmtVesting = (await SmtVestingFactory.deploy("Vesting Swarm Markets Token v3", "vSMT3")) as SmtVesting;
  console.log(`Deploying SmtVesting contract - txHash: ${SmtVestingContract.deployTransaction.hash}`);
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
  console.log(
    `SmtVesting deployed - txHash: ${SmtVestingContract.deployTransaction.hash} - address: ${SmtVestingContract.address}`,
  );

  // Set SmtVesting token
  console.log('Setting SmtVesting accepted token');
  const piaTx = await SmtVestingContract.setAcceptedToken('0xB17548c7B510427baAc4e267BEa62e800b247173');
  console.log(`Setting SmtVesting accepted token - txHash: ${piaTx.hash}`);
  await piaTx.wait();
  console.log(`Done setting SmtVesting accepted token - txHash: ${piaTx.hash}`);

  // Transfer SmtVesting ownership
  /*
  startLog('Add TREASURY_ACCOUNT to whitelist');
  const toTx = await SmtVestingContract.addWhitelistedAddress(process.env.TREASURY_ACCOUNT);
  updatetLog(`Add TREASURY_ACCOUNT to whitelist - txHash: ${toTx.hash}`);
  await toTx.wait();
  stopLog(`Done Add TREASURY_ACCOUNT to whitelist - txHash: ${toTx.hash}`);
  */

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
    console.error(error);
    process.exit(1);
  });
