/* eslint-disable */
import '@openzeppelin/hardhat-upgrades';
import '@nomicfoundation/hardhat-toolbox';
import 'solidity-docgen';
import dotenv from 'dotenv';
import type { HardhatUserConfig } from 'hardhat/config';
import { getNetworkConfig } from './utils/getNetworkConfig';
import { etherscanConfig as etherscan } from './utils/blockscanConfig';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.27',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.8.19',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.7.5',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.5.16',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      throwOnCallFailures: false,
      chainId: 31337,
      initialBaseFeePerGas: 0,
      accounts: { accountsBalance: '10000000000000000000000000' },
      forking: {
        url: getNetworkConfig('mainnet').url!,
        enabled: false,
      },
    },
    mainnet: getNetworkConfig('mainnet'),
    optimism: getNetworkConfig('optimism'),
    bsc: getNetworkConfig('bsc'),
    bscMainnet: {
      url: 'https://bsc-dataseed.binance.org/', // Public BSC mainnet RPC (or use testnet: https://data-seed-prebsc-1-s1.binance.org:8545/)
      accounts: [process.env.PK!], // Replace with your deployer's private key
      chainId: 56, // BSC mainnet (use 97 for testnet)
      gasPrice: 5000000000, // Set to 5 Gwei to cover BSC's minimum tip
      gas: 8000000, // Optional: Set a high gas limit for complex deployments
    },
    gnosis: getNetworkConfig('gnosis'),
    unichain: getNetworkConfig('unichain'),
    polygon: getNetworkConfig('polygon'),
    sonic: getNetworkConfig('sonic'),
    hedera: getNetworkConfig('hedera'),
    // hederaMainnet: {
    //   url: 'https://mainnet.hashio.io/api',
    //   chainId: 295,
    //   accounts: [process.env.HEDERA_PK!],
    //   blockGasLimit: 4_000_000,
    //   gas: 4_000_000,
    // },
    polygonZk: getNetworkConfig('polygonZk'),
    base: getNetworkConfig('base'),
    mode: getNetworkConfig('mode'),
    arbitrum: getNetworkConfig('arbitrum'),
    celo: getNetworkConfig('celo'),
    snowtrace: getNetworkConfig('snowtrace'),
    linea: getNetworkConfig('linea'),
    blast: getNetworkConfig('blast'),
    hyperevm: getNetworkConfig('hyperevm'),
    plume: getNetworkConfig('plume'),
    scroll: getNetworkConfig('scroll'),
    mezo: getNetworkConfig('mezo'),
    plasma: getNetworkConfig('plasma'),
    amoy: getNetworkConfig('amoy'),
    base_sepolia: getNetworkConfig('base_sepolia'),
    arbitrum_sepolia: getNetworkConfig('arbitrum_sepolia'),
    sepolia: getNetworkConfig('sepolia'),
    hedera_testnet: getNetworkConfig('hedera_testnet'),
  },
  gasReporter: {
    coinmarketcap: process.env.COIN_MARKET_CAP_KEY,
    currency: 'USD',
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: ['mocks/', 'test/'],
  },
  etherscan,
  // sourcify: {
  //   enabled: true,
  //   apiUrl: 'https://server-verify.hashscan.io',
  //   browserUrl: 'https://repository-verify.hashscan.io',
  // },
  docgen: {
    outputDir: './docs/TechnicalRequirements',
    exclude: ['mocks', 'OpenDotc/v1'],
    pages: 'files',
  },
  paths: {
    artifacts: './artifacts',
    cache: './cache',
    sources: './contracts',
    tests: './test',
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
  },
};

export default config;
