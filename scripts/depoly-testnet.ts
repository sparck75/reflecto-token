import { run, ethers } from 'hardhat';
import { Reflecto } from '../typechain/Reflecto';

async function main() {
  await run('compile');
  const Reflecto = await ethers.getContractFactory('Reflecto');
  const routerAddress = '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3';
  const WBNBAddress = '0xae13d989dac2f0debff460ac112a837c89baa7cd';
  const BUSD = '0x78867bbeef44f2326bf8ddd1941a4439382ef2a7';
  const Crypter = '0x8babbb98678facc7342735486c851abd7a0d17ca';

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

  console.log("BUSD deployed ", tx1.hash);

  const tx2 = await reflecto.addDistributor(
    routerAddress, // Router
    Crypter, // Reward token
    WBNBAddress, // WBNB
    {
      from: '0xc94FFb653315E982847838b977edd099aF7daEFB',
      gasLimit: 5000000,
    }
  );

  console.log("Crypter deployed ", tx2.hash);
  
  console.log('Pakcakeswap Pair Address', await reflecto.pair());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
