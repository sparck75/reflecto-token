import {
  BEP20Basic,
  CrypterToken,
  DexRouter,
  EverGrow,
  Reflecto,
} from '../typechain';

import { ethers, waffle } from 'hardhat';
import { expect } from 'chai';
import { parseEther } from 'ethers/lib/utils';

describe('Reflecto Transactions', function () {
  let reflecto: Reflecto;
  let dex: DexRouter;
  let wbnbToken: BEP20Basic;
  let busd: BEP20Basic;
  let crypt: CrypterToken;
  let egc: EverGrow;

  beforeEach(async () => {
    const Dex = await ethers.getContractFactory('DexRouter');
    const Reflecto = await ethers.getContractFactory('Reflecto');
    const WbnbToken = await ethers.getContractFactory('BEP20Basic');
    const BUSDToken = await ethers.getContractFactory('BEP20Basic');
    const Crypt = await ethers.getContractFactory('CrypterToken');
    const EGC = await ethers.getContractFactory('EverGrow');
    wbnbToken = await WbnbToken.deploy('WBNB');
    busd = await BUSDToken.deploy('BUSD');

    dex = await Dex.deploy();
    crypt = await Crypt.deploy(dex.address, dex.address);
    egc = await EGC.deploy(dex.address);
    reflecto = await Reflecto.deploy(dex.address, wbnbToken.address);
    await reflecto.donate({ value: parseEther('1.0') });

    await crypt.transfer(dex.address, '10000000000000000');
    await egc.transfer(dex.address, '10000000000000000');
    await busd.transfer(dex.address, '10000000000000000');
    await dex.donate({ value: parseEther('1.0') });
  });

  it('It should have proper fees and trensaction should be sent properly', async () => {
    const [adminSig, investorSig, tokenHolderSig] = await ethers.getSigners();
    const investor = investorSig.address;
    const admin = adminSig.address;
    const holder = tokenHolderSig.address;

    await reflecto.transfer(investor, '30000000000000000000000');

    const tenTokens = 10000000000;

    await reflecto.connect(investorSig).transfer(holder, tenTokens, {
      from: investor,
      gasLimit: 500000,
    });

    expect(((await reflecto.balanceOf(holder)) as any) / Math.pow(10, 9)).eq(8);
  });

  it('Marketing wallet and gas wallet should get proper amount', async () => {
    const [adminSig, investorSig, tokenHolderSig] = await ethers.getSigners();
    const investor = investorSig.address;
    const admin = adminSig.address;
    const holder = tokenHolderSig.address;

    await reflecto.setSwapBackSettings(true, 0);
    await reflecto.setFeeReceivers(holder, investor, investor);

    const provider = waffle.provider;
    const balance1: any = await provider.getBalance(investor);
    const balanceBeforeTaran = balance1 / Math.pow(10, 9);

    await reflecto.transfer(investor, '30000000000000000000000');
    const balance: any = await provider.getBalance(investor);
    const balanceAfterTran = balance / Math.pow(10, 9);

    const marketingAndGass = balanceAfterTran - balanceBeforeTaran;

    const totalFeeMinusHalfLiqFee = 0.2 - 0.02;
    const marketingAndGassFees = 0.04;
    const totalWhichDexReturnAfterSwap = 1;
    expect(marketingAndGass.toFixed(2)).eq(
      (
        (totalWhichDexReturnAfterSwap * marketingAndGassFees) /
        totalFeeMinusHalfLiqFee
      ).toFixed(2)
    );
  });

  it('Holders should receive proper rewards', async () => {
    const [
      adminSig,
      investorSig,
      tokenHolderSig,
      tokenHolder2Sig,
      tokenHolder3Sig,
    ] = await ethers.getSigners();
    const investor = investorSig.address;
    const admin = adminSig.address;
    const holder = tokenHolderSig.address;
    const holder1 = tokenHolder2Sig.address;
    const holder3 = tokenHolder3Sig.address;
    await reflecto.setSwapBackSettings(true, 0);
    await reflecto.setFeeReceivers(holder, investor, investor);

    const Distributer = await ethers.getContractFactory('DistributorFactory');
    const dist = await Distributer.deploy();

    // Add distributers
    const distributor = await reflecto.getDistributorFactory();
    const distributorInstance = dist.attach(distributor);

    await reflecto.addDistributor(
      dex.address,
      crypt.address,
      wbnbToken.address
    );

    await reflecto.addDistributor(dex.address, egc.address, wbnbToken.address);

    await reflecto.addDistributor(dex.address, busd.address, wbnbToken.address);

    await reflecto.transfer(holder, '600000000000000000000');
    await reflecto.transfer(holder1, '600000000000000000000');
    await reflecto.transfer(holder3, '600000000000000000000');

    await reflecto.transfer(investor, '3000000000000000000000');
    await reflecto.transfer(investor, '3000000000000000000000');
    await reflecto.transfer(investor, '3000000000000000000000');
    await reflecto.transfer(investor, '3000000000000000000000');
    await reflecto.transfer(investor, '3000000000000000000000');
    await reflecto.transfer(investor, '3000000000000000000000');
    await reflecto.transfer(holder, '6000');
    await reflecto.transfer(holder1, '6000');
    await reflecto.transfer(holder3, '6000');

    // check balance of holder
    const holder1RewardsBUSD =
      ((await busd.balanceOf(holder)) as any) / Math.pow(10, 9);
    const holder2RewardsBUSD =
      ((await busd.balanceOf(holder1)) as any) / Math.pow(10, 9);
    expect(holder1RewardsBUSD).eq(holder2RewardsBUSD);

    const holder1REwardsCrypt =
      ((await crypt.balanceOf(holder)) as any) / Math.pow(10, 9);
    const holder2RewardsCrypt =
      ((await crypt.balanceOf(holder1)) as any) / Math.pow(10, 9);
    expect(holder1REwardsCrypt).eq(holder2RewardsCrypt);

    const holder1REwardsEGC =
      ((await egc.balanceOf(holder)) as any) / Math.pow(10, 9);
    const holder3RewardsEGC =
      ((await egc.balanceOf(holder3)) as any) / Math.pow(10, 9);
    expect(holder1REwardsEGC).eq(holder3RewardsEGC);
  });
});
