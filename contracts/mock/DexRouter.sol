// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DexFactory {
    function createPair(address tokenA, address tokenB)
        external
        returns (address pair)
    {
        return address(tokenA);
    }
}

contract DexRouter {
    DexFactory dexFactory;

    constructor() public {
        dexFactory = new DexFactory();
    }

    function factory() external view returns (address) {
        return address(dexFactory);
    }

    function createPair(address tokenA, address tokenB)
        external
        returns (address pair)
    {
        return address(tokenA);
    }

    function WETH() external pure returns (address) {
        // address randomish = address(
        //     uint160(uint256(keccak256(abi.encodePacked("1", ""))))
        // );
        // return randomish;
    }

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    )
        external
        returns (
            uint256 amountA,
            uint256 amountB,
            uint256 liquidity
        )
    {
        // return (amountADesired, amountBDesired, amountBDesired);
    }

    function addLiquidityETH(
        address token,
        uint256 amountTokenDesired,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    )
        external
        payable
        returns (
            uint256 amountToken,
            uint256 amountETH,
            uint256 liquidity
        )
    {}

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external {}

    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable {}

    function getBanalce() external view returns (uint256) {
        return address(this).balance;
    }

    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external {}
}
