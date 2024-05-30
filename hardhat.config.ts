/* eslint-disable */
import '@nomicfoundation/hardhat-toolbox';
import dotenv from 'dotenv';
import '@nomiclabs/hardhat-waffle';
import 'hardhat-typechain';
import 'solidity-coverage';
import 'hardhat-gas-reporter';
import 'hardhat-contract-sizer';
import '@nomiclabs/hardhat-etherscan';
import { HardhatUserConfig } from 'hardhat/config';
import { getNetworkConfig, AccountTypes } from './utils/get-network-account';
dotenv.config();

const etherscanKey = process.env.ETHSCAN_KEY ?? '';
const polyscanKey = process.env.POLYSCAN_KEY ?? '';
const basescanKey = process.env.BASESCAN_KEY ?? '';
const opscanKey = process.env.OPSCAN_KEY ?? '';
const arbitrumscanKey = process.env.ARBSCAN_KEY ?? '';

export const ethApiKey = process.env.ALCHEMY_KEY_ETH;

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.26',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          viaIR: true,
        },
      },
      {
        version: '0.7.0',
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
      accounts: {
        accountsBalance: '10000000000000000000000000',
      },
      forking: {
        url: getNetworkConfig('mainnet', AccountTypes.SwarmMnemonic).url!,
        enabled: false,
        //blockNumber: 16383055,
      },
    },
    mainnet: getNetworkConfig('mainnet', AccountTypes.SwarmXMnemonic),
    polygon: getNetworkConfig('polygon', AccountTypes.SwarmXMnemonic),
    optimism: getNetworkConfig('optimism', AccountTypes.SwarmXMnemonic),
    base: getNetworkConfig('base', AccountTypes.SwarmXMnemonic),
    arbitrum: getNetworkConfig('arbitrum', AccountTypes.SwarmXMnemonic),
    sepolia: getNetworkConfig('sepolia', AccountTypes.TestnetPk),
    mumbai: getNetworkConfig('mumbai', AccountTypes.TestnetPk),
    base_sepolia: getNetworkConfig('base_sepolia', AccountTypes.TestnetPk),
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: false,
    disambiguatePaths: false,
  },
  etherscan: {
    apiKey: {
      mainnet: etherscanKey,
      polygon: polyscanKey,
      optimisticEthereum: opscanKey,
      base: basescanKey,
      arbitrumOne: arbitrumscanKey,
      base_sepolia: basescanKey,
      sepolia: etherscanKey
    },
    customChains: [
      {
        network: 'base',
        chainId: 8453,
        urls: {
          apiURL: 'https://api.basescan.org/api',
          browserURL: 'https://basescan.org/',
        },
      },
      {
        network: 'base_sepolia',
        chainId: 84532,
        urls: {
          apiURL: 'https://api-sepolia.basescan.org/api',
          browserURL: 'https://sepolia.basescan.org',
        },
      },
    ],
  },
  // docgen: {
  //   // path: './docs',
  //   // clear: true,
  //   // runOnCompile: true,
  //   pages: 'files',
  // },
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
