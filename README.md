# Permit with metamask

```
public async signTransaction() {
    const contract = CONTRACTS['token'];
    const tokenContract = new this.web3.eth.Contract(
      contract.abi,
      contract.address
    );
    const chainId = await tokenContract.methods.getChainID().call();
    const fromAddress = '0x83985bc2d03aEcc06fdD2Db55a8Dc6b06ca04b75';
    const expiry = Date.now() + 120;
    const nonce = await tokenContract.methods.nonces(fromAddress).call();
    console.log(nonce);
    const spender = '0x5EeBB2373a39B1552E885f7531967d4C27C86686';

    const result = await signDaiPermit(
      window.ethereum,
      contract.address,
      fromAddress,
      spender
    );

    await tokenContract.methods
      .permit(
        fromAddress,
        spender,
        result.nonce,
        result.expiry,
        true,
        result.v,
        result.r,
        result.s
      )
      .send({
        from: fromAddress,
      });
  }
```

# Deploy to testnet

truffle migrate --network testnet

# Deploy to main net

truffle migrate --network bsc

# First round of testing

Reflecto Contract Address 0x5410B11D47dF1d66cD01f54AD5ED5925633F1de0

Dex Contract Address 0x88098Be7868dA3aa5F4aEDEdc5D2dd7C14302660

Verify contract | https://github.com/rkalis/truffle-plugin-verify

truffle run verify Staked@0x069cdf81F168270C3C52675d58fd1d21Dd9f6a32 --network polygon
