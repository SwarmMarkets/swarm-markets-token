import { HttpNetworkAccountsUserConfig } from 'hardhat/types';
import dotenv from 'dotenv';
import { AccountTypes } from './types';

dotenv.config();

// Map each AccountType to its corresponding env var
const hostMap: Record<AccountTypes, string | undefined> = {
  [AccountTypes.MNEMONIC]: process.env.MNEMONIC,
  [AccountTypes.PK]: process.env.PK,
  [AccountTypes.TESTNET_PK]: process.env.TESTNET_PK,
  [AccountTypes.HEDERA_PK]: process.env.HEDERA_PK,
};

/**
 * Returns the accounts configuration for a given AccountType.
 * - Mnemonic-based types return a HD wallet config
 * - Key-based types return a single-key array
 */
export function getNetworkAccounts(accountType: AccountTypes): HttpNetworkAccountsUserConfig {
  const account = hostMap[accountType];

  if (!account || account.trim() === '') {
    throw new Error(`[getNetworkAccounts]: Missing credentials for ${AccountTypes[accountType]}`);
  }

  switch (accountType) {
    case AccountTypes.MNEMONIC:
      return {
        mnemonic: account,
        path: "m/44'/60'/0'/0",
        count: 10,
        initialIndex: 0,
      };
    default:
      return [account];
  }
}
