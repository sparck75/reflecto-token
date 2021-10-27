const { web3 } = require('@openzeppelin/test-environment');
const { expectRevert } = require('@openzeppelin/test-helpers');

const Reflecto = artifacts.require('Reflecto.sol');
const Distributoer = artifacts.require('DividendDistributor.sol');
const DexRouter = artifacts.require('./mock/DexRouter.sol');
const BEP20Basic = artifacts.require('./mock/BEP20Basic.sol');

contract('Reflecto', (accounts) => {
  let reflecto, dex, wbnbToken, t1, t2;
  const [admin, investor, _] = accounts;

  beforeEach(async () => {
    dex = await DexRouter.new();
    wbnbToken = await BEP20Basic.new("WBNB");
    t1 = await BEP20Basic.new("Token1");
    t2 = await BEP20Basic.new("Token2");


    reflecto = await Reflecto.new(dex.address, wbnbToken.address);

    await reflecto.donate({ value: web3.utils.toWei('0.1', 'ether') });

    // distribution = await reflecto.distributorAddress.call();
  });

  it('CRUD distributer', async () => {
    await reflecto.addDistributor(dex.address, t1.address, wbnbToken.address);

    const all = await reflecto.getDistributersBEP20Keys();

    const single = await reflecto.getDistributer(t1.address);
    // const unpaid = await single.getUnpaidEarnings(admin);

    // assert(unpaid === 0);
    assert(all[0] === t1.address);

    await reflecto.addDistributor(dex.address, t2.address, wbnbToken.address);

    const allAgain = await reflecto.getDistributersBEP20Keys();

    assert(allAgain[1] === t2.address);
    assert(allAgain.length === 2);

    await reflecto.deleteDistributor(t1.address);

    const allAgain1 = await reflecto.getDistributersBEP20Keys();
    assert(allAgain1.length === 1);
    assert(allAgain1[0] === t2.address);
  });

  it.only('Test shares after adding distributer', async () => {
    // Add frist dist
    const distributor1Addr = await reflecto.addDistributor(dex.address, t1.address, wbnbToken.address);
    const singleDist = await reflecto.getDistributer(t1.address);

    // check investitor shares
    const investiotorShares = await Distributoer.at(singleDist);
    console.log('Factory 1', singleDist);
    const shares = await investiotorShares.getShareholderAmount(investor);
    console.log('Shares before', shares / Math.pow(10, 9));

    // send some transactiions to investiotor
    await reflecto.transfer(investor, '30000000000000000000000');
    await reflecto.transfer(investor, '30000000000000000000000');
    await reflecto.transfer(investor, '30000000000000000000000');
    await reflecto.transfer(investor, '30000000000000000000000');
    await reflecto.transfer(investor, '30000000000000000000000');

    // check investitor shares after transfer
    const shares1 = await investiotorShares.getShareholderAmount(investor);
    console.log('Shares after', shares1 / Math.pow(10, 9));

    // add new distributor

    const tx = await reflecto.addDistributor(dex.address, t2.address, wbnbToken.address);
    console.log(tx);
    const newDist = await reflecto.getDistributer(t2.address);
    console.log('Factory 2', newDist);
    const investiotorShares1 = await Distributoer.at(newDist);
    const shares2 = await investiotorShares1.getShareholderAmount(investor);
    console.log('Shares after', shares2 / Math.pow(10, 9));

    // compare shares of investitor for new and old distributors
    assert.equal(shares1 / Math.pow(10, 9), shares2 / Math.pow(10, 9));
  });

  it('Test deposit function', async () => {
    await reflecto.addDistributor(dex.address, reflecto.address, wbnbToken.address);

    const all = await reflecto.getDistributersBEP20Keys();

    const single = await reflecto.getDistributer(reflecto.address);

    await reflecto.setSwapBackSettings(true, 0);

    console.log('Balance', (await reflecto.address) / Math.pow(10, 9));

    console.log((await dex.getBanalce()) / Math.pow(10, 9));

    await reflecto.transfer(investor, '30000000000000000000000');
    await reflecto.transfer(investor, '30000000000000000000000');
    await reflecto.transfer(investor, '30000000000000000000000');
    await reflecto.transfer(investor, '30000000000000000000000');
    await reflecto.transfer(investor, '30000000000000000000000');
    await reflecto.transfer(investor, '30000000000000000000000');
    await reflecto.transfer(investor, '30000000000000000000000');
    await reflecto.transfer(investor, '30000000000000000000000');
    await reflecto.transfer(investor, '30000000000000000000000');
    await reflecto.transfer(investor, '30000000000000000000000');
    await reflecto.transfer(investor, '30000000000000000000000');
    await reflecto.transfer(investor, '30000000000000000000000');
    const tx = await reflecto.transfer(investor, '30000000000000000000000');

    console.log(tx);

    // await(debug(reflecto.transfer(investor, '30000000000000000000000')))

    console.log((await reflecto.balanceOf(investor)) / Math.pow(10, 9));

    console.log((await dex.getBanalce()) / Math.pow(10, 9));
  });
});
