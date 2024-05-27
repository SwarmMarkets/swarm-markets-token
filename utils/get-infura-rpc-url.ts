import { chainIds } from './chain-ids';
import dotenv from 'dotenv';
dotenv.config();

const networkToInfuraHostMap: Record<keyof typeof chainIds, string> = Object.freeze({
  mainnet: 'mainnet.infura.io/v3/',
  sepolia: 'sepolia.infura.io/v3/',
  polygon: 'polygon-mainnet.infura.io/v3/',
  mumbai: 'polygon-mumbai.infura.io/v3/',
  optimism: 'optimism-mainnet.infura.io/v3/',
  base: 'n/a',
  base_sepolia: 'n/a',
  arbitrum: 'arbitrum-mainnet.infura.io/v3/',
});

export function getInfuraRpcUrl(network: keyof typeof chainIds): string {
  const apiKey = process.env.INFURA_KEY;

  const host = networkToInfuraHostMap[network];

  if (!host) {
    throw new Error(`[getInfuraRpcUrl]: No host for network ${network}`);
  }

  return `https://${host}${apiKey}`;
}
