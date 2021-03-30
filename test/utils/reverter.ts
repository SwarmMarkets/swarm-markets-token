import { ethers } from 'hardhat';

const { provider } = ethers;

export default class Reverter {
  snapshotId = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async snapshot(): Promise<any> {
    try {
      const result = await provider.send('evm_snapshot', []);
      this.snapshotId = result;
      return this.snapshotId;
    } catch (error) {
      return error;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async revert(): Promise<any> {
    try {
      await provider.send('evm_revert', [this.snapshotId]);
      const stanpshot = await this.snapshot();
      return stanpshot;
    } catch (error) {
      return error;
    }
  }
}
