import { HttpNetworkUserConfig } from 'hardhat/types';
import dotenv from 'dotenv';
import { getNetworkAccounts } from './getNetworkAccounts';
import { getChainRpc } from './getChainRpc';
import { AccountTypes, ChainConfig } from './types';
import chainConfig from './chain-properties.json';

dotenv.config();

const testnets = ['amoy', 'base_sepolia', 'arbitrum_sepolia', 'sepolia'];
const hederaOnly = ['hedera', 'hedera_testnet'];

const networkAccountMap: Record<string, AccountTypes> = Object.fromEntries(
  Object.keys(chainConfig).map(slug => {
    if (testnets.includes(slug)) {
      return [slug, AccountTypes.TESTNET_PK];
    }
    if (hederaOnly.includes(slug)) {
      return [slug, AccountTypes.HEDERA_PK];
    }
    if (slug === 'hyperevm') {
      return [slug, AccountTypes.HYPEREVM_PK];
    }
    return [slug, AccountTypes.PK];
  }),
);

export function getNetworkConfig(slug: string, override?: HttpNetworkUserConfig): HttpNetworkUserConfig {
  const entry = (chainConfig as Record<string, ChainConfig>)[slug];
  if (!entry) {
    throw new Error(`Network '${slug}' not found in chain-config.json`);
  }

  if (!(slug in networkAccountMap)) {
    throw new Error(`No AccountType mapped for network '${slug}'`);
  }

  // const timeout = slug === 'hedera' ? 60_000 : undefined;

  return {
    accounts: getNetworkAccounts(networkAccountMap[slug]),
    url: override?.url ?? getChainRpc(slug),
    // gas: 12_000_000,
    chainId: entry.chainId,
    // timeout,
    ...override,
  };
}
