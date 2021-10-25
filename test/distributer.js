const { web3 } = require('@openzeppelin/test-environment');
const { expectRevert } = require('@openzeppelin/test-helpers');

const Reflecto = artifacts.require('Reflecto.sol');
const DexRouter = artifacts.require('./mock/DexRouter.sol');

contract('Reflecto', (accounts) => {
  let reflecto, dex;
  const [admin, investor, _] = accounts;

  beforeEach(async () => {
    dex = await DexRouter.new();
    reflecto = await Reflecto.new(
      dex.address,
      '0x10ED43C718714eb63d5aA57B78B54704E256024E'
    );

    await reflecto.donate({ value: web3.utils.toWei('0.1', 'ether') });
    reflecto2 = await Reflecto.new(
      dex.address,
      '0x10ED43C718714eb63d5aA57B78B54704E256024E'
    );

    reflecto3 = await Reflecto.new(
      dex.address,
      '0x10ED43C718714eb63d5aA57B78B54704E256024E'
    );

    // distribution = await reflecto.distributorAddress.call();
  });

  it('CRUD distributer', async () => {
    await reflecto.addDistributor(dex.address, reflecto2.address);

    const all = await reflecto.getDistributersBEP20Keys();

    const single = await reflecto.getDistributer(reflecto2.address);
    // const unpaid = await single.getUnpaidEarnings(admin);

    // assert(unpaid === 0);
    assert(all[0] === reflecto2.address);

    await reflecto.addDistributor(dex.address, reflecto3.address);

    const allAgain = await reflecto.getDistributersBEP20Keys();

    assert(allAgain[1] === reflecto3.address);

    await reflecto.deleteDistributor(reflecto2.address);

    const allAgain1 = await reflecto.getDistributersBEP20Keys();
    assert(allAgain1[0] === reflecto3.address);
  });

  it.only('Test deposit function', async () => {
    await reflecto.addDistributor(dex.address, reflecto.address);

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
