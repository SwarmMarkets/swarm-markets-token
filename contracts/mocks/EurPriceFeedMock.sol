//SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.27;

contract EurPriceFeedMock {
    mapping(address => address) public assetEthFeed;

    function setAssetEthFeed(address _asset, address _feed) public {
        assetEthFeed[_asset] = _feed;
    }
}
