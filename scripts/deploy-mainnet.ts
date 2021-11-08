import { run, ethers } from 'hardhat';
import { Reflecto } from '../typechain/Reflecto';

async function main() {
  await run('compile');
  const Reflecto = await ethers.getContractFactory('Reflecto');
  const routerAddress = '0x10ed43c718714eb63d5aa57b78b54704e256024e';
  const WBNBAddress = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c';
  const BUSD = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56';
  const Crypter = '0xda6802bbec06ab447a68294a63de47ed4506acaa';
  const EverGrow = '0xc001bbe2b87079294c63ece98bdd0a88d761434e';

  const reflecto: Reflecto = await Reflecto.deploy(
    routerAddress, // Router
    WBNBAddress // WBNB
  );

  console.log('Reflecto TESTNET Contract Address', reflecto.address);

  const tx1 = await reflecto.addDistributor(
    routerAddress, // Router
    BUSD, // Reward token
    WBNBAddress, // WBNB
    {
      from: '0xc94FFb653315E982847838b977edd099aF7daEFB',
      gasLimit: 5000000,
    }
  );

  console.log('BUSD deployed ', tx1.hash);

  const tx2 = await reflecto.addDistributor(
    routerAddress, // Router
    Crypter, // Reward token
    WBNBAddress, // WBNB
    {
      from: '0xc94FFb653315E982847838b977edd099aF7daEFB',
      gasLimit: 5000000,
    }
  );

  console.log('Crypter deployed ', tx2.hash);

  const tx3 = await reflecto.addDistributor(
    routerAddress, // Router
    EverGrow, // Reward token
    WBNBAddress, // WBNB
    {
      from: '0xc94FFb653315E982847838b977edd099aF7daEFB',
      gasLimit: 5000000,
    }
  );

  console.log('EverGrow deployed ', tx3.hash);

  console.log('Pakcakeswap Pair Address', await reflecto.pair());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
