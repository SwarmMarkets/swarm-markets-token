//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

contract ChainlinkAggregatorMock {
    uint256 public decimals;
    int256 public price;

    constructor(uint256 _decimals, int256 _price) {
        decimals = _decimals;
        price = _price;
    }

    function latestAnswer() external view returns (int256) {
        return price;
    }

    function setPrice(int256 _price) external {
        price = _price;
    }
}
