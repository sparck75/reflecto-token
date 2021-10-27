import { run, ethers } from 'hardhat';
import { Greeter } from '../typechain';

async function main() {
  await run('compile');
  const Greeter = await ethers.getContractFactory('Greeter');
  const greeter: Greeter = await Greeter.deploy('Hello, Hardhat!');

  await greeter.deployed();
  console.log('Greeter deployed to:', greeter.address);
  const accounts = await ethers.getSigners();

  console.log(
    'Accounts:',
    accounts.map((a) => a.address)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
