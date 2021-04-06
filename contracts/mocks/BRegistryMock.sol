//SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.7.0;

contract BRegistryMock {
    address public constant ETH_TOKEN_ADDRESS = address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);

    address[] private pools;
    address[] private emptyPools;

    bool public emptyOnAsset = false;

    function setEmptyOnAsset(bool empty) public {
      emptyOnAsset = empty;
    }

    function setPools(address[] memory _pools) public {
      address[] memory newPools = new address[](_pools.length);
      for (uint256 i = 0; i < _pools.length; i++) {
        newPools[i] = _pools[i];
      }
      pools = newPools;
    }

    function getBestPoolsWithLimit(
        address fromToken,
        address,
        uint256
    ) external view returns (address[] memory) {
      if (emptyOnAsset && fromToken != ETH_TOKEN_ADDRESS) {
        return emptyPools;
      }

      address[] memory _pools = new address[](pools.length);
      for (uint256 i = 0; i < pools.length; i++) {
        _pools[i] = pools[i];
      }
      return _pools;
    }
}
