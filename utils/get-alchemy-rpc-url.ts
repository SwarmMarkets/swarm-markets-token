import { chainIds } from './chain-ids';
import dotenv from 'dotenv';
dotenv.config();

const networkToAlchemyHostMap: Record<keyof typeof chainIds, string> = Object.freeze({
  mainnet: 'eth-mainnet.g.alchemy.com/v2/',
  sepolia: 'eth-sepolia.g.alchemy.com/v2/',
  polygon: 'polygon-mainnet.g.alchemy.com/v2/',
  mumbai: 'polygon-mumbai.g.alchemy.com/v2/',
  optimism: 'opt-mainnet.g.alchemy.com/v2/',
  base: 'base-mainnet.g.alchemy.com/v2/',
  base_sepolia: 'base-sepolia.g.alchemy.com/v2/',
  arbitrum: 'arb-mainnet.g.alchemy.com/v2/',
  arbitrum_sepolia: 'arb-sepolia.g.alchemy.com/v2/',
});

const apiToAlchemyHostMap: Record<keyof typeof chainIds, string> = Object.freeze({
  mainnet: process.env.ALCHEMY_KEY_ETH as string,
  sepolia: process.env.ALCHEMY_KEY_SEPOLIA as string,
  polygon: process.env.ALCHEMY_KEY_POLYGON as string,
  mumbai: process.env.ALCHEMY_KEY_MUMBAI as string,
  optimism: process.env.ALCHEMY_KEY_OPTIMISM as string,
  base: process.env.ALCHEMY_KEY_BASE as string,
  base_sepolia: process.env.ALCHEMY_KEY_BASE_SEPOLIA as string,
  arbitrum: process.env.ALCHEMY_KEY_ARBITRUM as string,
  arbitrum_sepolia: process.env.ALCHEMY_KEY_ARBITRUM_SEPOLIA as string,
});

export function getAlchemyRpcUrl(network: keyof typeof chainIds): string {
  const apiKey = apiToAlchemyHostMap[network];

  const host = networkToAlchemyHostMap[network];

  if (!host) {
    return undefined!;
  }

  return `https://${host}${apiKey}`;
}
