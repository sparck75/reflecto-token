const { time } = require('@openzeppelin/test-helpers');
const { assertion } = require('@openzeppelin/test-helpers/src/expectRevert');
const Reflecto = artifacts.require('Reflecto.sol');
const DexRouter = artifacts.require('./mock/DexRouter.sol');

contract('Token', (accounts) => {
  let reflecto, distribution, dex;
  const [admin, investor, _] = accounts;

  beforeEach(async () => {
    dex = await DexRouter.new();
    reflecto = await Reflecto.new(dex.address);
    distribution = await reflecto.distributorAddress.call();
    // await reward.transfer(token.address, web3.utils.toWei('1000'));
    // const functionSignature = web3.eth.abi.encodeFunctionSignature(
    //   'setRewards(uint32,uint32,uint96)'
    // );
    // await token.grantRole(functionSignature, admin);

    // const functionBurn = web3.eth.abi.encodeFunctionSignature(
    //   'burn(address,uint256)'
    // );
    // await token.grantRole(functionBurn, admin);

    // const functionMint = web3.eth.abi.encodeFunctionSignature(
    //   'mint(address,uint256)'
    // );
    // await token.grantRole(functionMint, admin);
  });
  it('should return distribution contract', async () => {
    console.log('Get address', distribution);
    assert(distribution);
  });

  it('balance of contract deployer should be 1000000000000000', async () => {
    const balance = await reflecto.balanceOf(admin);
    const totalBalance = balance / Math.pow(10, 9);
    assert(totalBalance === 1000000000000000);
  });
  //   it('should give rewards', async () => {
  //     const { timestamp } = await web3.eth.getBlock('latest');
  //     const start = timestamp;
  //     const end = timestamp + 100;

  //     await token.setRewards(start, end, web3.utils.toWei('1'));
  //     await token.transfer(investor, web3.utils.toWei('1000'));
  //     await time.increase(100);
  //     await token.claim(investor, { from: investor });
  //     const rewardBalance = await reward.balanceOf(investor);
  //     //I fixed the below assertion by increasing the number of tokens transferred to the investor
  //     //Before I put a very low number that made the reward amount less than 1, which was rounded down to 0 by a division in the smart contract
  //     //This edge case happened because I used very small amounts of tokens for testing (i.e way less than 1 token)
  //     //But in real tokens, amounts in wei will be much greater, this edge case will probably never happen and even small investors will always get some rewards

  //     assert(web3.utils.fromWei(rewardBalance.toString()) === '0.05'); // scaled down numbers 100*1*1000/2000000 = 0.05 |
  //     // secondsPass * rewardPerSec * investedTokens / total supply
  //   });

  //   it('should mint and burn', async () => {
  //     await token.mint(admin, web3.utils.toWei('1000000'));

  //     const tokenBalance = await token.balanceOf(admin);
  //     assert(web3.utils.fromWei(tokenBalance.toString()) === '3000000');

  //     await token.burn(admin, web3.utils.toWei('1000000'));
  //     const tokenBalance1 = await token.balanceOf(admin);
  //     assert(web3.utils.fromWei(tokenBalance1.toString()) === '2000000');
  //   });
});
