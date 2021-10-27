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
      '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    );
    // distribution = await reflecto.distributorAddress.call();
  });

  it('balance of contract deployer should be 1000000000000000', async () => {
    const balance = await reflecto.balanceOf(admin);
    const totalBalance = balance / Math.pow(10, 9);
    assert(totalBalance === 1000000000000000);
  });

  it('initializes DOMAIN_SEPARATOR and PERMIT_TYPEHASH correctly', async () => {
    assert.equal(await reflecto.PERMIT_TYPEHASH(), PERMIT_TYPEHASH);
    const ci = await reflecto.getChainID.call();
    assert.equal(
      await reflecto.DOMAIN_SEPARATOR(),
      getDomainSeparator(
        await reflecto.name.call(),
        reflecto.address,
        ci.toNumber()
      )
    );
  });

  it('permits and emits Approval (replay safe)', async () => {
    // Try transfer
    expectRevert(
      reflecto.transferFrom(admin, investor, 3000, { from: investor }),
      'Insufficient Allowance -- Reason given: Insufficient Allowance.'
    );
    // Create the approval request
    const approve = {
      owner: admin,
      spender: investor,
    };

    // deadline as much as you want in the future
    const deadline = 100000000000000;

    // Get the user's nonce
    const nonceBn = await reflecto.nonces(admin);
    const contractAdress = reflecto.address;
    const chain = await reflecto.getChainID.call();
    const chainId = chain.toNumber();
    const name = await reflecto.name.call();
    const nonce = nonceBn.toNumber();
    // Get the EIP712 digest

    // console.log()
    const digest = getPermitDigest(
      name,
      contractAdress,
      chainId,
      approve,
      nonce,
      deadline
    );

    // Sign it
    // NOTE: Using web3.eth.sign will hash the message internally again which
    // we do not want, so we're manually signing here

    const { v, r, s } = sign(digest, ownerPrivateKey);

    // Approve it
    const receipt = await reflecto.permit(
      approve.owner,
      approve.spender,
      nonce,
      deadline,
      true,
      v,
      r,
      s
    );
    const event = receipt.logs[0];
    // It worked!

    const updatedNonce = await reflecto.nonces(approve.owner);
    assert.equal(event.event, 'Approval');
    assert.equal(updatedNonce.toNumber(), 1);

    const balance = await reflecto.balanceOf(admin);
    assert.equal(
      (await reflecto.allowance(approve.owner, approve.spender)) /
        Math.pow(10, 9),
      balance / Math.pow(10, 9)
    );

    // succesfull transfer
    reflecto.transferFrom(admin, investor, 3000, { from: investor });

    // Re-using the same sig doesn't work since the nonce has been incremented
    // on the contract level for replay-protection
    await expectRevert(
      reflecto.permit(
        approve.owner,
        approve.spender,
        nonce,
        deadline,
        true,
        v,
        r,
        s
      ),
      'Reflecto/invalid-nonce'
    );

    // invalid ecrecover's return address(0x0), so we must also guarantee that
    // this case fails
    await expectRevert(
      reflecto.permit(
        '0x0000000000000000000000000000000000000000',
        approve.spender,
        nonce,
        deadline,
        true,
        '0x99',
        r,
        s
      ),
      'Reflecto/invalid-address-0'
    );

    await expectRevert(
      reflecto.permit(
        approve.owner,
        approve.spender,
        nonce,
        deadline,
        true,
        '0x99',
        r,
        s
      ),
      'eflecto/invalid-permit'
    );
  });
});
