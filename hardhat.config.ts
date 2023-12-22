import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';
dotenvConfig({ path: resolve(__dirname, './.env') });

import { HardhatUserConfig } from 'hardhat/config';
// import { HardhatNetworkUserConfig } from 'hardhat/types/config';
import { NetworkUserConfig } from 'hardhat/types';
import './tasks/accounts';
import './tasks/clean';

import '@nomiclabs/hardhat-waffle';
import 'hardhat-typechain';
import 'solidity-coverage';
import 'hardhat-gas-reporter';
import 'hardhat-contract-sizer';
import '@nomiclabs/hardhat-etherscan';

// Ensure that we have all the environment variables we need.
const mnemonic = process.env.MNEMONIC || '';
const swarmx_privateKey = process.env.SWARMX_DEPLOYER_PK || '';
const testnet_privateKey = process.env.TESTNET_DEPLOYER_PK || '';

const etherscanKey = process.env.ETHSCAN_KEY || '';
const polyscanKey = process.env.POLYSCAN_KEY || '';

const infuraKey = process.env.INFURA_KEY != '' ? process.env.INFURA_KEY : '';
const ethApiKey = process.env.ALCHEMY_KEY_ETH != '' ? process.env.ALCHEMY_KEY_ETH : infuraKey;
const sepoliaApiKey = process.env.ALCHEMY_KEY_SEPOLIA != '' ? process.env.ALCHEMY_KEY_SEPOLIA : infuraKey;
const polygonApiKey = process.env.ALCHEMY_KEY_POLYGON != '' ? process.env.ALCHEMY_KEY_POLYGON : infuraKey;
const mumbaiApiKey = process.env.ALCHEMY_KEY_MUMBAI != '' ? process.env.ALCHEMY_KEY_MUMBAI : infuraKey;

const config: HardhatUserConfig = {
  // docgen: {
  //   // path: './docs',
  //   // clear: true,
  //   // runOnCompile: true,
  //   pages: 'files',
  // },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      blockGasLimit: 20000000,
      throwOnCallFailures: false,
      chainId: 31337,
      // accounts: {
      //   mnemonic,
      //   accountsBalance: '1000000000000000000000',
      // },
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${ethApiKey}`,
        enabled: true,
        //blockNumber: 16383055,
      },
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${ethApiKey}`,
      chainId: 1,
      accounts: [swarmx_privateKey],
      gas: 2100000,
      gasPrice: 45000000000, // 45
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${sepoliaApiKey}`,
      chainId: 11155111,
      accounts: [testnet_privateKey],
      gas: 2100000,
      gasPrice: 45000000000, // 45
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${polygonApiKey}`,
      chainId: 137,
      accounts: [swarmx_privateKey],
      gas: 5000000,
      gasPrice: 250000000000, // 250
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${mumbaiApiKey}`,
      chainId: 80001,
      accounts: [testnet_privateKey],
      gas: 2100000,
      gasPrice: 45000000000, // 45
      gasMultiplier: 2,
    },
  },
  paths: {
    artifacts: './artifacts',
    cache: './cache',
    sources: './contracts',
    tests: './test',
  },

  solidity: {
    compilers: [
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        }
      },
    ],
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
  },
  gasReporter: {
    coinmarketcap: process.env.COIN_MARKET_CAP_KEY,
    currency: 'USD',
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: ['mocks/', 'test/'],
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: false,
    disambiguatePaths: false,
  },
  etherscan: {
    apiKey: etherscanKey || polyscanKey,
  },
};

export default config;
