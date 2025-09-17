import dotenv from 'dotenv';
import chainConfig from './chain-properties.json';
import { ChainConfig } from './types';

dotenv.config();

const { ALCHEMY_KEY, INFURA_KEY } = process.env;

if (!ALCHEMY_KEY && !INFURA_KEY) {
  throw new Error('Missing both ALCHEMY_KEY and INFURA_KEY in env');
}

export function getChainRpc(slug: string): string {
  const entry = (chainConfig as Record<string, ChainConfig>)[slug];

  if (!entry) {
    throw new Error(`Network '${slug}' not found in chain-config.json`);
  }

  if (entry.rpc) {
    return entry.rpc;
  }

  if (entry.infuraSubdomain) {
    if (!INFURA_KEY) {
      throw new Error(`INFURA_KEY missing; needed for ${slug}`);
    }
    return `https://${entry.infuraSubdomain}.infura.io/v3/${INFURA_KEY}`;
  }

  if (entry.alchemySubdomain) {
    if (!ALCHEMY_KEY) {
      throw new Error(`ALCHEMY_KEY missing; needed for ${slug}`);
    }
    return `https://${entry.alchemySubdomain}.g.alchemy.com/v2/${ALCHEMY_KEY}`;
  }

  // 4) Nothing left
  throw new Error(`No RPC configuration found for network '${slug}'`);
}
