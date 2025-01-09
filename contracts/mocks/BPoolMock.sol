//SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.27;

contract BPoolMock {
    uint256 private tokenAmountDiv;

    constructor(uint256 div) {
        tokenAmountDiv = div;
    }

    function getDenormalizedWeight(address) external view returns (uint256) {
        return 1;
    }

    function getBalance(address) external view returns (uint256) {
        return 1;
    }

    function calcOutGivenIn(
        uint256,
        uint256,
        uint256,
        uint256,
        uint256 tokenAmountIn,
        uint256
    ) external view returns (uint256) {
        return tokenAmountIn / tokenAmountDiv;
    }
}
