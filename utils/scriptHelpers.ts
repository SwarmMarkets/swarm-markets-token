import fs from 'fs';
import path from 'path';
import { ethers } from 'hardhat';
import type { BigNumber, providers } from 'ethers';

export type Json = Record<string, any>;

export function readJson<T = Json>(filePath: string): T {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (err) {
    const e = err as Error;
    throw new Error(`Failed to read JSON at ${filePath}: ${e.message}`);
  }
}

// Atomic write to reduce risk of partial writes
export function writeJsonAtomic(filePath: string, data: unknown): void {
  const dir = path.dirname(filePath);
  const tmpPath = path.join(dir, `${path.basename(filePath)}.tmp`);
  const payload = JSON.stringify(data, null, 2);
  try {
    fs.writeFileSync(tmpPath, payload, { encoding: 'utf-8' });
    fs.renameSync(tmpPath, filePath);
  } catch (err) {
    // Attempt cleanup but don’t throw if it fails
    try {
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    } catch {}
    const e = err as Error;
    throw new Error(`Failed to write JSON at ${filePath}: ${e.message}`);
  }
}

export function isNonZeroAddress(addr: string | undefined | null): addr is string {
  return !!addr && addr !== ethers.constants.AddressZero && ethers.utils.isAddress(addr);
}

export async function getChainContext() {
  const network = await ethers.provider.getNetwork();
  return { chainId: Number(network.chainId) };
}

export async function getFeeOverrides(
  chainId: number,
  provider?: providers.Provider,
): Promise<{ maxPriorityFeePerGas?: BigNumber; maxFeePerGas?: BigNumber; gasLimit?: number }> {
  // Currently only BSC customizes gas settings in these scripts
  if (chainId === 56) {
    const feeData = await (provider ?? ethers.provider).getFeeData();
    const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas || ethers.utils.parseUnits('1', 'gwei');
    const maxFeePerGas = feeData.maxFeePerGas || ethers.utils.parseUnits('20', 'gwei');
    return { maxPriorityFeePerGas, maxFeePerGas };
  } else if (chainId === 295) {
    return { gasLimit: 2_000_000 };
  }
  return {};
}

export function safeGet<T, K extends keyof T>(obj: T, key: K, hint?: string) {
  const val = obj?.[key];
  if (val === undefined || val === null) {
    const h = hint ? ` (${hint})` : '';
    throw new Error(`Missing required key '${String(key)}'${h}`);
  }
  return val as T[K];
}
