const Reflecto = artifacts.require('Reflecto');
const DexMock = artifacts.require('./mock/DexRouter.sol');

module.exports = async (deployer, network, addresses) => {
  const [admin, investor, _, someone] = addresses;

  if (network === 'development') {
    // Deploy mocked dex
    await deployer.deploy(DexMock);
    const dex = await DexMock.deployed();
    console.log('Dex Contract Address', dex.address);

    // Deploy Reflecto
    const tx = await deployer.deploy(
      Reflecto,
      dex.address,
      '0x10ED43C718714eb63d5aA57B78B54704E256024E'
    );
    const token = await Reflecto.deployed();
    console.log('Reflecto Contract Address', token.address);
    console.log('Pakcakeswap Pair Address', await token.pair.call());
  } else if (network === 'testnet') {
    // Deploy Reflecto
    const tx = await deployer.deploy(
      Reflecto,
      '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3',
      '0xae13d989dac2f0debff460ac112a837c89baa7cd'
    );

    const token = await Reflecto.deployed();

    await token.addDistributor(
      '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3',
      '0x78867bbeef44f2326bf8ddd1941a4439382ef2a7'
    );
    await token.addDistributor(
      '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3',
      '0xf9f93cf501bfadb6494589cb4b4c15de49e85d0e'
    );
    console.log('Reflecto TESTNET Contract Address', token.address);
    console.log('Pakcakeswap Pair Address', await token.pair.call());
  } else if (network === 'bsc') {
    // Deploy Reflecto
    const tx = await deployer.deploy(
      Reflecto,
      '0x10ed43c718714eb63d5aa57b78b54704e256024e ',
      '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'
    );

    await token.addDistributor(
      '0x10ed43c718714eb63d5aa57b78b54704e256024e ',
      '0xda6802bbec06ab447a68294a63de47ed4506acaa'
    );
    await token.addDistributor(
      '0x10ed43c718714eb63d5aa57b78b54704e256024e ',
      '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'
    );
    const token = await Reflecto.deployed();
    console.log('Reflecto MAIN NET Contract Address', token.address);
    console.log('Pakcakeswap Pair Address', await token.pair.call());
  } else {
    console.log('NOT NETWORK SEPCIFIED');
  }
};
