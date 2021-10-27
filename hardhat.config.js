require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-ethers');
// const { mnemonic } = require('./secrets.json');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

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
    },
    ganache: {
      url: 'http://127.0.0.1:9545',
      // chainId: 97,
      // network_id: '5777',
      gasPrice: 20000000000,
      accounts: [
        '22d42ef7b322a59ac87e05d5c18bbbf05d6160ce0d96a8fc0b2137f6c69578e8',
      ],
    },
    hardhat: {},
    testnet: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [
        'ed0004ddbff73cf2e41b49c816cae97ec180c68ba0a3e2b54bdf9fe8f5855fcc',
      ],
    },
    mainnet: {
      url: 'https://bsc-dataseed.binance.org/',
      chainId: 56,
      gasPrice: 20000000000,
      accounts: [
        'ed0004ddbff73cf2e41b49c816cae97ec180c68ba0a3e2b54bdf9fe8f5855fcc',
      ],
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
