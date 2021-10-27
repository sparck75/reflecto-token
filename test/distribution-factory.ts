import { BEP20Basic, DexRouter, Reflecto } from '../typechain';

import { ethers } from 'hardhat';
import { expect } from 'chai';

describe('Reflecto', function () {
  let reflecto: Reflecto;
  let dex: DexRouter;
  let wbnbToken: BEP20Basic;
  let t1: BEP20Basic;
  let t2: BEP20Basic;

  beforeEach(async () => {
    const Dex = await ethers.getContractFactory('DexRouter');
    const Reflecto = await ethers.getContractFactory('Reflecto');
    const WbnbToken = await ethers.getContractFactory('BEP20Basic');
    const T1 = await ethers.getContractFactory('BEP20Basic');
    const T2 = await ethers.getContractFactory('BEP20Basic');
    wbnbToken = await WbnbToken.deploy('WBNB');
    t1 = await T1.deploy('Token Reward 1');
    t2 = await T2.deploy('Token Reward 2');

    dex = await Dex.deploy();
    reflecto = await Reflecto.deploy(dex.address, wbnbToken.address);
  });

  it('CRUD distributer', async () => {
    await reflecto.addDistributor(dex.address, t1.address, wbnbToken.address);

    const all = await reflecto.getDistributersBEP20Keys();

    const single = await reflecto.getDistributer(t1.address);
    // const unpaid = await single.getUnpaidEarnings(admin);

    // assert(unpaid === 0);
    expect(all[0]).to.be.equal(t1.address);

    await reflecto.addDistributor(dex.address, t2.address, wbnbToken.address);

    const allAgain = await reflecto.getDistributersBEP20Keys();

    expect(allAgain[1]).to.be.eq(t2.address);
    expect(allAgain.length).to.be.eq(2);

    await reflecto.deleteDistributor(t1.address);

    const allAgain1 = await reflecto.getDistributersBEP20Keys();
    expect(allAgain1.length).eq(1);
    expect(allAgain1[0]).eq(t2.address);
  });

  it.only('Test shares after adding distributer', async () => {
    const [adminSig, investorSig] = await ethers.getSigners();
    const investor = investorSig.address;
    const admin = adminSig.address;

    const Distributer = await ethers.getContractFactory('DistributorFactory');
    const dist = await Distributer.deploy();
    // dist.attach()
    // Add frist dist
    const distributor = await reflecto.getDistributorFactory();
    const distributorInstance = dist.attach(distributor);

    const distributor1Addr = await reflecto.addDistributor(
      dex.address,
      t1.address,
      wbnbToken.address
    );
    const singleDist = await reflecto.getDistributer(t1.address);

    // check investitor shares

    console.log('Distributer 1', singleDist);
    const shares: any = await distributorInstance.getShareholderAmount(
      t1.address,
      investor
    );
    console.log('Shares before', shares / Math.pow(10, 9));

    // // send some transactiions to investiotor
    await reflecto.transfer(investor, '30000000000000000000000');
    await reflecto.transfer(investor, '30000000000000000000000');
    await reflecto.transfer(investor, '30000000000000000000000');
    await reflecto.transfer(investor, '30000000000000000000000');
    await reflecto.transfer(investor, '30000000000000000000000');

    // check investitor shares after transfer
    const shares1: any = await distributorInstance.getShareholderAmount(
      t1.address,
      investor
    );
    console.log('Shares after', shares1 / Math.pow(10, 9));

    // add new distributor

    await reflecto.addDistributor(dex.address, t2.address, wbnbToken.address);

    const newDist = await reflecto.getDistributer(t2.address);
    console.log('Distributer 2', newDist);
    const shares2: any = await distributorInstance.getShareholderAmount(
      t2.address,
      investor
    );
    console.log('Shares after', shares2 / Math.pow(10, 9));

    // compare shares of investitor for new and old distributors
    expect(shares1 / Math.pow(10, 9)).eq(shares2 / Math.pow(10, 9));
  });

  //   it('Test deposit function', async () => {
  //     await reflecto.addDistributor(
  //       dex.address,
  //       reflecto.address,
  //       wbnbToken.address
  //     );

  //     const all = await reflecto.getDistributersBEP20Keys();

  //     const single = await reflecto.getDistributer(reflecto.address);

  //     await reflecto.setSwapBackSettings(true, 0);

  //     console.log('Balance', (await reflecto.address) / Math.pow(10, 9));

  //     console.log((await dex.getBanalce()) / Math.pow(10, 9));

  //     await reflecto.transfer(investor, '30000000000000000000000');
  //     await reflecto.transfer(investor, '30000000000000000000000');
  //     await reflecto.transfer(investor, '30000000000000000000000');
  //     await reflecto.transfer(investor, '30000000000000000000000');
  //     await reflecto.transfer(investor, '30000000000000000000000');
  //     await reflecto.transfer(investor, '30000000000000000000000');
  //     await reflecto.transfer(investor, '30000000000000000000000');
  //     await reflecto.transfer(investor, '30000000000000000000000');
  //     await reflecto.transfer(investor, '30000000000000000000000');
  //     await reflecto.transfer(investor, '30000000000000000000000');
  //     await reflecto.transfer(investor, '30000000000000000000000');
  //     await reflecto.transfer(investor, '30000000000000000000000');
  //     const tx = await reflecto.transfer(investor, '30000000000000000000000');

  //     console.log(tx);

  //     // await(debug(reflecto.transfer(investor, '30000000000000000000000')))

  //     console.log((await reflecto.balanceOf(investor)) / Math.pow(10, 9));

  //     console.log((await dex.getBanalce()) / Math.pow(10, 9));
  //   });
});