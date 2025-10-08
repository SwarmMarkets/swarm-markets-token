export enum AccountTypes {
  MNEMONIC,
  PK,
  TESTNET_PK,
  HEDERA_PK,
  HYPEREVM_PK,
}

export interface ChainConfig {
  chainId: number;
  alchemySubdomain?: string;
  infuraSubdomain?: string;
  rpc?: string;
  explorer: string;
  api?: string;
}
