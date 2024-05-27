import hre, { ethers } from 'hardhat';
import { ContractFactory } from 'ethers';
import { SwarmMarketsToken, SmtPriceFeed } from '../typechain';


async function main(): Promise<void> {
	const [deployer] = await ethers.getSigners();

	const SwarmMarketsTokenFactory: ContractFactory = await ethers.getContractFactory('SwarmMarketsToken');
	const swarmMarketsToken = (await SwarmMarketsTokenFactory.deploy(
		deployer.address,
	)) as SwarmMarketsToken;

	console.log(
		`SwarmMarketsToken deployed - txHash: ${swarmMarketsToken.deployTransaction.hash} - address: ${swarmMarketsToken.address}`,
	);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch((error: Error) => {
		console.error(error);
		process.exit(1);
	});
