// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BEP20Basic is ERC20 {
    uint8 constant _decimals = 9;

    constructor(string memory _name) ERC20(_name, "GLD") {
        _mint(msg.sender, 1_000_000_000_000_000 * (10**_decimals));
    }

    function mintForTesting(address addressToMint) external {
        _mint(addressToMint, 100000000000000000000000);
    }
}
