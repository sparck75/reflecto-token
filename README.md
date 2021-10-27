# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
npx hardhat run --network testnet scripts/deploy.js

# Import console log 

import "hardhat/console.sol";

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

# PancakeRouer testnet

Router: 0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3

WBNB: 0xae13d989dac2f0debff460ac112a837c89baa7cd

BUSD: 0x78867bbeef44f2326bf8ddd1941a4439382ef2a7

CRYPTER: 0xf9f93cf501bfadb6494589cb4b4c15de49e85d0e (CAKE because cannot find crypter)

# PancakeRouer main net

Router: 0x10ed43c718714eb63d5aa57b78b54704e256024e 

WBNB: 0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c

BUSD: 0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56

CRYPTER: 0xda6802bbec06ab447a68294a63de47ed4506acaa


Verify contract | https://github.com/rkalis/truffle-plugin-verify

truffle run verify Staked@0x069cdf81F168270C3C52675d58fd1d21Dd9f6a32 --network polygon
