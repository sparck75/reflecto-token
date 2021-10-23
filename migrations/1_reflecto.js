const Reflecto = artifacts.require('Reflecto');
const DexMock = artifacts.require('./mock/DexRouter.sol');

module.exports = async (deployer, network, addresses) => {
  const [admin, investor, _, someone] = addresses;

  // Deploy mocked dex
  await deployer.deploy(DexMock);
  const dex = await DexMock.deployed();
  console.log('Dex Contract Address', dex.address);

  // Deploy Reflecto
  const tx = await deployer.deploy(Reflecto, dex.address);
  const token = await Reflecto.deployed();
  console.log('Reflecto Contract Address', token.address);
};
