import { ethers } from 'hardhat';

const { provider } = ethers;

export default class Time {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  advanceBlock(): Promise<any> {
    return provider.send('evm_mine', []);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async advanceBlockTo(target: number): Promise<any> {
    const currentBlock = await this.latestBlock();
    if (target < currentBlock) throw Error(`Target block #(${target}) is lower than current block #(${currentBlock})`);

    while ((await this.latestBlock()) < target) {
      await this.advanceBlock();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async latestBlock(): Promise<any> {
    const block = await ethers.provider.getBlockNumber();
    return block;
  }
}
