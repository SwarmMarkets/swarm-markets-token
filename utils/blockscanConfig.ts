import { CustomChain, EtherscanConfig } from '@nomiclabs/hardhat-etherscan/dist/src/types';
import dotenv from 'dotenv';
import chainConfig from './chain-properties.json';
import { ChainConfig } from './types';

dotenv.config();

const allSlugs = Object.keys(chainConfig);

export function getBlockscanConfig(slug: string): CustomChain {
  const entry = (chainConfig as Record<string, ChainConfig>)[slug];

  if (!entry) {
    throw new Error(`Network '${slug}' not found in chain-config.json`);
  }

  const key = process.env.ETHERSCAN_KEY;
  if (!key) throw new Error('Missing ETHERSCAN_KEY in env');

  const chainId = entry.chainId;
  const browserURL = entry.explorer;

  const apiURL: string = entry.api ?? `https://api.etherscan.io/v2/api?chainid=${chainId}`;

  return {
    network: slug,
    chainId,
    urls: { apiURL, browserURL },
  };
}

const apiKey = Object.fromEntries(Object.keys(chainConfig).map(slug => [slug, process.env.ETHERSCAN_KEY ?? '']));

export const etherscanConfig: EtherscanConfig = {
  apiKey,
  customChains: allSlugs.map(getBlockscanConfig),
};
