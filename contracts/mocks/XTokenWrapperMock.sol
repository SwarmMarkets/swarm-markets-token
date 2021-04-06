//SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.7.0;

contract XTokenWrapperMock {
    address public constant ETH_TOKEN_ADDRESS = address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);

    function tokenToXToken(address) external pure returns (address) {
      return ETH_TOKEN_ADDRESS;
    }
}
