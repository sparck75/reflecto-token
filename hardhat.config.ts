const dotEnv = require('dotenv');
dotEnv.config();

import { task } from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});
// const { mnemonic } = require('./secrets.json');

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: 'mainnet',
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
      gasPrice: 20000000000,
    },
    ganache: {
      url: 'http://127.0.0.1:9545',
      // chainId: 97,
      // network_id: '5777',
      gasPrice: 20000000000,
      accounts: [process.env.WALLET_PRIVATE_KEY],
    },
    hardhat: {},
    testnet: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      chainId: 97,
      // gas: 10000000,
      // gasPrice: 20000000000,
      accounts: [process.env.WALLET_PRIVATE_KEY],
    },
    mainnet: {
      url: 'https://bsc-dataseed.binance.org/',
      chainId: 56,
      // gasPrice: 20000000000,
      accounts: [process.env.WALLET_PRIVATE_KEY],
    },
  },
  solidity: {
    version: '0.8.0',
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  mocha: {
    timeout: 20000,
  },
};
