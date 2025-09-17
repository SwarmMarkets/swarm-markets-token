import { ethers } from 'hardhat';
import { Wallet } from 'ethers';
import { HttpTransport, InfoClient, ExchangeClient } from '@nktkas/hyperliquid';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Initializes connection to Hyperliquid EVM via ethers.js + SDK transport
 */
export async function initHyperliquidClients() {
  // Default Hardhat provider
  const provider = ethers.provider;

  const pk = process.env.PK;

  if (!pk) {
    throw new Error(`No PK set in .env`);
  }

  // Use private key to create signer connected to Hardhat provider
  const wallet = new Wallet(pk, provider);

  // Configure Hyperliquid transport (REST + RPC endpoints)
  const transport = new HttpTransport({
    isTestnet: false,
    server: {
      mainnet: {
        api: 'https://api.hyperliquid.xyz',
        rpc: 'https://rpc.hyperliquid.xyz/evm',
      },
    },
  });

  // Initialize SDK clients
  const infoClient = new InfoClient({ transport });
  const exchangeClient = new ExchangeClient({ transport, wallet });

  return { provider, infoClient, exchangeClient };
}

/**
 * Enables big block mode on-chain for the wallet
 */
export async function enableBigBlocks(exchangeClient: ExchangeClient) {
  await exchangeClient.evmUserModify({ usingBigBlocks: true });
  console.log('✅ Big block mode enabled via ExchangeClient');
}

/**
 * Disables big block mode on-chain for the wallet
 */
export async function disableBigBlocks(exchangeClient: ExchangeClient) {
  await exchangeClient.evmUserModify({ usingBigBlocks: false });
  console.log('🛑 Big block mode disabled via ExchangeClient');
}
